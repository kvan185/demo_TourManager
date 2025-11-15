import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import adminApi from "../../api/adminApi";

export default function PaymentManager() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Popup xem chi tiết / edit
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Popup thêm
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [form, setForm] = useState({
    booking_id: "",
    amount: "",
    method: "cash",
    status: "pending",
  });

  // --- Phân trang FE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(payments.length / itemsPerPage);

  // Lấy danh sách payment
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await adminApi.getPayments();
      setPayments(res.data);
    } catch (err) {
      console.error(err);
      setError("Lỗi lấy danh sách payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // --- Thêm payment ---
  const handleAdd = async () => {
    try {
      await adminApi.addPayment(form);
      setForm({ booking_id: "", amount: "", method: "cash", status: "pending" });
      setOpenAddDialog(false);
      fetchPayments();
    } catch (err) {
      console.error(err);
      setError("Lỗi khi thêm payment");
    }
  };

  // --- Cập nhật payment ---
  const handleSave = async () => {
    try {
      await adminApi.updatePayment(selectedPayment.id, selectedPayment);
      setIsEditing(false);
      setSelectedPayment(null);
      fetchPayments();
    } catch (err) {
      console.error(err);
      setError("Lỗi khi cập nhật payment");
    }
  };

  // --- Xóa payment ---
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa payment này?")) return;
    try {
      await adminApi.deletePayment(id);
      fetchPayments();
    } catch (err) {
      console.error(err);
      setError("Lỗi khi xóa payment");
    }
  };

  // Mở popup chi tiết
  const openDetail = (p) => {
    setSelectedPayment(p);
    setIsEditing(false);
  };

  // --- Utils ---
  const formatCurrency = (num) => {
    return Number(num).toLocaleString("vi-VN");
  };

  const translateMethod = (method) => {
    switch (method) {
      case "cash":
        return "Tiền mặt";
      case "card":
        return "Thẻ";
      case "bank":
        return "Chuyển khoản";
      default:
        return method;
    }
  };

  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return "Đang chờ";
      case "completed":
        return "Hoàn tất";
      case "canceled":
        return "Hủy";
      default:
        return status;
    }
  };

  // --- Lọc dữ liệu phân trang ---
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPayments = payments.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <CircularProgress />;

  return (
    <Container sx={{ padding: "30px" }}>
      <Typography variant="h4" gutterBottom>
      Quản lý phương thức thanh toán
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => setOpenAddDialog(true)}
      >
        Thêm Payment
      </Button>

      {/* Bảng danh sách */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Booking ID</TableCell>
            <TableCell>Số tiền</TableCell>
            <TableCell>Phương thức</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Hành động</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPayments.map((p) => (
            <TableRow key={p.id}>
              <TableCell>{p.id}</TableCell>
              <TableCell>{p.booking_id}</TableCell>
              <TableCell>{formatCurrency(p.amount)}</TableCell>
              <TableCell>{translateMethod(p.method)}</TableCell>
              <TableCell>{translateStatus(p.status)}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => openDetail(p)}>
                  👁️ Xem
                </Button>
                <Button size="small" color="error" onClick={() => handleDelete(p.id)}>
                  🗑️ Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </Button>
        {[...Array(totalPages)].map((_, i) => (
          <Button
            key={i}
            variant={currentPage === i + 1 ? "contained" : "outlined"}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outlined"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </Stack>

      {/* Popup thêm mới */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
        <DialogTitle>Thêm Payment</DialogTitle>
        <DialogContent>
          <TextField
            label="Booking ID"
            type="number"
            value={form.booking_id}
            onChange={(e) => setForm({ ...form, booking_id: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Số tiền"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Phương thức"
            value={form.method}
            onChange={(e) => setForm({ ...form, method: e.target.value })}
            fullWidth
            margin="normal"
          >
            <MenuItem value="cash">Tiền mặt</MenuItem>
            <MenuItem value="card">Thẻ</MenuItem>
            <MenuItem value="bank">Chuyển khoản</MenuItem>
          </TextField>
          <TextField
            select
            label="Trạng thái"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            fullWidth
            margin="normal"
          >
            <MenuItem value="pending">Đang chờ</MenuItem>
            <MenuItem value="completed">Hoàn tất</MenuItem>
            <MenuItem value="canceled">Hủy</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddDialog(false)}>Hủy</Button>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popup xem chi tiết / edit */}
      {selectedPayment && (
        <Dialog
          open={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {isEditing ? "✏️ Cập nhật Payment" : "👁️ Xem chi tiết Payment"}
          </DialogTitle>
          <DialogContent dividers>
            {isEditing ? (
              <>
                <TextField
                  label="Booking ID"
                  type="number"
                  value={selectedPayment.booking_id}
                  onChange={(e) =>
                    setSelectedPayment({ ...selectedPayment, booking_id: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Số tiền"
                  type="number"
                  value={selectedPayment.amount}
                  onChange={(e) =>
                    setSelectedPayment({ ...selectedPayment, amount: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                />
                <TextField
                  select
                  label="Phương thức"
                  value={selectedPayment.method}
                  onChange={(e) =>
                    setSelectedPayment({ ...selectedPayment, method: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="cash">Tiền mặt</MenuItem>
                  <MenuItem value="card">Thẻ</MenuItem>
                  <MenuItem value="bank">Chuyển khoản</MenuItem>
                </TextField>
                <TextField
                  select
                  label="Trạng thái"
                  value={selectedPayment.status}
                  onChange={(e) =>
                    setSelectedPayment({ ...selectedPayment, status: e.target.value })
                  }
                  fullWidth
                  margin="normal"
                >
                  <MenuItem value="pending">Đang chờ</MenuItem>
                  <MenuItem value="completed">Hoàn tất</MenuItem>
                  <MenuItem value="canceled">Hủy</MenuItem>
                </TextField>
              </>
            ) : (
              <>
                <Typography><strong>ID:</strong> {selectedPayment.id}</Typography>
                <Typography><strong>Booking ID:</strong> {selectedPayment.booking_id}</Typography>
                <Typography><strong>Số tiền:</strong> {formatCurrency(selectedPayment.amount)}</Typography>
                <Typography><strong>Phương thức:</strong> {translateMethod(selectedPayment.method)}</Typography>
                <Typography><strong>Trạng thái:</strong> {translateStatus(selectedPayment.status)}</Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)}>Quay lại</Button>
                <Button variant="contained" color="success" onClick={handleSave}>
                  Lưu
                </Button>
              </>
            ) : (
              <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
                Cập nhật
              </Button>
            )}
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
}
