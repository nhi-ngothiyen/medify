from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings


# Thêm connect_args để tránh treo khi kết nối database
# Lưu ý: connect_args chỉ áp dụng cho PostgreSQL
# Nếu dùng database khác, cần điều chỉnh tương ứng
try:
    engine = create_engine(
        settings.DATABASE_URL, 
        pool_pre_ping=True,
        connect_args={
            "connect_timeout": 5,  # Timeout sau 5 giây
            "options": "-c statement_timeout=5000"  # Timeout cho queries
        },
        pool_timeout=5,  # Timeout cho pool connection
        pool_recycle=3600,  # Recycle connections sau 1 giờ
        echo=False  # Tắt SQL logging để tránh spam
    )
except Exception as e:
    print(f"⚠️ Warning: Could not create database engine: {e}")
    print("⚠️ Please check your .env file and DATABASE_URL configuration")
    raise
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)


Base = declarative_base()