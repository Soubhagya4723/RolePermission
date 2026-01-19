import dotenv from "dotenv";
dotenv.config();

import createRBAC from "./001_rbac_tables.js";
import createUsers from "./002_users_auth_tables.js";
import createMarksheetTable from "./003_marksheets_table.js";
import createPostsTable from "./004_posts_table.js";
import addRoleToUsersTable from "./005_add_role_to_users_table.js";
import addParentIdToUsers from "./006_add_parent_id_to_users.js";
import addParentIdToRoles from "./007_add_parent_id_to_roles.js"; // ✅ ADD THIS

const runMigrations = async () => {
  try {
    console.log("🚀 Running migrations...");

    await createRBAC();
    await createUsers();
    await createMarksheetTable();
    await createPostsTable();
    await addRoleToUsersTable();
    await addParentIdToUsers();
    await addParentIdToRoles(); // ✅ THIS WAS MISSING

    console.log("✅ All migrations executed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

runMigrations();
