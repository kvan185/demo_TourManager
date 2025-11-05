# 🧭 Demo Tour Manager

Ứng dụng **Tour Manager** giúp quản lý tour du lịch, khách hàng và đặt vé.
Dự án được tách thành hai phần riêng biệt:

*  **Backend (BE):** Xây dựng bằng **Node.js + Express + MySQL**
*  **Frontend (FE):** Xây dựng bằng **React + Vite**

---

## 1. Cài đặt cơ sở dữ liệu MySQL

### 🔸 Bước 1: Tạo cơ sở dữ liệu

Mở MySQL (vd: MySQL Workbench hoặc XAMPP) và chạy lệnh:

```sql
CREATE DATABASE travel_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 🔸 Bước 2: Import dữ liệu mẫu

Trong thư mục dự án, tìm file:

```
BE/sql/travel_app.sql
```

Import dữ liệu bằng lệnh:

```bash
mysql -u root -p travel_app < BE/sql/travel_app.sql
```

> ⚠️ Lưu ý: Thay `root` và `password` bằng tài khoản MySQL của bạn.

---

## 2. Khởi chạy Backend (BE)

```bash
cd BE
npm install
npm run dev
```

> Mặc định server chạy tại: **[http://localhost:8088](http://localhost:8088)**

### Cấu hình `.env` mẫu:

```env
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
```

---

## 3. Khởi chạy Frontend (FE)

```bash
cd FE
npm install
npm run dev
```

> Ứng dụng React chạy tại: **[http://localhost:5173](http://localhost:5173)**

### ⚙️ File `.env` mẫu:

```env
VITE_API_URL=http://localhost:8088/api
```

---

## 4. Cấu trúc thư mục

```
demo_TourManager/
│
├── BE/                             # Backend - Node.js + Express
│   ├── node_modules/
│   ├── sql/                        # Chứa file SQL khởi tạo database
│   ├── src/                        # Mã nguồn chính
│   │   ├── controllers/            # Xử lý logic cho từng route
│   │   ├── middlewares/            # Middleware (xác thực, xử lý lỗi,…)
│   │   ├── routes/                 # Định nghĩa các route API
│   │   ├── utils/                  # Các hàm tiện ích (JWT, hash,…)
│   │   ├── app.js                  # File cấu hình Express app
│   │   └── db.js                   # Kết nối database
│   ├── uploads/                    # Nơi lưu file tải lên
│   │   ├── services/               # Upload dịch vụ
│   │   └── tours/                  # Upload hình tour
│   ├── .env                        # Cấu hình môi trường
│   ├── .env.example                # Mẫu file .env
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
│
├── FE/                             # Frontend - React + Vite
│   ├── node_modules/
│   ├── public/                     # Tài nguyên tĩnh (ảnh, favicon,…)
│   ├── src/
│   │   ├── api/                    # Gọi API backend
│   │   ├── assets/                 # Hình ảnh, biểu tượng
│   │   ├── components/             # Các component dùng chung
│   │   ├── context/                # Quản lý context (Auth, Theme,…)
│   │   └── pages/                  # Các trang chính
│   │       ├── admin/              # Trang dành cho quản trị viên
│   │       └── user/               # Trang dành cho người dùng
│   ├── .env
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx                    # File khởi chạy React
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   └── vite.config.js              # Cấu hình Vite
│
└── README.md                       # Hướng dẫn cài đặt tổng thể
```

---

## 5. Ghi chú

* Đảm bảo MySQL đang chạy trước khi start backend.
* Nếu thay đổi cấu hình database, chỉnh trong `BE/src/db.js`.
* Sử dụng **Node.js >= 18** và **npm >= 9** để đảm bảo tương thích.

---

## 6. Công nghệ sử dụng

* **Backend:** Node.js, Express, MySQL, JWT, Multer
* **Frontend:** React, Vite, Axios, React Router, Context API
* **Khác:** ESLint, dotenv, bcrypt, cors

---

## 7. Preview (gợi ý)

* Trang quản trị: Quản lý Tour, Khách hàng, Đặt vé
* Trang người dùng: Xem tour, tìm kiếm, đặt tour trực tuyến

---

**Tác giả:** Khánh Văn
**Repo:** [github.com/kvan185/demo_TourManager](https://github.com/kvan185/demo_TourManager)
