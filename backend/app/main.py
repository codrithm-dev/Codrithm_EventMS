import logging
import traceback
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from app.config import get_settings
from app.core.middleware import setup_middleware
from app.api.v1.router import api_router
from app.core.exceptions import AppException

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

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
            headers={"Access-Control-Allow-Origin": settings.FRONTEND_URL},
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {exc}\n{traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
            headers={"Access-Control-Allow-Origin": settings.FRONTEND_URL},
        )

    @app.get("/")
    async def root():
        return {"message": f"Welcome to {settings.APP_NAME} API", "docs": "/docs"}

    @app.get("/health")
    async def health():
        return {"status": "ok"}

    return app


app = create_app()
