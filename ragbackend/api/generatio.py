"""
generator.py
Turns (question, retrieved chunks) into a grounded answer.

If OPENAI_API_KEY is set, calls the OpenAI API with the retrieved
chunks as context. Otherwise falls back to a template answer that just
surfaces the retrieved facts directly, so /query still works with zero
API keys configured (useful for local dev/testing).
"""
from __future__ import annotations

import os
from typing import List, Tuple

from .ingestion import Chunk

SYSTEM_PROMPT = (
    "You are a financial analyst assistant. Answer the user's question "
    "using ONLY the financial records provided as context. Cite the "
    "account, business unit, scenario, and year for any figure you use. "
    "If the context does not contain enough information to answer, say so "
    "plainly instead of guessing."
)


def _build_context(hits: List[Tuple[Chunk, float]]) -> str:
    lines = []
    for i, (chunk, score) in enumerate(hits, start=1):
        lines.append(f"[{i}] {chunk['text']}")
    return "\n".join(lines)


def _fallback_answer(question: str, hits: List[Tuple[Chunk, float]]) -> str:
    if not hits:
        return "No relevant financial records were found for that question."

    lead = hits[0][0]["text"]

    return (
        "No LLM API key configured (set OPENAI_API_KEY to get a real "
        f"synthesized answer). Most relevant record found: {lead}"
    )


def generate_answer(question: str, hits: List[Tuple[Chunk, float]]) -> str:
    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        return _fallback_answer(question, hits)

    try:
        from openai import OpenAI
    except ImportError:
        return _fallback_answer(question, hits)

    client = OpenAI(api_key=api_key)

    context = _build_context(hits)

    user_content = (
        f"Context (retrieved financial records):\n{context}\n\n"
        f"Question: {question}"
    )

    response = client.responses.create(
        model=os.getenv("OPENAI_MODEL", "gpt-4.0-MINI"),
        instructions=SYSTEM_PROMPT,
        input=user_content,
        max_output_tokens=600,
    )

    return response.output_text