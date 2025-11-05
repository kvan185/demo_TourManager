import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Paper,
  Grid,
  Alert,
  Collapse,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import FooterUser from "../../components/footer/FooterUser";
import adminApi from "../../api/adminApi";
import axios from "axios";

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tour, setTour] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [guides, setGuides] = useState([]);
  const [services, setServices] = useState([]);
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showServices, setShowServices] = useState(false);

  const API_URL = "http://localhost:8088/api/tours";

  useEffect(() => {
    const fetchTourDetail = async () => {
      try {
        // 🧭 Lấy chi tiết tour
        const res = await axios.get(`${API_URL}/${id}/detail`);
        const data = res.data;

        setTour(data.tour);
        setSchedules(data.schedules || []);
        setGuides(data.guides || []);
        setServices(data.services || []);

        // 🖼️ Lấy ảnh theo cách của TourManager
        const imgsRes = await adminApi.getTourImages(id);
        setImages(imgsRes.data || []);
      } catch (err) {
        console.error("❌ Lỗi khi tải chi tiết tour:", err);
        setError("Không thể tải thông tin tour");
      } finally {
        setLoading(false);
      }
    };

    fetchTourDetail();
  }, [id]);

  const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value || 0);

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

  if (!tour) return null;

  return (
    <>
      <Container sx={{ py: 6 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {tour.title}
          </Typography>

          {/* 🖼️ Ảnh tour (đọc từ API giống TourManager) */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {images?.length > 0 ? (
              images.map((img) => (
                <Grid item xs={12} md={4} key={img.id}>
                  <img
                    src={`http://localhost:8088/${img.img_url}`}
                    alt={img.alt_text || "Tour image"}
                    style={{
                      width: "100%",
                      height: "250px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                  alt="default"
                  style={{
                    width: "100%",
                    height: "300px",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              </Grid>
            )}
          </Grid>

          {/* 🧾 Thông tin tour */}
          <Typography paragraph>
            <strong>Giá:</strong>{" "}
            <span style={{ color: "#1976d2", fontWeight: "bold" }}>
              {formatVND(tour.price)}
            </span>
          </Typography>
          <Typography paragraph>
            <strong>Thời lượng:</strong> {tour.duration_days} ngày
          </Typography>
          <Typography paragraph>
            <strong>Địa điểm:</strong> {tour.main_location_name || "Chưa rõ"}
          </Typography>
          <Typography paragraph>
            <strong>Mô tả:</strong> {tour.short_description || "Chưa có mô tả"}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, mr: 2 }}
            onClick={() => navigate(`/book/${tour.id}`)}
          >
            Đặt tour ngay
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            sx={{ mt: 2 }}
            onClick={() => setShowServices(!showServices)}
          >
            {showServices ? "Ẩn phương tiện" : "🚍 Phương tiện & Dịch vụ"}
          </Button>

          {/* 🚍 Dịch vụ & Phương tiện */}
          <Collapse in={showServices} sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              🚍 Dịch vụ & Phương tiện
            </Typography>
            <Grid container spacing={2}>
              {services?.length > 0 ? (
                services.map((sv) => (
                  <Grid item xs={12} md={4} key={sv.id}>
                    <Card sx={{ height: "100%" }}>
                      {sv.img_url && (
                        <CardMedia
                          component="img"
                          height="160"
                          image={`http://localhost:8088/${sv.img_url}`}
                          alt={sv.name}
                        />
                      )}
                      <CardContent>
                        <Typography variant="h6">{sv.name}</Typography>
                        <Typography color="text.secondary">
                          Loại: {sv.type}
                        </Typography>
                        <Typography color="text.secondary">
                          Nhà cung cấp: {sv.provider}
                        </Typography>
                        <Typography color="text.primary" sx={{ mt: 1 }}>
                          Giá: {formatVND(sv.price)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography color="text.secondary" sx={{ ml: 2 }}>
                  Không có dịch vụ kèm theo.
                </Typography>
              )}
            </Grid>
          </Collapse>

          {/* 🗓️ Lịch khởi hành */}
          <Box sx={{ mt: 5 }}>
            <Typography variant="h6" gutterBottom>
              🗓️ Lịch khởi hành
            </Typography>
            {schedules.length === 0 ? (
              <Typography color="text.secondary">
                Chưa có lịch khởi hành nào.
              </Typography>
            ) : (
              schedules.map((sc) => (
                <Box
                  key={sc.id}
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    p: 2,
                    mb: 2,
                  }}
                >
                  <Typography>
                    📅 {sc.start_date} → {sc.end_date}
                  </Typography>
                  <Typography>
                    💺 {sc.seats_booked}/{sc.seats_total} chỗ | Giá:{" "}
                    {formatVND(sc.price_per_person)}
                  </Typography>
                  <Typography>Trạng thái: {sc.status}</Typography>
                </Box>
              ))
            )}
          </Box>

          {/* 🧑‍🏫 Hướng dẫn viên */}
          <Box sx={{ mt: 5 }}>
            <Typography variant="h6" gutterBottom>
              🧑‍🏫 Hướng dẫn viên
            </Typography>
            {guides.length === 0 ? (
              <Typography color="text.secondary">
                Chưa có hướng dẫn viên.
              </Typography>
            ) : (
              guides.map((g, i) => (
                <Typography key={i}>
                  👤 {g.full_name} ({g.phone}) — {g.role}
                </Typography>
              ))
            )}
          </Box>
        </Paper>
      </Container>
      <FooterUser />
    </>
  );
}
