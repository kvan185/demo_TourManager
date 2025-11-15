import express from "express";
import {
  getCustomers,
  addCustomer,
  getCustomerDetail,
  updateCustomer,
  deleteCustomer
} from "../../controllers/admin/customerController.js";

const router = express.Router();

//
// ========== CUSTOMERS ==========
//
router.get("/", getCustomers);
router.post("/add-customer", addCustomer);
router.get("/:id", getCustomerDetail);
router.put("/:id", updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
