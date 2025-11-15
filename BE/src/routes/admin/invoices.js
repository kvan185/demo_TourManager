import express from "express";
import {
  getAllInvoices,
  getInvoiceById,
  getInvoicesByBooking,
  addInvoice,
  updateInvoice,
  deleteInvoice
} from "../../controllers/admin/invoiceController.js";

const router = express.Router();

router.get("/", getAllInvoices);
router.get("/:id", getInvoiceById);
router.get("/booking/:booking_id", getInvoicesByBooking);
router.post("/add-invoice", addInvoice);
router.put("/:id", updateInvoice);
router.delete("/:id", deleteInvoice);

export default router;
