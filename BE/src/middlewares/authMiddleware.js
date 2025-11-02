// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

// ✅ Kiểm tra token
export function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("🚫 Không có Authorization header");
    return res.status(401).json({ message: "Thiếu token xác thực" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("🚫 Không có token sau Bearer");
    return res.status(401).json({ message: "Token không hợp lệ" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token hợp lệ:", decoded);
    req.user = decoded; // { id, role_id }
    next();
  } catch (err) {
    console.error("❌ Token lỗi:", err.message);
    return res.status(401).json({ message: "Token hết hạn hoặc không hợp lệ" });
  }
}

// ✅ Kiểm tra quyền cụ thể
export function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      const [perms] = await pool.query(
        `SELECT p.name FROM role_permissions rp
         JOIN permissions p ON rp.permission_id = p.id
         WHERE rp.role_id = ?`,
        [req.user.role_id]
      );
      const userPerms = perms.map(p => p.name);
      if (!userPerms.includes(permission))
        return res.status(403).json({ message: "Không có quyền truy cập" });

      next();
    } catch (err) {
      console.error("Lỗi kiểm tra quyền:", err);
      res.status(500).json({ message: "Lỗi kiểm tra quyền" });
    }
  };
}
