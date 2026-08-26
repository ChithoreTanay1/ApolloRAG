
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, jsonify, request

from api.cors import configure_cors
from api.ingestion import load_chunks
from api.vect import VectorStore
from api.generatio import generate_answer

app = Flask(__name__)
configure_cors(app)

UPLOAD_DIR = Path(__file__).parent / "data" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

documents: dict[str, dict] = {}  # id -> {id, name, status, createdAt, chunks}
store = VectorStore()


def _rebuild_store() -> None:
    all_chunks = [chunk for doc in documents.values() for chunk in doc["chunks"]]
    if all_chunks:
        store.build(all_chunks)
    else:
        store.chunks = []


def _public_doc(doc: dict) -> dict:
    return {"id": doc["id"], "name": doc["name"], "status": doc["status"], "createdAt": doc["createdAt"]}


@app.route("/api/documents", methods=["GET"])
def list_documents():
    return jsonify([_public_doc(d) for d in documents.values()])


@app.route("/api/documents", methods=["POST"])
def upload_document():
    file = request.files.get("file")
    if not file or not file.filename:
        return jsonify({"error": "Field 'file' is required"}), 400
    if not file.filename.lower().endswith(".xlsx"):
        return jsonify({"error": "Only .xlsx files are supported"}), 400

    doc_id = str(uuid.uuid4())
    dest = UPLOAD_DIR / f"{doc_id}_{file.filename}"
    file.save(str(dest))

    try:
        chunks = load_chunks(dest)
    except Exception as e:
        dest.unlink(missing_ok=True)
        return jsonify({"error": f"Could not process file: {e}"}), 400

    for chunk in chunks:
        chunk["metadata"]["document_id"] = doc_id
        chunk["metadata"]["document_name"] = file.filename

    doc = {
        "id": doc_id,
        "name": file.filename,
        "status": "indexed",
        "createdAt": datetime.now(timezone.utc).isoformat(),
        "chunks": chunks,
    }
    documents[doc_id] = doc
    _rebuild_store()

    return jsonify(_public_doc(doc)), 201


@app.route("/api/documents/<doc_id>", methods=["DELETE"])
def delete_document(doc_id):
    doc = documents.pop(doc_id, None)
    if not doc:
        return jsonify({"error": "Document not found"}), 404

    for path in UPLOAD_DIR.glob(f"{doc_id}_*"):
        path.unlink(missing_ok=True)
    _rebuild_store()

    return "", 204


@app.route("/api/query", methods=["POST"])
def query():
    body = request.get_json(silent=True) or {}
    question = (body.get("question") or "").strip()
    document_ids = body.get("document_ids") or None
    top_k = int(body.get("top_k", 5))

    if not question:
        return jsonify({"error": "Field 'question' is required"}), 400
    if not store.chunks:
        return jsonify({"error": "No documents indexed yet. Upload a document first."}), 409

    hits = store.search(question, top_k=top_k * 3 if document_ids else top_k)
    if document_ids:
        hits = [h for h in hits if h[0]["metadata"]["document_id"] in document_ids][:top_k]

    answer = generate_answer(question, hits)
    sources = [
        {
            "documentId": chunk["metadata"]["document_id"],
            "documentName": chunk["metadata"]["document_name"],
            "snippet": chunk["text"],
        }
        for chunk, _score in hits
    ]
    return jsonify({"answer": answer, "sources": sources})


if __name__ == "__main__":
    app.run(debug=True, port=3000)
