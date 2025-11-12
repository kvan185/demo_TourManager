import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8088/api/auth/forgot-password", { email });
      setMessage(res.data.message || "Đã gửi email đặt lại mật khẩu!");
      setLoading(false);

      // Optional: chuyển về login sau 3s
      setTimeout(() => navigate("/login"), 5173);
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi gửi email");
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
          Quên mật khẩu
        </Typography>

        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {loading ? "Đang gửi..." : "Gửi email đặt lại mật khẩu"}
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
