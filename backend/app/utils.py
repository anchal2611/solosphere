import json
import re
from collections.abc import Iterable
from typing import Any

import pandas as pd


def normalise_text(value: Any) -> str:
    return re.sub(r"\s+", " ", str(value or "").strip().lower())


def token_set(value: Any) -> set[str]:
    """Convert dataset list-like values into consistently comparable strings."""
    if value is None:
        return set()
    if not isinstance(value, Iterable) and pd.isna(value):
        return set()
    if isinstance(value, str):
        try:
            decoded = json.loads(value)
            if isinstance(decoded, list):
                value = decoded
        except json.JSONDecodeError:
            value = re.split(r"[,;|]", value)
    if not isinstance(value, Iterable):
        value = [value]
    return {normalise_text(item) for item in value if normalise_text(item)}


def json_safe(value: Any) -> Any:
    """Convert pandas/numpy values to JSON-compatible native Python values."""
    if value is None:
        return None
    if hasattr(value, "tolist"):
        value = value.tolist()
    elif hasattr(value, "item"):
        value = value.item()
    if not isinstance(value, (list, tuple, dict)) and pd.isna(value):
        return None
    if isinstance(value, dict):
        return {str(key): json_safe(item) for key, item in value.items()}
    if isinstance(value, (list, tuple)):
        return [json_safe(item) for item in value]
    return value
