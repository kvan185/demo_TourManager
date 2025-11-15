import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import * as customerActionsController from "../controllers/customerActionsController.js";

const router = express.Router();

/* ----------------------------
   BOOKINGS
-----------------------------*/
router.get("/bookings", verifyToken, customerActionsController.getMyBookings);
router.post("/bookings/add", verifyToken, customerActionsController.createBooking);
router.get("/bookings/:id", verifyToken, customerActionsController.getBookingDetail);
router.put("/bookings/:id/cancel", verifyToken, customerActionsController.cancelBooking);

/* Passengers */
router.get("/bookings/:id/passengers", verifyToken, customerActionsController.getPassengers);
router.post("/bookings/:id/passengers/add", verifyToken, customerActionsController.addPassenger);
router.put("/passengers/:pid", verifyToken, customerActionsController.updatePassenger);
router.delete("/passengers/:pid", verifyToken, customerActionsController.deletePassenger);

/* ----------------------------
   PAYMENTS
-----------------------------*/
router.get("/payments", verifyToken, customerActionsController.getMyPayments);
router.post("/payments/add", verifyToken, customerActionsController.addPayment);

/* ----------------------------
   INVOICES
-----------------------------*/
router.get("/invoices", verifyToken, customerActionsController.getMyInvoices);
router.get("/invoices/:id", verifyToken, customerActionsController.getInvoiceDetail);

/* ----------------------------
   REVIEWS
-----------------------------*/
router.post("/reviews/add", verifyToken, customerActionsController.addReview);
router.get("/reviews/my", verifyToken, customerActionsController.getMyReviews);

export default router;
