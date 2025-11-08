# scripts/create_user.py
import sys
import re
from getpass import getpass
from typing import Optional

# Cho phép import "app.*" khi chạy trực tiếp file này
sys.path.insert(0, ".")

from app.db import SessionLocal
from app import models
from app.security import hash_password

ROLE_CHOICES = {
    "1": models.Role.admin,
    "2": models.Role.doctor,
    "3": models.Role.patient,
}

# Regex: 8-16 ký tự, ít nhất 1 chữ thường, 1 chữ hoa, 1 số, 1 ký tự đặc biệt
PASSWORD_REGEX = re.compile(
    r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,16}$"
)

def prompt_yes_no(message: str, default: Optional[bool] = None) -> bool:
    if default is True:
        suffix = " [Y/n] "
    elif default is False:
        suffix = " [y/N] "
    else:
        suffix = " [y/n] "

    while True:
        ans = input(message + suffix).strip().lower()
        if ans in ("y", "yes"):
            return True
        if ans in ("n", "no"):
            return False
        if ans == "" and default is not None:
            return default
        print("Vui lòng nhập y/yes hoặc n/no.")

def is_valid_email(email: str) -> bool:
    return bool(re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email))

def select_role() -> models.Role:
    print("Chọn vai trò (role):")
    print("  1) Admin")
    print("  2) Doctor")
    print("  3) Patient")
    while True:
        choice = input("Nhập số [1-3]: ").strip()
        if choice in ROLE_CHOICES:
            return ROLE_CHOICES[choice]
        print("Lựa chọn không hợp lệ. Vui lòng nhập 1, 2 hoặc 3.")

def get_email() -> str:
    while True:
        email = input("Email: ").strip()
        if not email:
            print("Email không được để trống.")
            continue
        if not is_valid_email(email):
            print("Email không hợp lệ. Ví dụ hợp lệ: user@example.com")
            continue
        return email

def validate_password_policy(pw: str) -> Optional[str]:
    """
    Trả về None nếu hợp lệ; ngược lại trả về thông báo lỗi.
    Yêu cầu:
    - 8-16 ký tự
    - gồm ít nhất: 1 chữ thường, 1 chữ hoa, 1 số, 1 ký tự đặc biệt
    """
    if not 8 <= len(pw) <= 16:
        return "Mật khẩu phải từ 8 đến 16 ký tự."
    if not PASSWORD_REGEX.match(pw):
        return (
            "Mật khẩu phải gồm chữ thường, chữ hoa, chữ số và ký tự đặc biệt."
        )
    return None

def get_password() -> str:
    while True:
        pw = getpass("Mật khẩu (ẩn ký tự): ").strip()
        err = validate_password_policy(pw)
        if err:
            print("❌", err)
            continue
        pw2 = getpass("Nhập lại mật khẩu: ").strip()
        if pw != pw2:
            print("❌ Mật khẩu không khớp. Thử lại.")
            continue
        return pw

def upsert_user(email: str, password: str, role: models.Role, full_name: Optional[str] = None):
    db = SessionLocal()
    try:
        user = db.query(models.User).filter(models.User.email == email).first()
        if user:
            print(f"⚠️ Người dùng với email '{email}' đã tồn tại (id={user.id}, role={user.role.value}).")
            if prompt_yes_no("Bạn có muốn CẬP NHẬT role/password cho người dùng này?", default=False):
                user.role = role
                user.password_hash = hash_password(password)
                if full_name:
                    user.full_name = full_name
                db.commit()
                db.refresh(user)
                print(f"✅ Đã cập nhật người dùng (id={user.id}) → role={user.role.value}")
            else:
                print("❎ Bỏ qua cập nhật người dùng hiện có.")
            return user

        if full_name is None or not full_name.strip():
            full_name = "New User"

        new_user = models.User(
            email=email,
            full_name=full_name,
            password_hash=hash_password(password),
            role=role,
            gender=None,
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        print(f"✅ Đã tạo người dùng mới: id={new_user.id}, email={new_user.email}, role={new_user.role.value}")

        if role == models.Role.doctor:
            if prompt_yes_no("Bạn có muốn tạo hồ sơ bác sĩ mặc định (General, 0 năm KN)?", default=True):
                prof = models.DoctorProfile(
                    user_id=new_user.id,
                    specialty="General",
                    years_exp=0,
                    bio="",
                )
                db.add(prof)
                db.commit()
                print("✅ Đã tạo hồ sơ bác sĩ mặc định.")

        return new_user
    finally:
        db.close()

def main():
    print("=== Tạo/Cập nhật người dùng cục bộ ===")
    role = select_role()
    email = get_email()
    full_name = input("Họ tên (nhấn Enter để bỏ qua): ").strip() or None
    password = get_password()

    print("\nTÓM TẮT:")
    print(f"  Role   : {role.value.upper()}")
    print(f"  Email  : {email}")
    print(f"  Họ tên : {full_name or '(mặc định: New User)'}")

    if not prompt_yes_no("Xác nhận tạo/cập nhật người dùng?", default=True):
        print("❎ Đã hủy thao tác.")
        return

    upsert_user(email=email, password=password, role=role, full_name=full_name)

if __name__ == "__main__":
    main()
