import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.config import get_settings

settings = get_settings()


def setup_middleware(app: FastAPI):
    extra_origins = os.environ.get("CORS_EXTRA_ORIGINS", "")
    origins = [settings.FRONTEND_URL, "http://localhost:3000"]
    if extra_origins:
        origins.extend([o.strip() for o in extra_origins.split(",") if o.strip()])
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
