import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import HeaderPublic from "../header/HeaderPublic";
import HeaderUser from "../header/HeaderUser";
import { Box, Container, Typography } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";

export default function UserLayout() {
  const { token } = useContext(AuthContext);

  return (
    <div>
      {/* Header động */}
      {token ? <HeaderUser /> : <HeaderPublic />}

      {/* Nội dung chính */}
      <Container sx={{ py: 4 }}>
        <Outlet />
      </Container>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: "#f4f4f4",
          py: 3,
          textAlign: "center",
          mt: 4,
          borderTop: "1px solid #ddd",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2025 TravelBooking. All rights reserved.
        </Typography>
      </Box>
    </div>
  );
}
