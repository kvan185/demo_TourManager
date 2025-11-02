import express from "express";
import { pool } from "../../db.js";

const router = express.Router();

// 🔹 Lấy danh sách khách hàng
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        u.id AS user_id,
        u.email,
        u.role_id,
        r.name AS role_name,
        c.id AS customer_id,
        c.full_name,
        c.phone,
        c.gender,
        c.birthday,
        c.address,
        c.note,
        c.created_at,
        c.updated_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN customers c ON c.user_id = u.id
      WHERE r.name = 'customer'
      ORDER BY c.id DESC
      `
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách khách hàng:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Thêm khách hàng mới
router.post("/add-customer", async (req, res) => {
  const { full_name, email, phone, gender, address, note } = req.body;

  // ⚠️ Kiểm tra đầu vào
  if (!full_name || !email) {
    return res.status(400).json({ message: "Tên và Email là bắt buộc" });
  }

  try {
    // 1️⃣ Kiểm tra trùng email
    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại trong hệ thống" });
    }

    // 2️⃣ Tạo user mới với role 'customer'
    const [userResult] = await pool.query(
      `INSERT INTO users (email, password_hash, role_id, created_at, updated_at)
       VALUES (?, ?, (SELECT id FROM roles WHERE name = 'customer' LIMIT 1), NOW(), NOW())`,
      [email, "",] // password_hash để rỗng hoặc tạo tạm
    );

    const userId = userResult.insertId;

    // 3️⃣ Tạo customer gắn user_id
    const [customerResult] = await pool.query(
      `INSERT INTO customers (user_id, full_name, phone, gender, address, note, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [userId, full_name, phone || null, gender || "other", address || null, note || null]
    );

    console.log("✅ [DEBUG] Thêm khách hàng thành công:", customerResult.insertId);

    res.status(201).json({
      id: customerResult.insertId,
      user_id: userId,
      email,
      full_name,
    });
  } catch (err) {
    console.error("❌ Lỗi thêm khách hàng:", err);
    res.status(500).json({ message: "Không thể thêm khách hàng" });
  }
});


// 🔹 Lấy chi tiết khách hàng theo ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT c.*, u.email AS user_email
       FROM customers c
       LEFT JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Lỗi lấy chi tiết khách hàng:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Cập nhật thông tin khách hàng
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id, full_name, phone, birthday, gender, address, note } = req.body;

  try {
    await pool.query(
      `UPDATE customers 
       SET user_id=?, full_name=?, phone=?, birthday=?, gender=?, address=?, note=? 
       WHERE id=?`,
      [user_id || null, full_name, phone, birthday, gender, address, note, id]
    );
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật khách hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 🔹 Xóa khách hàng
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM customers WHERE id = ?", [id]);
    res.json({ message: "Đã xóa khách hàng" });
  } catch (err) {
    console.error("❌ Lỗi xóa khách hàng:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
