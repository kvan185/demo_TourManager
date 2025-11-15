import express from "express";
import {
  getPermissions,
  createPermission,
  updatePermission,
  deletePermission,
  getRoles,
  createRole,
  updateRole,
  deleteRole,
  getRolePermissions,
  updateRolePermissions
} from "../../controllers/admin/rolePermissionController.js";

const router = express.Router();

//
// ========== QUYỀN HỆ THỐNG ==========
//
router.get("/permissions", getPermissions);
router.post("/permissions", createPermission);
router.put("/permissions/:id", updatePermission);
router.delete("/permissions/:id", deletePermission);

//
// ========== VAI TRÒ & PHÂN QUYỀN ==========
//
router.get("/roles", getRoles);
router.post("/roles", createRole);
router.put("/roles/:id", updateRole);
router.delete("/roles/:id", deleteRole);

//
// ========== QUẢN LÝ QUYỀN THEO VAI TRÒ ==========
//
router.get("/roles/:id/permissions", getRolePermissions);
router.post("/roles/:id/permissions", updateRolePermissions);

export default router;
