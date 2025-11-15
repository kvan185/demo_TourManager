import { pool } from "../../db.js";
import fs from "fs";
import path from "path";

const uploadDir = "uploads/services";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//
// ========== SERVICES ==========
//

// Lấy danh sách dịch vụ (kèm ảnh đại diện)
export const getServices = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.*, 
        (SELECT img_url FROM service_images WHERE service_id = s.id LIMIT 1) AS preview_image
      FROM services s
      ORDER BY s.id ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách dịch vụ:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Thêm dịch vụ mới
export const addService = async (req, res) => {
  const { type, name, provider, details, price } = req.body;
  if (!name) return res.status(400).json({ message: "Thiếu tên dịch vụ" });

  try {
    const [result] = await pool.query(
      "INSERT INTO services (type, name, provider, details, price) VALUES (?, ?, ?, ?, ?)",
      [type || "other", name, provider || null, details || null, price || 0]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    console.error("❌ Lỗi thêm dịch vụ:", err);
    res.status(500).json({ message: "Không thể thêm dịch vụ" });
  }
};

// Upload ảnh cho dịch vụ
export const uploadServiceImage = async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  if (!file) return res.status(400).json({ message: "Chưa có file gửi lên" });

  const imgUrl = `${uploadDir}/${file.filename}`;
  try {
    await pool.query("INSERT INTO service_images (service_id, img_url) VALUES (?, ?)", [id, imgUrl]);
    res.status(201).json({ img_url: imgUrl });
  } catch (err) {
    console.error("❌ Lỗi upload ảnh:", err);
    res.status(500).json({ message: "Không thể upload ảnh" });
  }
};

// Lấy ảnh của 1 service
export const getServiceImages = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM service_images WHERE service_id=?", [id]);
    res.json(rows || []);
  } catch (err) {
    console.error("❌ Lỗi tải ảnh service:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Xóa ảnh dịch vụ
export const deleteServiceImage = async (req, res) => {
  const { imgId } = req.params;
  try {
    const [rows] = await pool.query("SELECT img_url FROM service_images WHERE id=?", [imgId]);
    if (!rows.length) return res.status(404).json({ message: "Không tìm thấy ảnh" });

    const filePath = rows[0].img_url;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await pool.query("DELETE FROM service_images WHERE id=?", [imgId]);

    res.json({ message: "Đã xóa ảnh" });
  } catch (err) {
    console.error("❌ Lỗi xóa ảnh:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cập nhật dịch vụ
export const updateService = async (req, res) => {
  const { id } = req.params;
  const { type, name, provider, details, price } = req.body;
  try {
    await pool.query(
      "UPDATE services SET type=?, name=?, provider=?, details=?, price=? WHERE id=?",
      [type, name, provider, details, price, id]
    );
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa dịch vụ
export const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM services WHERE id=?", [id]);
    res.json({ message: "Đã xóa dịch vụ" });
  } catch (err) {
    console.error("❌ Lỗi xóa dịch vụ:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
