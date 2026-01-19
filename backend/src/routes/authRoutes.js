// import express from "express";
// import { register, login, verifyEmailOTP } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/verify-otp", verifyEmailOTP);
// router.post("/login", login);

// export default router;

import express from "express";
import {
  register,
  login,
  verifyEmailOTP,
  createTeamMember
} from "../controllers/authController.js";

import { protect } from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminMiddleware.js"; // ✅ FIX

const router = express.Router();

/*
|--------------------------------------------------------------------------
| AUTH ROUTES
|--------------------------------------------------------------------------
| POST /api/auth/register        → Register ADMIN (ONLY ONCE)
| POST /api/auth/verify-otp      → Verify email OTP
| POST /api/auth/login           → Login (Admin + Team)
| POST /api/auth/create-team     → Admin creates team member
|--------------------------------------------------------------------------
*/

// 🔐 Register ADMIN (only once)
router.post("/register", register);

// 📧 Verify OTP
router.post("/verify-otp", verifyEmailOTP);

// 🔑 Login
router.post("/login", login);

// 👥 CREATE TEAM MEMBER (ADMIN ONLY)
router.post(
  "/create-team",
  protect,   // JWT check
  adminAuth, // Admin check
  createTeamMember
);

export default router;
