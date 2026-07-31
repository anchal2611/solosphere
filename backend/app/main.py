from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers.recipe_router import router as recipe_router
from app.services.recipe_service import RecipeService


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load the immutable recipe data once for the life of this process."""
    service = RecipeService(get_settings())
    service.load()
    app.state.recipe_service = service
    yield


app = FastAPI(title="SoloSphere Recipe API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_origin_regex=r"https://([a-z0-9-]+\.)*vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(recipe_router)


@app.get("/", tags=["system"])
def root() -> dict[str, str]:
    return {"status": "running"}


@app.get("/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "healthy"}
