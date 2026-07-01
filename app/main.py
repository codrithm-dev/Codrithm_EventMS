from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.config import get_settings
from app.database import engine, Base
from app.core.middleware import setup_middleware
from app.api.v1.router import api_router

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        description="Event Management & Registration Platform API",
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    setup_middleware(app)
    app.include_router(api_router)

    @app.get("/")
    async def root():
        return {"message": f"Welcome to {settings.APP_NAME} API", "docs": "/docs"}

    @app.get("/health")
    async def health():
        return {"status": "ok"}

    return app


app = create_app()
