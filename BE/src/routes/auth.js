import express from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import dotenv from "dotenv";
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

router.put("/test", async (req, res) => {
  res.json({ message: "✅ Token hợp lệ!" });
});

// --- MY BOOKINGS ---
router.get("/my-booking", async (req, res) => {
  try {
    // const userId =1 || req.user.id; // ✅ Lấy từ token

    const [rows] = await pool.query(
      `SELECT * FROM bookings WHERE customer_id = 1`,
      // [req.user.id]
    );

    res.json(rows);
  } catch (error) {
    console.error("❌ Lỗi /my-booking:", error);
    res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách đặt tour" });
  }
});

// --- CANCEL BOOKING ---
router.put("/cancel-booking/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookingId = req.params.id;

    // Xác nhận booking thuộc về người dùng
    const [check] = await pool.query(
      "SELECT id FROM bookings WHERE id = ? AND customer_id = ?",
      [bookingId, userId]
    );
    if (!check.length)
      return res.status(403).json({ message: "Không có quyền hủy booking này" });

    await pool.query("UPDATE bookings SET status = 'cancelled' WHERE id = ?", [bookingId]);
    res.json({ message: "✅ Hủy tour thành công!" });
  } catch (err) {
    console.error("❌ Lỗi hủy booking:", err);
    res.status(500).json({ message: "Lỗi server khi hủy tour" });
  }
});

export default router;
