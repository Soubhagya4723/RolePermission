// import { query } from "../config/db.js";

// const checkPermission = (permissionName) => {
//   return async (req, res, next) => {
//     const roleId = req.user.role_id;

//     const result = await query(
//       `SELECT 1
//        FROM role_permissions rp
//        JOIN permissions p ON p.id = rp.permission_id
//        WHERE rp.role_id = $1 AND p.name = $2`,
//       [roleId, permissionName]
//     );

//     if (!result.rowCount) {
//       return res.status(403).json({
//         success: false,
//         message: "Permission denied"
//       });
//     }

//     next();
//   };
// };

// export default checkPermission;








import { query } from "../config/db.js";

const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      // Admin (no role_id) → full access
      if (!req.user.role_id) {
        return next();
      }

      const result = await query(
        `
        SELECT 1
        FROM role_permissions rp
        JOIN permissions p ON p.id = rp.permission_id
        WHERE rp.role_id = $1
          AND p.name = $2
        `,
        [req.user.role_id, permissionName]
      );

      if (!result.rowCount) {
        return res.status(403).json({
          success: false,
          message: "Permission denied"
        });
      }

      next();
    } catch (err) {
      console.error("Permission middleware error:", err.message);
      res.status(500).json({
        success: false,
        message: "Permission check failed"
      });
    }
  };
};

export default checkPermission;
