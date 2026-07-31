from pydantic import BaseModel, Field

from app.models import Preferences


class QueryRequest(BaseModel):
    query: str = Field(min_length=1, max_length=2_000)


class SearchResponse(BaseModel):
    success: bool = True
    preferences: Preferences
    count: int
    recipes: list[dict]
