import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import { toast } from "sonner";

export default function CustomerManager() {
  const [customers, setCustomers] = useState([]);
  const [editItem, setEditItem] = useState(null);

  // 🧩 Form thêm mới
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("other");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  // 🔹 Lấy danh sách khách hàng
  const fetchData = async () => {
    try {
      const res = await adminApi.getCustomers();
      setCustomers(res.data || []);
    } catch (err) {
      console.error("❌ Lỗi tải khách hàng:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Thêm khách hàng
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim()) {
      toast.error("⚠️ Vui lòng nhập họ tên và email!");
      return;
    }

    try {
      await adminApi.addCustomer({
        full_name: fullName,
        email,
        phone,
        gender,
        address,
        note,
      });
      toast.success("✅ Thêm khách hàng thành công!");
      setFullName("");
      setEmail("");
      setPhone("");
      setGender("other");
      setAddress("");
      setNote("");
      fetchData();
    } catch (err) {
      toast.error("❌ " + (err.response?.data?.message || "Không thể thêm khách hàng"));
    }
  };

  // 🔹 Lưu cập nhật
  const handleSave = async (id) => {
    try {
      await adminApi.updateCustomer(id, editItem);
      toast.success("✅ Cập nhật thành công!");
      setEditItem(null);
      fetchData();
    } catch {
      toast.error("❌ Lỗi khi cập nhật!");
    }
  };

  // 🔹 Xóa khách hàng
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khách hàng này?")) {
      await adminApi.deleteCustomer(id);
      toast.success("🗑️ Đã xóa khách hàng!");
      fetchData();
    }
  };

  // 🔹 Hiển thị giới tính tiếng Việt
  const displayGender = (g) => {
    if (!g) return "Khác";
    const lower = g.toLowerCase();
    if (lower === "male") return "Nam";
    if (lower === "female") return "Nữ";
    return "Khác";
  };

  // 🔹 Định dạng ngày đẹp
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div style={{ padding: 30, fontFamily: "Arial" }}>
        <h2>👤 Quản lý khách hàng</h2>

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
          <h3>➕ Thêm khách hàng mới</h3>

          <label>Họ tên:</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            placeholder="Nhập họ tên"
            style={{ width: "100%", padding: "8px", marginBottom: 8 }}
          />

          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Nhập email"
            style={{ width: "100%", padding: "8px", marginBottom: 8 }}
          />

          <label>Điện thoại:</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
            style={{ width: "100%", padding: "8px", marginBottom: 8 }}
          />

          <label>Giới tính:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            style={{ width: "100%", padding: "8px", marginBottom: 8 }}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>

          <label>Địa chỉ:</label>
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Nhập địa chỉ"
            style={{ width: "100%", padding: "8px", marginBottom: 8 }}
          />

          <label>Ghi chú:</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ghi chú (nếu có)"
            style={{ width: "100%", padding: "8px", marginBottom: 8 }}
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
              cursor: "pointer",
            }}
          >
            ➕ Thêm khách hàng
          </button>
        </form>

        {/* --- Danh sách khách hàng --- */}
        <table
          border="1"
          cellPadding="8"
          style={{
            borderCollapse: "collapse",
            width: "100%",
            background: "white",
          }}
        >
          <thead style={{ background: "#f0f0f0" }}>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Họ tên</th>
              <th>Điện thoại</th>
              <th>Giới tính</th>
              <th>Địa chỉ</th>
              <th>Ghi chú</th>
              <th>Ngày tạo</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => {
              const id = c.customer_id || c.id;
              const isEditing = editItem?.customer_id === id;

              return (
                <tr key={`customer-${id}`}>
                  <td>{id}</td>
                  <td>{c.email}</td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editItem.full_name || ""}
                        onChange={(e) =>
                          setEditItem({ ...editItem, full_name: e.target.value })
                        }
                      />
                    ) : (
                      c.full_name
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editItem.phone || ""}
                        onChange={(e) =>
                          setEditItem({ ...editItem, phone: e.target.value })
                        }
                      />
                    ) : (
                      c.phone
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <select
                        value={editItem.gender || "other"}
                        onChange={(e) =>
                          setEditItem({ ...editItem, gender: e.target.value })
                        }
                      >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    ) : (
                      displayGender(c.gender)
                    )}
                  </td>
                  <td>{c.address}</td>
                  <td>{c.note}</td>
                  <td>{formatDate(c.created_at)}</td>
                  <td>
                    {isEditing ? (
                      <>
                        <button onClick={() => handleSave(id)}>💾</button>
                        <button onClick={() => setEditItem(null)}>❌</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditItem(c)}>✏️</button>
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
