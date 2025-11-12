import React, { useEffect, useState } from "react";
import tourApi from "../../api/tourApi";
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";

export default function HomePage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await tourApi.getAll();
        setTours(res.data.data || []);
      } catch (err) {
        setError("Không thể tải danh sách tour. Vui lòng thử lại sau!");
        console.error("Lỗi tải tour:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center", mb: 4 }}
      >
        🌍 Khám phá các tour du lịch nổi bật
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      ) : tours.length === 0 ? (
        <Typography textAlign="center" color="text.secondary">
          Hiện chưa có tour nào được đăng.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {tours.map((tour) => (
            <Grid item xs={12} sm={6} md={4} key={tour.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 4,
                  borderRadius: 3,
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  // ✅ Lấy ảnh từ backend qua src đầy đủ
                  src={
                    tour.main_image
                      ? `http://localhost:8088/${tour.main_image}`
                      : "/no-image.jpg"
                  }
                  alt={tour.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {tour.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                    }}
                  >
                    {tour.short_description || "Chưa có mô tả."}
                  </Typography>
                  <Typography mt={2} fontWeight="bold" color="primary.main">
                    💰 {tour.price.toLocaleString()} VNĐ
                  </Typography>
                  <Typography color="text.secondary">
                    ⏱ {tour.duration_days} ngày — 📍{" "}
                    {tour.location_name || "Không rõ"}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    href={`/tour/${tour.id}`}
                  >
                    Xem chi tiết
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
