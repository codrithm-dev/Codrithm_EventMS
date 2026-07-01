from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, RefreshRequest, ForgotPasswordRequest, ResetPasswordRequest
from app.schemas.user import UserResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    user = await auth_service.register_user(db, data.full_name, data.email, data.password)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await auth_service.login_user(db, data.email, data.password)
    return {
        "access_token": result["access_token"],
        "refresh_token": result["refresh_token"],
    }


@router.post("/refresh", response_model=TokenResponse)
async def refresh(data: RefreshRequest):
    result = await auth_service.refresh_tokens(data.refresh_token)
    return result


@router.post("/verify-email")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    await auth_service.verify_email(db, token)
    return {"message": "Email verified successfully"}


@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    await auth_service.forgot_password(db, data.email)
    return {"message": "If the email exists, a reset link has been sent"}


@router.post("/reset-password")
async def reset_password(data: ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    await auth_service.reset_password(db, data.token, data.new_password)
    return {"message": "Password reset successfully"}
