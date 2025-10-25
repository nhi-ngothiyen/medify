from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.deps import get_db, require_role
from app.models import Role

router = APIRouter(prefix="/admin", tags=["admin"])


# 🧩 Lấy danh sách tất cả người dùng
@router.get("/users", response_model=List[schemas.UserOut])
def get_all_users(db: Session = Depends(get_db), _: dict = Depends(require_role(Role.admin))):
    users = db.query(models.User).all()
    return users


# 🧩 Xem chi tiết một người dùng
@router.get("/users/{user_id}", response_model=schemas.UserOut)
def get_user_detail(user_id: int, db: Session = Depends(get_db), _: dict = Depends(require_role(Role.admin))):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


# 🧩 Xóa một người dùng (bao gồm bác sĩ hoặc bệnh nhân)
@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), _: dict = Depends(require_role(Role.admin))):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}


# 🧩 Lấy danh sách tất cả bác sĩ
@router.get("/doctors", response_model=List[schemas.DoctorCard])
def list_doctors(db: Session = Depends(get_db), _: dict = Depends(require_role(Role.admin))):
    qry = (
        db.query(models.User, models.DoctorProfile)
        .join(models.DoctorProfile, models.DoctorProfile.user_id == models.User.id)
        .filter(models.User.role == Role.doctor)
    )

    items = []
    for u, p in qry.all():
        items.append(
            schemas.DoctorCard(
                id=u.id,
                full_name=u.full_name,
                specialty=p.specialty,
                years_exp=p.years_exp,
                avg_rating=p.avg_rating,
                gender=u.gender,
            )
        )

    return items


# 🧩 Xem tất cả các cuộc hẹn
@router.get("/appointments", response_model=List[schemas.AppointmentOut])
def list_appointments(db: Session = Depends(get_db), _: dict = Depends(require_role(Role.admin))):
    appointments = db.query(models.Appointment).all()
    return appointments


# 🧩 Xóa một cuộc hẹn (nếu cần)
@router.delete("/appointments/{appointment_id}")
def delete_appointment(appointment_id: int, db: Session = Depends(get_db), _: dict = Depends(require_role(Role.admin))):
    appt = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")

    db.delete(appt)
    db.commit()
    return {"message": "Appointment deleted successfully"}
