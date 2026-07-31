import pandas as pd

from app.models import Preferences


class RankingService:
    """Vectorised, deterministic scoring of recipes after pandas candidate filtering."""

    def rank(self, frame: pd.DataFrame, preferences: Preferences) -> pd.DataFrame:
        scores = pd.Series(0.0, index=frame.index)
        requested = set(preferences.ingredients)
        if requested:
            ingredient_sets = frame["_ingredient_set"]
            overlap = ingredient_sets.map(lambda items: len(requested & items) / len(requested))
            scores += overlap * 60
        keyword_query = set(preferences.ingredients + [preferences.taste]) - {""}
        if keyword_query:
            keyword_match = frame["_keyword_text"].map(lambda text: any(word in text for word in keyword_query))
            scores += keyword_match.astype(float) * 15
        scores += self._text_match(frame, "diet", preferences.diet, 10)
        scores += self._text_match(frame, "meal_type", preferences.mealType, 5)
        scores += self._text_match(frame, "cuisine", preferences.cuisine, 5)
        if preferences.maxTime is not None and "_time" in frame:
            scores += (frame["_time"].le(preferences.maxTime)).astype(float) * 5
        return frame.assign(_score=scores).sort_values("_score", ascending=False, kind="stable")

    @staticmethod
    def _text_match(frame: pd.DataFrame, column: str, expected: str, weight: float) -> pd.Series:
        if not expected or column not in frame:
            return pd.Series(0.0, index=frame.index)
        return frame[column].fillna("").astype(str).str.lower().str.contains(expected.lower(), regex=False).astype(float) * weight
