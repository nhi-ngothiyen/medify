# 🏥 Medify — Hệ thống đặt lịch khám bệnh trực tuyến
Medify là một ứng dụng đặt lịch khám bệnh toàn diện, giúp **bệnh nhân** dễ dàng tìm kiếm và đặt lịch với bác sĩ theo chuyên khoa, giới tính, thời gian làm việc,…  
Đồng thời cung cấp hệ thống quản lý cho **bác sĩ** và **admin** để theo dõi, xác nhận, và quản lý lịch hẹn.

## ⚙️ 1. Backend (FastAPI)

### 🔧 Yêu cầu môi trường
- Python **3.9+**
- PostgreSQL
- pip, venv (hoặc pyenv)
- Git

### 🚀 Cài đặt
```bash
# Clone repo
git clone git@github.com:nhi-ngothiyen/medify.git
cd medify/medify-be

# Tạo virtual environment
python3 -m venv .venv
source .venv/bin/activate   # macOS / Linux
# hoặc
.venv\Scripts\activate      # Windows

# Cài dependencies
pip install -r requirements.txt
```

### ⚙️ Cấu hình .env
```bash
# Tạo file .env trong thư mục medify-be/ (dựa theo .env.example):
DATABASE_URL=postgresql+psycopg2://<username>@localhost:5432/medify
JWT_SECRET=supersecretkey
JWT_ALG=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
``` 

### Khởi tạo database
```bash
# Tạo database nếu chưa có
createdb medify

# Tạo bảng từ model
alembic revision --autogenerate -m "init"
alembic upgrade head
```

### ▶️ Chạy server
```bash
uvicorn app.main:app --reload --port 8000

# API docs sẽ khả dụng tại:
Swagger UI: http://127.0.0.1:8000/docs
ReDoc: http://127.0.0.1:8000/redoc
```

## 📱 2. Ứng dụng Flutter
### 🔧 Yêu cầu
Flutter SDK ≥ 3.10
Dart SDK ≥ 3.0

### 🚀 Chạy ứng dụng
```bash
cd ../medify_app
flutter pub get
flutter run

# Ứng dụng kết nối với API backend tại http://127.0.0.1:8000
```

## 💻 3. Trang quản trị 
### 🔧 Yêu cầu
Node.js ≥ 18
npm hoặc yarn

### 🚀 Cài đặt & chạy
```bash
cd ../medify-admin
npm install
npm run dev

# Dashboard mặc định chạy tại http://localhost:5173
```