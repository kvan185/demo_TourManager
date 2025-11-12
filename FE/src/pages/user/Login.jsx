import React, { useState, useContext } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import authApi from "../../api/authApi";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await authApi.login({ email, password });
      const user = res.data.user;
      const token = res.data.token;

      login(token);
      localStorage.setItem("user", JSON.stringify(user));

      setMessage("✅ Đăng nhập thành công!");
      setLoading(false);

      setTimeout(() => {
        if (user.role === "customer") navigate("/");
        else navigate("/admin/tours");
      }, 500);
    } catch (err) {
      console.error("❌ Lỗi đăng nhập:", err);
      setError(err.response?.data?.message || "❌ Sai email hoặc mật khẩu!");
      setLoading(false);
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
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </Box>

      {/* --- Links: quên mật khẩu & đăng ký --- */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Link to="/forgot-password" style={{ textDecoration: "none", color: "#007bff" }}>
          Quên mật khẩu?
        </Link>
        <Link to="/register" style={{ textDecoration: "none", color: "#007bff" }}>
          Chưa có tài khoản? Đăng ký
        </Link>
      </Box>
    </Container>
  );
}
