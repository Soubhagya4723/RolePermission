// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import {
//   getAllMarksheets,
//   createMarksheet,
//   updateMarksheet,
//   deleteMarksheet
// } from "../controllers/marksheetController.js";

// const router = express.Router();

// /*
//  BASE PATH: /api/marksheets
// */

// // GET ALL
// router.get("/get", protect, getAllMarksheets);

// // CREATE
// router.post("/", protect, createMarksheet);

// // UPDATE
// router.put("/:id", protect, updateMarksheet);

// // DELETE
// router.delete("/:id", protect, deleteMarksheet);

// export default router;



import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import checkPermission from "../middleware/permissionMiddleware.js";
import {
  getAllMarksheets,
  createMarksheet,
  updateMarksheet,
  deleteMarksheet
} from "../controllers/marksheetController.js";

const router = express.Router();

/*
 BASE PATH: /api/marksheets
*/

// VIEW
router.get(
  "/get",
  protect,
  checkPermission("marksheet-view"),
  getAllMarksheets
);

// CREATE
router.post(
  "/",
  protect,
  checkPermission("marksheet-create"),
  createMarksheet
);

// UPDATE
router.put(
  "/:id",
  protect,
  checkPermission("marksheet-edit"),
  updateMarksheet
);

// ❌ MANAGER BLOCKED HERE IF NO PERMISSION
router.delete(
  "/:id",
  protect,
  checkPermission("marksheet-delete"),
  deleteMarksheet
);

export default router;
