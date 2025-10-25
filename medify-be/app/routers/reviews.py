from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.deps import get_db, require_role, get_current_user
from app import models, schemas


router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("", dependencies=[Depends(require_role(models.Role.patient))])
def create_review(
        payload: schemas.ReviewCreate,
        user=Depends(get_current_user),
        db: Session = Depends(get_db),
):
    # 🔍 Kiểm tra cuộc hẹn hợp lệ
    ap = db.query(models.Appointment).get(payload.appointment_id)
    if not ap or ap.patient_id != user["sub"]:
        raise HTTPException(status_code=403, detail="Forbidden")
    if ap.status != models.AppointmentStatus.done:
        raise HTTPException(status_code=400, detail="Appointment must be DONE before review")

    # 🔗 Tìm hồ sơ bác sĩ tương ứng
    doc_profile_id = (
        db.query(models.DoctorProfile.id)
        .filter_by(user_id=ap.doctor_id)
        .scalar()
    )

    if not doc_profile_id:
        raise HTTPException(status_code=404, detail="Doctor profile not found")

    # ✍️ Tạo đánh giá mới
    rv = models.Review(
        appointment_id=ap.id,
        doctor_profile_id=doc_profile_id,
        rating=payload.rating,
        comment=payload.comment,
    )
    db.add(rv)
    db.commit()

    # 🔁 Cập nhật điểm trung bình cho bác sĩ
    avg = (
            db.query(func.avg(models.Review.rating))
            .filter_by(doctor_profile_id=doc_profile_id)
            .scalar()
            or 0
    )

    dp = db.query(models.DoctorProfile).get(doc_profile_id)
    dp.avg_rating = float(avg)
    db.commit()

    return {"ok": True, "new_avg_rating": dp.avg_rating}
