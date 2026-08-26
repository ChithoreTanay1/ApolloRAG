from __future__ import annotations

import os

from flask import Flask
from flask_cors import CORS

DEFAULT_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


def configure_cors(app: Flask) -> None:
    """Wire up CORS so the frontend dev server (and any origins from
    CORS_ORIGINS, comma-separated) can call the /api/* routes."""
    env_origins = os.environ.get("CORS_ORIGINS")
    origins = [o.strip() for o in env_origins.split(",") if o.strip()] if env_origins else DEFAULT_ORIGINS

    CORS(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=True)
