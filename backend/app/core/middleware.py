import os
import secrets
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.config import get_settings

settings = get_settings()

CSRF_SAFE_METHODS = {"GET", "HEAD", "OPTIONS"}


class CSRFMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.method not in CSRF_SAFE_METHODS:
            origin = request.headers.get("origin")
            referer = request.headers.get("referer")
            if not origin and not referer:
                return JSONResponse(
                    status_code=403,
                    content={"detail": "CSRF validation failed: missing Origin/Referer header"},
                )
            allowed_origins = [settings.FRONTEND_URL, "http://localhost:3000"]
            extra_origins = os.environ.get("CORS_EXTRA_ORIGINS", "")
            if extra_origins:
                allowed_origins.extend([o.strip() for o in extra_origins.split(",") if o.strip()])
            check_url = origin or referer
            if not any(check_url.startswith(o) for o in allowed_origins):
                return JSONResponse(
                    status_code=403,
                    content={"detail": "CSRF validation failed: origin mismatch"},
                )
        response = await call_next(request)
        return response


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
    app.add_middleware(CSRFMiddleware)
