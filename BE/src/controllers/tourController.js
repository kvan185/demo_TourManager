import { pool } from "../db.js";

/* ===============================
   GET /api/tours
   Danh sách tour (có phân trang)
================================ */
export const getTours = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const perPage = Math.min(100, Number(req.query.per_page) || 10);
    const offset = (page - 1) * perPage;

    const [rows] = await pool.query(
      `SELECT 
        t.id, t.code, t.title, t.short_description, t.price, t.duration_days, 
        t.status, l.name AS location_name,
        (SELECT img_url FROM tour_images WHERE tour_id = t.id LIMIT 1) AS main_image
      FROM tours t
      LEFT JOIN locations l ON t.main_location_id = l.id
      WHERE t.status = 'published'
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?`,
      [perPage, offset]
    );

    res.json({ data: rows, page, perPage });
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách tour:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/* ===============================
   GET /api/tours/:id
================================ */
export const getTourById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM tours WHERE id = ?",
      [req.params.id]
    );

    if (!rows.length)
      return res.status(404).json({ error: "Không tìm thấy tour" });

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Lỗi lấy tour:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/* ===============================
   GET /api/tours/:id/images
================================ */
export const getTourImages = async (req, res) => {
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
};

/* ===============================
   GET /api/tours/:id/detail
   Thông tin tour + schedule + guides + services
================================ */
export const getTourDetail = async (req, res) => {
  try {
    const tourId = req.params.id;

    // 1️⃣ Info tour
    const [[tour]] = await pool.query(
      `SELECT t.*, l.name AS main_location_name
       FROM tours t
       LEFT JOIN locations l ON t.main_location_id = l.id
       WHERE t.id = ?`,
      [tourId]
    );

    if (!tour)
      return res.status(404).json({ message: "Không tìm thấy tour" });

    // 2️⃣ Schedules
    const [schedules] = await pool.query(
      `SELECT id, start_date, end_date, seats_total, seats_booked, price_per_person, status
       FROM tour_schedules 
       WHERE tour_id = ?
       ORDER BY start_date ASC`,
      [tourId]
    );

    // 3️⃣ Guides
    const [guides] = await pool.query(
      `SELECT e.full_name, e.phone, tg.role, tg.assigned_at
       FROM tour_guides tg
       JOIN employees e ON tg.employee_id = e.id
       WHERE tg.schedule_id IN (SELECT id FROM tour_schedules WHERE tour_id = ?)`,
      [tourId]
    );

    // 4️⃣ Images
    const [images] = await pool.query(
      "SELECT img_url, alt_text FROM tour_images WHERE tour_id = ?",
      [tourId]
    );

    // 5️⃣ Services
    const [services] = await pool.query(
      `SELECT 
         s.id, s.type, s.name, s.provider, s.details, s.price,
         ts.qty, ts.note,
         si.img_url
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
};

/* ===============================
   GET /api/tours/:id/itineraries
================================ */
export const getItineraries = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, tour_id, day_number, title, description
       FROM tour_itineraries
       WHERE tour_id = ?
       ORDER BY day_number ASC`,
      [req.params.id]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy itineraries:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/* ===============================
   GET /api/tours/:id/services
================================ */
export const getTourServices = async (req, res) => {
  try {
    const tourId = req.params.id;

    const [rows] = await pool.query(
      `SELECT 
         s.id, s.type, s.name, s.provider, s.details, s.price,
         ts.qty, ts.note,
         si.img_url
       FROM tour_services ts
       JOIN services s ON ts.service_id = s.id
       LEFT JOIN service_images si ON si.service_id = s.id
       WHERE ts.tour_id = ?`,
      [tourId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi dịch vụ tour:", err);
    res.status(500).json({ message: "Lỗi server khi lấy dịch vụ" });
  }
};
