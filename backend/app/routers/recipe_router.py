from fastapi import APIRouter, Depends, Request

from app.config import Settings, get_settings
from app.models import Preferences
from app.schemas import QueryRequest, SearchResponse
from app.services.gemini_service import GeminiService
from app.services.recipe_service import RecipeService

router = APIRouter(prefix="/recipes", tags=["recipes"])


def recipe_service(request: Request) -> RecipeService:
    return request.app.state.recipe_service


def gemini_service(settings: Settings = Depends(get_settings)) -> GeminiService:
    return GeminiService(settings)


@router.post("/extract", response_model=Preferences)
def extract_preferences(payload: QueryRequest, gemini: GeminiService = Depends(gemini_service)) -> Preferences:
    return gemini.extract_preferences(payload.query)


@router.post("/search", response_model=SearchResponse)
def search_recipes(payload: QueryRequest, recipes: RecipeService = Depends(recipe_service), gemini: GeminiService = Depends(gemini_service)) -> SearchResponse:
    preferences = gemini.extract_preferences(payload.query)
    results = recipes.search(preferences)
    return SearchResponse(preferences=preferences, count=len(results), recipes=results)


@router.get("/random")
def random_recipes(limit: int = 10, recipes: RecipeService = Depends(recipe_service)) -> list[dict]:
    return recipes.random(max(1, min(limit, 50)))


@router.get("/cuisines")
def cuisines(recipes: RecipeService = Depends(recipe_service)) -> list[str]:
    return recipes.values("cuisine")


@router.get("/courses")
def courses(recipes: RecipeService = Depends(recipe_service)) -> list[str]:
    return recipes.values("course")


@router.get("/{recipe_id}")
def get_recipe(recipe_id: str, recipes: RecipeService = Depends(recipe_service)) -> dict:
    return recipes.get_by_id(recipe_id)
