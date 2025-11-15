import express from "express";
import { body } from "express-validator";
import { verifyToken } from "../middlewares/authMiddleware.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// AUTH
router.post("/login", authController.login);

router.post(
  "/register",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("full_name").notEmpty(),
  ],
  authController.register
);

// PROFILE
router.get("/profile", verifyToken, authController.getProfile);
router.put("/profile", verifyToken, authController.updateProfile);

// PASSWORD
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.put("/change-password", verifyToken, authController.changePassword);

// BOOKINGS
router.get("/my-booking", verifyToken, authController.getMyBookings);
router.put("/booking/:id/cancel", verifyToken, authController.cancelBooking);

export default router;
