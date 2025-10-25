from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.deps import get_db
from app import models, schemas

router = APIRouter(prefix="/doctors", tags=["doctors"])


@router.get("", response_model=List[schemas.DoctorCard])
def search_doctors(
        q: Optional[str] = None,
        specialty: Optional[str] = None,
        gender: Optional[models.Gender] = None,
        sort: str = "rating_desc",
        db: Session = Depends(get_db),
):
    qry = (
        db.query(models.User, models.DoctorProfile)
        .join(models.DoctorProfile, models.DoctorProfile.user_id == models.User.id)
        .filter(models.User.role == models.Role.doctor)
    )

    if specialty:
        qry = qry.filter(models.DoctorProfile.specialty.ilike(f"%{specialty}%"))
    if gender:
        qry = qry.filter(models.User.gender == gender)
    if q:
        qry = qry.filter(
            models.User.full_name.ilike(f"%{q}%")
            | models.DoctorProfile.bio.ilike(f"%{q}%")
        )
    if sort == "rating_desc":
        qry = qry.order_by(models.DoctorProfile.avg_rating.desc())

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


@router.get("/{doctor_user_id}", response_model=schemas.DoctorDetail)
def doctor_detail(doctor_user_id: int, db: Session = Depends(get_db)):
    u = (
        db.query(models.User)
        .filter_by(id=doctor_user_id, role=models.Role.doctor)
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
