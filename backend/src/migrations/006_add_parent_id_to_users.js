import { query } from "../config/db.js";

const addParentIdToRoles = async () => {
  console.log("🚀 Adding parent_id to roles table...");

  await query(`
    ALTER TABLE roles
    ADD COLUMN IF NOT EXISTS parent_id INT
    REFERENCES users(id)
    ON DELETE CASCADE;
  `);

  console.log("✅ parent_id added to roles table");
};

export default addParentIdToRoles;
