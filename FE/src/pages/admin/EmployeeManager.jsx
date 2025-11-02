import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";

export default function EmployeeManager() {
  const [employees, setEmployees] = useState([]);
  const [editItem, setEditItem] = useState(null);

  // 🧩 Form thêm mới
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("active");
  const [email, setEmail] = useState("");
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  // 🔹 Lấy danh sách vai trò
  const fetchRoles = async () => {
    try {
      const res = await adminApi.getRoles();
      setRoles(res.data);
    } catch (err) {
      console.error("❌ Lỗi tải roles:", err);
    }
  };

  // 🔹 Lấy danh sách nhân viên
  const fetchData = async () => {
    try {
      const res = await adminApi.getEmployees();
      setEmployees(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi tải nhân viên:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, []);

  // 🔹 Thêm nhân viên
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await adminApi.addEmployee({
        full_name: fullName,
        email,
        phone,
        status,
        role_id: selectedRole,
      });
      toast.success("✅ Thêm nhân viên thành công!");
      setFullName("");
      setEmail("");
      setPhone("");
      setStatus("active");
      fetchData();
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || "Không thể thêm nhân viên"));
    }
  };


  // 🔹 Lưu cập nhật
  const handleSave = async (id) => {
    try {
      await adminApi.updateEmployee(id, editItem);
      toast.success("✅ Cập nhật thành công!");
      setEditItem(null);
      fetchData();
    } catch {
      toast.error("❌ Lỗi khi cập nhật!");
    }
  };

  // 🔹 Xóa nhân viên
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      await adminApi.deleteEmployee(id);
      toast.success("🗑️ Đã xóa nhân viên!");
      fetchData();
    }
  };

  return (
    <div>
      <div style={{ padding: 30, fontFamily: "Arial" }}>
        <h2>🧑‍💼 Quản lý nhân viên</h2>

        {/* --- Form thêm mới --- */}
        <form
          onSubmit={handleAdd}
          style={{
            marginBottom: "30px",
            padding: "15px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            maxWidth: 600,
            background: "#fafafa",
          }}
        >
          <h3>➕ Thêm nhân viên mới</h3>

          <label>Họ tên:</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: 8 }}
          />

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginBottom: 8 }}
          />


          <label>Loại nhân viên (vai trò):</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: 8 }}
            required
          >
            <option value="">-- Chọn vai trò --</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>


          <label>Số điện thoại:</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: 8 }}
          />

          <label>Trạng thái:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: 8 }}
          >
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="on_leave">Nghỉ phép</option>
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
              cursor: "pointer",
            }}
          >
            Thêm nhân viên
          </button>
        </form>

        {/* --- Danh sách nhân viên --- */}
        <table
          border="1"
          cellPadding="8"
          style={{ borderCollapse: "collapse", width: "100%", background: "white" }}
        >
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Loại</th>
              <th>Chức vụ</th>
              <th>Điện thoại</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => {
              if (!e) return null; // ✅ tránh lỗi dữ liệu null
              const id = e.employee_id || e.id;
              const isEditing = editItem?.employee_id === id || editItem?.id === id;

              return (
                <tr key={`employee-${id}`}>
                  <td>{id}</td>
                  <td>{e.email}</td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editItem?.full_name || ""}
                        onChange={(ev) =>
                          setEditItem({ ...editItem, full_name: ev.target.value })
                        }
                      />
                    ) : (
                      e?.full_name || ""
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <select
                        value={editItem?.role_id || e.role_id || ""}
                        onChange={(ev) =>
                          setEditItem({
                            ...editItem,
                            role_id: ev.target.value,
                          })
                        }
                      >
                        {roles.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      e?.role_name || "—"
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <input
                        value={editItem?.phone || ""}
                        onChange={(ev) =>
                          setEditItem({ ...editItem, phone: ev.target.value })
                        }
                      />
                    ) : (
                      e?.phone || ""
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <select
                        value={editItem?.status || "active"}
                        onChange={(ev) =>
                          setEditItem({ ...editItem, status: ev.target.value })
                        }
                      >
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Không hoạt động</option>
                        <option value="on_leave">Nghỉ phép</option>
                      </select>
                    ) : (
                      e?.status || ""
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <>
                        <button onClick={() => handleSave(id)}>💾</button>
                        <button onClick={() => setEditItem(null)}>❌</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditItem(e)}>✏️</button>
                        <button onClick={() => handleDelete(id)}>🗑️</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
