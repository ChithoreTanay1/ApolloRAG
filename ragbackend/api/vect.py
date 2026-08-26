"""
vectorstore.py
Minimal in-memory vector index: cosine similarity over whatever matrix the
embedding backend produces (sparse TF-IDF or dense sentence embeddings).
Small corpus (hundreds-thousands of chunks) -> no need for FAISS/etc.
Swap in a real vector DB here if the corpus grows large.
"""
from __future__ import annotations

import json
import pickle
from pathlib import Path
from typing import List, Tuple

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from .embeddings import EmbeddingBackend, get_backend
from .ingestion import Chunk


class VectorStore:
    def __init__(self, backend: EmbeddingBackend | None = None):
        self.backend = backend or get_backend()
        self.chunks: List[Chunk] = []

    def build(self, chunks: List[Chunk]) -> None:
        self.chunks = chunks
        texts = [c["text"] for c in chunks]
        self.backend.fit(texts)

    def search(self, query: str, top_k: int = 5) -> List[Tuple[Chunk, float]]:
        if not self.chunks:
            raise RuntimeError("Vector store is empty. Call build() or load() first.")
        query_vec = self.backend.transform([query])
        corpus = self.backend.corpus_matrix()
        sims = cosine_similarity(query_vec, corpus)[0]
        top_idx = np.argsort(sims)[::-1][:top_k]
        return [(self.chunks[i], float(sims[i])) for i in top_idx]

    def save(self, dir_path: str | Path) -> None:
        dir_path = Path(dir_path)
        dir_path.mkdir(parents=True, exist_ok=True)
        self.backend.save(dir_path / "backend.pkl")
        with open(dir_path / "chunks.json", "w") as f:
            json.dump(self.chunks, f)

    def load(self, dir_path: str | Path) -> None:
        dir_path = Path(dir_path)
        self.backend.load(dir_path / "backend.pkl")
        with open(dir_path / "chunks.json") as f:
            self.chunks = json.load(f)
