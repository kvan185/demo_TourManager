import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import authApi from "../../api/authApi";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await authApi.register({ email, password, full_name: name, role: 2 });
      setMessage("✅ Đăng ký thành công! Chuyển đến đăng nhập...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("❌ " + (err.response?.data?.message || "Không thể đăng ký"));
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Typography variant="h5" align="center" gutterBottom fontWeight="bold">
        Đăng ký tài khoản
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleRegister}>
        <TextField
          label="Họ tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
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
          color="success"
          fullWidth
          sx={{ mt: 2, py: 1.2 }}
        >
          Đăng ký
        </Button>
      </Box>

      <Typography align="center" sx={{ mt: 2 }}>
        Đã có tài khoản?{" "}
        <Link to="/login" style={{ textDecoration: "none", color: "#007bff" }}>
          Đăng nhập
        </Link>
      </Typography>
    </Container>
  );
}
