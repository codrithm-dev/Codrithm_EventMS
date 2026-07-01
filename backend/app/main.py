import logging
from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.config import get_settings
from app.core.middleware import setup_middleware
from app.api.v1.router import api_router

logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        from app.database import engine, Base
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Database setup error: {e}")
    yield
    try:
        from app.database import engine
        await engine.dispose()
    except Exception:
        pass


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
