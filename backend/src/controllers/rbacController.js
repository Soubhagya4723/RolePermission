import pool from "../config/db.js";

/* ================= CREATE ROLE ================= */
export const createRole = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Role name is required" });
  }

  const result = await pool.query(
    "INSERT INTO roles (name) VALUES ($1) RETURNING *",
    [name]
  );

  res.json({
    success: true,
    role: result.rows[0]
  });
};

/* ================= ASSIGN PERMISSION (BY ID) ================= */
export const assignPermission = async (req, res) => {
  const { roleId, permissionId } = req.body;

  if (!roleId || !permissionId) {
    return res.status(400).json({ message: "roleId and permissionId required" });
  }

  await pool.query(
    "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)",
    [roleId, permissionId]
  );

  res.json({ success: true, message: "Permission assigned" });
};

/* ================= ASSIGN PERMISSION (BY NAME) ================= */
export const assignPermissionByName = async (req, res) => {
  const { roleId, permission } = req.body;

  const perm = await pool.query(
    "SELECT id FROM permissions WHERE name = $1",
    [permission]
  );

  if (!perm.rowCount) {
    return res.status(404).json({ message: "Permission not found" });
  }

  await pool.query(
    "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1, $2)",
    [roleId, perm.rows[0].id]
  );

  res.json({ success: true, message: "Permission assigned by name" });
};





// import express from "express";
// import {
//   createRoleWithPermissions
// } from "../controllers/rolePermissionController.js";

// import { protect } from "../middleware/authMiddleware.js";
// import adminAuth from "../middleware/adminMiddleware.js";

// const router = express.Router();

// router.post(
//   "/roles",
//   protect,
//   adminAuth,
//   createRoleWithPermissions
// );

// export default router;
