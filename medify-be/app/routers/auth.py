from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Generator

from app import schemas, models
from app.db import SessionLocal
from app.security import hash_password, verify_password, create_access_token


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

    return {"access_token": token, "token_type": "bearer"}
