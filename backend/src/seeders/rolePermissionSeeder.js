import { query } from "../config/db.js";

const seedRolePermissions = async () => {
  const roles = await query("SELECT * FROM roles");
  const perms = await query("SELECT * FROM permissions");

  const roleMap = {};
  roles.rows.forEach(r => (roleMap[r.name] = r.id));

  for (const perm of perms.rows) {
    // ADMIN → ALL PERMISSIONS
    await query(
      "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
      [roleMap.admin, perm.id]
    );

    // MANAGER → everything except delete + role manage
    if (
      !perm.name.includes("delete") &&
      perm.name !== "role-manage"
    ) {
      await query(
        "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
        [roleMap.manager, perm.id]
      );
    }

    // VIEWER → view only
    if (perm.name.includes("view")) {
      await query(
        "INSERT INTO role_permissions (role_id, permission_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
        [roleMap.viewer, perm.id]
      );
    }
  }

  console.log("✅ Role permissions mapped");
};

export default seedRolePermissions;
