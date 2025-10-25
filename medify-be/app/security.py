from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt
from typing import Optional
from app.config import settings

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(pw: str) -> str:
    return pwd_ctx.hash(pw)

def verify_password(pw: str, hashed: str) -> bool:
    return pwd_ctx.verify(pw, hashed)

def create_access_token(sub: str, role: str, expires_minutes: Optional[int] = None):
    from datetime import timezone
    exp = datetime.now(timezone.utc) + timedelta(...)
    return jwt.encode(
        {"sub": sub, "role": role, "exp": exp},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALG
    )
