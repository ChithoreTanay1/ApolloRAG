
from __future__ import annotations

import uuid
from pathlib import Path
from typing import List, TypedDict

import pandas as pd

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


class Chunk(TypedDict):
    id: str
    text: str
    metadata: dict


def _fmt_money(value: float) -> str:
    sign = "-" if value < 0 else ""
    return f"{sign}${abs(value):,.0f}"


def row_to_chunk(row: pd.Series) -> Chunk:
    account = str(row["Account"]).strip()
    bu = str(row["Businees Unit"]).strip()  # typo preserved from source file
    currency = str(row["Currency"]).strip()
    year = int(row["Year"])
    scenario = str(row["Scenario"]).strip()

    monthly = {m: float(row[m]) for m in MONTHS}
    total = sum(monthly.values())

    monthly_str = ", ".join(f"{m} {_fmt_money(v)}" for m, v in monthly.items())

    text = (
        f"{account} for the {bu} business unit, {scenario} scenario, "
        f"fiscal year {year}, in {currency}. "
        f"Monthly values: {monthly_str}. "
        f"Full-year total: {_fmt_money(total)}."
    )

    return Chunk(
        id=str(uuid.uuid4()),
        text=text,
        metadata={
            "account": account,
            "business_unit": bu,
            "currency": currency,
            "year": year,
            "scenario": scenario,
            "annual_total": total,
            **{m: v for m, v in monthly.items()},
        },
    )


def load_chunks(xlsx_path: str | Path, sheet_name: str = "Financials") -> List[Chunk]:
    df = pd.read_excel(xlsx_path, sheet_name=sheet_name)
    df.columns = [c.strip() for c in df.columns]
    return [row_to_chunk(row) for _, row in df.iterrows()]


if __name__ == "__main__":
    chunks = load_chunks(Path(__file__).parent.parent / "data" / "Financials Sample Data.xlsx")
    print(f"Loaded {len(chunks)} chunks")
    print(chunks[0]["text"])
