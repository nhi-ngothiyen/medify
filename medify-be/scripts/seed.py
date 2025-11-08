import sys
from pathlib import Path

# Thêm thư mục gốc vào PYTHONPATH
sys.path.insert(0, str(Path(__file__).parent.parent))

from app.db import SessionLocal
from app.models import User, Role, DoctorProfile
from app.security import hash_password


if __name__ == "__main__":
    db = SessionLocal()
    p = User(email="patient@medify.vn", full_name="Người Bệnh", password_hash=hash_password("123456"), role=Role.patient)
    d = User(email="doctor@medify.vn", full_name="Bác Sĩ A", password_hash=hash_password("123456"), role=Role.doctor)
    a = User(email="admin@medify.vn", full_name="Quản trị", password_hash=hash_password("Admin@123"), role=Role.admin)
    db.add_all([p, d, a]); db.commit()
    dp = DoctorProfile(user_id=d.id, specialty="Cardiology", years_exp=5, bio="Tốt nghiệp XYZ")
    db.add(dp); db.commit(); db.close()