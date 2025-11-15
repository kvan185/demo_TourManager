import { pool } from "../../db.js";

// Lấy toàn bộ lịch làm việc
export const getAllSchedules = async (_, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        es.id, es.schedule_date, es.start_time, es.end_time, es.shift, es.status, es.note,
        e.full_name AS employee_name,
        t.title AS tour_title
      FROM employee_schedules es
      JOIN employees e ON es.employee_id = e.id
      JOIN tours t ON es.tour_id = t.id
      ORDER BY es.schedule_date DESC, es.start_time ASC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy danh sách lịch:", err);
    res.status(500).json({ message: "Không thể lấy danh sách lịch làm việc" });
  }
};

// Lấy chi tiết 1 lịch làm việc
export const getScheduleById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(`
      SELECT es.*, e.full_name AS employee_name, t.name AS tour_name
      FROM employee_schedules es
      JOIN employees e ON es.employee_id = e.id
      JOIN tours t ON es.tour_id = t.id
      WHERE es.id = ?
    `, [id]);

    if (!rows.length) return res.status(404).json({ message: "Không tìm thấy lịch làm việc" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Lỗi lấy lịch:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thêm mới lịch làm việc
export const addSchedule = async (req, res) => {
  const { employee_id, tour_id, schedule_date, start_time, end_time, shift, status, note } = req.body;
  if (!employee_id || !tour_id || !schedule_date)
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });

  try {
    const [result] = await pool.query(`
      INSERT INTO employee_schedules (employee_id, tour_id, schedule_date, start_time, end_time, shift, status, note)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [employee_id, tour_id, schedule_date, start_time, end_time, shift || "full-day", status || "scheduled", note || null]);

    res.status(201).json({ id: result.insertId, message: "Đã thêm lịch làm việc" });
  } catch (err) {
    console.error("❌ Lỗi thêm lịch:", err);
    res.status(500).json({ message: "Không thể thêm lịch làm việc" });
  }
};

// Cập nhật lịch làm việc
export const updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { schedule_date, start_time, end_time, shift, status, note } = req.body;

  try {
    await pool.query(`
      UPDATE employee_schedules
      SET schedule_date = ?, start_time = ?, end_time = ?, shift = ?, status = ?, note = ?
      WHERE id = ?
    `, [schedule_date, start_time, end_time, shift, status, note, id]);

    res.json({ message: "Cập nhật lịch làm việc thành công" });
  } catch (err) {
    console.error("❌ Lỗi cập nhật lịch:", err);
    res.status(500).json({ message: "Không thể cập nhật lịch làm việc" });
  }
};

// Xóa lịch làm việc
export const deleteSchedule = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM employee_schedules WHERE id = ?", [id]);
    res.json({ message: "Đã xóa lịch làm việc" });
  } catch (err) {
    console.error("❌ Lỗi xóa lịch:", err);
    res.status(500).json({ message: "Không thể xóa lịch làm việc" });
  }
};

// Xem lịch làm việc của chính mình
export const getEmployeeSchedules = async (req, res) => {
  const { employeeId } = req.params;
  const { date } = req.query;

  try {
    let query = `
      SELECT es.*, t.name AS tour_name
      FROM employee_schedules es
      JOIN tours t ON es.tour_id = t.id
      WHERE es.employee_id = ?
    `;
    const params = [employeeId];

    if (date) {
      query += " AND es.schedule_date = ?";
      params.push(date);
    }

    query += " ORDER BY es.schedule_date ASC";

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("❌ Lỗi lấy lịch nhân viên:", err);
    res.status(500).json({ message: "Không thể lấy lịch nhân viên" });
  }
};
