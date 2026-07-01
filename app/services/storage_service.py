import io
import cloudinary
import cloudinary.uploader
from app.config import get_settings

settings = get_settings()

if settings.CLOUDINARY_CLOUD_NAME:
    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
    )


async def upload_image(file: io.BytesIO, folder: str = "uploads") -> str:
    if not settings.CLOUDINARY_CLOUD_NAME:
        # Return a placeholder URL when Cloudinary is not configured
        return f"https://placehold.co/400x400?text={folder.split('/')[-1]}"

    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type="image",
        )
        return result["secure_url"]
    except Exception as e:
        print(f"[CLOUDINARY ERROR] {e}")
        return f"https://placehold.co/400x400?text=upload-error"


async def upload_file(file: bytes, folder: str = "uploads", filename: str = "file") -> str:
    if not settings.CLOUDINARY_CLOUD_NAME:
        return f"https://placehold.co/100x100?text={filename}"

    try:
        result = cloudinary.uploader.upload(
            file,
            folder=folder,
            resource_type="raw",
            public_id=filename,
        )
        return result["secure_url"]
    except Exception as e:
        print(f"[CLOUDINARY ERROR] {e}")
        return f"https://placehold.co/100x100?text=upload-error"


def destroy_image(public_id: str) -> bool:
    if not settings.CLOUDINARY_CLOUD_NAME:
        return False
    try:
        cloudinary.uploader.destroy(public_id)
        return True
    except Exception:
        return False
