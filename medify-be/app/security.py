# app/security.py
from datetime import datetime, timedelta
from typing import Optional

from jose import jwt
from passlib.context import CryptContext

from app.config import settings

# Dùng bcrypt_sha256 để tránh giới hạn 72 bytes của bcrypt thuần.
# Giữ "bcrypt" để verify các hash cũ nếu có.
pwd_ctx = CryptContext(
    schemes=["bcrypt_sha256", "bcrypt"],
    deprecated="auto",
)

def hash_password(pw: str) -> str:
    """
    Hash mật khẩu an toàn. Hỗ trợ mật khẩu dài >72 bytes nhờ bcrypt_sha256.
    """
    return pwd_ctx.hash(pw)

def verify_password(pw: str, hashed: str) -> bool:
    """
    Kiểm tra mật khẩu với hash trong DB. Tương thích cả bcrypt_sha256 & bcrypt.
    """
    return pwd_ctx.verify(pw, hashed)

def create_access_token(sub: str, role: str, expires_minutes: Optional[int] = None) -> str:
    """
    Tạo JWT access token.
    - sub: user id (string)
    - role: vai trò (vd: 'admin' | 'doctor' | 'patient')
    - expires_minutes: thời gian hết hạn (mặc định lấy từ settings)
    """
    minutes = expires_minutes or settings.ACCESS_TOKEN_EXPIRE_MINUTES
    exp = datetime.utcnow() + timedelta(minutes=minutes)
    payload = {"sub": sub, "role": role, "exp": exp}
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALG)
