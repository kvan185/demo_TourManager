import express from "express";
import {
  getAllSchedules,
  getScheduleById,
  addSchedule,
  updateSchedule,
  deleteSchedule,
  getEmployeeSchedules
} from "../../controllers/admin/employeeSchedulesController.js";

const router = express.Router();

// Admin routes
router.get("/", getAllSchedules);
router.get("/:id", getScheduleById);
router.post("/add", addSchedule);
router.put("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

// Employee self-view
router.get("/employee/:employeeId", getEmployeeSchedules);

export default router;
