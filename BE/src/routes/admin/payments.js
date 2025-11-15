import express from "express";
import {
  getAllPayments,
  getPaymentsByBooking,
  addPayment,
  updatePayment,
  deletePayment
} from "../../controllers/admin/paymentController.js";

const router = express.Router();

router.get("/", getAllPayments);
router.get("/booking/:booking_id", getPaymentsByBooking);
router.post("/add-payment", addPayment);
router.put("/:id", updatePayment);
router.delete("/:id", deletePayment);

export default router;
