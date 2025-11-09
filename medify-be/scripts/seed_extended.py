"""
Script tạo dữ liệu mẫu mở rộng cho Medify
- 10 bệnh nhân
- 10 bác sĩ với các chuyên khoa khác nhau
- Appointments
- Reviews
- Availability
"""
import sys
from pathlib import Path
from datetime import datetime, timedelta
import random

# Thêm thư mục gốc vào PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db import SessionLocal
from app.models import (
    User, Role, DoctorProfile, Appointment, Review, Availability,
    Gender, AppointmentStatus
)
from app.security import hash_password

# Dữ liệu mẫu
PATIENTS_DATA = [
    {"name": "Nguyễn Văn An", "email": "nguyenvanan@example.com", "gender": Gender.male},
    {"name": "Trần Thị Bình", "email": "tranthibinh@example.com", "gender": Gender.female},
    {"name": "Lê Văn Cường", "email": "levancuong@example.com", "gender": Gender.male},
    {"name": "Phạm Thị Dung", "email": "phamthidung@example.com", "gender": Gender.female},
    {"name": "Hoàng Văn Em", "email": "hoangvanem@example.com", "gender": Gender.male},
    {"name": "Vũ Thị Phương", "email": "vuthiphuong@example.com", "gender": Gender.female},
    {"name": "Đặng Văn Giang", "email": "dangvangiang@example.com", "gender": Gender.male},
    {"name": "Bùi Thị Hoa", "email": "buithihoa@example.com", "gender": Gender.female},
    {"name": "Ngô Văn Ích", "email": "ngovanich@example.com", "gender": Gender.male},
    {"name": "Đỗ Thị Kim", "email": "dothikim@example.com", "gender": Gender.female},
]

DOCTORS_DATA = [
    {"name": "BS. Nguyễn Văn Tim", "email": "bs.tim@medify.vn", "specialty": "Tim mạch", "exp": 10, "bio": "Chuyên khoa Tim mạch với 10 năm kinh nghiệm"},
    {"name": "BS. Trần Thị Da", "email": "bs.da@medify.vn", "specialty": "Da liễu", "exp": 8, "bio": "Chuyên khoa Da liễu, điều trị các bệnh về da"},
    {"name": "BS. Lê Văn Tâm", "email": "bs.tam@medify.vn", "specialty": "Tâm lý", "exp": 6, "bio": "Chuyên tư vấn và điều trị tâm lý"},
    {"name": "BS. Phạm Thị Lão", "email": "bs.lao@medify.vn", "specialty": "Khoa Lão", "exp": 12, "bio": "Chuyên chăm sóc sức khỏe người cao tuổi"},
    {"name": "BS. Hoàng Văn Xương", "email": "bs.xuong@medify.vn", "specialty": "Chấn thương chỉnh hình", "exp": 9, "bio": "Chuyên điều trị chấn thương và chỉnh hình"},
    {"name": "BS. Vũ Thị Mắt", "email": "bs.mat@medify.vn", "specialty": "Mắt", "exp": 7, "bio": "Chuyên khoa Mắt, phẫu thuật và điều trị"},
    {"name": "BS. Đặng Văn Tai", "email": "bs.tai@medify.vn", "specialty": "Tai mũi họng", "exp": 11, "bio": "Chuyên khoa Tai mũi họng"},
    {"name": "BS. Bùi Thị Răng", "email": "bs.rang@medify.vn", "specialty": "Răng hàm mặt", "exp": 8, "bio": "Nha khoa và phẫu thuật răng hàm mặt"},
    {"name": "BS. Ngô Văn Nhi", "email": "bs.nhi@medify.vn", "specialty": "Nhi khoa", "exp": 9, "bio": "Chuyên chăm sóc sức khỏe trẻ em"},
    {"name": "BS. Đỗ Thị Sản", "email": "bs.san@medify.vn", "specialty": "Sản phụ khoa", "exp": 10, "bio": "Chuyên khoa Sản phụ khoa"},
]

REVIEW_COMMENTS = [
    "Bác sĩ rất tận tâm và chuyên nghiệp",
    "Khám bệnh kỹ lưỡng, giải thích rõ ràng",
    "Thái độ phục vụ tốt, hài lòng",
    "Bác sĩ có kinh nghiệm, điều trị hiệu quả",
    "Rất hài lòng với dịch vụ",
    "Bác sĩ nhiệt tình, tư vấn chi tiết",
    "Phòng khám sạch sẽ, chuyên nghiệp",
    "Điều trị hiệu quả, bệnh thuyên giảm nhanh",
    "Bác sĩ dễ gần, giải thích dễ hiểu",
    "Dịch vụ tốt, sẽ quay lại",
]

APPOINTMENT_NOTES = [
    "Khám định kỳ",
    "Tái khám",
    "Khám lần đầu",
    "Khám cấp cứu",
    "Tư vấn sức khỏe",
    None,
    None,
    None,
]


def create_sample_data():
    db = SessionLocal()
    
    try:
        print("🌱 Bắt đầu tạo dữ liệu mẫu...")
        
        # 1. Tạo bệnh nhân
        print("\n📋 Tạo 10 bệnh nhân...")
        patients = []
        for p_data in PATIENTS_DATA:
            patient = User(
                email=p_data["email"],
                full_name=p_data["name"],
                password_hash=hash_password("123456"),
                role=Role.patient,
                gender=p_data["gender"],
                is_active=True
            )
            db.add(patient)
            patients.append(patient)
        db.commit()
        print(f"✅ Đã tạo {len(patients)} bệnh nhân")
        
        # 2. Tạo bác sĩ
        print("\n👨‍⚕️ Tạo 10 bác sĩ...")
        doctors = []
        doctor_profiles = []
        for d_data in DOCTORS_DATA:
            doctor = User(
                email=d_data["email"],
                full_name=d_data["name"],
                password_hash=hash_password("123456"),
                role=Role.doctor,
                gender=Gender.male if "Văn" in d_data["name"] else Gender.female,
                is_active=True
            )
            db.add(doctor)
            db.flush()  # Để lấy ID
            
            profile = DoctorProfile(
                user_id=doctor.id,
                specialty=d_data["specialty"],
                years_exp=d_data["exp"],
                bio=d_data["bio"],
                avg_rating=0.0
            )
            db.add(profile)
            doctors.append(doctor)
            doctor_profiles.append(profile)
        db.commit()
        print(f"✅ Đã tạo {len(doctors)} bác sĩ")
        
        # 3. Tạo Availability cho bác sĩ
        print("\n📅 Tạo lịch làm việc cho bác sĩ...")
        for profile in doctor_profiles:
            # Mỗi bác sĩ làm việc 3-5 ngày/tuần
            weekdays = random.sample(range(7), random.randint(3, 5))
            for weekday in weekdays:
                start_hour = random.randint(7, 9)
                end_hour = random.randint(16, 18)
                availability = Availability(
                    doctor_id=profile.id,
                    weekday=weekday,
                    start_time=f"{start_hour:02d}:00",
                    end_time=f"{end_hour:02d}:00"
                )
                db.add(availability)
        db.commit()
        print("✅ Đã tạo lịch làm việc")
        
        # 4. Tạo Appointments
        print("\n📝 Tạo appointments...")
        appointments = []
        today = datetime.now()
        
        # Tạo một số appointments cho hôm nay (5-10 appointments)
        print("   Tạo appointments cho hôm nay...")
        today_start = today.replace(hour=0, minute=0, second=0, microsecond=0)
        num_today_appointments = random.randint(5, 10)
        created_today = 0
        
        for i in range(num_today_appointments * 2):  # Thử nhiều lần để đảm bảo có đủ
            if created_today >= num_today_appointments:
                break
                
            hour = random.randint(8, 17)
            minute = random.choice([0, 30])
            start_at = today_start.replace(hour=hour, minute=minute, second=0, microsecond=0)
            end_at = start_at + timedelta(hours=1)
            
            # Nếu appointment đã qua, đánh dấu là DONE hoặc CANCELED
            # Nếu appointment chưa đến, đánh dấu là BOOKED hoặc CANCELED
            if start_at < today:
                status = random.choices(
                    [AppointmentStatus.done, AppointmentStatus.canceled],
                    weights=[70, 30]
                )[0]
            else:
                status = random.choices(
                    [AppointmentStatus.booked, AppointmentStatus.canceled],
                    weights=[85, 15]
                )[0]
            
            patient = random.choice(patients)
            doctor = random.choice(doctors)
            
            appointment = Appointment(
                patient_id=patient.id,
                doctor_id=doctor.id,
                start_at=start_at,
                end_at=end_at,
                status=status,
                note=random.choice(APPOINTMENT_NOTES)
            )
            db.add(appointment)
            appointments.append(appointment)
            created_today += 1
        
        # Tạo appointments trong 30 ngày qua và 30 ngày tới
        for i in range(30):
            # Appointments trong quá khứ
            days_ago = random.randint(1, 30)
            appointment_date = today - timedelta(days=days_ago)
            hour = random.randint(8, 17)
            minute = random.choice([0, 30])
            start_at = appointment_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
            end_at = start_at + timedelta(hours=1)
            
            patient = random.choice(patients)
            doctor = random.choice(doctors)
            profile = next(p for p in doctor_profiles if p.user_id == doctor.id)
            
            # Status: 60% DONE, 20% CANCELED, 20% BOOKED (nếu trong tương lai)
            if start_at < today:
                status = random.choices(
                    [AppointmentStatus.done, AppointmentStatus.canceled],
                    weights=[70, 30]
                )[0]
            else:
                status = random.choices(
                    [AppointmentStatus.booked, AppointmentStatus.canceled],
                    weights=[80, 20]
                )[0]
            
            appointment = Appointment(
                patient_id=patient.id,
                doctor_id=doctor.id,
                start_at=start_at,
                end_at=end_at,
                status=status,
                note=random.choice(APPOINTMENT_NOTES)
            )
            db.add(appointment)
            appointments.append(appointment)
            
            # Appointments trong tương lai
            days_ahead = random.randint(1, 30)
            appointment_date = today + timedelta(days=days_ahead)
            hour = random.randint(8, 17)
            minute = random.choice([0, 30])
            start_at = appointment_date.replace(hour=hour, minute=minute, second=0, microsecond=0)
            end_at = start_at + timedelta(hours=1)
            
            patient = random.choice(patients)
            doctor = random.choice(doctors)
            
            status = random.choices(
                [AppointmentStatus.booked, AppointmentStatus.canceled],
                weights=[85, 15]
            )[0]
            
            appointment = Appointment(
                patient_id=patient.id,
                doctor_id=doctor.id,
                start_at=start_at,
                end_at=end_at,
                status=status,
                note=random.choice(APPOINTMENT_NOTES)
            )
            db.add(appointment)
            appointments.append(appointment)
        
        db.commit()
        print(f"✅ Đã tạo {len(appointments)} appointments")
        
        # 5. Tạo Reviews cho appointments đã hoàn thành
        print("\n⭐ Tạo reviews...")
        done_appointments = [a for a in appointments if a.status == AppointmentStatus.done]
        reviews_created = 0
        
        for appointment in done_appointments[:25]:  # Tối đa 25 reviews
            # 80% appointments có review
            if random.random() < 0.8:
                profile = next(p for p in doctor_profiles if p.user_id == appointment.doctor_id)
                rating = random.choices([1, 2, 3, 4, 5], weights=[2, 3, 10, 30, 55])[0]
                
                review = Review(
                    appointment_id=appointment.id,
                    doctor_profile_id=profile.id,
                    rating=rating,
                    comment=random.choice(REVIEW_COMMENTS)
                )
                db.add(review)
                reviews_created += 1
        
        db.commit()
        print(f"✅ Đã tạo {reviews_created} reviews")
        
        # 6. Cập nhật avg_rating cho bác sĩ
        print("\n📊 Cập nhật đánh giá trung bình cho bác sĩ...")
        for profile in doctor_profiles:
            reviews = db.query(Review).filter(Review.doctor_profile_id == profile.id).all()
            if reviews:
                avg_rating = sum(r.rating for r in reviews) / len(reviews)
                profile.avg_rating = round(avg_rating, 1)
        
        db.commit()
        print("✅ Đã cập nhật đánh giá trung bình")
        
        print("\n🎉 Hoàn thành tạo dữ liệu mẫu!")
        print(f"\n📊 Tóm tắt:")
        print(f"   - Bệnh nhân: {len(patients)}")
        print(f"   - Bác sĩ: {len(doctors)}")
        print(f"   - Appointments: {len(appointments)}")
        print(f"   - Reviews: {reviews_created}")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Lỗi: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    create_sample_data()

