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


# 🧩 Tạo bác sĩ mới
@router.post("/doctors", response_model=schemas.DoctorManagementOut)
def create_doctor(
    data: schemas.DoctorCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    from app.security import get_password_hash
    
    # Check if email already exists
    existing_user = db.query(models.User).filter(models.User.email == data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    
    # Create user
    new_user = models.User(
        email=data.email,
        full_name=data.full_name,
        password_hash=get_password_hash(data.password),
        gender=data.gender,
        role=Role.doctor,
        is_active=True
    )
    db.add(new_user)
    db.flush()  # Get user ID
    
    # Create doctor profile
    doctor_profile = models.DoctorProfile(
        user_id=new_user.id,
        specialty=data.specialty,
        years_exp=data.years_exp,
        bio=data.bio,
        avg_rating=0.0
    )
    db.add(doctor_profile)
    db.commit()
    db.refresh(new_user)
    db.refresh(doctor_profile)
    
    return schemas.DoctorManagementOut(
        id=new_user.id,
        email=new_user.email,
        full_name=new_user.full_name,
        gender=new_user.gender,
        specialty=doctor_profile.specialty,
        years_exp=doctor_profile.years_exp,
        avg_rating=doctor_profile.avg_rating,
        bio=doctor_profile.bio,
        is_active=new_user.is_active
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


# ==================== Specializations Management ====================

# 🧩 Lấy danh sách tất cả chuyên khoa
@router.get("/specializations", response_model=List[schemas.SpecializationOut])
def list_specializations(
    search: Optional[str] = None,
    sort_by: Optional[str] = "name",  # "name", "doctor_count"
    sort_order: Optional[str] = "asc",
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    from sqlalchemy import func, case
    
    # Query to get specializations with doctor count
    qry = (
        db.query(
            models.DoctorProfile.specialty,
            func.count(models.DoctorProfile.id).label("doctor_count"),
            func.avg(models.DoctorProfile.avg_rating).label("avg_rating")
        )
        .filter(models.DoctorProfile.specialty.isnot(None))
        .filter(models.DoctorProfile.specialty != "")
        .group_by(models.DoctorProfile.specialty)
    )
    
    # Search filter
    if search:
        qry = qry.filter(models.DoctorProfile.specialty.ilike(f"%{search}%"))
    
    # Sort
    if sort_by == "doctor_count":
        if sort_order == "desc":
            qry = qry.order_by(func.count(models.DoctorProfile.id).desc())
        else:
            qry = qry.order_by(func.count(models.DoctorProfile.id).asc())
    else:  # sort by name
        if sort_order == "desc":
            qry = qry.order_by(models.DoctorProfile.specialty.desc())
        else:
            qry = qry.order_by(models.DoctorProfile.specialty.asc())
    
    results = qry.all()
    
    specializations = []
    for specialty, doctor_count, avg_rating in results:
        specializations.append(
            schemas.SpecializationOut(
                name=specialty,
                doctor_count=doctor_count,
                avg_rating=round(avg_rating or 0.0, 2)
            )
        )
    
    return specializations


# 🧩 Tạo chuyên khoa mới
@router.post("/specializations", response_model=schemas.SpecializationOut)
def create_specialization(
    data: schemas.SpecializationCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    # Check if specialization already exists
    existing = db.query(models.DoctorProfile).filter(
        models.DoctorProfile.specialty == data.name
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Chuyên khoa đã tồn tại")
    
    # Return the new specialization with 0 doctors
    return schemas.SpecializationOut(
        name=data.name,
        doctor_count=0,
        avg_rating=0.0
    )


# 🧩 Cập nhật tên chuyên khoa (rename)
@router.put("/specializations/{old_name}")
def update_specialization(
    old_name: str,
    data: schemas.SpecializationUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    # Check if new name already exists
    existing = db.query(models.DoctorProfile).filter(
        models.DoctorProfile.specialty == data.new_name
    ).first()
    
    if existing and data.new_name != old_name:
        raise HTTPException(status_code=400, detail="Chuyên khoa mới đã tồn tại")
    
    # Update all doctors with this specialty
    updated_count = db.query(models.DoctorProfile).filter(
        models.DoctorProfile.specialty == old_name
    ).update({"specialty": data.new_name})
    
    if updated_count == 0:
        raise HTTPException(status_code=404, detail="Chuyên khoa không tồn tại")
    
    db.commit()
    
    return {
        "message": "Cập nhật chuyên khoa thành công",
        "updated_doctors": updated_count
    }


# 🧩 Xóa chuyên khoa (set về null hoặc xóa bác sĩ)
@router.delete("/specializations/{name}")
def delete_specialization(
    name: str,
    action: str = "clear",  # "clear" or "delete_doctors"
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    doctors = db.query(models.DoctorProfile).filter(
        models.DoctorProfile.specialty == name
    ).all()
    
    if not doctors:
        raise HTTPException(status_code=404, detail="Chuyên khoa không tồn tại")
    
    if action == "delete_doctors":
        # Delete all doctors with this specialty
        for doctor in doctors:
            user = db.query(models.User).filter(models.User.id == doctor.user_id).first()
            if user:
                db.delete(user)
        db.commit()
        return {
            "message": f"Đã xóa {len(doctors)} bác sĩ thuộc chuyên khoa '{name}'"
        }
    else:
        # Just clear the specialty field
        for doctor in doctors:
            doctor.specialty = None
        db.commit()
        return {
            "message": f"Đã xóa chuyên khoa '{name}' khỏi {len(doctors)} bác sĩ"
        }