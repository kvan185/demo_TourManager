import { pool } from "../../db.js";

// Lấy tất cả thanh toán
export const getAllPayments = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id, p.amount, p.method, p.status, p.paid_at, p.transaction_ref,
             b.booking_code, c.full_name AS customer_name
      FROM payments p
      JOIN bookings b ON p.booking_id = b.id
      JOIN customers c ON b.customer_id = c.id
      ORDER BY p.paid_at DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách payments:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Lấy thanh toán theo booking
export const getPaymentsByBooking = async (req, res) => {
  const { booking_id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM payments WHERE booking_id = ? ORDER BY paid_at DESC",
      [booking_id]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy thanh toán theo booking:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Thêm thanh toán mới
export const addPayment = async (req, res) => {
  const { booking_id, paid_by_user_id, amount, method, transaction_ref, status } = req.body;
  if (!booking_id || !amount)
    return res.status(400).json({ message: "Thiếu booking_id hoặc số tiền" });

  try {
    const [result] = await pool.query(
      `INSERT INTO payments 
       (booking_id, paid_by_user_id, amount, method, transaction_ref, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [booking_id, paid_by_user_id || null, amount, method || "cash", transaction_ref || null, status || "success"]
    );
    res.status(201).json({ id: result.insertId, booking_id, amount });
  } catch (err) {
    console.error("❌ Lỗi thêm payment:", err);
    res.status(500).json({ message: "Không thể thêm thanh toán" });
  }
};

// Cập nhật thanh toán
export const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { amount, method, status, transaction_ref } = req.body;
  try {
    await pool.query(
      `UPDATE payments SET amount=?, method=?, status=?, transaction_ref=? WHERE id=?`,
      [amount, method, status, transaction_ref, id]
    );
    res.json({ message: "Cập nhật thanh toán thành công" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật payment:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa thanh toán
export const deletePayment = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM payments WHERE id = ?", [id]);
    res.json({ message: "Đã xóa thanh toán" });
  } catch (err) {
    console.error("❌ Lỗi xóa payment:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
