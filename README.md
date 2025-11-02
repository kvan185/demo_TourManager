# 🧭 Demo Tour Manager

Dự án **Tour Manager** gồm hai phần chính:
- **Backend (BE):** Xây dựng bằng Node.js (Express)
- **Frontend (FE):** Xây dựng bằng React + Vite

---

## ⚙️ 1. Cài đặt cơ sở dữ liệu MySQL

### 🔸 Bước 1: Tạo cơ sở dữ liệu
Mở MySQL (vd: MySQL Workbench hoặc terminal) và chạy lệnh:
```sql
CREATE DATABASE travel_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 🔸 Bước 2: Import dữ liệu mẫu
Trong thư mục dự án, tìm file:
```
BE/sql/travel_app.sql
```

Chạy lệnh import:
```bash
mysql -u root -p travel_app < BE/sql/travel_app.sql
```
> ⚠️ Thay `root` và `password` bằng tài khoản MySQL của bạn.

---

## 💻 2. Chạy Backend (BE)

Từ thư mục gốc, di chuyển vào thư mục BE:
```bash
cd BE
```

Cài đặt thư viện:
```bash
npm install
```

Chạy server:
```bash
npm run dev
```

> Mặc định server chạy tại: **http://localhost:5000**

---

## 🌐 3. Chạy Frontend (FE)

Từ thư mục gốc, di chuyển vào thư mục FE:
```bash
cd FE
```

Cài đặt thư viện:
```bash
npm install
```

Chạy ứng dụng:
```bash
npm run dev
```

> Mặc định frontend chạy tại: **http://localhost:5173**

---

## 📁 4. Cấu trúc thư mục

```
demo_TourManager/
│
├── BE/                   # Backend (Node.js + Express)
│   ├── sql/              # File SQL cho MySQL
│   ├── routes/           # API routes
│   ├── models/           # Models cho database
│   └── server.js         # File khởi chạy server
│
├── FE/                   # Frontend (React + Vite)
│   ├── src/              # Mã nguồn React
│   └── package.json
│
└── README.md             # Hướng dẫn cài đặt
```

---

## 🧪 5. Ghi chú
- Đảm bảo MySQL đang chạy trước khi start backend.  
- Nếu thay đổi cấu hình database, chỉnh trong `BE/config/db.js`.  
- Sử dụng Node.js >= 18 và npm >= 9 để đảm bảo tương thích.

---

✨ **Tác giả:** Khánh Văn  
📅 **Repo:** [github.com/kvan185/demo_TourManager](https://github.com/kvan185/demo_TourManager)
