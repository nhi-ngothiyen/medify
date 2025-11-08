# app/schemas.py
from typing import Optional, List
from datetime import datetime
import re

from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator

from app.models import Gender, Role, AppointmentStatus


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional["UserOut"] = None


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    # Chỉ áp dụng min/max length tại Field; rule chi tiết dùng validator bên dưới
    password: str = Field(..., min_length=8, max_length=16, description="8-16 ký tự")
    gender: Optional[Gender] = None
    role: Role = Role.patient

    @field_validator("password")
    @classmethod
    def validate_password_policy(cls, v: str) -> str:
        """
        Yêu cầu:
        - 8-16 ký tự (Field đã ràng buộc)
        - Ít nhất 1 chữ thường, 1 chữ hoa, 1 số, 1 ký tự đặc biệt
        """
        if not re.search(r"[a-z]", v):
            raise ValueError("Mật khẩu phải có ít nhất 1 chữ thường")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Mật khẩu phải có ít nhất 1 chữ hoa")
        if not re.search(r"\d", v):
            raise ValueError("Mật khẩu phải có ít nhất 1 chữ số")
        if not re.search(r"[\W_]", v):
            raise ValueError("Mật khẩu phải có ít nhất 1 ký tự đặc biệt")
        return v


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    gender: Optional[Gender]
    role: Role
    is_active: bool


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class DoctorCard(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    specialty: str
    years_exp: int
    avg_rating: float
    gender: Optional[Gender]


class AvailabilityOut(BaseModel):
    weekday: int  # 0..6 (tùy bạn quy ước)
    start_time: str  # "08:00"
    end_time: str    # "17:00"


class DoctorDetail(BaseModel):
    user: UserOut
    profile_specialty: str
    years_exp: int
    bio: Optional[str]
    avg_rating: float
    availabilities: List[AvailabilityOut] = []


class AppointmentCreate(BaseModel):
    doctor_user_id: int
    start_at: datetime
    end_at: datetime
    note: Optional[str] = None

    @field_validator("end_at")
    @classmethod
    def check_time_order(cls, end_at: datetime, info):
        start_at: datetime = info.data.get("start_at")
        if start_at and end_at <= start_at:
            raise ValueError("end_at phải sau start_at")
        return end_at


class AppointmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    doctor_user_id: int
    patient_id: int
    start_at: datetime
    end_at: datetime
    status: AppointmentStatus


class ReviewCreate(BaseModel):
    appointment_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None
