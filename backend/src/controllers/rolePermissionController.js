import pool from "../config/db.js";
import { query } from "../config/db.js";

/* ======================================================
   PERMISSION GROUPS
====================================================== */
export const getPermissionGroups = async (req, res) => {
  const result = await query(
    "SELECT * FROM permission_groups ORDER BY id ASC"
  );
  res.json({ success: true, data: result.rows });
};

/* ======================================================
   PERMISSIONS
====================================================== */
export const getPermissions = async (req, res) => {
  const result = await query(`
    SELECT p.id, p.name, p.label, pg.name AS group_name
    FROM permissions p
    JOIN permission_groups pg ON pg.id = p.permission_group_id
    ORDER BY p.id ASC
  `);

  res.json({ success: true, data: result.rows });
};

/* ======================================================
   ROLES
====================================================== */
export const getDefaultRoles = async (req, res) => {
  const result = await query("SELECT * FROM roles ORDER BY id ASC");
  res.json({ success: true, data: result.rows });
};

export const deleteRole = async (req, res) => {
  await query("DELETE FROM roles WHERE id = $1", [req.params.id]);
  res.json({ success: true });
};

/* ======================================================
   GET PERMISSIONS BY ROLE ID
====================================================== */
export const getPermissionsByRoleId = async (roleId) => {
  const result = await query(`
    SELECT p.name
    FROM permissions p
    JOIN role_permissions rp ON rp.permission_id = p.id
    WHERE rp.role_id = $1
  `, [roleId]);

  return result.rows.map(p => p.name);
};

/* ======================================================
   CREATE ROLE + PERMISSIONS
====================================================== */
// export const createRoleWithPermissions = async (req, res) => {
//   const { name, permissions } = req.body;
//   const client = await pool.connect();

//   try {
//     await client.query("BEGIN");

//     const roleRes = await client.query(
//       "INSERT INTO roles (name) VALUES ($1) RETURNING id",
//       [name.toLowerCase()]
//     );

//     const roleId = roleRes.rows[0].id;

//     for (const perm of permissions) {
//       const permRes = await client.query(
//         "SELECT id FROM permissions WHERE name = $1",
//         [perm]
//       );

//       await client.query(
//         "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1,$2)",
//         [roleId, permRes.rows[0].id]
//       );
//     }

//     await client.query("COMMIT");
//     res.status(201).json({ success: true });

//   } catch (err) {
//     await client.query("ROLLBACK");
//     res.status(500).json({ success: false, message: err.message });
//   } finally {
//     client.release();
//   }
// };


export const createRoleWithPermissions = async (req, res) => {
  const { name, permissions } = req.body;

  // ✅ ADMIN ID (parent for roles)
  const adminId = req.user.id;

  if (!name || !Array.isArray(permissions)) {
    return res.status(400).json({
      success: false,
      message: "Role name and permissions are required"
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* ================= CREATE ROLE ================= */
    const roleRes = await client.query(
      `INSERT INTO roles (name, parent_id)
       VALUES ($1, $2)
       RETURNING id`,
      [name.toLowerCase(), adminId]
    );

    const roleId = roleRes.rows[0].id;

    /* ================= ASSIGN PERMISSIONS ================= */
    for (const perm of permissions) {
      const permRes = await client.query(
        "SELECT id FROM permissions WHERE name = $1",
        [perm]
      );

      if (!permRes.rowCount) {
        throw new Error(`Permission not found: ${perm}`);
      }

      await client.query(
        `INSERT INTO role_permissions (role_id, permission_id)
         VALUES ($1, $2)`,
        [roleId, permRes.rows[0].id]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Role created successfully"
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("CREATE ROLE ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: err.message
    });
  } finally {
    client.release();
  }
};

/* ======================================================
   🔥 UPDATE ROLE + UPDATE PERMISSIONS (THIS WAS MISSING)
====================================================== */
export const updateRoleWithPermissions = async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "UPDATE roles SET name = $1 WHERE id = $2",
      [name.toLowerCase(), id]
    );

    await client.query(
      "DELETE FROM role_permissions WHERE role_id = $1",
      [id]
    );

    for (const perm of permissions) {
      const permRes = await client.query(
        "SELECT id FROM permissions WHERE name = $1",
        [perm]
      );

      await client.query(
        "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1,$2)",
        [id, permRes.rows[0].id]
      );
    }

    await client.query("COMMIT");
    res.json({ success: true });

  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ success: false, message: err.message });
  } finally {
    client.release();
  }
};
