import express from "express";
import * as RolePermissionController from "../controllers/rolePermissionController.js";
import { protect } from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ===== GROUPS & PERMISSIONS ===== */
router.get("/permission-groups", protect, adminAuth, RolePermissionController.getPermissionGroups);
router.get("/permissions", protect, adminAuth, RolePermissionController.getPermissions);

/* ===== ROLES ===== */
router.get("/roles", protect, adminAuth, RolePermissionController.getDefaultRoles);
router.delete("/roles/:id", protect, adminAuth, RolePermissionController.deleteRole);

/* ===== CREATE ROLE ===== */
router.post(
  "/create-role-with-permissions",
  protect,
  adminAuth,
  RolePermissionController.createRoleWithPermissions
);

/* ===== EDIT ROLE (🔥 FIXED) ===== */
router.put(
  "/roles/:id/permissions",
  protect,
  adminAuth,
  RolePermissionController.updateRoleWithPermissions
);

/* ===== GET ROLE PERMISSIONS ===== */
router.get(
  "/roles/:id/permissions",
  protect,
  adminAuth,
  async (req, res) => {
    const data = await RolePermissionController.getPermissionsByRoleId(req.params.id);
    res.json({ success: true, data });
  }
);

export default router;
