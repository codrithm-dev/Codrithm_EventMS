import secrets
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User, UserRole
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.core.email import send_email, verification_email_html
from app.core.exceptions import NotFoundException, UnauthorizedException, ConflictException, ForbiddenException
from app.config import get_settings

settings = get_settings()

# Simple in-memory verification tokens (replace with Redis in production)
verification_tokens: dict[str, str] = {}


def _reset_password_html(name: str, token: str) -> str:
    link = f"{settings.FRONTEND_URL}/reset-password?token={token}"
    return f"""
    <h2>Password Reset</h2>
    <p>Hi {name},</p>
    <p>We received a request to reset your password. Click the link below:</p>
    <a href="{link}" style="background:#4F46E5;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Reset Password</a>
    <p>If you didn't request this, please ignore this email.</p>
    <p>This link expires in 1 hour.</p>
    """


async def register_user(db: AsyncSession, full_name: str, email: str, password: str) -> User:
    result = await db.execute(select(User).where(User.email == email))
    if result.scalar_one_or_none():
        raise ConflictException("Email already registered")

    user = User(
        full_name=full_name,
        email=email,
        password_hash=hash_password(password),
        role=UserRole.user,
    )
    db.add(user)
    await db.flush()

    token = secrets.token_urlsafe(32)
    verification_tokens[token] = user.id

    await send_email(
        to=email,
        subject=f"Verify your email - {settings.APP_NAME}",
        html=verification_email_html(full_name, token),
    )

    return user


async def login_user(db: AsyncSession, email: str, password: str) -> dict:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if not user or not user.password_hash:
        raise UnauthorizedException("Invalid email or password")
    if not verify_password(password, user.password_hash):
        raise UnauthorizedException("Invalid email or password")

    return {
        "access_token": create_access_token(user.id, user.role.value if hasattr(user.role, 'value') else str(user.role)),
        "refresh_token": create_refresh_token(user.id),
        "user": user,
    }


async def refresh_tokens(db: AsyncSession, refresh_token: str) -> dict:
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise UnauthorizedException("Invalid refresh token")
    user_id = payload.get("sub")
    # Fetch user to get current role
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    role = user.role.value if user and hasattr(user.role, 'value') else "user"
    return {
        "access_token": create_access_token(user_id, role),
        "refresh_token": create_refresh_token(user_id),
    }


async def verify_email(db: AsyncSession, token: str) -> bool:
    user_id = verification_tokens.pop(token, None)
    if not user_id:
        raise NotFoundException("Invalid or expired verification token")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise NotFoundException("User")
    user.is_verified = True
    return True


async def forgot_password(db: AsyncSession, email: str) -> None:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()
    if user:
        token = secrets.token_urlsafe(32)
        verification_tokens[token] = user.id
        await send_email(
            to=email,
            subject=f"Reset your password - {settings.APP_NAME}",
            html=_reset_password_html(user.full_name, token),
        )
    # Always return None to prevent email enumeration


async def reset_password(db: AsyncSession, token: str, new_password: str) -> bool:
    user_id = verification_tokens.pop(token, None)
    if not user_id:
        raise NotFoundException("Invalid or expired reset token")

    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise NotFoundException("User")
    user.password_hash = hash_password(new_password)
    return True


async def create_oauth_user(db: AsyncSession, full_name: str, email: str, provider: str, provider_id: str) -> User:
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalar_one_or_none()

    if user:
        user.oauth_provider = provider
        user.oauth_provider_id = provider_id
        if not user.is_verified:
            user.is_verified = True
        return user

    user = User(
        full_name=full_name,
        email=email,
        oauth_provider=provider,
        oauth_provider_id=provider_id,
        role=UserRole.user,
        is_verified=True,
    )
    db.add(user)
    await db.flush()
    return user
