from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr
from app.models import Gender, Role, AppointmentStatus

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    gender: Optional[Gender] = None
    role: Role = Role.patient

class UserOut(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    gender: Optional[Gender]
    role: Role
    class Config:
        from_attributes = True

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class DoctorCard(BaseModel):
    id: int
    full_name: str
    specialty: str
    years_exp: int
    avg_rating: float
    gender: Optional[Gender]
    class Config:
        from_attributes = True

class AvailabilityOut(BaseModel):
    weekday: int
    start_time: str
    end_time: str

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

class AppointmentOut(BaseModel):
    id: int
    doctor_user_id: int
    patient_id: int
    start_at: datetime
    end_at: datetime
    status: AppointmentStatus
    class Config:
        from_attributes = True

class ReviewCreate(BaseModel):
    appointment_id: int
    rating: int
    comment: Optional[str] = None
