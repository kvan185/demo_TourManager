import express from "express";
import {
  getAllReviews,
  getReviewsByTour,
  getReviewsByGuide,
  addReview,
  updateReview,
  deleteReview,
} from "../../controllers/admin/reviewController.js";

const router = express.Router();

// Routes
router.get("/", getAllReviews);
router.get("/tour/:tour_id", getReviewsByTour);
router.get("/guide/:guide_id", getReviewsByGuide);
router.post("/add-review", addReview);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;
