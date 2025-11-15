import express from "express";
import {
  getLocations,
  addLocation,
  getLocationDetail,
  updateLocation,
  deleteLocation
} from "../../controllers/admin/locationController.js";

const router = express.Router();

//
// ========== LOCATIONS ==========
//
router.get("/", getLocations);
router.post("/add-location", addLocation);
router.get("/:id", getLocationDetail);
router.put("/:id", updateLocation);
router.delete("/:id", deleteLocation);

export default router;
