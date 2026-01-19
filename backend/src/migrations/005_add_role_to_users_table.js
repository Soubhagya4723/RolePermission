import pool from "../config/db.js";

const addRoleIdToUsersTable = async () => {
  try {
    /* 1️⃣ Add role_id column */
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS role_id INTEGER
    `);

    /* 2️⃣ Add FK constraint safely */
    const fkCheck = await pool.query(`
      SELECT 1
      FROM information_schema.table_constraints
      WHERE constraint_name = 'fk_users_role'
    `);

    if (fkCheck.rowCount === 0) {
      await pool.query(`
        ALTER TABLE users
        ADD CONSTRAINT fk_users_role
        FOREIGN KEY (role_id)
        REFERENCES roles(id)
        ON DELETE SET NULL
      `);
    }

    /* 3️⃣ Set default role = viewer */
    await pool.query(`
      UPDATE users
      SET role_id = (SELECT id FROM roles WHERE name = 'viewer')
      WHERE role_id IS NULL
    `);

    console.log("✅ Migration 005: role_id added to users table");
  } catch (error) {
    console.error("❌ Migration 005 failed:", error.message);
    throw error;
  }
};

export default addRoleIdToUsersTable;
