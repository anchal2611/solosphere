from functools import lru_cache
import os
from pathlib import Path

from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()

class Settings(BaseModel):

    gemini_api_key: str | None = None
    gemini_model: str = "gemini-2.5-flash"
    gemini_timeout_seconds: float = 20.0
    data_path: Path = Path("data/recipes_enriched.parquet")

    def resolved_data_path(self) -> Path:
        """Use the configured dataset, with a read-only compatibility fallback."""
        if self.data_path.exists():
            return self.data_path
        legacy_path = Path("data/recipes_final.parquet")
        return legacy_path if legacy_path.exists() else self.data_path


@lru_cache
def get_settings() -> Settings:
    return Settings(
        gemini_api_key=os.getenv("GEMINI_API_KEY"),
        gemini_model=os.getenv("GEMINI_MODEL", "gemini-2.5-flash"),
        gemini_timeout_seconds=float(os.getenv("GEMINI_TIMEOUT_SECONDS", "20")),
        data_path=Path(os.getenv("DATA_PATH", "data/recipes_enriched.parquet")),
    )
