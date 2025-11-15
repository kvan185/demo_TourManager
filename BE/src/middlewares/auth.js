// src/middlewares/auth.js
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

/**
 * Middleware xác thực token
 * Nếu không có token -> 401
 * Nếu token hợp lệ -> req.user = { id, role_id }
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Chưa đăng nhập" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token không hợp lệ" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role_id }
    next();
  } catch (err) {
    console.error("❌ Token lỗi:", err.message);
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
  }
}

/**
 * Middleware phân chia route Khách / Admin
 * roles = ["customer"] hoặc ["admin"]
 */
export function roleRedirect(roles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Chưa đăng nhập" });

    const roleMap = {
      1: "admin",
      2: "employee",
      3: "customer"
    };
    const userRole = roleMap[req.user.role_id] || "unknown";

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: "Không đủ quyền truy cập" });
    }

    next();
  };
}

/**
 * Middleware kiểm tra permission cụ thể
 * permissions = ["create_tour", "update_booking", ...]
 */
export function requirePermission(permissions = []) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Chưa đăng nhập" });

    try {
      const [perms] = await pool.query(
        `SELECT p.name
         FROM role_permissions rp
         JOIN permissions p ON rp.permission_id = p.id
         WHERE rp.role_id = ?`,
        [req.user.role_id]
      );
      const userPerms = perms.map(p => p.name);
      const hasPerm = permissions.every(p => userPerms.includes(p));

      if (!hasPerm) return res.status(403).json({ message: "Không đủ quyền truy cập" });

      next();
    } catch (err) {
      console.error("❌ Lỗi kiểm tra permission:", err);
      res.status(500).json({ message: "Lỗi kiểm tra quyền" });
    }
  };
}
