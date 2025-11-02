import express from "express";
import { getAllUsers, getUser, deleteUser } from "../controllers/userController.js";
import { verifyToken, requirePermission } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Chỉ admin hoặc manager có thể xem danh sách user
router.get("/", verifyToken, requirePermission("user.view"), getAllUsers);

// Xem thông tin 1 user
router.get("/:id", verifyToken, requirePermission("user.view"), getUser);

// Xoá user
router.delete("/:id", verifyToken, requirePermission("user.delete"), deleteUser);

export default router;
