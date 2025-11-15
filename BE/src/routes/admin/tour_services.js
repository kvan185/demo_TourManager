import express from "express";
import {
  getAllTourServices,
  getTourServicesByTour,
  addTourService,
  updateTourService,
  deleteTourService,
} from "../../controllers/admin/tourServiceController.js";

const router = express.Router();

// Routes
router.get("/", getAllTourServices);
router.get("/tour/:tour_id", getTourServicesByTour);
router.post("/add-tour-service", addTourService);
router.put("/:id", updateTourService);
router.delete("/:id", deleteTourService);

export default router;
