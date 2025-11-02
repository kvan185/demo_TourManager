import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import HeaderUser from "../../components/HeaderUser";
import FooterUser from "../../components/FooterUser";
import userApi from "../../api/userApi";

export default function BookingForm() {
  const { id } = useParams(); // id tour
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [form, setForm] = useState({
    qty_adults: 1,
    qty_children: 0,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    userApi.getTourDetail(id).then((res) => setTour(res.data));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const total =
        tour.price * form.qty_adults + tour.price * 0.6 * form.qty_children;

      await userApi.createBooking({
        tour_id: tour.id,
        qty_adults: parseInt(form.qty_adults),
        qty_children: parseInt(form.qty_children),
        total_amount: total,
      });

      setSuccess("✅ Đặt tour thành công!");
      setTimeout(() => navigate("/my-bookings"), 1500);
    } catch (err) {
      setError("❌ Không thể đặt tour. Vui lòng đăng nhập hoặc thử lại sau!");
    }
  };

  if (!tour) return <p>Đang tải thông tin tour...</p>;

  return (
    <>
      <HeaderUser />
      <Container sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 600, margin: "0 auto" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom align="center">
            🧳 Đặt tour: {tour.title}
          </Typography>

          {success && <Alert severity="success">{success}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Số người lớn"
              name="qty_adults"
              type="number"
              value={form.qty_adults}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: 1 }}
            />
            <TextField
              label="Số trẻ em"
              name="qty_children"
              type="number"
              value={form.qty_children}
              onChange={handleChange}
              fullWidth
              margin="normal"
              inputProps={{ min: 0 }}
            />

            <Typography sx={{ mt: 2 }}>
              💰 Giá người lớn: {tour.price.toLocaleString()} VNĐ
            </Typography>
            <Typography>
              👶 Trẻ em: {Math.round(tour.price * 0.6).toLocaleString()} VNĐ
            </Typography>
            <Typography fontWeight="bold" sx={{ mt: 2 }}>
              Tổng tạm tính:{" "}
              {(
                tour.price * form.qty_adults +
                tour.price * 0.6 * form.qty_children
              ).toLocaleString()}{" "}
              VNĐ
            </Typography>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 3, py: 1.3 }}
            >
              Xác nhận đặt tour
            </Button>
          </Box>
        </Paper>
      </Container>
      <FooterUser />
    </>
  );
}
