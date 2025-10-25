from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.deps import get_db, get_current_user, require_role
from app import models, schemas

router = APIRouter(prefix="/appointments", tags=["appointments"])


# 🧩 Lấy danh sách cuộc hẹn (theo vai trò)
@router.get("", response_model=List[schemas.AppointmentOut])
def my_appointments(
        user=Depends(get_current_user),
        db: Session = Depends(get_db),
):
    if user["role"] == models.Role.patient.value:
        q = db.query(models.Appointment).filter_by(patient_id=user["sub"])
    elif user["role"] == models.Role.doctor.value:
        q = db.query(models.Appointment).filter_by(doctor_id=user["sub"])
    else:
        q = db.query(models.Appointment)

    return q.order_by(models.Appointment.start_at.desc()).all()


# 🧩 Bệnh nhân tạo cuộc hẹn mới
@router.post(
    "",
    response_model=schemas.AppointmentOut,
    dependencies=[Depends(require_role(models.Role.patient))],
)
def create_appointment(
        payload: schemas.AppointmentCreate,
        user=Depends(get_current_user),
        db: Session = Depends(get_db),
):
    ap = models.Appointment(
        patient_id=user["sub"],
        doctor_id=payload.doctor_user_id,
        start_at=payload.start_at,
        end_at=payload.end_at,
        note=payload.note,
    )
    db.add(ap)
    db.commit()
    db.refresh(ap)
    return ap


# 🧩 Hủy cuộc hẹn (bệnh nhân hoặc bác sĩ)
@router.post("/{appointment_id}/cancel", response_model=schemas.AppointmentOut)
def cancel_appointment(
        appointment_id: int,
        user=Depends(get_current_user),
        db: Session = Depends(get_db),
):
    ap = db.query(models.Appointment).get(appointment_id)
    if not ap:
        raise HTTPException(404, "Not found")

    # Kiểm tra quyền hủy
    if user["role"] == models.Role.patient.value and ap.patient_id != user["sub"]:
        raise HTTPException(403, "Forbidden")
    if user["role"] == models.Role.doctor.value and ap.doctor_id != user["sub"]:
        raise HTTPException(403, "Forbidden")

    ap.status = models.AppointmentStatus.canceled
    db.commit()
    db.refresh(ap)
    return ap
