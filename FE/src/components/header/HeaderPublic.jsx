import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./headerPublic.css";

export default function HeaderPublic() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="header-public">
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        🌍 TravelBooking
      </div>

      {/* Menu điều hướng */}
      <nav className="nav-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          Trang chủ
        </Link>
        <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>
          Giới thiệu
        </Link>
        <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>
          Liên hệ
        </Link>
        <Link to="/tours" className={location.pathname.startsWith("/tours") ? "active" : ""}>
          Tour du lịch nhưng chưa triển khai
        </Link>
      </nav>

      {/* Nút đăng nhập / đăng ký */}
      <div className="user-actions">
        <button onClick={() => navigate("/login")}>Đăng nhập</button>
        <button onClick={() => navigate("/register")}>Đăng ký</button>
      </div>
    </header>
  );
}
