from pathlib import Path
from typing import Any

import pandas as pd
from fastapi import HTTPException

from app.config import Settings
from app.models import Preferences
from app.services.ranking_service import RankingService
from app.utils import json_safe, normalise_text, token_set


class RecipeService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings
        self._recipes: pd.DataFrame | None = None
        self._id_column = "id"
        self._ranking = RankingService()

    def load(self) -> None:
        path: Path = self._settings.resolved_data_path()
        if not path.is_file():
            raise RuntimeError(f"Recipe dataset not found: {path}")
        recipes = pd.read_parquet(path)
        if recipes.empty:
            raise RuntimeError("Recipe dataset is empty")
        self._id_column = "id" if "id" in recipes else "recipe_id"
        if self._id_column not in recipes:
            raise RuntimeError("Recipe dataset requires an 'id' or 'recipe_id' column")
        recipes = recipes.copy()
        ingredient_col = "ingredients_search" if "ingredients_search" in recipes else "ingredients"
        if ingredient_col not in recipes:
            raise RuntimeError("Recipe dataset requires ingredients or ingredients_search")
        recipes["_ingredient_set"] = recipes[ingredient_col].map(token_set)
        keyword_columns = [name for name in ("title", "name", "search_keywords", "tags", "search_text") if name in recipes]
        recipes["_keyword_text"] = recipes[keyword_columns].fillna("").astype(str).agg(" ".join, axis=1).str.lower()
        time_col = next((name for name in ("time", "total_time", "cook_time") if name in recipes), None)
        if time_col:
            recipes["_time"] = pd.to_numeric(recipes[time_col], errors="coerce")
        if "meal_type" not in recipes:
            recipes["meal_type"] = recipes["course"] if "course" in recipes else ""
        self._recipes = recipes

    @property
    def recipes(self) -> pd.DataFrame:
        if self._recipes is None:
            raise HTTPException(status_code=503, detail="Recipe dataset is not ready")
        return self._recipes

    def search(self, preferences: Preferences, limit: int = 10) -> list[dict[str, Any]]:
        ranked = self._ranking.rank(self.recipes, preferences)
        # A text-only request can legitimately return the best global matches; ingredient requests require overlap.
        if preferences.ingredients:
            ranked = ranked[ranked["_score"] > 0]
        return [self._serialise(record) for record in ranked.head(limit).to_dict(orient="records")]

    def get_by_id(self, recipe_id: str) -> dict[str, Any]:
        matches = self.recipes[self.recipes[self._id_column].astype(str) == recipe_id]
        if matches.empty:
            raise HTTPException(status_code=404, detail="Recipe not found")
        return self._serialise(matches.iloc[0].to_dict())

    def random(self, limit: int = 10) -> list[dict[str, Any]]:
        count = min(limit, len(self.recipes))
        return [self._serialise(record) for record in self.recipes.sample(n=count).to_dict(orient="records")]

    def values(self, column: str) -> list[str]:
        if column not in self.recipes:
            return []
        return sorted(self.recipes[column].dropna().astype(str).loc[lambda series: series.str.strip().ne("")].unique().tolist())

    def _serialise(self, record: dict[str, Any]) -> dict[str, Any]:
        import re
        record = {key: json_safe(value) for key, value in record.items() if not key.startswith("_")}
        
        # Parse ingredients_display into a list of clean strings
        raw_ingredients = record.get("ingredients_display") or record.get("ingredients")
        if isinstance(raw_ingredients, str):
            ingredients_list = [i.strip() for i in raw_ingredients.split(",") if i.strip()]
        elif isinstance(raw_ingredients, list):
            ingredients_list = [str(i).strip() for i in raw_ingredients if str(i).strip()]
        else:
            ingredients_list = []
            
        # Parse instructions into steps
        raw_instructions = record.get("instructions") or ""
        if isinstance(raw_instructions, str):
            # Split by period followed by space, or newline
            steps_list = [s.strip() for s in re.split(r'\.\s+|\n', raw_instructions) if s.strip()]
        elif isinstance(raw_instructions, list):
            steps_list = [str(s).strip() for s in raw_instructions if str(s).strip()]
        else:
            steps_list = []

        total_time = record.get("total_time")
        if pd.notna(total_time) and total_time is not None:
            try:
                time_val = int(float(total_time))
                time_str = f"{time_val}m"
            except ValueError:
                time_val = 30
                time_str = "30m"
        else:
            time_val = 30
            time_str = "30m"

        # Construct safe and formatted values matching Solosphere's design
        aliases = {
            "id": str(record.get("recipe_id", record.get("id"))),
            "title": record.get("name", record.get("title", "")),
            "ingredients": ingredients_list,
            "time": time_str,
            "meal_type": record.get("course", record.get("meal_type", "")),
            "image": record.get("image_url") or "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=800",
            "description": record.get("description") or f"A beautiful, portion-sized {(record.get('cuisine') or '').lower()} {(record.get('course') or '').lower()} dish, perfect for a cozy kitchen experience.",
            "difficulty": "Easy" if time_val <= 30 else ("Medium" if time_val <= 60 else "Hard"),
            "calories": f"{250 + (time_val * 4) % 300} kcal", # deterministic placeholder
            "steps": steps_list,
            "nutrition": {
                "carbs": "45g",
                "protein": "15g",
                "fat": "12g",
                "fiber": "6g"
            }
        }
        return {**record, **aliases}

