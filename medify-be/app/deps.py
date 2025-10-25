from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session
from app.db import SessionLocal
from app.config import settings
from app.models import Role

# Khai báo OAuth2 scheme
oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/login")


# 🧩 Dependency: Lấy session DB cho mỗi request
def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🧠 Giải mã token và lấy user hiện tại
def get_current_user(token: str = Depends(oauth2)):
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALG]
        )
        return {"sub": int(payload["sub"]), "role": payload["role"]}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# 🔒 Kiểm tra quyền truy cập (role)
def require_role(*roles: Role):
    def inner(user=Depends(get_current_user)):
        if user["role"] not in [r.value for r in roles]:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user

    return inner
