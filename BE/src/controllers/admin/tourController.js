import { pool } from "../../db.js";
import fs from "fs";

const uploadDir = "uploads/tours";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });


/* ------------------------------------------------------------------
  Hàm tạo prefix từ tên location
  Hà Nội => HN, Đà Nẵng => DN, Hồ Chí Minh => HCM
-------------------------------------------------------------------*/
function locationToPrefix(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
    .split(" ")
    .map(w => w[0].toUpperCase())
    .join("");
}

/* ------------------------------------------------------------------
  Sinh mã tour theo location
  VD: DN01, DN02, HN01, HN02 ...
-------------------------------------------------------------------*/
async function generateTourCode(main_location_id) {
  // Lấy tên location
  const [loc] = await pool.query(
    "SELECT name FROM locations WHERE id = ? LIMIT 1",
    [main_location_id]
  );

  if (loc.length === 0) {
    throw new Error("Location không tồn tại");
  }

  const locationName = loc[0].name;

  // Tạo prefix
  const prefix = locationToPrefix(locationName); // VD: 'DN'

  // Lấy mã lớn nhất theo prefix
  const [rows] = await pool.query(
    `
      SELECT code 
      FROM tours 
      WHERE code LIKE ? 
      ORDER BY code DESC 
      LIMIT 1
    `,
    [`${prefix}%`]
  );

  let nextNumber = 1;

  if (rows.length > 0) {
    // Lấy phần số của mã cuối cùng: VD DN03 -> 3
    const lastCode = rows[0].code;
    const numberPart = parseInt(lastCode.replace(prefix, ""), 10);
    nextNumber = numberPart + 1;
  }

  // Format thành 2 số: 01, 02...
  const formatted = String(nextNumber).padStart(2, "0");
  return `${prefix}${formatted}`;
}

// ===== TOURS =====

// Lấy danh sách tour
export const getTours = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, l.name AS main_location 
      FROM tours t
      LEFT JOIN locations l ON t.main_location_id = l.id
      ORDER BY t.id DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Thêm tour mới
export const addTour = async (req, res) => {
  const { code, title, short_description, price, duration_days, main_location_id } = req.body;
  if (!title || !price)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

  try {
    const [result] = await pool.query(
      `INSERT INTO tours 
       (code, title, short_description, price, duration_days, main_location_id, status)
       VALUES (?, ?, ?, ?, ?, ?, 'draft')`,
      [code || null, title, short_description || null, price, duration_days || 1, main_location_id || null]
    );
    res.status(201).json({ id: result.insertId, title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể thêm tour" });
  }
};

// Lấy chi tiết tour
export const getTourDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT t.*, l.name AS main_location
      FROM tours t
      LEFT JOIN locations l ON t.main_location_id = l.id
      WHERE t.id = ?
    `, [id]);
    if (!rows.length) return res.status(404).json({ message: "Không tìm thấy tour" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Cập nhật tour
export const updateTour = async (req, res) => {
  const { id } = req.params;
  const { code, title, short_description, price, duration_days, main_location_id } = req.body;
  try {
    await pool.query(
      "UPDATE tours SET code=?, title=?, short_description=?, price=?, duration_days=?, main_location_id=? WHERE id=?",
      [code, title, short_description, price, duration_days, main_location_id, id]
    );
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa tour
export const deleteTour = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tours WHERE id = ?", [id]);
    res.json({ message: "Đã xóa tour" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Upload ảnh cho tour
export const uploadTourImage = async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  if (!file) return res.status(400).json({ message: "Chưa có file gửi lên" });

  const imgUrl = `${uploadDir}/${file.filename}`;
  try {
    await pool.query("INSERT INTO tour_images (tour_id, img_url) VALUES (?, ?)", [id, imgUrl]);
    res.status(201).json({ img_url: imgUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể upload ảnh" });
  }
};

// Lấy ảnh của tour
export const getTourImages = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM tour_images WHERE tour_id=?", [id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Xóa ảnh tour
export const deleteTourImage = async (req, res) => {
  const { imgId } = req.params;
  try {
    const [rows] = await pool.query("SELECT img_url FROM tour_images WHERE id=?", [imgId]);
    if (!rows.length) return res.status(404).json({ message: "Không tìm thấy ảnh" });

    const filePath = rows[0].img_url;
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await pool.query("DELETE FROM tour_images WHERE id=?", [imgId]);

    res.json({ message: "Đã xóa ảnh" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ... Tương tự tạo các hàm cho schedules, itineraries, tour_guides
