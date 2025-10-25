# app/deps.py
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.config import settings
from app.models import Role
from app.token_blocklist import is_blocked

oauth2 = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2)):
    # 1) chặn token đã logout
    if is_blocked(token):
        raise HTTPException(status_code=401, detail="Token is revoked")

    # 2) giải mã JWT
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])
        sub = int(payload["sub"])
        role = payload["role"]
        return {"sub": sub, "role": role}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_role(*roles: Role):
    def inner(user = Depends(get_current_user)):
        if user["role"] not in [r.value for r in roles]:
            raise HTTPException(status_code=403, detail="Forbidden")
        return user
    return inner
