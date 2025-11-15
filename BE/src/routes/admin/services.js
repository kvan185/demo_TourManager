import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  getServices,
  addService,
  uploadServiceImage,
  getServiceImages,
  deleteServiceImage,
  updateService,
  deleteService
} from "../../controllers/admin/serviceController.js";

const router = express.Router();

// 📂 Thư mục lưu ảnh dịch vụ
const uploadDir = "uploads/services";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// ⚙️ Cấu hình multer để upload ảnh
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ROUTES
router.get("/", getServices);
router.post("/add-service", addService);
router.post("/:id/upload-image", upload.single("image"), uploadServiceImage);
router.get("/:id/images", getServiceImages);
router.delete("/image/:imgId", deleteServiceImage);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
