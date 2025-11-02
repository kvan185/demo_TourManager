import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./headerUser.css";

export default function HeaderUser() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header-user">
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        🌴 TravelBooking
      </div>

      {/* Menu điều hướng */}
      <nav className="nav-links">
        <Link to="/">Trang chủ</Link>
        <Link to="/about">Giới thiệu</Link>
        <Link to="/contact">Liên hệ</Link>
        <Link to="/my-bookings">Đơn của tôi</Link>
      </nav>

      {/* Khu vực người dùng */}
      <div className="user-actions">
        <button onClick={() => navigate("/profile")}>Tài khoản</button>
        <button onClick={handleLogout}>Đăng xuất</button>
      </div>
    </header>
  );
}
