import json
import re
from typing import Any

from fastapi import HTTPException, status
from google import genai
from google.genai import types
from pydantic import ValidationError

from app.config import Settings
from app.models import Preferences

_SYSTEM_INSTRUCTION = """You extract recipe-search preferences from a user query.
Return only a JSON object with exactly these keys: ingredients (array of English ingredient names), diet,
mealType, taste, maxTime (integer minutes or null), cuisine, course. Use empty strings/arrays when
unknown. Never create, recommend, rank, or describe recipes."""


class GeminiService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    def extract_preferences(self, query: str) -> Preferences:
        if not self._settings.gemini_api_key:
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="GEMINI_API_KEY is not configured")
        client = genai.Client(api_key=self._settings.gemini_api_key)
        for attempt in range(2):
            try:
                response = client.models.generate_content(
                    model=self._settings.gemini_model,
                    contents=query,
                    config=types.GenerateContentConfig(
                        system_instruction=_SYSTEM_INSTRUCTION,
                        response_mime_type="application/json",
                        temperature=0,
                        http_options=types.HttpOptions(timeout=int(self._settings.gemini_timeout_seconds * 1000)),
                    ),
                )
                return Preferences.model_validate(self._parse_json(response.text or ""))
            except (json.JSONDecodeError, ValidationError, ValueError, AttributeError) as error:
                if attempt == 1:
                    raise HTTPException(status_code=502, detail="Gemini returned an invalid preference response") from error
            except Exception as error:
                if attempt == 1:
                    raise HTTPException(status_code=504, detail="Gemini preference extraction failed or timed out") from error
        raise HTTPException(status_code=502, detail="Gemini preference extraction failed")

    @staticmethod
    def _parse_json(text: str) -> dict[str, Any]:
        cleaned = re.sub(r"^\s*```(?:json)?\s*|\s*```\s*$", "", text, flags=re.IGNORECASE)
        parsed = json.loads(cleaned.strip())
        if not isinstance(parsed, dict):
            raise ValueError("Gemini response must be a JSON object")
        return parsed
