import express from "express";
import * as tourController from "../controllers/tourController.js";

const router = express.Router();

// PUBLIC TOUR ROUTES
router.get("/", tourController.getTours);
router.get("/:id", tourController.getTourById);
router.get("/:id/images", tourController.getTourImages);
router.get("/:id/detail", tourController.getTourDetail);
router.get("/:id/itineraries", tourController.getItineraries);
router.get("/:id/services", tourController.getTourServices);

export default router;
