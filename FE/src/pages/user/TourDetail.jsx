import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Alert,
} from "@mui/material";
import HeaderUser from "../../components/header/HeaderUser";
import FooterUser from "../../components/footer/FooterUser";
import userApi from "../../api/userApi";

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const res = await userApi.getTourDetail(id);
        setTour(res.data);
      } catch (err) {
        setError("Không thể tải thông tin tour. Vui lòng thử lại sau!");
        console.error("Lỗi tải tour:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTour();
  }, [id]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Container sx={{ mt: 6 }}>
        <Alert severity="error" sx={{ textAlign: "center" }}>
          {error}
        </Alert>
      </Container>
    );

  if (!tour)
    return (
      <Container sx={{ mt: 6 }}>
        <Typography color="text.secondary" align="center">
          Không tìm thấy tour này.
        </Typography>
      </Container>
    );

  return (
    <>
      <HeaderUser />
      <Container sx={{ py: 6 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {tour.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Mã tour: {tour.code || "Không có"} | Thời gian: {tour.duration_days} ngày
          </Typography>

          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={6}>
              <img
                src={
                  tour.image_url ||
                  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                }
                alt={tour.title}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  objectFit: "cover",
                  maxHeight: 380,
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography paragraph>
                <strong>Giá tour:</strong>{" "}
                <span style={{ color: "#1976d2", fontWeight: "bold" }}>
                  {tour.price?.toLocaleString()} VNĐ
                </span>
              </Typography>
              <Typography paragraph>
                <strong>Địa điểm chính:</strong> {tour.main_location_name || "Chưa xác định"}
              </Typography>
              <Typography paragraph>
                <strong>Mô tả ngắn:</strong> {tour.short_description || "Chưa có mô tả"}
              </Typography>
              <Typography paragraph>
                <strong>Trạng thái:</strong>{" "}
                {tour.status === "active" ? "Đang mở đặt" : "Tạm dừng"}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 3, py: 1.3 }}
                onClick={() => navigate(`/book/${tour.id}`)}
              >
                Đặt tour ngay
              </Button>
            </Grid>
          </Grid>

          {tour.description && (
            <Box sx={{ mt: 5 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📋 Chi tiết hành trình
              </Typography>
              <Typography color="text.secondary">{tour.description}</Typography>
            </Box>
          )}
        </Paper>
      </Container>
      <FooterUser />
    </>
  );
}
