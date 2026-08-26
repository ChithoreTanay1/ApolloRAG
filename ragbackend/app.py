from flask import Flask,jsonify,request

from api.retrieval import retrieval_blueprint,retriever
from api.generation import generation_blueprint
from api.comparative_analysis import comparative_blueprint
from config import config
app = Flask(__name__)

app.config.from_object(config)

app.register_blueprint(retrieval_blueprint,url_prefix = "/api/retrieval")
app.register_blueprint(generation_blueprint,url_prefix="/api/generatio")
app.register_blueprint(comparative_blueprint,url_prefix = "/api/comparative")

@app.route('/api/query', methods=['POST'])
def query():
    body = request.get_json(silent=True) or {}
    question = (body.get("question") or "").strip()
    top_k = int(body.get("top_k", 5))

    if not question:
        return jsonify({"error": "Field 'question' is required"}), 400
    if not retriever.chunks:
        return jsonify({"error": "Index is empty. Call POST /ingest first."}), 409

    result = retriever.query(question, top_k=top_k)
    return jsonify({"answer": result["answer"], "sources": result["sources"]})


if __name__ == "__main__":
    app.run(debug=True)
