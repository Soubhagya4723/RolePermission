import express from "express";
import { createRoleWithPermissions } from "../controllers/createRole.js";
import { protect } from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post(
  "/create",
  protect,
  adminAuth,
  createRoleWithPermissions
);

export default router;
