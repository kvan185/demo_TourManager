import React from "react";
import { Container, Typography, Grid, Box, Paper } from "@mui/material";
import FooterUser from "../../components/footer/FooterUser";

export default function About() {
  return (
    <>
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          🌴 Giới thiệu về TravelBooking
        </Typography>

        <Typography
          variant="subtitle1"
          color="text.secondary"
          align="center"
          sx={{ mb: 4 }}
        >
          Mang đến cho bạn những hành trình đáng nhớ và trải nghiệm tuyệt vời.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <img
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
              alt="Travel"
              style={{
                width: "100%",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography paragraph>
              TravelBooking là nền tảng đặt tour du lịch trong và ngoài nước,
              giúp bạn dễ dàng tìm kiếm, so sánh và lựa chọn những chuyến đi
              phù hợp nhất với nhu cầu.
            </Typography>
            <Typography paragraph>
              Với đội ngũ tư vấn chuyên nghiệp, hệ thống thanh toán an toàn và
              dịch vụ chăm sóc khách hàng tận tâm, chúng tôi cam kết mang đến
              cho bạn trải nghiệm du lịch trọn vẹn, tiện lợi và đáng nhớ nhất.
            </Typography>
            <Typography paragraph>
              Hãy cùng chúng tôi khám phá những địa điểm tuyệt vời — từ biển
              xanh, rừng núi hùng vĩ cho đến thành phố sôi động.
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Paper elevation={2} sx={{ p: 3, maxWidth: 600, margin: "0 auto" }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tầm nhìn của chúng tôi
            </Typography>
            <Typography color="text.secondary">
              “Trở thành nền tảng đặt tour hàng đầu Việt Nam — kết nối con người
              với thiên nhiên và văn hóa khắp nơi.”
            </Typography>
          </Paper>
        </Box>
      </Container>
      <FooterUser />
    </>
  );
}
