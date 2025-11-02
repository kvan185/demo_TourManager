import React, { useState, useContext } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import authApi from "../../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext"; // 🔹 import thêm

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // 🔹 lấy hàm login từ context

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await authApi.login({ email, password });
      const user = res.data.user;
      const token = res.data.token;

      // 🔹 Cập nhật AuthContext để header đổi ngay
      login(token);

      // 🔹 Lưu thêm user nếu cần
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("✅ Đăng nhập thành công!");

      setTimeout(() => {
        if (user.role === "customer") navigate("/");
        else navigate("/admin/tours");
      }, 500);
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      setError("❌ Sai email hoặc mật khẩu!");
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
        Đăng nhập tài khoản
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, py: 1.2 }}
        >
          Đăng nhập
        </Button>
      </Box>

      <Typography align="center" sx={{ mt: 2 }}>
        Chưa có tài khoản?{" "}
        <Link to="/register" style={{ textDecoration: "none", color: "#007bff" }}>
          Đăng ký ngay
        </Link>
      </Typography>
    </Container>
  );
}
