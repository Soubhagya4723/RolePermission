import { query } from "../config/db.js";

const permissions = [
  // Dashboard
  { group: "dashboard", label: "View Dashboard", name: "dashboard-view" },

  // Posts
  { group: "posts", label: "Create Post", name: "post-create" },
  { group: "posts", label: "View Post", name: "post-view" },
  { group: "posts", label: "Edit Post", name: "post-edit" },
  { group: "posts", label: "Delete Post", name: "post-delete" },

  // Marksheets
  { group: "marksheets", label: "Create Marksheet", name: "marksheet-create" },
  { group: "marksheets", label: "View Marksheet", name: "marksheet-view" },
  { group: "marksheets", label: "Edit Marksheet", name: "marksheet-edit" },
  { group: "marksheets", label: "Delete Marksheet", name: "marksheet-delete" },

  // Teams
  { group: "teams", label: "Add Team Member", name: "team-create" },
  { group: "teams", label: "View Team", name: "team-view" },

  // RBAC
  { group: "rbac", label: "Manage Roles", name: "role-manage" }
];

const seedPermissions = async () => {
  for (const p of permissions) {
    const group = await query(
      "SELECT id FROM permission_groups WHERE slug=$1",
      [p.group]
    );

    if (!group.rowCount) continue;

    await query(
      `INSERT INTO permissions (permission_group_id, label, name)
       VALUES ($1,$2,$3)
       ON CONFLICT (name) DO NOTHING`,
      [group.rows[0].id, p.label, p.name]
    );
  }

  console.log("✅ Permissions seeded");
};

export default seedPermissions;
