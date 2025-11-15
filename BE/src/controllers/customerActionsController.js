import { pool } from "../db.js";

/* -----------------------------------------------------
    BOOKINGS
------------------------------------------------------*/

// Lấy danh sách booking của khách
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT 
        b.id, b.booking_code, b.qty_adults, b.qty_children,
        b.total_amount, b.status, b.payment_status,
        b.booking_date, t.title AS tour_title
      FROM bookings b
      JOIN customers c ON c.id = b.customer_id
      LEFT JOIN tours t ON t.id = b.schedule_id
      WHERE c.user_id = ?
      ORDER BY b.booking_date DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy booking:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Tạo booking mới
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { schedule_id, qty_adults, qty_children, note } = req.body;

    const [[customer]] = await pool.query(
      "SELECT id FROM customers WHERE user_id = ?",
      [userId]
    );

    if (!customer)
      return res.status(400).json({ message: "Không tìm thấy thông tin khách hàng" });

    const bookingCode = "BK" + Date.now();

    const [result] = await pool.query(
      `INSERT INTO bookings (booking_code, customer_id, schedule_id, qty_adults, qty_children, note)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [bookingCode, customer.id, schedule_id, qty_adults, qty_children, note || null]
    );

    res.json({ message: "Đặt tour thành công", id: result.insertId });
  } catch (err) {
    console.error("❌ Lỗi tạo booking:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Chi tiết booking
export const getBookingDetail = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT b.*, t.title AS tour_title, c.full_name
      FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      LEFT JOIN tours t ON t.id = b.schedule_id
      WHERE b.id = ? AND c.user_id = ?
      `,
      [bookingId, userId]
    );

    if (!rows.length)
      return res.status(403).json({ message: "Không có quyền xem booking này" });

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Lỗi chi tiết booking:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Hủy booking
export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id;

    const [check] = await pool.query(
      `
      SELECT b.id FROM bookings b
      JOIN customers c ON b.customer_id = c.id
      WHERE b.id = ? AND c.user_id = ?
      `,
      [bookingId, userId]
    );

    if (!check.length)
      return res.status(403).json({ message: "Không thể hủy booking này" });

    await pool.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = ?",
      [bookingId]
    );

    res.json({ message: "Hủy booking thành công!" });
  } catch (err) {
    console.error("❌ Lỗi hủy booking:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/* -----------------------------------------------------
    PASSENGERS
------------------------------------------------------*/
export const getPassengers = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const [rows] = await pool.query(
      "SELECT * FROM booking_passengers WHERE booking_id = ?",
      [bookingId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy hành khách:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addPassenger = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { full_name, gender, birth_date, passport_number, seat_type, price } = req.body;

    await pool.query(
      `INSERT INTO booking_passengers 
         (booking_id, full_name, gender, birth_date, passport_number, seat_type, price)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [bookingId, full_name, gender, birth_date, passport_number, seat_type, price]
    );

    res.json({ message: "Thêm hành khách thành công" });
  } catch (err) {
    console.error("❌ Lỗi thêm hành khách:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updatePassenger = async (req, res) => {
  try {
    const pid = req.params.pid;
    const data = req.body;

    await pool.query(
      `UPDATE booking_passengers
       SET full_name=?, gender=?, birth_date=?, passport_number=?, seat_type=?, price=?
       WHERE id=?`,
      [
        data.full_name,
        data.gender,
        data.birth_date,
        data.passport_number,
        data.seat_type,
        data.price,
        pid,
      ]
    );

    res.json({ message: "Cập nhật hành khách thành công" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật hành khách:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deletePassenger = async (req, res) => {
  try {
    await pool.query("DELETE FROM booking_passengers WHERE id = ?", [
      req.params.pid,
    ]);
    res.json({ message: "Xóa hành khách thành công" });
  } catch (err) {
    console.error("❌ Lỗi xóa hành khách:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/* -----------------------------------------------------
    PAYMENTS
------------------------------------------------------*/
export const getMyPayments = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT p.*, b.booking_code
      FROM payments p
      JOIN bookings b ON b.id = p.booking_id
      JOIN customers c ON c.id = b.customer_id
      WHERE c.user_id = ?
      ORDER BY p.paid_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy thanh toán:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const addPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { booking_id, amount, method, transaction_ref } = req.body;

    await pool.query(
      `INSERT INTO payments (booking_id, paid_by_user_id, amount, method, transaction_ref)
       VALUES (?, ?, ?, ?, ?)`,
      [booking_id, userId, amount, method, transaction_ref]
    );

    res.json({ message: "Thanh toán thành công" });
  } catch (err) {
    console.error("❌ Lỗi thêm payment:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/* -----------------------------------------------------
    INVOICES
------------------------------------------------------*/
export const getMyInvoices = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT i.*, b.booking_code
      FROM invoices i
      JOIN bookings b ON b.id = i.booking_id
      JOIN customers c ON c.id = b.customer_id
      WHERE c.user_id = ?
      ORDER BY i.issued_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi invoices:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getInvoiceDetail = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT i.*, b.booking_code, c.full_name
      FROM invoices i
      JOIN bookings b ON b.id = i.booking_id
      JOIN customers c ON c.id = b.customer_id
      WHERE i.id = ? AND c.user_id = ?
      `,
      [invoiceId, userId]
    );

    if (!rows.length)
      return res.status(403).json({ message: "Không có quyền xem hóa đơn này" });

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Lỗi invoice detail:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

/* -----------------------------------------------------
    REVIEWS
------------------------------------------------------*/
export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { booking_id, tour_id, rating, comment } = req.body;

    const [[customer]] = await pool.query(
      "SELECT id FROM customers WHERE user_id = ?",
      [userId]
    );

    if (!customer)
      return res.status(404).json({ message: "Không tìm thấy khách hàng" });

    await pool.query(
      `INSERT INTO reviews 
         (booking_id, customer_id, tour_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [booking_id, customer.id, tour_id, rating, comment]
    );

    res.json({ message: "Gửi đánh giá thành công" });
  } catch (err) {
    console.error("❌ Lỗi thêm review:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT r.*, t.title AS tour_title
      FROM reviews r
      JOIN customers c ON c.id = r.customer_id
      JOIN tours t ON t.id = r.tour_id
      WHERE c.user_id = ?
      ORDER BY r.created_at DESC
      `,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy reviews:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
