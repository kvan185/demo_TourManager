import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./AdminHeader.css";

export default function AdminHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const permissions = user.permissions || [];

  // 🔹 Gom nhóm quyền theo module chính
  const moduleMap = {
    manage_tours: { path: "/admin/tours", label: "Tour" },
    manage_services: { path: "/admin/services", label: "Dịch vụ" },
    manage_locations: { path: "/admin/locations", label: "Địa điểm" },
    manage_users: { path: "/admin/users", label: "Người dùng" },
    manage_customers: { path: "/admin/customers", label: "Khách hàng" },
    manage_employees: { path: "/admin/employees", label: "Nhân viên" },
    manage_bookings: { path: "/admin/bookings", label: "Đặt tour" },
    manage_roles: { path: "/admin/role-permissions", label: "Phân quyền" },
    manage_payments: { path: "/admin/payments", label: "Thanh toán" },
    view_reports: { path: "/admin/reports", label: "Báo cáo" },
    view_reviews: { path: "/admin/reviews", label: "Đánh giá" },
  };

  // 🔹 Tạo danh sách menu từ quyền thật
  const allowedMenu = Object.entries(moduleMap)
    .filter(([key]) =>
      permissions.some((p) => p.startsWith(key))
    )
    .map(([_, item]) => item);

  // Nếu là admin → cho full menu
  const menuToRender =
    user.role === "admin" ? Object.values(moduleMap) : allowedMenu;

  return (
    <header className="admin-header">
      {/* Logo */}
      <div className="admin-header-left">
        <h1 className="admin-logo" onClick={() => navigate("/admin/tours")}>
          🧭 <span>Travel Admin</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="admin-nav">
        {menuToRender.length > 0 ? (
          menuToRender.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
            >
              {item.label}
            </Link>
          ))
        ) : (
          <span className="no-access">❌ Không có quyền truy cập</span>
        )}
      </nav>

      {/* Logout */}
      <div className="admin-header-right">
        <span className="user-info">{user.email}</span>
        <button className="logout-btn" onClick={handleLogout}>
          🚪 Đăng xuất
        </button>
      </div>
    </header>
  );
}
