import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import FooterUser from "../../components/footer/FooterUser";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Hàm dịch trạng thái sang tiếng Việt
  const translateStatus = (status) => {
    switch (status) {
      case "pending":
        return "⏳ Chờ xác nhận";
      case "confirmed":
        return "✅ Đã xác nhận";
      case "cancelled":
        return "❌ Đã hủy";
      case "completed":
        return "🏁 Hoàn thành";
      default:
        return status;
    }
  };

  // ✅ Hàm format tiền VND
  const formatVND = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8088/api/auth/my-booking", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBookings(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Không thể tải danh sách tour");
        setLoading(false);
      });
  }, [navigate]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Bạn có chắc muốn hủy tour này không?")) return;

    try {
      await axios.put(
        `http://localhost:8088/api/auth/booking/${bookingId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMessage("✅ Hủy tour thành công!");
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      setMessage("❌ Hủy tour thất bại!");
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Container sx={{ py: 6, minHeight: "70vh" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          🧾 Danh sách tour đã đặt
        </Typography>

        {message && (
          <Alert
            severity={message.startsWith("✅") ? "success" : "error"}
            sx={{ mb: 2 }}
          >
            {message}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : bookings.length === 0 ? (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            Bạn chưa đặt tour nào.
          </Typography>
        ) : (
          <Paper sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f5f5f5" }}>
                  <TableCell>ID</TableCell>
                  <TableCell>Tên tour</TableCell>
                  <TableCell>Người lớn</TableCell>
                  <TableCell>Trẻ em</TableCell>
                  <TableCell>Tổng tiền</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.id}</TableCell>
                    <TableCell>{b.tour_title || "Tour #" + b.tour_id}</TableCell>
                    <TableCell>{b.qty_adults}</TableCell>
                    <TableCell>{b.qty_children}</TableCell>
                    <TableCell>{formatVND(b.total_amount)}</TableCell>
                    <TableCell>{translateStatus(b.status)}</TableCell>
                    <TableCell>
                      {b.status === "cancelled" ? (
                        <Typography color="text.secondary">Đã hủy</Typography>
                      ) : (
                        <Button
                          color="error"
                          onClick={() => handleCancel(b.id)}
                          size="small"
                        >
                          Hủy
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}
      </Container>

      <FooterUser />
    </>
  );
}

export default MyBookings;
