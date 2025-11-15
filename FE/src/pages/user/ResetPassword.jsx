import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy token từ query string ?token=xxxx
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) return setError("Token không hợp lệ");
    if (newPassword !== confirmPassword) return setError("Mật khẩu xác nhận không khớp");

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8088/api/auth/reset-password", {
        token,
        newPassword,
      });
      setMessage(res.data.message || "Đổi mật khẩu thành công!");
      setLoading(false);

      // Chuyển về login sau 2s
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Đổi mật khẩu thất bại");
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Container
        maxWidth="xs"
        sx={{ p: 4, bgcolor: "white", borderRadius: 3, boxShadow: 2 }}
      >
        <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
          Đặt lại mật khẩu
        </Typography>

        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Mật khẩu mới"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
          />
          <TextField
            label="Xác nhận mật khẩu mới"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            sx={{ mt: 2, py: 1.2 }}
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
          </Button>
        </Box>

        <Typography align="center" sx={{ mt: 2 }}>
          <Button onClick={() => navigate("/login")} sx={{ textTransform: "none" }}>
            Quay lại đăng nhập
          </Button>
        </Typography>
      </Container>
    </Box>
  );
}
