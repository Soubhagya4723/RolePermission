import { query } from "../config/db.js";

const seedRBAC = async () => {
  try {
    /* ================= PERMISSION GROUPS ================= */
    await query(`
      INSERT INTO permission_groups (name, slug)
      VALUES
        ('Dashboard', 'dashboard'),
        ('Marksheet', 'marksheet'),
        ('Post', 'post')
      ON CONFLICT DO NOTHING
    `);

    /* ================= DASHBOARD ================= */
    await query(`
      INSERT INTO permissions (permission_group_id, label, name)
      SELECT id, 'View Dashboard', 'dashboard-view'
      FROM permission_groups WHERE slug = 'dashboard'
      ON CONFLICT DO NOTHING
    `);

    /* ================= MARKSHEET ================= */
    await query(`
      INSERT INTO permissions (permission_group_id, label, name)
      SELECT id, 'Add Marksheet', 'marksheet-add'
      FROM permission_groups WHERE slug = 'marksheet'
      ON CONFLICT DO NOTHING
    `);

    await query(`
      INSERT INTO permissions (permission_group_id, label, name)
      SELECT id, 'View Marksheet', 'marksheet-view'
      FROM permission_groups WHERE slug = 'marksheet'
      ON CONFLICT DO NOTHING
    `);

    await query(`
      INSERT INTO permissions (permission_group_id, label, name)
      SELECT id, 'Edit Marksheet', 'marksheet-edit'
      FROM permission_groups WHERE slug = 'marksheet'
      ON CONFLICT DO NOTHING
    `);

    await query(`
      INSERT INTO permissions (permission_group_id, label, name)
      SELECT id, 'Delete Marksheet', 'marksheet-delete'
      FROM permission_groups WHERE slug = 'marksheet'
      ON CONFLICT DO NOTHING
    `);

    /* ================= POST ================= */
    await query(`
      INSERT INTO permissions (permission_group_id, label, name)
      SELECT id, 'Add Post', 'post-add'
      FROM permission_groups WHERE slug = 'post'
      ON CONFLICT DO NOTHING
    `);

    await query(`
      INSERT INTO permissions (permission_group_id, label, name)
      SELECT id, 'View Post', 'post-view'
      FROM permission_groups WHERE slug = 'post'
      ON CONFLICT DO NOTHING
    `);

    await query(`
      INSERT INTO permissions (permission_group_id, label, name)
      SELECT id, 'Edit Post', 'post-edit'
      FROM permission_groups WHERE slug = 'post'
      ON CONFLICT DO NOTHING
    `);

    await query(`
      INSERT INTO permissions (permission_group_id, label, name)
      SELECT id, 'Delete Post', 'post-delete'
      FROM permission_groups WHERE slug = 'post'
      ON CONFLICT DO NOTHING
    `);

    console.log("✅ RBAC permissions seeded successfully");
  } catch (err) {
    console.error("❌ RBAC Seeder Error:", err.message);
  }
};

export default seedRBAC;
