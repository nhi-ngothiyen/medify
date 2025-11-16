from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

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


# 🧩 Lấy danh sách tất cả bác sĩ với filter, search, sort
@router.get("/doctors", response_model=List[schemas.DoctorManagementOut])
def list_doctors(
    specialty: Optional[str] = None,
    search: Optional[str] = None,
    search_field: Optional[str] = None,  # "name", "email", "specialty", "all"
    sort_by: Optional[str] = None,  # "name", "experience", "rating", "specialty"
    sort_order: Optional[str] = "asc",  # "asc" or "desc"
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    qry = (
        db.query(models.User, models.DoctorProfile)
        .join(models.DoctorProfile, models.DoctorProfile.user_id == models.User.id)
        .filter(models.User.role == Role.doctor)
    )

    # Filter by specialty
    if specialty and specialty != "all":
        qry = qry.filter(models.DoctorProfile.specialty.ilike(f"%{specialty}%"))

    # Search by different fields
    if search:
        search_term = f"%{search}%"
        if search_field == "name":
            qry = qry.filter(models.User.full_name.ilike(search_term))
        elif search_field == "email":
            qry = qry.filter(models.User.email.ilike(search_term))
        elif search_field == "specialty":
            qry = qry.filter(models.DoctorProfile.specialty.ilike(search_term))
        else:  # "all" or None - search in all fields
            qry = qry.filter(
                models.User.full_name.ilike(search_term)
                | models.User.email.ilike(search_term)
                | models.DoctorProfile.specialty.ilike(search_term)
            )

    # Sort
    if sort_by == "name":
        if sort_order == "desc":
            qry = qry.order_by(models.User.full_name.desc())
        else:
            qry = qry.order_by(models.User.full_name.asc())
    elif sort_by == "experience":
        if sort_order == "desc":
            qry = qry.order_by(models.DoctorProfile.years_exp.desc())
        else:
            qry = qry.order_by(models.DoctorProfile.years_exp.asc())
    elif sort_by == "rating":
        if sort_order == "desc":
            qry = qry.order_by(models.DoctorProfile.avg_rating.desc())
        else:
            qry = qry.order_by(models.DoctorProfile.avg_rating.asc())
    elif sort_by == "specialty":
        if sort_order == "desc":
            qry = qry.order_by(models.DoctorProfile.specialty.desc())
        else:
            qry = qry.order_by(models.DoctorProfile.specialty.asc())
    else:
        # Default sort by name
        qry = qry.order_by(models.User.full_name.asc())

    items = []
    for u, p in qry.all():
        items.append(
            schemas.DoctorManagementOut(
                id=u.id,
                email=u.email,
                full_name=u.full_name,
                gender=u.gender,
                specialty=p.specialty or "",
                years_exp=p.years_exp or 0,
                avg_rating=p.avg_rating or 0.0,
                bio=p.bio,
                is_active=u.is_active,
            )
        )

    return items


# 🧩 Xem chi tiết bác sĩ
@router.get("/doctors/{doctor_id}", response_model=schemas.DoctorDetail)
def get_doctor_detail(
    doctor_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    u = (
        db.query(models.User)
        .filter_by(id=doctor_id, role=Role.doctor)
        .first()
    )

    if not u or not u.doctor_profile:
        raise HTTPException(status_code=404, detail="Doctor not found")

    p = u.doctor_profile
    avs = [
        schemas.AvailabilityOut(
            weekday=a.weekday,
            start_time=a.start_time,
            end_time=a.end_time,
        )
        for a in p.availabilities
    ]

    return schemas.DoctorDetail(
        user=u,
        profile_specialty=p.specialty,
        years_exp=p.years_exp,
        bio=p.bio,
        avg_rating=p.avg_rating,
        availabilities=avs,
    )


# 🧩 Xóa bác sĩ
@router.delete("/doctors/{doctor_id}")
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    user = db.query(models.User).filter(models.User.id == doctor_id, models.User.role == Role.doctor).first()
    if not user:
        raise HTTPException(status_code=404, detail="Doctor not found")

    db.delete(user)
    db.commit()
    return {"message": "Doctor deleted successfully"}


# 🧩 Xem tất cả các cuộc hẹn
@router.get("/appointments", response_model=List[schemas.AppointmentOut])
def list_appointments(db: Session = Depends(get_db), _: dict = Depends(require_role(Role.admin))):
    appointments = db.query(models.Appointment)\
        .options(joinedload(models.Appointment.patient))\
        .options(joinedload(models.Appointment.doctor).joinedload(models.User.doctor_profile))\
        .order_by(models.Appointment.start_at.desc())\
        .all()
    
    # Populate specialty field for doctors
    for appt in appointments:
        if appt.doctor and appt.doctor.doctor_profile:
            appt.doctor.specialty = appt.doctor.doctor_profile.specialty
    
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


# 🧩 Toggle trạng thái active của user
@router.post("/users/{user_id}/toggle-active")
def toggle_user_active(user_id: int, db: Session = Depends(get_db), _: dict = Depends(require_role(Role.admin))):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.is_active = not user.is_active
    db.commit()
    db.refresh(user)
    
    return {
        "message": f"User {'activated' if user.is_active else 'deactivated'} successfully",
        "is_active": user.is_active
    }


# 🧩 Reset mật khẩu user về default
@router.post("/users/{user_id}/reset-password")
def reset_user_password(user_id: int, db: Session = Depends(get_db), _: dict = Depends(require_role(Role.admin))):
    from app.security import get_password_hash
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Reset về mật khẩu mặc định
    default_password = "Password@123"
    user.password_hash = get_password_hash(default_password)
    db.commit()
    
    return {
        "message": "Password reset successfully",
        "default_password": default_password
    }