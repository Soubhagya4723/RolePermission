const adminAuth = (req, res, next) => {
  // ✅ single source of truth
  if (!req.user?.is_admin) {
    return res.status(403).json({
      success: false,
      message: "Admin access only"
    });
  }

  next();
};

export default adminAuth;


// import jwt from "jsonwebtoken";

// export const protect = (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     token = req.headers.authorization.split(" ")[1];
//   }

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Not authorized"
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; // ✅ MUST contain role_id
//     next();
//   } catch (err) {
//     return res.status(401).json({
//       success: false,
//       message: "Invalid token"
//     });
//   }
// };
 
