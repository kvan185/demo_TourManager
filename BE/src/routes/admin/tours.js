import express from "express";
import { pool } from "../../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// 📂 Thư mục lưu ảnh
const uploadDir = "uploads/tours";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ⚙️ Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 🔹 Danh sách tour
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT t.*, l.name AS main_location 
      FROM tours t
      LEFT JOIN locations l ON t.main_location_id = l.id
      ORDER BY t.id DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 Upload ảnh cho tour
router.post("/:id/upload-image", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const file = req.file;
  if (!file) return res.status(400).json({ message: "Chưa có file gửi lên" });

  const imgUrl = `uploads/tours/${file.filename}`;
  await pool.query("INSERT INTO tour_images (tour_id, img_url) VALUES (?, ?)", [id, imgUrl]);
  res.status(201).json({ img_url: imgUrl });
});

// 🟢 Lấy ảnh của 1 tour
router.get("/:id/images", async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query("SELECT * FROM tour_images WHERE tour_id=?", [id]);
  res.json(rows);
});

// 🟢 Xóa ảnh tour
router.delete("/image/:imgId", async (req, res) => {
  const { imgId } = req.params;
  const [rows] = await pool.query("SELECT img_url FROM tour_images WHERE id=?", [imgId]);
  if (!rows.length) return res.status(404).json({ message: "Không tìm thấy ảnh" });

  const filePath = rows[0].img_url;
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  await pool.query("DELETE FROM tour_images WHERE id=?", [imgId]);

  res.json({ message: "Đã xóa ảnh" });
});

// 🔹 Thêm tour mới
router.post("/add-tour", async (req, res) => {
  const { code, title, short_description, price, duration_days, main_location_id } = req.body;
  if (!title || !price)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

  try {
    const [result] = await pool.query(
      `INSERT INTO tours (code, title, short_description, price, duration_days, main_location_id, status)
       VALUES (?, ?, ?, ?, ?, ?, 'draft')`,
      [code || null, title, short_description || null, price, duration_days || 1, main_location_id || null]
    );
    res.status(201).json({ id: result.insertId, title });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể thêm tour" });
  }
});

// 🔹 Lấy chi tiết tour
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT t.*, l.name AS main_location
      FROM tours t
      LEFT JOIN locations l ON t.main_location_id = l.id
      WHERE t.id = ?
    `, [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Không tìm thấy tour" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT - cập nhật tour
router.put("/:id", async (req, res) => {
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
});

// DELETE - xóa tour
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tours WHERE id = ?", [id]);
    res.json({ message: "Đã xóa tour" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 🔹 Lấy danh sách lịch tour theo id tour
router.get("/:tour_id", async (req, res) => {
  const { tour_id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM tour_schedules WHERE tour_id = ? ORDER BY start_date DESC`,
      [tour_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy lịch trình tour:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Lấy danh sách lịch tour
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ts.*, t.title AS tour_title
      FROM tour_schedules ts
      JOIN tours t ON ts.tour_id = t.id
      ORDER BY ts.start_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy lịch tour:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Thêm lịch tour
router.post("/add-tour", async (req, res) => {
  const {
    code,
    title,
    short_description,
    price,
    duration_days,
    min_participants,
    max_participants,
    main_location_id,
  } = req.body;

  if (!title || !price || !duration_days)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

  try {
    const [result] = await pool.query(
      `INSERT INTO tours 
      (code, title, short_description, price, duration_days, min_participants, max_participants, main_location_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft')`,
      [
        code || null,
        title,
        short_description || null,
        price,
        duration_days,
        min_participants || 1,
        max_participants || 30,
        main_location_id || null,
      ]
    );

    const [[tour]] = await pool.query(
      "SELECT * FROM tours WHERE id = ?",
      [result.insertId]
    );

    res.json({ message: "Thêm tour thành công", tour });
  } catch (err) {
    console.error("❌ Lỗi thêm tour:", err);
    res.status(500).json({ message: "Lỗi server khi thêm tour" });
  }
});


// POST /api/tours/add-tour-scheduler
router.post("/add-schedule", async (req, res) => {
  const {
    tour_id,
    start_date,
    end_date,
    seats_total,
    seats_booked,
    price_per_person,
    status,
  } = req.body;

  if (!tour_id || !start_date || !end_date || !seats_total)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

  try {
    const [result] = await pool.query(
      `INSERT INTO tour_schedules 
      (tour_id, start_date, end_date, seats_total, seats_booked, price_per_person, status)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        tour_id,
        start_date,
        end_date,
        seats_total,
        seats_booked || 0,
        price_per_person || null,
        status || "open",
      ]
    );

    const [[schedule]] = await pool.query(
      "SELECT * FROM tour_schedules WHERE id = ?",
      [result.insertId]
    );

    res.json({ message: "Thêm lịch khởi hành thành công", schedule });
  } catch (err) {
    console.error("❌ Lỗi thêm lịch khởi hành:", err);
    res.status(500).json({ message: "Lỗi server khi thêm lịch khởi hành" });
  }
});


// POST /api/tours/add-tour-itineraries
router.post("/add-itineraries", async (req, res) => {
  const { tour_id, day_number, title, description } = req.body;

  if (!tour_id || !day_number || !title)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

  try {
    const [result] = await pool.query(
      `INSERT INTO tour_itineraries
      (tour_id, day_number, title, description)
      VALUES (?, ?, ?, ?)`,
      [tour_id, day_number, title, description || null]
    );

    const [[itinerary]] = await pool.query(
      "SELECT * FROM tour_itineraries WHERE id = ?",
      [result.insertId]
    );

    res.json({ message: "Thêm lịch trình thành công", itinerary });
  } catch (err) {
    console.error("❌ Lỗi thêm lịch trình:", err);
    res.status(500).json({ message: "Lỗi server khi thêm lịch trình" });
  }
});


// 🔹 Cập nhật lịch tour
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    start_date,
    end_date,
    seats_total,
    seats_booked,
    price_per_person,
    status,
  } = req.body;
  try {
    await pool.query(
      `UPDATE tour_schedules 
       SET start_date=?, end_date=?, seats_total=?, seats_booked=?, price_per_person=?, status=? 
       WHERE id=?`,
      [
        start_date,
        end_date,
        seats_total,
        seats_booked,
        price_per_person,
        status,
        id,
      ]
    );
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật lịch tour:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 🔹 Xóa lịch tour
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tour_schedules WHERE id = ?", [id]);
    res.json({ message: "Đã xóa lịch tour" });
  } catch (err) {
    console.error("❌ Lỗi xóa lịch tour:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});


// 🔹 Lấy tất cả hướng dẫn viên đang được phân công
router.get("/guide", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT tg.id, tg.schedule_id, t.title AS tour_title, tg.employee_id, e.full_name AS employee_name,
             tg.role, tg.assigned_at, ts.start_date, ts.end_date
      FROM tour_guides tg
      JOIN employees e ON tg.employee_id = e.id
      JOIN tour_schedules ts ON tg.schedule_id = ts.id
      JOIN tours t ON ts.tour_id = t.id
      ORDER BY tg.assigned_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách hướng dẫn viên tour:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Lấy hướng dẫn viên theo lịch tour cụ thể
router.get("/schedule/:schedule_id", async (req, res) => {
  const { schedule_id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT tg.id, tg.employee_id, e.full_name AS employee_name, tg.role, tg.assigned_at
      FROM tour_guides tg
      JOIN employees e ON tg.employee_id = e.id
      WHERE tg.schedule_id = ?
    `, [schedule_id]);
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy hướng dẫn viên theo schedule:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 Thêm hướng dẫn viên vào lịch tour
router.post("/add-tour-guide", async (req, res) => {
  const { schedule_id, employee_id, role } = req.body;
  if (!schedule_id || !employee_id)
    return res.status(400).json({ message: "Thiếu schedule_id hoặc employee_id" });

  try {
    const [result] = await pool.query(`
      INSERT INTO tour_guides (schedule_id, employee_id, role)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE role = VALUES(role)
    `, [schedule_id, employee_id, role || "guide"]);

    res.status(201).json({ id: result.insertId, schedule_id, employee_id });
  } catch (err) {
    console.error("❌ Lỗi thêm hướng dẫn viên:", err);
    res.status(500).json({ message: "Không thể thêm hướng dẫn viên cho tour" });
  }
});

// 🔹 Cập nhật vai trò của hướng dẫn viên
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  try {
    await pool.query("UPDATE tour_guides SET role=? WHERE id=?", [role, id]);
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật tour_guide:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// 🔹 Xóa hướng dẫn viên khỏi lịch tour
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM tour_guides WHERE id=?", [id]);
    res.json({ message: "Đã xóa hướng dẫn viên khỏi tour" });
  } catch (err) {
    console.error("❌ Lỗi xóa hướng dẫn viên:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

export default router;