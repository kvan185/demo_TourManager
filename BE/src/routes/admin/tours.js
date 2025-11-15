import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getTours,
  addTour,
  getTourDetail,
  updateTour,
  deleteTour,
  uploadTourImage,
  getTourImages,
  deleteTourImage,
} from "../../controllers/admin/tourController.js";

const router = express.Router();

// 📂 Thư mục upload tour
const uploadDir = "uploads/tours";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.get("/", getTours);
router.post("/add-tour", addTour);
router.get("/:id", getTourDetail);
router.put("/:id", updateTour);
router.delete("/:id", deleteTour);

router.post("/:id/upload-image", upload.single("image"), uploadTourImage);
router.get("/:id/images", getTourImages);
router.delete("/image/:imgId", deleteTourImage);

// Các route schedules, itineraries, tour_guides cũng tách tương tự
// VD: router.post("/add-schedule", addTourSchedule); ...

export default router;
