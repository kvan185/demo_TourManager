import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tours, setTours] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [message, setMessage] = useState("");

  // 🧩 Form thêm mới
  const [customerId, setCustomerId] = useState("");
  const [tourId, setTourId] = useState("");
  const [qtyAdults, setQtyAdults] = useState(1);
  const [qtyChildren, setQtyChildren] = useState(0);
  const [status, setStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("unpaid");
  const [totalAmount, setTotalAmount] = useState(0);

  // 🔹 Lấy dữ liệu ban đầu
  const fetchData = async () => {
    try {
      const [b, c, t] = await Promise.all([
        adminApi.getBookings(),
        adminApi.getCustomers(),
        adminApi.getTours(),
      ]);
      setBookings(b.data);
      setCustomers(c.data);
      setTours(t.data);
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔹 Thêm booking
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await adminApi.addBooking({
        customer_id: customerId,
        tour_id: tourId,
        qty_adults: qtyAdults,
        qty_children: qtyChildren,
        total_amount: totalAmount,
        status,
        payment_status: paymentStatus,
      });
      setMessage("✅ Thêm đơn đặt thành công!");
      setCustomerId("");
      setTourId("");
      setQtyAdults(1);
      setQtyChildren(0);
      setTotalAmount(0);
      setStatus("pending");
      setPaymentStatus("unpaid");
      fetchData();
    } catch (err) {
      setMessage("❌ Lỗi: " + (err.response?.data?.message || "Không thể thêm booking"));
    }
  };

  // 🔹 Cập nhật booking
  const handleSave = async (id) => {
    try {
      await adminApi.updateBooking(id, editItem);
      setMessage("✅ Cập nhật thành công!");
      setEditItem(null);
      fetchData();
    } catch {
      setMessage("❌ Lỗi khi cập nhật!");
    }
  };

  // 🔹 Xóa booking
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa đơn đặt này?")) {
      await adminApi.deleteBooking(id);
      fetchData();
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>📦 Quản lý đơn đặt tour</h2>
      {message && <p>{message}</p>}

      {/* --- Form thêm mới --- */}
      <form
        onSubmit={handleAdd}
        style={{
          marginBottom: "30px",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          maxWidth: 700,
        }}
      >
        <h3>➕ Thêm đơn đặt mới</h3>

        <label>Khách hàng:</label>
        <select
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
          style={{ width: "100%", padding: "8px" }}
        >
          <option value="">-- Chọn khách hàng --</option>
          {Array.isArray(customers) &&
            customers.map((c, index) => (
              <option key={c.id || `customer-${index}`} value={c.id}>
                {c.full_name}
              </option>
            ))}
        </select>

        <label>Tour:</label>
        <select
          value={tourId}
          onChange={(e) => setTourId(e.target.value)}
          required
          style={{ width: "100%", padding: "8px" }}
        >
          <option value="">-- Chọn tour --</option>
          {Array.isArray(tours) &&
            tours.map((t, index) => (
              <option key={t.id || `tour-${index}`} value={t.id}>
                {t.title}
              </option>
            ))}
        </select>

        <label>Số người lớn:</label>
        <input
          type="number"
          value={qtyAdults}
          min="1"
          onChange={(e) => setQtyAdults(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        <label>Số trẻ em:</label>
        <input
          type="number"
          value={qtyChildren}
          min="0"
          onChange={(e) => setQtyChildren(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        <label>Tổng tiền (VND):</label>
        <input
          type="number"
          value={totalAmount}
          onChange={(e) => setTotalAmount(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        />

        <label>Trạng thái:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        >
          <option value="pending">Chờ xác nhận</option>
          <option value="confirmed">Đã xác nhận</option>
          <option value="canceled">Đã hủy</option>
        </select>

        <label>Thanh toán:</label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          style={{ width: "100%", padding: "8px" }}
        >
          <option value="unpaid">Chưa thanh toán</option>
          <option value="paid">Đã thanh toán</option>
          <option value="refund">Hoàn tiền</option>
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
          Thêm đơn đặt
        </button>
      </form>

      {/* --- Danh sách booking --- */}
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>ID</th>
            <th>Khách hàng</th>
            <th>Tour</th>
            <th>Người lớn</th>
            <th>Trẻ em</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thanh toán</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(bookings) &&
            bookings.map((b, index) =>
              editItem?.id === b.id ? (
                <tr key={b.id || `edit-${index}`}>
                  <td>{b.id}</td>
                  <td>
                    <select
                      value={editItem.customer_id}
                      onChange={(e) =>
                        setEditItem({ ...editItem, customer_id: e.target.value })
                      }
                    >
                      {customers.map((c, idx) => (
                        <option key={c.id || `c-${idx}`} value={c.id}>
                          {c.full_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={editItem.tour_id}
                      onChange={(e) =>
                        setEditItem({ ...editItem, tour_id: e.target.value })
                      }
                    >
                      {tours.map((t, idx) => (
                        <option key={t.id || `t-${idx}`} value={t.id}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editItem.qty_adults}
                      onChange={(e) =>
                        setEditItem({ ...editItem, qty_adults: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editItem.qty_children}
                      onChange={(e) =>
                        setEditItem({
                          ...editItem,
                          qty_children: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editItem.total_amount}
                      onChange={(e) =>
                        setEditItem({
                          ...editItem,
                          total_amount: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={editItem.status}
                      onChange={(e) =>
                        setEditItem({ ...editItem, status: e.target.value })
                      }
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="canceled">Đã hủy</option>
                    </select>
                  </td>
                  <td>
                    <select
                      value={editItem.payment_status}
                      onChange={(e) =>
                        setEditItem({
                          ...editItem,
                          payment_status: e.target.value,
                        })
                      }
                    >
                      <option value="unpaid">Chưa thanh toán</option>
                      <option value="paid">Đã thanh toán</option>
                      <option value="refund">Hoàn tiền</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleSave(b.id)}>💾</button>
                    <button onClick={() => setEditItem(null)}>❌</button>
                  </td>
                </tr>
              ) : (
                <tr key={b.id || `row-${index}`}>
                  <td>{b.id}</td>
                  <td>
                    {customers.find((c) => c.id === b.customer_id)?.full_name ||
                      "—"}
                  </td>
                  <td>
                    {tours.find((t) => t.id === b.tour_id)?.title || "—"}
                  </td>
                  <td>{b.qty_adults}</td>
                  <td>{b.qty_children}</td>
                  <td>{b.total_amount}</td>
                  <td>{b.status}</td>
                  <td>{b.payment_status}</td>
                  <td>
                    <button onClick={() => setEditItem(b)}>✏️</button>
                    <button onClick={() => handleDelete(b.id)}>🗑️</button>
                  </td>
                </tr>
              )
            )}
        </tbody>
      </table>
    </div>
  );
}
