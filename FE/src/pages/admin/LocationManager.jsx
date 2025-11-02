import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

export default function LocationManager() {
  const [locations, setLocations] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [message, setMessage] = useState("");

  // Form thêm mới
  const [name, setName] = useState("");
  const [country, setCountry] = useState("Việt Nam");
  const [region, setRegion] = useState("");
  const [description, setDescription] = useState("");

  // Lấy danh sách
  const fetchData = async () => {
    const res = await adminApi.getLocations();
    setLocations(res.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý thêm mới
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await adminApi.addLocation({ name, country, region, description });
      setMessage("✅ Thêm địa điểm thành công!");
      setName(""); setRegion(""); setDescription("");
      fetchData();
    } catch (err) {
      setMessage("❌ Lỗi: " + (err.response?.data?.message || "Không thể thêm"));
    }
  };

  // Xử lý cập nhật
  const handleSave = async (id) => {
    try {
      await adminApi.updateLocation(id, editItem);
      setMessage("✅ Cập nhật thành công!");
      setEditItem(null);
      fetchData();
    } catch {
      setMessage("❌ Lỗi khi cập nhật!");
    }
  };

  // Xử lý xóa
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa địa điểm này?")) {
      await adminApi.deleteLocation(id);
      fetchData();
    }
  };

  return (
    <div>
      <div style={{ padding: "30px", fontFamily: "Arial" }}>
        <h2>📍 Quản lý địa điểm</h2>

        {message && <p>{message}</p>}

        {/* --- Form thêm mới --- */}
        <form
          onSubmit={handleAdd}
          style={{
            marginBottom: "30px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            maxWidth: 600,
          }}
        >
          <h3>➕ Thêm địa điểm mới</h3>
          <label>Tên địa điểm:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />
          <label>Quốc gia:</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
          <label>Vùng:</label>
          <input
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
          <label>Mô tả:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
          <button
            type="submit"
            style={{
              marginTop: 10,
              padding: "10px 15px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Thêm địa điểm
          </button>
        </form>

        {/* --- Bảng danh sách --- */}
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th>ID</th>
              <th>Tên</th>
              <th>Vùng</th>
              <th>Quốc gia</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {locations.map((loc) =>
              editItem?.id === loc.id ? (
                <tr key={loc.id}>
                  <td>{loc.id}</td>
                  <td>
                    <input
                      value={editItem.name}
                      onChange={(e) =>
                        setEditItem({ ...editItem, name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editItem.region || ""}
                      onChange={(e) =>
                        setEditItem({ ...editItem, region: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editItem.country || ""}
                      onChange={(e) =>
                        setEditItem({ ...editItem, country: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editItem.description || ""}
                      onChange={(e) =>
                        setEditItem({
                          ...editItem,
                          description: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => handleSave(loc.id)}>💾 Lưu</button>
                    <button onClick={() => setEditItem(null)}>❌ Hủy</button>
                  </td>
                </tr>
              ) : (
                <tr key={loc.id}>
                  <td>{loc.id}</td>
                  <td>{loc.name}</td>
                  <td>{loc.region}</td>
                  <td>{loc.country}</td>
                  <td>{loc.description}</td>
                  <td>
                    <button onClick={() => setEditItem(loc)}>✏️ Sửa</button>
                    <button onClick={() => handleDelete(loc.id)}>🗑️ Xóa</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
