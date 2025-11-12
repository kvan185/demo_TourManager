import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const router = express.Router();

// --- REGISTER ---
router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("full_name").notEmpty().withMessage("Họ tên là bắt buộc"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, full_name, phone, gender, address, note } = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // 1️⃣ Kiểm tra email trùng
      const [checkEmail] = await connection.query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );
      if (checkEmail.length > 0) {
        await connection.rollback();
        return res.status(400).json({ message: "Email đã tồn tại" });
      }

      // 2️⃣ Mã hóa mật khẩu
      const hashed = await bcrypt.hash(password, 10);

      // 3️⃣ Tạo user mới với role_id = role có name='customer'
      const [resUser] = await connection.query(
        `INSERT INTO users (email, password_hash, role_id)
         VALUES (?, ?, (SELECT id FROM roles WHERE name = 'customer' LIMIT 1));`,
        [email, hashed]
      );
      const userId = resUser.insertId;

      // 4️⃣ Tạo bản ghi trong bảng customers
      await connection.query(
        `INSERT INTO customers (user_id, full_name, phone, gender, address, note)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, full_name, phone || null, gender || "other", address || null, note || null]
      );

      await connection.commit();

      return res.status(201).json({
        message: "Đăng ký thành công!",
        user: { id: userId, email, full_name },
      });
    } catch (err) {
      await connection.rollback();
      console.error("❌ Lỗi đăng ký:", err);
      if (err.code === "ER_DUP_ENTRY")
        return res.status(400).json({ message: "Email đã tồn tại" });
      return res.status(500).json({ message: "Server error" });
    } finally {
      connection.release();
    }
  }
);

// --- LOGIN ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Kiểm tra dữ liệu đầu vào
    if (!email || !password)
      return res.status(400).json({ message: "Vui lòng nhập email và mật khẩu" });

    // 2️⃣ Tìm user trong DB
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length)
      return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    const user = rows[0];

    // 3️⃣ Kiểm tra mật khẩu
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ message: "Sai email hoặc mật khẩu" });

    // 4️⃣ Lấy role
    const [[role]] = await pool.query("SELECT name FROM roles WHERE id = ?", [user.role_id]);
    const roleName = role?.name || "customer";

    // 5️⃣ Lấy danh sách quyền
    const [permissions] = await pool.query(
      `SELECT p.name
       FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [user.role_id]
    );

    const permissionList = permissions.map((p) => p.name);

    // 6️⃣ Kiểm tra JWT_SECRET tồn tại
    if (!process.env.JWT_SECRET) {
      console.error("❌ Lỗi: JWT_SECRET chưa được cấu hình trong .env");
      return res.status(500).json({ message: "Lỗi cấu hình máy chủ" });
    }

    // 7️⃣ Tạo token
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    // 8️⃣ Trả về dữ liệu người dùng
    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: roleName,
        permissions: permissionList,
      },
    });
  } catch (err) {
    console.error("❌ Lỗi đăng nhập:", err);
    res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau" });
  }
});

// --- STEP 1: gửi email reset password ---
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Vui lòng nhập email" });

  try {
    const [users] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (!users.length) return res.status(404).json({ message: "Email không tồn tại" });

    const user = users[0];
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" } // token 15 phút
    );

    // Tạo link reset password
    const resetLink = `http://localhost:5173/reset-password?token=${token}`;

    // Gửi email (sử dụng nodemailer)
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Yêu cầu đặt lại mật khẩu",
      html: `<p>Nhấn vào link để đặt lại mật khẩu:</p><a href="${resetLink}">${resetLink}</a>`
    });

    res.json({ message: "Đã gửi email đặt lại mật khẩu" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ message: "Thiếu token hoặc mật khẩu mới" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [hash, userId]);

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
});

// --- PROFILE ---
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.role_id, c.full_name, c.phone, c.gender, c.address
       FROM users u
       LEFT JOIN customers c ON c.user_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- UPDATE PROFILE ---
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { full_name, phone, gender, address } = req.body;

    // cập nhật bảng customers
    await pool.query(
      `UPDATE customers SET full_name = ?, phone = ?, gender = ?, address = ? 
       WHERE user_id = ?`,
      [full_name, phone, gender, address, req.user.id]
    );

    // trả lại profile mới
    const [rows] = await pool.query(
      `SELECT u.id, u.email, u.role_id, c.full_name, c.phone, c.gender, c.address
       FROM users u
       LEFT JOIN customers c ON c.user_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    );

    res.json(rows[0]);
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- CHANGE PASSWORD ---
router.put("/change-password", verifyToken, async (req, res) => {
  console.log("REQ USER:", req.user);
  console.log("BODY:", req.body);
  try {
    const { currentPassword, newPassword } = req.body;
    console.log("current:", currentPassword, "new:", newPassword);
    const [rows] = await pool.query("SELECT password_hash FROM users WHERE id = ?", [req.user.id]);

    console.log("DB row:", rows[0]);

    if (rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(currentPassword, rows[0].password_hash);
    if (!valid)
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = ? WHERE id = ?", [
      newHash,
      req.user.id,
    ]);

    res.json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/test", async (req, res) => {
  res.json({ message: "✅ Token hợp lệ!" });
});

// --- MY BOOKINGS ---
router.get("/my-booking", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT 
        b.id,
        b.booking_code,
        b.qty_adults,
        b.qty_children,
        b.total_amount,
        b.status,
        b.payment_status,
        b.booking_date,
        t.title AS tour_title,
        c.full_name AS customer_name
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      LEFT JOIN tours t ON b.schedule_id = t.id
      WHERE c.user_id = ?
      ORDER BY b.booking_date DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ Lỗi /my-booking:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách đặt tour" });
  }
});

// --- CANCEL BOOKING ---
router.put("/booking/:id/cancel", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;       // ID người dùng từ token
    const bookingId = req.params.id;  // ID booking từ URL

    // 🔹 Kiểm tra xem booking này có thuộc về user hiện tại không
    const [check] = await pool.query(
      `
      SELECT b.id
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      WHERE b.id = ? AND c.user_id = ?
      `,
      [bookingId, userId]
    );

    if (!check.length) {
      return res.status(403).json({ message: "❌ Không có quyền hủy booking này" });
    }

    // 🔹 Cập nhật trạng thái sang 'cancelled'
    await pool.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
      [bookingId]
    );

    res.json({ message: "✅ Hủy tour thành công!" });
  } catch (err) {
    console.error("❌ Lỗi hủy booking:", err);
    res.status(500).json({ message: "Lỗi server khi hủy tour" });
  }
});

export default router;
