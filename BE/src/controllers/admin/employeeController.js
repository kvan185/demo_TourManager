import { pool } from "../../db.js";

//
// ========== ROLES ==========
//

// Lấy danh sách vai trò
export const getRoles = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name FROM roles ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách roles:", err);
    res.status(500).json({ message: "Lỗi server khi lấy roles" });
  }
};

//
// ========== EMPLOYEES ==========
//

// Lấy danh sách nhân viên
export const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        u.id AS user_id,
        u.email,
        u.role_id,
        r.name AS role_name,
        e.id AS employee_id,
        e.full_name,
        e.phone,
        e.status,
        e.created_at,
        e.updated_at
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN employees e ON e.user_id = u.id
      WHERE u.id NOT IN (SELECT user_id FROM customers WHERE user_id IS NOT NULL)
      ORDER BY e.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách nhân viên:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Thêm nhân viên mới (tự động tạo user)
export const addEmployee = async (req, res) => {
  const { full_name, email, phone, status, role_id } = req.body;

  if (!full_name || !email || !role_id) {
    return res.status(400).json({ message: "Tên, email và vai trò là bắt buộc" });
  }

  try {
    // Kiểm tra trùng email
    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại trong hệ thống" });
    }

    // Tạo user mới
    const [userResult] = await pool.query(
      `INSERT INTO users (email, password_hash, role_id, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())`,
      [email, "", role_id]
    );
    const userId = userResult.insertId;

    // Thêm nhân viên gắn user_id
    const [empResult] = await pool.query(
      `INSERT INTO employees (user_id, full_name, phone, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      [userId, full_name, phone || null, status || "active"]
    );

    res.status(201).json({
      id: empResult.insertId,
      user_id: userId,
      email,
      full_name,
    });
  } catch (err) {
    console.error("❌ Lỗi thêm nhân viên:", err);
    res.status(500).json({ message: "Không thể thêm nhân viên" });
  }
};

// Lấy chi tiết nhân viên
export const getEmployeeDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT e.*, u.email AS user_email 
       FROM employees e 
       LEFT JOIN users u ON e.user_id = u.id 
       WHERE e.id = ?`,
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Không tìm thấy nhân viên" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Lỗi lấy chi tiết nhân viên:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Cập nhật nhân viên
export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { user_id, full_name, type, role_title, phone, status } = req.body;

  try {
    await pool.query(
      `UPDATE employees 
       SET user_id=?, full_name=?, type=?, role_title=?, phone=?, status=? 
       WHERE id=?`,
      [user_id || null, full_name, type, role_title, phone, status, id]
    );
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật nhân viên:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa nhân viên
export const deleteEmployee = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM employees WHERE id = ?", [id]);
    res.json({ message: "Đã xóa nhân viên" });
  } catch (err) {
    console.error("❌ Lỗi xóa nhân viên:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
