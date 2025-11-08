from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Generator

from app import schemas, models
from app.db import SessionLocal
from app.security import hash_password, verify_password, create_access_token

from jose import jwt
from app.deps import get_db, oauth2, get_current_user
from app.token_blocklist import block as block_token
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


# 🧩 Tạo session database cho mỗi request
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🧩 API đăng ký tài khoản
@router.post("/register", response_model=schemas.UserOut)
def register(payload: schemas.UserCreate, db: Session = Depends(get_db)):
    # Kiểm tra email đã tồn tại
    exists = db.query(models.User).filter(models.User.email == payload.email).first()
    if exists:
        raise HTTPException(status_code=400, detail="Email already used")

    # Tạo user mới
    user = models.User(
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        role=payload.role,
        gender=payload.gender,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    # Nếu là bác sĩ, tạo hồ sơ trống mặc định
    if user.role == models.Role.doctor:
        prof = models.DoctorProfile(
            user_id=user.id,
            specialty="General",
            years_exp=0,
            bio="",
        )
        db.add(prof)
        db.commit()

    return user


# 🧩 API đăng nhập
@router.post("/login", response_model=schemas.TokenOut)
def login(payload: schemas.LoginIn, db: Session = Depends(get_db)):
    # Kiểm tra người dùng tồn tại
    u = db.query(models.User).filter(models.User.email == payload.email).first()
    if not u:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Kiểm tra mật khẩu
    if not verify_password(payload.password, u.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Tạo token đăng nhập
    token = create_access_token(str(u.id), u.role.value)

    # Trả về thông tin user cùng với token (Pydantic tự động convert từ ORM)
    return {"access_token": token, "token_type": "bearer", "user": u}


# 🧩 API lấy thông tin user hiện tại
@router.get("/me", response_model=schemas.UserOut)
def get_me(user=Depends(get_current_user), db: Session = Depends(get_db)):
    u = db.query(models.User).filter(models.User.id == user["sub"]).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    return u


@router.post("/logout")
def logout(token: str = Depends(oauth2)):
    """
    Đưa access token hiện tại vào blocklist đến hết hạn.
    Client vẫn cần xoá token ở local để ngắt phiên ngay.
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALG])
        exp = int(payload["exp"])  # exp dạng epoch (s)
    except Exception:
        # Token không hợp lệ thì coi như đã "logout" ở client; trả về 200 cho idempotency.
        return {"ok": True, "revoked": False}

    block_token(token, exp_epoch=exp)
    return {"ok": True, "revoked": True, "exp": exp}