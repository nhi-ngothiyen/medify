# app/models.py
from sqlalchemy import (
    Column, Integer, String, Boolean, Enum, ForeignKey, DateTime, Text, Float
)
from sqlalchemy.orm import relationship
import enum

from app.db import Base

class Gender(str, enum.Enum):
    male = "MALE"
    female = "FEMALE"
    other = "OTHER"

class Role(str, enum.Enum):
    patient = "PATIENT"
    doctor = "DOCTOR"
    admin = "ADMIN"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    gender = Column(Enum(Gender), nullable=True)
    password_hash = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role = Column(Enum(Role), nullable=False, index=True)

    doctor_profile = relationship("DoctorProfile", back_populates="user", uselist=False)
    appointments_patient = relationship(
        "Appointment", back_populates="patient", foreign_keys="Appointment.patient_id"
    )
    appointments_doctor = relationship(
        "Appointment", back_populates="doctor", foreign_keys="Appointment.doctor_id"
    )

class DoctorProfile(Base):
    __tablename__ = "doctor_profiles"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    specialty = Column(String, index=True)
    years_exp = Column(Integer, default=0)
    bio = Column(Text)
    avg_rating = Column(Float, default=0.0)

    user = relationship("User", back_populates="doctor_profile")
    availabilities = relationship("Availability", back_populates="doctor")
    reviews = relationship("Review", back_populates="doctor")

class Availability(Base):
    __tablename__ = "availabilities"
    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer, ForeignKey("doctor_profiles.id"))
    weekday = Column(Integer)            # 0..6
    start_time = Column(String)          # "08:00"
    end_time = Column(String)            # "11:30"

    doctor = relationship("DoctorProfile", back_populates="availabilities")

class AppointmentStatus(str, enum.Enum):
    booked = "BOOKED"
    canceled = "CANCELED"
    done = "DONE"

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("users.id"))
    start_at = Column(DateTime, index=True)
    end_at = Column(DateTime)
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.booked)
    note = Column(Text, nullable=True)

    patient = relationship("User", foreign_keys=[patient_id], back_populates="appointments_patient")
    doctor = relationship("User", foreign_keys=[doctor_id], back_populates="appointments_doctor")
    review = relationship("Review", back_populates="appointment", uselist=False)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), unique=True)
    doctor_profile_id = Column(Integer, ForeignKey("doctor_profiles.id"))
    rating = Column(Integer)  # 1..5
    comment = Column(Text)

    appointment = relationship("Appointment", back_populates="review")
    doctor = relationship("DoctorProfile", back_populates="reviews")
