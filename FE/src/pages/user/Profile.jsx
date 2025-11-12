import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const navigate = useNavigate();

  // 🔹 Lấy profile
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
      .catch((err) => setError(err.response?.data?.message || "Không thể tải hồ sơ"));
  }, [navigate]);

  // 🔹 Hàm cập nhật hồ sơ
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) return setError("Vui lòng đăng nhập lại!");

    try {
      const res = await axios.put(
        "http://localhost:8088/api/auth/profile",
        {
          full_name: profile.full_name,
          phone: profile.phone,
          gender: profile.gender,
          address: profile.address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Cập nhật hồ sơ thành công!");
      setEditMode(false);
      setProfile(res.data);
    } catch (err) {
      setError("❌ " + (err.response?.data?.message || "Cập nhật thất bại"));
    }
  };

  // 🔹 Hàm đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (passwords.newPass !== passwords.confirm)
      return setError("❌ Mật khẩu xác nhận không khớp!");

    const token = localStorage.getItem("token");
    if (!token) return setError("Vui lòng đăng nhập lại!");

    try {
      await axios.put(
        "http://localhost:8088/api/auth/change-password",
        {
          currentPassword: passwords.current,
          newPassword: passwords.newPass,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("✅ Đổi mật khẩu thành công!");
      setPasswords({ current: "", newPass: "", confirm: "" });
      setChangePasswordMode(false);
    } catch (err) {
      setError("❌ " + (err.response?.data?.message || "Đổi mật khẩu thất bại"));
    }
  };

  if (error && !profile) return <Alert severity="error">{error}</Alert>;
  if (!profile)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

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
        maxWidth="sm"
        sx={{ p: 4, bgcolor: "white", borderRadius: 3, boxShadow: 2 }}
      >
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Hồ sơ cá nhân
        </Typography>

        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* --- Chế độ xem hồ sơ --- */}
        {!editMode && !changePasswordMode && (
          <>
            <Typography>
              <b>Email:</b> {profile.email}
            </Typography>
            <Typography>
              <b>Họ tên:</b> {profile.full_name || "Chưa cập nhật"}
            </Typography>
            <Typography>
              <b>Số điện thoại:</b> {profile.phone || "Chưa cập nhật"}
            </Typography>
            <Typography>
              <b>Giới tính:</b>{" "}
              {profile.gender === "male"
                ? "Nam"
                : profile.gender === "female"
                ? "Nữ"
                : "Khác"}
            </Typography>
            <Typography>
              <b>Địa chỉ:</b> {profile.address || "Chưa cập nhật"}
            </Typography>
            <Typography>
              <b>Vai trò:</b> {profile.role_id === 1 ? "Admin" : "Khách hàng"}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => setEditMode(true)}
              >
                Cập nhật hồ sơ
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => setChangePasswordMode(true)}
              >
                Đổi mật khẩu
              </Button>
            </Box>
          </>
        )}

        {/* --- Chế độ cập nhật hồ sơ --- */}
        {editMode && (
          <Box component="form" onSubmit={handleUpdate}>
            <TextField
              label="Họ tên"
              value={profile.full_name || ""}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Số điện thoại"
              value={profile.phone || ""}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Giới tính"
              value={profile.gender || "other"}
              onChange={(e) =>
                setProfile({ ...profile, gender: e.target.value })
              }
              fullWidth
              margin="normal"
            >
              <MenuItem value="male">Nam</MenuItem>
              <MenuItem value="female">Nữ</MenuItem>
              <MenuItem value="other">Khác</MenuItem>
            </TextField>
            <TextField
              label="Địa chỉ"
              value={profile.address || ""}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button type="submit" variant="contained" color="success" fullWidth>
                Lưu thay đổi
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => setEditMode(false)}
              >
                Hủy
              </Button>
            </Box>
          </Box>
        )}

        {/* --- Chế độ đổi mật khẩu --- */}
        {changePasswordMode && (
          <Box component="form" onSubmit={handleChangePassword}>
            <TextField
              label="Mật khẩu hiện tại"
              type="password"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Mật khẩu mới"
              type="password"
              value={passwords.newPass}
              onChange={(e) =>
                setPasswords({ ...passwords, newPass: e.target.value })
              }
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              fullWidth
              margin="normal"
              required
            />

            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                fullWidth
              >
                Xác nhận đổi mật khẩu
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => setChangePasswordMode(false)}
              >
                Hủy
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
