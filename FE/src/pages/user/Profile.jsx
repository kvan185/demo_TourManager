import React, { useEffect, useState } from "react";
import { Container, Typography, Box, CircularProgress, Alert, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:8088/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load profile"));
  }, [navigate]);

  if (error) return <Alert severity="error">{error}</Alert>;
  if (!profile) return <CircularProgress />;

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Hồ sơ cá nhân
        </Typography>
        <Typography>Email: {profile.email}</Typography>
        <Typography>Họ tên: {profile.full_name || "Chưa cập nhật"}</Typography>
        <Typography>Số điện thoại: {profile.phone || "Chưa cập nhật"}</Typography>
        <Typography>Địa chỉ: {profile.address || "Chưa cập nhật"}</Typography>
        <Typography>Vai trò: {profile.role_id === 1 ? "Admin" : "Khách hàng"}</Typography>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate("/")}>
          Quay lại trang chủ
        </Button>
      </Box>
    </Container>
  );
}

export default Profile;
