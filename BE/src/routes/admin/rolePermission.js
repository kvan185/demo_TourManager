import express from "express";
import { pool } from "../../db.js";
const router = express.Router();

//
// ========== QUYỀN HỆ THỐNG ==========
//

// 🔹 Lấy danh sách quyền
router.get("/permissions", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM permissions ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy permissions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Thêm quyền mới
router.post("/permissions", async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "Tên quyền là bắt buộc" });

  try {
    const [result] = await pool.query(
      "INSERT INTO permissions (name, description) VALUES (?, ?)",
      [name, description || null]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    console.error("❌ Lỗi thêm permission:", err);
    res.status(500).json({ message: "Không thể thêm quyền" });
  }
});

// 🔹 Cập nhật quyền
router.put("/permissions/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    await pool.query("UPDATE permissions SET name=?, description=? WHERE id=?", [
      name,
      description,
      id,
    ]);
    res.json({ message: "Cập nhật quyền thành công" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật permission:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 🔹 Xóa quyền
router.delete("/permissions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM permissions WHERE id=?", [id]);
    res.json({ message: "Đã xóa quyền" });
  } catch (err) {
    console.error("❌ Lỗi xóa permission:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

//
// ========== VAI TRÒ & PHÂN QUYỀN ==========
//

// 🔹 Lấy danh sách vai trò
router.get("/roles", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM roles ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy roles:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Thêm vai trò mới
router.post("/roles", async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "Tên vai trò là bắt buộc" });

  try {
    const [result] = await pool.query(
      "INSERT INTO roles (name, description) VALUES (?, ?)",
      [name, description || null]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    console.error("❌ Lỗi thêm role:", err);
    res.status(500).json({ message: "Không thể thêm vai trò" });
  }
});

// 🔹 Cập nhật vai trò
router.put("/roles/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    await pool.query("UPDATE roles SET name=?, description=? WHERE id=?", [name, description, id]);
    res.json({ message: "Cập nhật vai trò thành công" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật role:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 🔹 Xóa vai trò
router.delete("/roles/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM roles WHERE id=?", [id]);
    res.json({ message: "Đã xóa vai trò" });
  } catch (err) {
    console.error("❌ Lỗi xóa role:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

//
// ========== QUẢN LÝ QUYỀN THEO VAI TRÒ ==========
//

// 🔹 Lấy danh sách quyền theo vai trò
router.get("/roles/:id/permissions", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.name, p.description
      FROM role_permissions rp
      JOIN permissions p ON rp.permission_id = p.id
      WHERE rp.role_id = ?`, [id]);
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy quyền theo role:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Cập nhật quyền cho vai trò
router.post("/roles/:id/permissions", async (req, res) => {
  const { id } = req.params;
  const { permission_ids } = req.body;
  if (!Array.isArray(permission_ids))
    return res.status(400).json({ message: "permission_ids phải là mảng" });

  try {
    await pool.query("DELETE FROM role_permissions WHERE role_id = ?", [id]);
    for (const pid of permission_ids) {
      await pool.query("INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)", [id, pid]);
    }
    res.json({ message: "Cập nhật quyền cho vai trò thành công" });
  } catch (err) {
    console.error("❌ Lỗi gán quyền:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
