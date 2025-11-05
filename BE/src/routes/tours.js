// routes/tours.js
import express from 'express';
import { pool } from '../db.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// GET /api/tours - list (pagination basic)
router.get('/', async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const perPage = Math.min(100, Number(req.query.per_page) || 10);
  const offset = (page - 1) * perPage;
  const [rows] = await pool.query('SELECT id, code, title, price, duration_days, status FROM tours LIMIT ? OFFSET ?', [perPage, offset]);
  res.json({data: rows, page, perPage});
});

// GET /api/tours/:id
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const [rows] = await pool.query('SELECT * FROM tours WHERE id = ?', [id]);
  if (!rows || rows.length === 0) return res.status(404).json({error: 'Not found'});
  res.json(rows[0]);
});

// POST /api/tours (protected, e.g., admin/manager only)
router.post('/', authenticate, authorize([1 /* example role_id for admin */]), [
  body('title').notEmpty(),
  body('price').isNumeric()
], async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty()) return res.status(400).json({errors: errs.array()});
  const { code, title, short_description, price, duration_days, main_location_id } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO tours (code, title, short_description, price, duration_days, main_location_id, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'draft')`,
      [code, title, short_description, price, duration_days, main_location_id]
    );
    const [row] = await pool.query('SELECT * FROM tours WHERE id = ?', [result.insertId]);
    res.status(201).json(row[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({error:'Server error'});
  }
});

// PUT /api/tours/:id (update)
router.put('/:id', authenticate, authorize([1]), async (req,res)=>{
  const id = req.params.id;
  // example: allow updating title and price
  const { title, price, status } = req.body;
  await pool.query('UPDATE tours SET title = COALESCE(?, title), price = COALESCE(?, price), status = COALESCE(?, status), updated_at = CURRENT_TIMESTAMP WHERE id = ?', [title, price, status, id]);
  const [r] = await pool.query('SELECT * FROM tours WHERE id = ?', [id]);
  res.json(r[0]);
});

// DELETE /api/tours/:id
router.delete('/:id', authenticate, authorize([1]), async (req,res)=>{
  const id = req.params.id;
  await pool.query('DELETE FROM tours WHERE id = ?', [id]);
  res.status(204).send();
});

router.get("/:id/images", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM tour_images WHERE tour_id = ?",
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi khi lấy ảnh tour:", err);
    res.status(500).json({ message: "Lỗi server khi lấy ảnh tour" });
  }
});

router.get("/:id/detail", async (req, res) => {
  try {
    const tourId = req.params.id;

    // 1️⃣ Thông tin cơ bản tour
    const [[tour]] = await pool.query(
      `SELECT t.*, l.name AS main_location_name
       FROM tours t
       LEFT JOIN locations l ON t.main_location_id = l.id
       WHERE t.id = ?`,
      [tourId]
    );
    if (!tour) return res.status(404).json({ message: "Không tìm thấy tour" });

    // 2️⃣ Lịch khởi hành
    const [schedules] = await pool.query(
      `SELECT id, start_date, end_date, seats_total, seats_booked, price_per_person, status
       FROM tour_schedules WHERE tour_id = ? ORDER BY start_date ASC`,
      [tourId]
    );

    // 3️⃣ Hướng dẫn viên (JOIN nhân viên)
    const [guides] = await pool.query(
      `SELECT e.full_name, e.phone, tg.role, tg.assigned_at
       FROM tour_guides tg
       JOIN employees e ON tg.employee_id = e.id
       WHERE tg.schedule_id IN (SELECT id FROM tour_schedules WHERE tour_id = ?)`,
      [tourId]
    );

    // 4️⃣ Ảnh tour
    const [images] = await pool.query(
      "SELECT img_url, alt_text FROM tour_images WHERE tour_id = ?",
      [tourId]
    );

    // 5️⃣ Dịch vụ liên quan (JOIN service_images)
    const [services] = await pool.query(
      `SELECT s.id, s.name, s.type, s.provider, s.price, s.details, si.img_url
       FROM tour_services ts
       JOIN services s ON ts.service_id = s.id
       LEFT JOIN service_images si ON si.service_id = s.id
       WHERE ts.tour_id = ?`,
      [tourId]
    );

    res.json({
      tour,
      schedules,
      guides,
      images,
      services,
    });
  } catch (err) {
    console.error("❌ Lỗi lấy chi tiết tour:", err);
    res.status(500).json({ message: "Lỗi server khi lấy chi tiết tour" });
  }
});

export default router;
