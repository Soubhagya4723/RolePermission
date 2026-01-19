import express from "express";
import cors from "cors";
import dotenv from "dotenv";

/* ================= ROUTES ================= */
import authRoutes from "./routes/authRoutes.js";
import rbacRoutes from "./routes/rbacRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import marksheetRoutes from "./routes/marksheetRoutes.js";

/* ================= SEEDER (TEMPORARY) ================= */
import seedRBAC from "./seeders/rbacSeeder.js"; // 👈 ADD THIS

dotenv.config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

app.use(express.json());

/* ================= RUN RBAC SEEDER (RUNS ONCE) ================= */
seedRBAC(); // 👈 ADD THIS (REMOVE AFTER FIRST SUCCESS)

/* ================= ROUTE REGISTRATION ================= */

// Auth (register, login, OTP, create team)
app.use("/api/auth", authRoutes);

// RBAC (roles & permissions mapping)
app.use("/api/rbac", rbacRoutes);

// Roles (includes /create and /)
app.use("/api/roles", roleRoutes);
console.log("✅ roleRoutes loaded");

// 🔥 TEST ROUTE
app.get("/api/roles-test", (req, res) => {
  res.json({ test: "OK FROM CORRECT SERVER" });
});

// Posts CRUD
app.use("/api/posts", postRoutes);

// Marksheets CRUD
app.use("/api/marksheets", marksheetRoutes);

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "RBAC + CRUD API running 🚀"
  });
});

/* ================= 404 HANDLER ================= */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
