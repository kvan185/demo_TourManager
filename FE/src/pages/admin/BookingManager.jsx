import React, { useEffect, useState } from "react";
import adminApi from "../../api/adminApi";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from "@mui/material";

export default function BookingManager() {
  const [bookings, setBookings] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [tours, setTours] = useState([]);
  const [message, setMessage] = useState("");

  // Phân trang
  const [page, setPage] = useState(1);
  const rowsPerPage = 5; // số dòng mỗi trang

  // --- Popup xem chi tiết / edit ---
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // --- Popup thêm mới ---
  const [openAdd, setOpenAdd] = useState(false);

  // --- Form thêm / edit ---
  const [form, setForm] = useState({
    id: null,
    customer_id: "",
    tour_id: "",
    qty_adults: 1,
    qty_children: 0,
    total_amount: 0,
    status: "pending",
    payment_status: "unpaid",
  });

  // --- Lấy dữ liệu ---
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

  // --- Thêm booking ---
  const handleAdd = async () => {
    try {
      await adminApi.addBooking(form);
      setMessage("✅ Thêm đơn đặt thành công!");
      setOpenAdd(false);
      setForm({
        id: null,
        customer_id: "",
        tour_id: "",
        qty_adults: 1,
        qty_children: 0,
        total_amount: 0,
        status: "pending",
        payment_status: "unpaid",
      });
      fetchData();
    } catch (err) {
      setMessage("❌ Lỗi: " + (err.response?.data?.message || "Không thể thêm booking"));
    }
  };

  // --- Xóa booking ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa đơn đặt này?")) {
      await adminApi.deleteBooking(id);
      fetchData();
    }
  };

  // --- Mở popup xem chi tiết ---
  const openDetail = (b) => {
    setSelectedBooking({ ...b });
    setIsEditing(false);
  };

  // --- Cập nhật booking ---
  const handleSave = async () => {
    try {
      await adminApi.updateBooking(selectedBooking.id, selectedBooking);
      setMessage("✅ Cập nhật thành công!");
      setIsEditing(false);
      setSelectedBooking(null);
      fetchData();
    } catch {
      setMessage("❌ Lỗi khi cập nhật!");
    }
  };

  // --- Hàm tiện ích ---
  const formatPrice = (num) => num.toLocaleString("vi-VN") + " VND";

  const translateStatus = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    canceled: "Đã hủy",
  };

  const translatePayment = {
    unpaid: "Chưa thanh toán",
    paid: "Đã thanh toán",
    refund: "Hoàn tiền",
  };

  // --- Phân trang ---
  const paginatedBookings = bookings.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(bookings.length / rowsPerPage);

  return (
    <div style={{ padding: 30, fontFamily: "Arial" }}>
      <h2>Quản lý đơn đặt tour</h2>
      {message && <p>{message}</p>}

      {/* --- Nút thêm mới --- */}
      <Button variant="contained" color="primary" onClick={() => setOpenAdd(true)}>
        Thêm đơn đặt mới
      </Button>

      {/* --- Popup Thêm booking --- */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>➕ Thêm đơn đặt mới</DialogTitle>
        <DialogContent style={{ minWidth: 400 }}>
          <FormControl fullWidth margin="dense">
            <InputLabel>Khách hàng</InputLabel>
            <Select
              value={form.customer_id}
              onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
              required
            >
              {customers.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.full_name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Tour</InputLabel>
            <Select
              value={form.tour_id}
              onChange={(e) => setForm({ ...form, tour_id: e.target.value })}
              required
            >
              {tours.map((t) => (
                <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="Người lớn" type="number" fullWidth margin="dense" value={form.qty_adults}
            onChange={(e) => setForm({ ...form, qty_adults: e.target.value })} />
          <TextField label="Trẻ em" type="number" fullWidth margin="dense" value={form.qty_children}
            onChange={(e) => setForm({ ...form, qty_children: e.target.value })} />
          <TextField label="Tổng tiền (VND)" type="number" fullWidth margin="dense" value={form.total_amount}
            onChange={(e) => setForm({ ...form, total_amount: e.target.value })} />

          <FormControl fullWidth margin="dense">
            <InputLabel>Trạng thái</InputLabel>
            <Select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <MenuItem value="pending">Chờ xác nhận</MenuItem>
              <MenuItem value="confirmed">Đã xác nhận</MenuItem>
              <MenuItem value="canceled">Đã hủy</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Thanh toán</InputLabel>
            <Select value={form.payment_status} onChange={(e) => setForm({ ...form, payment_status: e.target.value })}>
              <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
              <MenuItem value="paid">Đã thanh toán</MenuItem>
              <MenuItem value="refund">Hoàn tiền</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Hủy</Button>
          <Button variant="contained" color="primary" onClick={handleAdd}>Thêm</Button>
        </DialogActions>
      </Dialog>

      {/* --- Popup xem chi tiết + edit --- */}
      {selectedBooking && (
        <Dialog open={!!selectedBooking} onClose={() => setSelectedBooking(null)} fullWidth maxWidth="sm">
          <DialogTitle>{isEditing ? "✏️ Cập nhật đơn đặt" : "👁️ Xem chi tiết đơn đặt"}</DialogTitle>
          <DialogContent dividers>
            {isEditing ? (
              <>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Khách hàng</InputLabel>
                  <Select
                    value={selectedBooking.customer_id}
                    onChange={(e) => setSelectedBooking({ ...selectedBooking, customer_id: e.target.value })}
                  >
                    {customers.map((c) => (
                      <MenuItem key={c.id} value={c.id}>{c.full_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="dense">
                  <InputLabel>Tour</InputLabel>
                  <Select
                    value={selectedBooking.tour_id}
                    onChange={(e) => setSelectedBooking({ ...selectedBooking, tour_id: e.target.value })}
                  >
                    {tours.map((t) => (
                      <MenuItem key={t.id} value={t.id}>{t.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label="Người lớn"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={selectedBooking.qty_adults}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, qty_adults: e.target.value })}
                />
                <TextField
                  label="Trẻ em"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={selectedBooking.qty_children}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, qty_children: e.target.value })}
                />
                <TextField
                  label="Tổng tiền (VND)"
                  type="number"
                  fullWidth
                  margin="dense"
                  value={selectedBooking.total_amount}
                  onChange={(e) => setSelectedBooking({ ...selectedBooking, total_amount: e.target.value })}
                />

                <FormControl fullWidth margin="dense">
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={selectedBooking.status}
                    onChange={(e) => setSelectedBooking({ ...selectedBooking, status: e.target.value })}
                  >
                    <MenuItem value="pending">Chờ xác nhận</MenuItem>
                    <MenuItem value="confirmed">Đã xác nhận</MenuItem>
                    <MenuItem value="canceled">Đã hủy</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="dense">
                  <InputLabel>Thanh toán</InputLabel>
                  <Select
                    value={selectedBooking.payment_status}
                    onChange={(e) => setSelectedBooking({ ...selectedBooking, payment_status: e.target.value })}
                  >
                    <MenuItem value="unpaid">Chưa thanh toán</MenuItem>
                    <MenuItem value="paid">Đã thanh toán</MenuItem>
                    <MenuItem value="refund">Hoàn tiền</MenuItem>
                  </Select>
                </FormControl>
              </>
            ) : (
              <>
                <Typography><strong>ID:</strong> {selectedBooking.id}</Typography>
                <Typography><strong>Khách hàng:</strong> {customers.find(c => c.id === selectedBooking.customer_id)?.full_name || "—"}</Typography>
                <Typography><strong>Tour:</strong> {tours.find(t => t.id === selectedBooking.tour_id)?.title || "—"}</Typography>
                <Typography><strong>Người lớn:</strong> {selectedBooking.qty_adults}</Typography>
                <Typography><strong>Trẻ em:</strong> {selectedBooking.qty_children}</Typography>
                <Typography><strong>Tổng tiền:</strong> {formatPrice(selectedBooking.total_amount)}</Typography>
                <Typography><strong>Trạng thái:</strong> {translateStatus[selectedBooking.status]}</Typography>
                <Typography><strong>Thanh toán:</strong> {translatePayment[selectedBooking.payment_status]}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)}>Quay lại</Button>
                <Button variant="contained" color="primary" onClick={handleSave}>Lưu</Button>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>Cập nhật</Button>
            )}
          </DialogActions>
        </Dialog>
      )}

      {/* --- Bảng danh sách --- */}
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginTop: 20 }}>
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
          {paginatedBookings.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{customers.find(c => c.id === b.customer_id)?.full_name || "—"}</td>
              <td>{tours.find(t => t.id === b.tour_id)?.title || "—"}</td>
              <td>{b.qty_adults}</td>
              <td>{b.qty_children}</td>
              <td>{formatPrice(b.total_amount)}</td>
              <td>{translateStatus[b.status]}</td>
              <td>{translatePayment[b.payment_status]}</td>
              <td>
                <Button size="small" onClick={() => openDetail(b)}>👁️</Button>
                <Button size="small" color="error" onClick={() => handleDelete(b.id)}>🗑️</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Phân trang --- */}
      <div style={{ marginTop: 10 }}>
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>« Trước</Button>
        <span style={{ margin: "0 10px" }}>{page} / {totalPages}</span>
        <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Tiếp »</Button>
      </div>
    </div>
  );
}
