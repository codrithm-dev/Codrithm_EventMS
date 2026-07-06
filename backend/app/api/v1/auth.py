from fastapi import APIRouter, Depends, Request, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from urllib.parse import urlencode
import httpx
import secrets
import base64
import json
from app.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, RefreshRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.schemas.user import UserResponse
from app.services import auth_service
from app.core.rate_limit import rate_limit
from app.core.security import create_access_token, create_refresh_token
from app.config import get_settings

settings = get_settings()
router = APIRouter(prefix="/auth", tags=["Authentication"])

# In-memory OAuth state tokens
oauth_states: dict[str, str] = {}


def _set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    cookie_domain = settings.COOKIE_DOMAIN or None
    response.set_cookie(
        "access_token", access_token,
        httponly=True, secure=True, samesite="none",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        domain=cookie_domain, path="/",
    )
    response.set_cookie(
        "refresh_token", refresh_token,
        httponly=True, secure=True, samesite="none",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        domain=cookie_domain, path="/",
    )


@router.post("/register", response_model=UserResponse)
@rate_limit(max_requests=5, window_seconds=60)
async def register(request: Request, data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    user = await auth_service.register_user(db, data.full_name, data.email, data.password)
    return user


@router.post("/login")
@rate_limit(max_requests=10, window_seconds=60)
async def login(request: Request, data: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    result = await auth_service.login_user(db, data.email, data.password)
    _set_auth_cookies(response, result["access_token"], result["refresh_token"])
    return {
        "access_token": result["access_token"],
        "refresh_token": result["refresh_token"],
    }


@router.post("/refresh")
async def refresh(request: Request, response: Response, data: RefreshRequest = None, db: AsyncSession = Depends(get_db)):
    token = None
    if data and data.refresh_token:
        token = data.refresh_token
    else:
        token = request.cookies.get("refresh_token")
    if not token:
        from app.core.exceptions import UnauthorizedException
        raise UnauthorizedException("No refresh token provided")
    result = await auth_service.refresh_tokens(db, token)
    _set_auth_cookies(response, result["access_token"], result["refresh_token"])
    return result


@router.post("/logout")
async def logout(response: Response):
    cookie_domain = settings.COOKIE_DOMAIN or None
    response.delete_cookie("access_token", domain=cookie_domain, path="/")
    response.delete_cookie("refresh_token", domain=cookie_domain, path="/")
    return {"message": "Logged out"}


@router.post("/verify-email")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    await auth_service.verify_email(db, token)
    return {"message": "Email verified successfully"}


@router.post("/forgot-password")
@rate_limit(max_requests=3, window_seconds=300)
async def forgot_password(request: Request, data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    await auth_service.forgot_password(db, data.email)
    return {"message": "If the email exists, a reset link has been sent"}


@router.post("/reset-password")
@rate_limit(max_requests=5, window_seconds=300)
async def reset_password(request: Request, data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    await auth_service.reset_password(db, data.token, data.new_password)
    return {"message": "Password reset successfully"}


# ─── OAuth: Google ───────────────────────────────────────────────

@router.get("/google")
async def google_login():
    state = secrets.token_urlsafe(32)
    oauth_states[state] = "google"
    params = urlencode({
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": f"{settings.APP_URL}/api/v1/auth/google/callback",
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "consent",
    })
    return RedirectResponse(f"https://accounts.google.com/o/oauth2/v2/auth?{params}")


@router.get("/google/callback")
async def google_callback(code: str = None, state: str = None, response: Response = None, db: AsyncSession = Depends(get_db)):
    if not code or not state or state not in oauth_states:
        return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=invalid_state")
    oauth_states.pop(state, None)

    async with httpx.AsyncClient() as client:
        token_resp = await client.post("https://oauth2.googleapis.com/token", data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": f"{settings.APP_URL}/api/v1/auth/google/callback",
            "grant_type": "authorization_code",
        })
        if token_resp.status_code != 200:
            return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=token_exchange_failed")
        access_token = token_resp.json().get("access_token")

        user_resp = await client.get("https://www.googleapis.com/oauth2/v2/userinfo", headers={"Authorization": f"Bearer {access_token}"})
        if user_resp.status_code != 200:
            return RedirectResponse(f"{settings.FRONTEND_URL}/login?error=userinfo_failed")
        profile = user_resp.json()

    user = await auth_service.create_oauth_user(db, profile.get("name", ""), profile["email"], "google", profile["id"])
    jwt_access = create_access_token(user.id, user.role.value if hasattr(user.role, "value") else str(user.role))
    jwt_refresh = create_refresh_token(user.id)

    resp = RedirectResponse(f"{settings.FRONTEND_URL}/auth/callback?token={jwt_access}")
    _set_auth_cookies(resp, jwt_access, jwt_refresh)
    return resp



