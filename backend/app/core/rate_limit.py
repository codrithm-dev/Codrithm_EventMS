import time
from collections import defaultdict
from functools import wraps
from fastapi import Request, HTTPException, status


class RateLimiter:
    def __init__(self):
        self._requests: dict[str, list[float]] = defaultdict(list)

    def is_limited(self, key: str, max_requests: int = 10, window_seconds: int = 60) -> bool:
        now = time.time()
        cutoff = now - window_seconds
        self._requests[key] = [t for t in self._requests[key] if t > cutoff]
        if len(self._requests[key]) >= max_requests:
            return True
        self._requests[key].append(now)
        return False


limiter = RateLimiter()


def rate_limit(max_requests: int = 10, window_seconds: int = 60):
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            client_ip = request.client.host if request.client else "unknown"
            key = f"{func.__module__}.{func.__name__}:{client_ip}"
            if limiter.is_limited(key, max_requests, window_seconds):
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail="Too many requests. Please try again later.",
                )
            return await func(request, *args, **kwargs)
        return wrapper
    return decorator
