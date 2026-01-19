// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import crypto from "crypto";
// import pool from "../config/db.js";
// import {
//   sendOTPEmail,
//   sendCredentialsEmail
// } from "../utils/email.js";

// /* =====================================================
//    REGISTER (ADMIN ONLY – ONLY ONCE)
// ===================================================== */
// export const register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, email and password are required"
//       });
//     }

//     // 🔒 Allow only ONE admin
//     const adminExists = await pool.query(
//       "SELECT id FROM users WHERE is_admin = true"
//     );

//     if (adminExists.rowCount > 0) {
//       return res.status(403).json({
//         success: false,
//         message: "Admin already exists. Registration disabled."
//       });
//     }

//     const existingUser = await pool.query(
//       "SELECT id FROM users WHERE email = $1",
//       [email]
//     );

//     if (existingUser.rowCount > 0) {
//       return res.status(409).json({
//         success: false,
//         message: "Email already registered"
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // ✅ ADMIN → parent_id = NULL
//     const userRes = await pool.query(
//       `INSERT INTO users
//        (name, email, password, is_verified, is_admin, parent_id)
//        VALUES ($1,$2,$3,false,true,NULL)
//        RETURNING id`,
//       [name, email, hashedPassword]
//     );

//     const userId = userRes.rows[0].id;

//     const otp = Math.floor(100000 + Math.random() * 900000).toString();
//     const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

//     await pool.query(
//       `INSERT INTO email_otps (user_id, otp, expires_at)
//        VALUES ($1,$2,$3)`,
//       [userId, otp, expiresAt]
//     );

//     await sendOTPEmail(email, otp);

//     res.status(201).json({
//       success: true,
//       message: "Admin registered. OTP sent to email."
//     });

//   } catch (err) {
//     console.error("❌ Register error:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* =====================================================
//    VERIFY EMAIL OTP
// ===================================================== */
// export const verifyEmailOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     const userRes = await pool.query(
//       "SELECT id FROM users WHERE email=$1",
//       [email]
//     );

//     if (!userRes.rowCount) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = userRes.rows[0];

//     const otpRes = await pool.query(
//       `SELECT * FROM email_otps
//        WHERE user_id=$1 AND otp=$2
//        ORDER BY created_at DESC LIMIT 1`,
//       [user.id, otp]
//     );

//     if (!otpRes.rowCount) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     if (new Date(otpRes.rows[0].expires_at) < new Date()) {
//       return res.status(400).json({ message: "OTP expired" });
//     }

//     await pool.query(
//       "UPDATE users SET is_verified=true WHERE id=$1",
//       [user.id]
//     );

//     await pool.query(
//       "DELETE FROM email_otps WHERE user_id=$1",
//       [user.id]
//     );

//     res.json({ success: true, message: "Email verified" });

//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* =====================================================
//    LOGIN (ENSURE parent_id RULES)
// ===================================================== */
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const userRes = await pool.query(
//       `SELECT 
//          u.id,
//          u.name,
//          u.email,
//          u.password,
//          u.is_verified,
//          u.role_id,
//          u.is_admin,
//          u.parent_id,
//          r.name AS role_name
//        FROM users u
//        LEFT JOIN roles r ON r.id = u.role_id
//        WHERE u.email = $1`,
//       [email]
//     );

//     if (!userRes.rowCount) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const user = userRes.rows[0];

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     if (!user.is_verified) {
//       return res.status(403).json({ message: "Verify email first" });
//     }

//     // ✅ SAFETY: Admin must always have parent_id = NULL
//     if (user.is_admin && user.parent_id !== null) {
//       await pool.query(
//         "UPDATE users SET parent_id = NULL WHERE id = $1",
//         [user.id]
//       );
//     }

//     const roleName = user.is_admin ? "admin" : user.role_name;

//     const token = jwt.sign(
//       {
//         id: user.id,
//         role: roleName,
//         role_id: user.role_id,
//         is_admin: user.is_admin
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     /* ================= FETCH ROLE PERMISSIONS ================= */
//     let permissions = {};

//     if (user.role_id) {
//       const permRes = await pool.query(
//         `
//         SELECT p.name
//         FROM role_permissions rp
//         JOIN permissions p ON p.id = rp.permission_id
//         WHERE rp.role_id = $1
//         `,
//         [user.role_id]
//       );

//       permRes.rows.forEach((row) => {
//         permissions[row.name] = true;
//       });
//     }

//     res.json({
//       success: true,
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: roleName,
//         is_admin: user.is_admin
//       },
//       permissions
//     });

//   } catch (err) {
//     console.error("❌ Login error:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// /* =====================================================
//    CREATE TEAM MEMBER (ADMIN → parent_id)
// ===================================================== */
// export const createTeamMember = async (req, res) => {
//   try {
//     // ✅ LOGGED-IN ADMIN ID
//     const adminId = req.user.id;

//     const { firstName, lastName, email, role_id } = req.body;

//     if (!firstName || !email || !role_id) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     const exists = await pool.query(
//       "SELECT id FROM users WHERE email=$1",
//       [email]
//     );

//     if (exists.rowCount) {
//       return res.status(409).json({ message: "Email already exists" });
//     }

//     const rawPassword = crypto.randomBytes(4).toString("hex");
//     const hashedPassword = await bcrypt.hash(rawPassword, 10);

//     // ✅ STAFF → parent_id = admin_id
//     await pool.query(
//       `INSERT INTO users
//        (name,email,password,role_id,is_verified,is_admin,parent_id)
//        VALUES ($1,$2,$3,$4,true,false,$5)`,
//       [
//         `${firstName} ${lastName || ""}`,
//         email,
//         hashedPassword,
//         role_id,
//         adminId
//       ]
//     );

//     await sendCredentialsEmail({
//       to: email,
//       name: firstName,
//       password: rawPassword,
//       role: "Assigned by Admin"
//     });

//     res.status(201).json({
//       success: true,
//       message: "Team member created under admin"
//     });

//   } catch (err) {
//     console.error("❌ Create team error:", err.message);
//     res.status(500).json({ message: "Server error" });
//   }
// };


import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../config/db.js";
import {
  sendOTPEmail,
  sendCredentialsEmail
} from "../utils/email.js";

/* =====================================================
   REGISTER (ADMIN ONLY – ONLY ONCE)
===================================================== */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    // 🔒 Allow only ONE admin
    const adminExists = await pool.query(
      "SELECT id FROM users WHERE is_admin = true"
    );

    if (adminExists.rowCount > 0) {
      return res.status(403).json({
        success: false,
        message: "Admin already exists. Registration disabled."
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rowCount > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Admin → parent_id = NULL
    const userRes = await pool.query(
      `INSERT INTO users
       (name, email, password, is_verified, is_admin, parent_id)
       VALUES ($1,$2,$3,false,true,NULL)
       RETURNING id`,
      [name, email, hashedPassword]
    );

    const userId = userRes.rows[0].id;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      `INSERT INTO email_otps (user_id, otp, expires_at)
       VALUES ($1,$2,$3)`,
      [userId, otp, expiresAt]
    );

    await sendOTPEmail(email, otp);

    res.status(201).json({
      success: true,
      message: "Admin registered. OTP sent to email."
    });

  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   VERIFY EMAIL OTP  ✅ FIXED & EXPORTED
===================================================== */
export const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const userRes = await pool.query(
      "SELECT id, is_verified FROM users WHERE email = $1",
      [email]
    );

    if (!userRes.rowCount) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = userRes.rows[0];

    const otpRes = await pool.query(
      `SELECT *
       FROM email_otps
       WHERE user_id = $1 AND otp = $2
       ORDER BY created_at DESC
       LIMIT 1`,
      [user.id, otp]
    );

    if (!otpRes.rowCount) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (new Date(otpRes.rows[0].expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    await pool.query(
      "UPDATE users SET is_verified = true WHERE id = $1",
      [user.id]
    );

    await pool.query(
      "DELETE FROM email_otps WHERE user_id = $1",
      [user.id]
    );

    res.json({
      success: true,
      message: "Email verified successfully"
    });

  } catch (err) {
    console.error("❌ Verify OTP error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   LOGIN (JWT FIXED WITH parent_id)
===================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRes = await pool.query(
      `SELECT 
         u.id,
         u.name,
         u.email,
         u.password,
         u.is_verified,
         u.role_id,
         u.is_admin,
         u.parent_id,
         r.name AS role_name
       FROM users u
       LEFT JOIN roles r ON r.id = u.role_id
       WHERE u.email = $1`,
      [email]
    );

    if (!userRes.rowCount) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userRes.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.is_verified) {
      return res.status(403).json({ message: "Verify email first" });
    }

    const roleName = user.is_admin ? "admin" : user.role_name;

    const token = jwt.sign(
      {
        id: user.id,
        role: roleName,
        role_id: user.role_id,
        is_admin: user.is_admin,
        parent_id: user.parent_id
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    /* ================= FETCH ROLE PERMISSIONS ================= */
    let permissions = {};

    if (user.role_id) {
      const permRes = await pool.query(
        `SELECT p.name
         FROM role_permissions rp
         JOIN permissions p ON p.id = rp.permission_id
         WHERE rp.role_id = $1`,
        [user.role_id]
      );

      permRes.rows.forEach((row) => {
        permissions[row.name] = true;
      });
    }

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: roleName,
        is_admin: user.is_admin
      },
      permissions
    });

  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* =====================================================
   CREATE TEAM MEMBER (ADMIN → parent_id)
===================================================== */
export const createTeamMember = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { firstName, lastName, email, role_id } = req.body;

    if (!firstName || !email || !role_id) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const exists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (exists.rowCount) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const rawPassword = crypto.randomBytes(4).toString("hex");
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    await pool.query(
      `INSERT INTO users
       (name, email, password, role_id, is_verified, is_admin, parent_id)
       VALUES ($1,$2,$3,$4,true,false,$5)`,
      [
        `${firstName} ${lastName || ""}`,
        email,
        hashedPassword,
        role_id,
        adminId
      ]
    );

    await sendCredentialsEmail({
      to: email,
      name: firstName,
      password: rawPassword,
      role: "Assigned by Admin"
    });

    res.status(201).json({
      success: true,
      message: "Team member created successfully"
    });

  } catch (err) {
    console.error("❌ Create team error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
