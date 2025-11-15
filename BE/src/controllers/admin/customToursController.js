import { pool } from "../../db.js";

// Lấy danh sách tour tùy chỉnh
export const getAllCustomTours = async (_, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ct.*, c.full_name AS customer_name, c.email AS customer_email
      FROM custom_tours ct
      JOIN customers c ON ct.customer_id = c.id
      JOIN users u ON c.user_id = u.id
      ORDER BY ct.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách custom tours:", err);
    res.status(500).json({ message: "Không thể lấy danh sách tour tùy chỉnh" });
  }
};

// Lấy chi tiết 1 tour tùy chỉnh
export const getCustomTourById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT ct.*, c.full_name AS customer_name, c.email AS customer_email
      FROM custom_tours ct
      JOIN customers c ON ct.customer_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE ct.id = ?
    `, [id]);

    if (!rows.length) return res.status(404).json({ message: "Không tìm thấy tour tùy chỉnh" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Lỗi lấy tour tùy chỉnh:", err);
    res.status(500).json({ message: "Không thể lấy tour tùy chỉnh" });
  }
};

// Thêm tour tùy chỉnh mới
export const addCustomTour = async (req, res) => {
  const { customer_id, title, description, preferred_start_date, preferred_end_date, number_of_people, budget, status } = req.body;
  if (!customer_id || !title)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

  try {
    const [result] = await pool.query(
      `INSERT INTO custom_tours
       (customer_id, title, description, preferred_start_date, preferred_end_date, number_of_people, budget, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_id,
        title,
        description || null,
        preferred_start_date || null,
        preferred_end_date || null,
        number_of_people || 1,
        budget || 0.0,
        status || "pending"
      ]
    );

    res.status(201).json({ id: result.insertId, message: "Đã thêm tour tùy chỉnh" });
  } catch (err) {
    console.error("❌ Lỗi thêm tour tùy chỉnh:", err);
    res.status(500).json({ message: "Không thể thêm tour tùy chỉnh" });
  }
};

// Cập nhật tour tùy chỉnh
export const updateCustomTour = async (req, res) => {
  const { id } = req.params;
  const { title, description, preferred_start_date, preferred_end_date, number_of_people, budget, status } = req.body;

  try {
    await pool.query(
      `UPDATE custom_tours
       SET title = ?, description = ?, preferred_start_date = ?, preferred_end_date = ?, 
           number_of_people = ?, budget = ?, status = ?
       WHERE id = ?`,
      [title, description, preferred_start_date, preferred_end_date, number_of_people, budget, status, id]
    );

    res.json({ message: "Cập nhật tour tùy chỉnh thành công" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật tour tùy chỉnh:", err);
    res.status(500).json({ message: "Không thể cập nhật tour tùy chỉnh" });
  }
};

// Xóa tour tùy chỉnh
export const deleteCustomTour = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM custom_tours WHERE id = ?", [id]);
    res.json({ message: "Đã xóa tour tùy chỉnh" });
  } catch (err) {
    console.error("❌ Lỗi xóa tour tùy chỉnh:", err);
    res.status(500).json({ message: "Không thể xóa tour tùy chỉnh" });
  }
};
