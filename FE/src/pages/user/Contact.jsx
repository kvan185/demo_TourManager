import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Alert,
} from "@mui/material";
import FooterUser from "../../components/footer/FooterUser";
import userApi from "../../api/userApi";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      await userApi.sendContact(form);
      setSuccess("✅ Gửi liên hệ thành công! Chúng tôi sẽ phản hồi sớm nhất.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError("❌ Không thể gửi liên hệ. Vui lòng thử lại sau!");
    }
  };

  return (
    <>
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          📞 Liên hệ với TravelBooking
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Hãy để lại lời nhắn — chúng tôi luôn sẵn sàng hỗ trợ bạn.
        </Typography>

        <Grid container spacing={4}>
          {/* Form liên hệ */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              {success && <Alert severity="success">{success}</Alert>}
              {error && <Alert severity="error">{error}</Alert>}

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Họ tên"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                />
                <TextField
                  label="Nội dung"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  required
                  multiline
                  rows={4}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2, py: 1.2 }}
                >
                  Gửi liên hệ
                </Button>
              </form>
            </Paper>
          </Grid>

          {/* Thông tin công ty */}
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 4, height: "100%" }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Thông tin liên hệ
              </Typography>
              <Typography>🏢 Địa chỉ: 123 Đường Trải Nghiệm, Quận 1, TP.HCM</Typography>
              <Typography>📞 Hotline: 0123 456 789</Typography>
              <Typography>✉️ Email: support@travelbooking.vn</Typography>
              <Typography sx={{ mt: 2 }}>
                ⏰ Giờ làm việc: 8:00 - 17:00 (T2 - T7)
              </Typography>
              <Typography sx={{ mt: 3 }} color="text.secondary">
                Theo dõi chúng tôi trên mạng xã hội để nhận ưu đãi mới nhất!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <FooterUser />
    </>
  );
}
