# app/routers/dashboard.py
from typing import List
from datetime import datetime, timedelta, date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, cast, Date, desc

from app import models, schemas
from app.deps import get_db, require_role
from app.models import Role, AppointmentStatus

router = APIRouter(prefix="/admin/dashboard", tags=["dashboard"])


@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    """
    Lấy thống kê tổng quan cho dashboard
    """
    # Tổng số bệnh nhân
    total_patients = db.query(models.User).filter(
        models.User.role == Role.patient
    ).count()
    
    # Tổng số bác sĩ
    total_doctors = db.query(models.User).filter(
        models.User.role == Role.doctor
    ).count()
    
    # Tổng số appointments
    total_appointments = db.query(models.Appointment).count()
    
    # Số appointments đang chờ (BOOKED)
    pending_appointments = db.query(models.Appointment).filter(
        models.Appointment.status == AppointmentStatus.booked
    ).count()
    
    # Số appointments hôm nay
    today = date.today()
    today_appointments = db.query(models.Appointment).filter(
        cast(models.Appointment.start_at, Date) == today
    ).count()
    
    # Số user đang hoạt động
    active_users = db.query(models.User).filter(
        models.User.is_active == True
    ).count()
    
    return schemas.DashboardStats(
        total_patients=total_patients,
        total_doctors=total_doctors,
        total_appointments=total_appointments,
        pending_appointments=pending_appointments,
        today_appointments=today_appointments,
        active_users=active_users
    )


@router.get("/appointments-by-status", response_model=List[schemas.AppointmentStatusCount])
def get_appointments_by_status(
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    """
    Thống kê số lượng appointments theo trạng thái
    """
    results = db.query(
        models.Appointment.status,
        func.count(models.Appointment.id).label('count')
    ).group_by(models.Appointment.status).all()
    
    return [
        schemas.AppointmentStatusCount(
            status=status.value,
            count=count
        ) for status, count in results
    ]


@router.get("/users-by-role", response_model=List[schemas.UserRoleCount])
def get_users_by_role(
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    """
    Thống kê số lượng users theo role
    """
    results = db.query(
        models.User.role,
        func.count(models.User.id).label('count')
    ).group_by(models.User.role).all()
    
    return [
        schemas.UserRoleCount(
            role=role.value,
            count=count
        ) for role, count in results
    ]


@router.get("/specialties", response_model=List[schemas.SpecialtyStats])
def get_specialty_stats(
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    """
    Thống kê theo chuyên khoa: số bác sĩ và số appointments
    """
    # Đếm số bác sĩ theo chuyên khoa
    doctor_counts = db.query(
        models.DoctorProfile.specialty,
        func.count(models.DoctorProfile.id).label('doctor_count')
    ).group_by(models.DoctorProfile.specialty).all()
    
    # Đếm số appointments theo chuyên khoa
    appointment_counts = db.query(
        models.DoctorProfile.specialty,
        func.count(models.Appointment.id).label('appointment_count')
    ).join(
        models.User, models.DoctorProfile.user_id == models.User.id
    ).join(
        models.Appointment, models.Appointment.doctor_id == models.User.id
    ).group_by(models.DoctorProfile.specialty).all()
    
    # Tạo dict để merge data
    appt_dict = {specialty: count for specialty, count in appointment_counts}
    
    return [
        schemas.SpecialtyStats(
            specialty=specialty,
            doctor_count=doctor_count,
            appointment_count=appt_dict.get(specialty, 0)
        ) for specialty, doctor_count in doctor_counts
    ]


@router.get("/top-doctors", response_model=List[schemas.TopDoctor])
def get_top_doctors(
    limit: int = 5,
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    """
    Lấy top bác sĩ có nhiều appointments nhất
    """
    results = db.query(
        models.User.id,
        models.User.full_name,
        models.DoctorProfile.specialty,
        models.DoctorProfile.avg_rating,
        func.count(models.Appointment.id).label('appointment_count')
    ).join(
        models.DoctorProfile, models.User.id == models.DoctorProfile.user_id
    ).outerjoin(
        models.Appointment, models.Appointment.doctor_id == models.User.id
    ).filter(
        models.User.role == Role.doctor
    ).group_by(
        models.User.id,
        models.User.full_name,
        models.DoctorProfile.specialty,
        models.DoctorProfile.avg_rating
    ).order_by(
        desc('appointment_count')
    ).limit(limit).all()
    
    return [
        schemas.TopDoctor(
            doctor_id=doctor_id,
            doctor_name=doctor_name,
            specialty=specialty,
            avg_rating=avg_rating,
            appointment_count=appointment_count
        ) for doctor_id, doctor_name, specialty, avg_rating, appointment_count in results
    ]


@router.get("/appointment-trends", response_model=List[schemas.AppointmentTrend])
def get_appointment_trends(
    days: int = 7,
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    """
    Xu hướng đặt lịch theo ngày (mặc định 7 ngày gần nhất)
    """
    # Lấy appointments trong N ngày gần nhất
    start_date = date.today() - timedelta(days=days)
    
    results = db.query(
        cast(models.Appointment.start_at, Date).label('date'),
        func.count(models.Appointment.id).label('count')
    ).filter(
        cast(models.Appointment.start_at, Date) >= start_date
    ).group_by(
        cast(models.Appointment.start_at, Date)
    ).order_by('date').all()
    
    # Tạo dict từ kết quả
    data_dict = {str(d): count for d, count in results}
    
    # Tạo list đầy đủ các ngày (kể cả ngày không có appointment)
    trends = []
    for i in range(days):
        current_date = start_date + timedelta(days=i)
        date_str = str(current_date)
        trends.append(
            schemas.AppointmentTrend(
                date=date_str,
                count=data_dict.get(date_str, 0)
            )
        )
    
    return trends


@router.get("/recent-activities", response_model=List[schemas.RecentActivity])
def get_recent_activities(
    limit: int = 10,
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    """
    Lấy các hoạt động gần đây (appointments mới, users mới đăng ký, reviews mới)
    """
    activities = []
    
    # Lấy appointments mới nhất
    recent_appointments = db.query(models.Appointment).order_by(
        desc(models.Appointment.id)
    ).limit(limit // 2).all()
    
    for appt in recent_appointments:
        patient = db.query(models.User).filter(models.User.id == appt.patient_id).first()
        doctor = db.query(models.User).filter(models.User.id == appt.doctor_id).first()
        
        activities.append(
            schemas.RecentActivity(
                id=appt.id,
                type="appointment",
                description=f"{patient.full_name if patient else 'Unknown'} đặt lịch với {doctor.full_name if doctor else 'Unknown'}",
                created_at=appt.start_at
            )
        )
    
    # Lấy users mới đăng ký (giả sử có created_at field, nếu không thì bỏ qua)
    # Vì model User không có created_at, ta sẽ skip phần này hoặc dùng id
    
    # Sắp xếp theo thời gian
    activities.sort(key=lambda x: x.created_at, reverse=True)
    
    return activities[:limit]


@router.get("", response_model=schemas.DashboardData)
def get_dashboard_data(
    db: Session = Depends(get_db),
    _: dict = Depends(require_role(Role.admin))
):
    """
    API tổng hợp - lấy tất cả dữ liệu dashboard trong một request
    """
    return schemas.DashboardData(
        overview=get_dashboard_stats(db, _),
        appointments_by_status=get_appointments_by_status(db, _),
        users_by_role=get_users_by_role(db, _),
        specialties=get_specialty_stats(db, _),
        top_doctors=get_top_doctors(5, db, _),
        recent_activities=get_recent_activities(10, db, _),
        appointment_trends=get_appointment_trends(7, db, _)
    )

