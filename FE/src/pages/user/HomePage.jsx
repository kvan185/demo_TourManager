import React, { useEffect, useState } from "react";
import tourApi from "../../api/tourApi";
import TourCard from "../../components/TourCard";
import { Container, Grid, Typography, Box, CircularProgress } from "@mui/material";

export default function HomePage() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await tourApi.getAll();
        setTours(res.data.data || []); // ✅ Lấy đúng mảng data
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
    <Container sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", textAlign: "center", mb: 3 }}
      >
        🌍 Danh sách Tour Du Lịch
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
              <TourCard tour={tour} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
