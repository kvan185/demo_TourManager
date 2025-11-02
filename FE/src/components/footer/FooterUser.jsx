import React from "react";
import "./footerUser.css";
import { Link } from "react-router-dom";

export default function FooterUser() {
  return (
    <footer className="footer-user">
      <div className="footer-container">
        {/* --- Cột 1: Logo + giới thiệu --- */}
        <div className="footer-section">
          <h4>🌴 TravelBooking</h4>
          <p>
            Website đặt tour du lịch uy tín, mang đến những hành trình tuyệt
            vời nhất cho bạn và gia đình. Khám phá thế giới cùng TravelBooking!
          </p>
        </div>

        {/* --- Cột 2: Liên kết nhanh --- */}
        <div className="footer-section footer-links">
          <h4>Liên kết nhanh</h4>
          <Link to="/">Trang chủ</Link>
          <Link to="/about">Giới thiệu</Link>
          <Link to="/contact">Liên hệ</Link>
          <Link to="/policy">Chính sách bảo mật</Link>
        </div>

        {/* --- Cột 3: Kết nối --- */}
        <div className="footer-section">
          <h4>Kết nối với chúng tôi</h4>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>
      </div>

      {/* --- Dòng cuối cùng --- */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} TravelBooking. All rights reserved.
      </div>
    </footer>
  );
}
