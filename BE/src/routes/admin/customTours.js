import express from "express";
import {
  getAllCustomTours,
  getCustomTourById,
  addCustomTour,
  updateCustomTour,
  deleteCustomTour
} from "../../controllers/admin/customToursController.js";

const router = express.Router();

router.get("/", getAllCustomTours);
router.get("/:id", getCustomTourById);
router.post("/add", addCustomTour);
router.put("/:id", updateCustomTour);
router.delete("/:id", deleteCustomTour);

export default router;
