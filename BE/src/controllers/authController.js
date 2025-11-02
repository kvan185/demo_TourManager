// controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

// 🟢 Đăng ký
export async function register(req, res) {
  const { email, password, role_id } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });

  try {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (email, password_hash, role_id) VALUES (?, ?, ?)",
      [email, hashed, role_id || 4] // mặc định là Customer
    );
    res.status(201).json({ id: result.insertId, email });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY")
      return res.status(400).json({ message: "Email đã tồn tại" });
    console.error("❌ Lỗi đăng ký:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
}

// 🟢 Đăng nhập
export async function login(req, res) {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length)
      return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    // Lấy role name & permissions
    const [[role]] = await pool.query("SELECT name FROM roles WHERE id = ?", [user.role_id]);
    const [perms] = await pool.query(
      `SELECT p.name 
       FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [user.role_id]
    );

    const permissions = perms.map(p => p.name);
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: role?.name,
        permissions,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
}

// 🟢 Lấy thông tin người dùng hiện tại
export async function me(req, res) {
  try {
    const [rows] = await pool.query("SELECT id, email, role_id FROM users WHERE id = ?", [req.user.id]);
    if (!rows.length) return res.status(404).json({ message: "Không tìm thấy người dùng" });

    const user = rows[0];
    const [[role]] = await pool.query("SELECT name FROM roles WHERE id = ?", [user.role_id]);
    const [perms] = await pool.query(
      `SELECT p.name 
       FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [user.role_id]
    );

    const permissions = perms.map(p => p.name);
    res.json({
      id: user.id,
      email: user.email,
      role: role?.name,
      permissions,
    });
  } catch (err) {
    console.error("❌ Lỗi lấy thông tin:", err);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
}
