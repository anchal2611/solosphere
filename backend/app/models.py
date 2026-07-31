from typing import Any

from pydantic import BaseModel, ConfigDict, Field, field_validator


class Preferences(BaseModel):
    """The strictly bounded output expected from Gemini."""

    model_config = ConfigDict(extra="ignore")

    ingredients: list[str] = Field(default_factory=list)
    diet: str = ""
    mealType: str = ""
    taste: str = ""
    maxTime: int | None = None
    cuisine: str = ""
    course: str = ""

    @field_validator("ingredients", mode="before")
    @classmethod
    def normalise_ingredients(cls, value: Any) -> list[str]:
        if not isinstance(value, list):
            return []
        return [str(item).strip().lower() for item in value if str(item).strip()]

    @field_validator("diet", "mealType", "taste", "cuisine", "course", mode="before")
    @classmethod
    def normalise_text(cls, value: Any) -> str:
        return str(value or "").strip()
