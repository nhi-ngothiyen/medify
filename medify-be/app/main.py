# app/main.py
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, doctors, appointments, reviews, admin

# (Tùy chọn) Nếu bạn muốn dùng settings cho các cấu hình khác:
# from app.config import settings
# from app.db import Base, engine  # Khi dùng Alembic, KHÔNG create_all()

tags_metadata = [
    {"name": "auth", "description": "Đăng ký / đăng nhập, cấp JWT"},
    {"name": "doctors", "description": "Tìm kiếm, xem hồ sơ bác sĩ"},
    {"name": "appointments", "description": "Quản lý lịch hẹn"},
    {"name": "reviews", "description": "Đánh giá sau khám"},
    {"name": "admin", "description": "Quản trị hệ thống (chỉ Admin)"},
]

app = FastAPI(
    title="Medify API",
    version="0.1.0",
    openapi_tags=tags_metadata,
)

# --- CORS: cho Flutter (mobile/web) & Admin (web) ---
# Thêm origin bạn dùng thực tế (Vite/Next/Flutter web) vào đây
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    # Bạn có thể bổ sung origin khác nếu cần
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- KHÔNG tạo bảng khi dùng Alembic ---
# from app.db import Base, engine
# Base.metadata.create_all(bind=engine)  # ❌ Không bật khi dùng Alembic


# --- Lifespan logs (tùy chọn) ---
@app.on_event("startup")
def on_startup():
    print("🚀 Medify API started")

@app.on_event("shutdown")
def on_shutdown():
    print("🛑 Medify API stopped")


# --- Health & Root ---
@app.get("/", tags=["auth"])
def root():
    return {"message": "✅ Medify API is running successfully!"}

@app.get("/health", tags=["auth"])
def health():
    return {
        "status": "ok",
        "time_utc": datetime.now(timezone.utc).isoformat(),
        "services": {
            "api": "up",
            # Bạn có thể bổ sung ping DB nếu muốn
        },
    }


# --- Routers ---
app.include_router(auth.router)
app.include_router(doctors.router)
app.include_router(appointments.router)
app.include_router(reviews.router)
app.include_router(admin.router)
