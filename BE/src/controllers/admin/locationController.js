import { pool } from "../../db.js";

//
// ========== LOCATIONS ==========
//

// Lấy danh sách địa điểm
export const getLocations = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM locations ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Thêm địa điểm mới
export const addLocation = async (req, res) => {
  const { name, country, region, description } = req.body;
  if (!name) return res.status(400).json({ message: "Tên địa điểm bắt buộc" });

  try {
    const [result] = await pool.query(
      "INSERT INTO locations (name, country, region, description) VALUES (?, ?, ?, ?)",
      [name, country || "Việt Nam", region || null, description || null]
    );
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể thêm địa điểm" });
  }
};

// Lấy chi tiết địa điểm theo ID
export const getLocationDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM locations WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Không tìm thấy" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Cập nhật địa điểm
export const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { name, country, region, description } = req.body;
  try {
    await pool.query(
      "UPDATE locations SET name=?, country=?, region=?, description=? WHERE id=?",
      [name, country, region, description, id]
    );
    res.json({ message: "Cập nhật thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa địa điểm
export const deleteLocation = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM locations WHERE id = ?", [id]);
    res.json({ message: "Đã xóa địa điểm" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
