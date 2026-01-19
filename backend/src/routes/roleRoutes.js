import express from "express";
import {
  getRoles,
  getRoleById,
  updateRole,
  deleteRole
} from "../controllers/roleController.js";

import { createRoleWithPermissions } from "../controllers/createRole.js";
import { protect } from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminMiddleware.js";

const router = express.Router();

/* ===== ADMIN ONLY ===== */

// Create role + permissions
router.post(
  "/create",
  protect,
  adminAuth,
  createRoleWithPermissions
);

// Get all roles
router.get(
  "/",
  protect,
  adminAuth,
  getRoles
);

// Get single role
router.get(
  "/:id",
  protect,
  adminAuth,
  getRoleById
);

// Update role
router.put(
  "/:id",
  protect,
  adminAuth,
  updateRole
);

// ✅ DELETE role (THIS FIXES YOUR ERROR)
router.delete(
  "/:id",
  protect,
  adminAuth,
  deleteRole
);

export default router;
