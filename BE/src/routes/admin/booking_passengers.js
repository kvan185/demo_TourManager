import express from "express";
import {
  getAllPassengers,
  getPassengersByBooking,
  addPassenger,
  updatePassenger,
  deletePassenger
} from "../../controllers/admin/passengerController.js";

const router = express.Router();

router.get("/", getAllPassengers);
router.get("/booking/:booking_id", getPassengersByBooking);
router.post("/add-passenger", addPassenger);
router.put("/:id", updatePassenger);
router.delete("/:id", deletePassenger);

export default router;
