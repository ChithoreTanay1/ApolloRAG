"""
embeddings.py
The embedding backend vect.py needs: turns chunk text into vectors it can
compare with cosine similarity. TF-IDF is enough for a small corpus and
needs no extra ML dependencies beyond scikit-learn (already required).
"""
from __future__ import annotations

import pickle
from pathlib import Path
from typing import List

from sklearn.feature_extraction.text import TfidfVectorizer


class EmbeddingBackend:
    def __init__(self):
        self.vectorizer = TfidfVectorizer()
        self._matrix = None

    def fit(self, texts: List[str]) -> None:
        self._matrix = self.vectorizer.fit_transform(texts)

    def transform(self, texts: List[str]):
        return self.vectorizer.transform(texts)

    def corpus_matrix(self):
        return self._matrix

    def save(self, path: str | Path) -> None:
        with open(path, "wb") as f:
            pickle.dump({"vectorizer": self.vectorizer, "matrix": self._matrix}, f)

    def load(self, path: str | Path) -> None:
        with open(path, "rb") as f:
            data = pickle.load(f)
        self.vectorizer = data["vectorizer"]
        self._matrix = data["matrix"]


def get_backend() -> EmbeddingBackend:
    return EmbeddingBackend()
