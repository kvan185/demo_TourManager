import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [message, setMessage] = useState("");

  // Form thêm mới
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  // Lấy danh sách user
  const fetchData = async () => {
    try {
      const res = await adminApi.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Lỗi load user:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Xử lý thêm user
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await adminApi.addUser({
        email,
        password,
        role: role || null,
      });
      setMessage("✅ Thêm user thành công!");
      setEmail("");
      setPassword("");
      setRole("");
      fetchData();
    } catch (err) {
      console.error(err);
      setMessage("❌ Lỗi: " + (err.response?.data?.message || "Không thể thêm user"));
    }
  };

  // Xử lý lưu chỉnh sửa
  const handleSave = async (id) => {
    try {
      await adminApi.updateUser(id, editItem);
      setMessage("✅ Cập nhật thành công!");
      setEditItem(null);
      fetchData();
    } catch (err) {
      console.error("❌ Lỗi cập nhật user:", err);
    }
  };

  // Xử lý xóa user
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa User này?")) {
      try {
        await adminApi.deleteUser(id);
        fetchData();
      } catch (err) {
        console.error("❌ Lỗi xóa user:", err);
      }
    }
  };

  return (
    <div>
      <div style={{ padding: "30px", fontFamily: "Arial" }}>
        <h2>👤 Quản lý Người dùng</h2>
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
          <h3>➕ Thêm người dùng mới</h3>

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />

          <label>Mật khẩu:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "8px" }}
          />

          <label>Quyền (role):</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">-- Chọn quyền --</option>
            <option value="1">Admin</option>
            <option value="2">User</option>
            <option value="3">Nhân viên</option>
          </select>

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
            Thêm User
          </button>
        </form>

        {/* --- Bảng danh sách --- */}
        <table
          border="1"
          cellPadding="8"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr style={{ background: "#f0f0f0" }}>
              <th>ID</th>
              <th>Quyền</th>
              <th>Email</th>
              <th>Mật khẩu</th>
              <th>Ngày tạo</th>
              <th>Ngày cập nhật</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) =>
              editItem?.id === u.id ? (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>
                    <input
                      value={editItem.role || ""}
                      onChange={(e) =>
                        setEditItem({ ...editItem, role: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editItem.email}
                      onChange={(e) =>
                        setEditItem({ ...editItem, email: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={editItem.password_hash || ""}
                      onChange={(e) =>
                        setEditItem({
                          ...editItem,
                          password_hash: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>{u.created_at}</td>
                  <td>{u.updated_at}</td>
                  <td>
                    <button onClick={() => handleSave(u.id)}>💾</button>
                    <button onClick={() => setEditItem(null)}>❌</button>
                  </td>
                </tr>
              ) : (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.role}</td>
                  <td>{u.email}</td>
                  <td>{u.password_hash}</td>
                  <td>{u.created_at}</td>
                  <td>{u.updated_at}</td>
                  <td>
                    <button onClick={() => setEditItem(u)}>✏️</button>
                    <button onClick={() => handleDelete(u.id)}>🗑️</button>
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
