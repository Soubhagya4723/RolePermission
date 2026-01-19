// import jwt from "jsonwebtoken";
// import pool from "../config/db.js";

// export const protect = async (req, res, next) => {
//   try {
//     const auth = req.headers.authorization;

//     if (!auth || !auth.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     const token = auth.split(" ")[1];

//     // 🔐 VERIFY TOKEN
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     // 🔎 CHECK USER STILL EXISTS
//     const userRes = await pool.query(
//       `
//       SELECT 
//         u.id,
//         u.email,
//         u.role_id,
//         COALESCE(r.name, 'admin') AS role
//       FROM users u
//       LEFT JOIN roles r ON r.id = u.role_id
//       WHERE u.id = $1
//       `,
//       [decoded.id]
//     );

//     if (!userRes.rowCount) {
//       return res.status(401).json({ message: "User not found" });
//     }

//     // ✅ ATTACH USER + PERMISSIONS FROM JWT
//     req.user = {
//       id: decoded.id,
//       email: userRes.rows[0].email,
//       role_id: decoded.role_id,
//       role: decoded.role,
//       permissions: decoded.permissions || []
//     };

//     next();

//   } catch (error) {
//     console.error("AUTH ERROR:", error.message);
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };



import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ VERY IMPORTANT
    req.user = {
      id: decoded.id,
      role_id: decoded.role_id,
      is_admin: decoded.is_admin,
      parent_id: decoded.parent_id ?? null
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};
