import express from "express";
import {
  getRoles,
  getEmployees,
  addEmployee,
  getEmployeeDetail,
  updateEmployee,
  deleteEmployee
} from "../../controllers/admin/employeeController.js";

const router = express.Router();

//
// ========== ROLES ==========
//
router.get("/roles", getRoles);

//
// ========== EMPLOYEES ==========
//
router.get("/", getEmployees);
router.post("/add-employee", addEmployee);
router.get("/:id", getEmployeeDetail);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;
