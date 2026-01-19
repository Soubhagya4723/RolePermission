import pool from "../config/db.js";

/* ======================================================
   CREATE ROLE + ASSIGN PERMISSIONS
====================================================== */
export const createRoleWithPermissions = async (req, res) => {
  const { name, permissions } = req.body;

  if (!name || !Array.isArray(permissions)) {
    return res.status(400).json({
      success: false,
      message: "Role name and permissions are required"
    });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /* 🔍 Check role */
    const roleCheck = await client.query(
      "SELECT id FROM roles WHERE name = $1",
      [name.toLowerCase()]
    );

    if (roleCheck.rowCount > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: "Role already exists"
      });
    }

    /* ➕ Create role */
    const roleRes = await client.query(
      "INSERT INTO roles (name) VALUES ($1) RETURNING id, name",
      [name.toLowerCase()]
    );

    const roleId = roleRes.rows[0].id;

    /* 🔗 Assign permissions */
    for (const permName of permissions) {
      const permRes = await client.query(
        "SELECT id FROM permissions WHERE name = $1",
        [permName]
      );

      if (!permRes.rowCount) {
        await client.query("ROLLBACK");
        return res.status(404).json({
          success: false,
          message: `Permission not found: ${permName}`
        });
      }

      await client.query(
        `
        INSERT INTO role_permissions (role_id, permission_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
        [roleId, permRes.rows[0].id]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      role: roleRes.rows[0]
    });

  } catch (err) {
    await client.query("ROLLBACK");
    console.error("CREATE ROLE ERROR:", err.message);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  } finally {
    client.release();
  }
};
