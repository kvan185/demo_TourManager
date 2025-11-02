import express from "express";
import { pool } from "../../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// 📂 Thư mục lưu ảnh dịch vụ
const uploadDir = "uploads/services";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ⚙️ Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 🔹 Danh sách dịch vụ (kèm ảnh đại diện)
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.*, 
        (SELECT img_url FROM service_images WHERE service_id = s.id LIMIT 1) AS preview_image
      FROM services s
      ORDER BY s.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách dịch vụ:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 Thêm dịch vụ
router.post("/add-service", async (req, res) => {
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
});

// 🟢 Upload ảnh cho dịch vụ
router.post("/:id/upload-image", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  if (!file) return res.status(400).json({ message: "Chưa có file gửi lên" });

  const imgUrl = `uploads/services/${file.filename}`;
  await pool.query("INSERT INTO service_images (service_id, img_url) VALUES (?, ?)", [id, imgUrl]);
  res.status(201).json({ img_url: imgUrl });
});

// 🟢 Lấy ảnh của 1 service
router.get("/:id/images", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM service_images WHERE service_id=?", [id]);
    res.json(rows || []); // ✅ luôn trả về mảng
  } catch (err) {
    console.error("❌ Lỗi tải ảnh service:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 Xóa ảnh dịch vụ
router.delete("/image/:imgId", async (req, res) => {
  const { imgId } = req.params;
  const [rows] = await pool.query("SELECT img_url FROM service_images WHERE id=?", [imgId]);
  if (!rows.length) return res.status(404).json({ message: "Không tìm thấy ảnh" });

  const filePath = rows[0].img_url;
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await pool.query("DELETE FROM service_images WHERE id=?", [imgId]);

  res.json({ message: "Đã xóa ảnh" });
});

// 🔹 Cập nhật dịch vụ
router.put("/:id", async (req, res) => {
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
});

// 🔹 Xóa dịch vụ
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM services WHERE id=?", [id]);
    res.json({ message: "Đã xóa dịch vụ" });
  } catch (err) {
    console.error("❌ Lỗi xóa dịch vụ:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;
