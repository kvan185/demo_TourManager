import express from "express";
import {
  getAllBookings,
  getBookingById,
  addBooking,
  updateBooking,
  deleteBooking
} from "../../controllers/admin/bookingController.js";

const router = express.Router();

router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.post("/add-booking", addBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;
