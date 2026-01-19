import seedRoles from "./roleSeeder.js";
import seedPermissionGroups from "./permissionGroupSeeder.js";
import seedPermissions from "./permissionSeeder.js";
import seedRolePermissions from "./rolePermissionSeeder.js";
import seedUsers from "./userSeeder.js";

const runSeeders = async () => {
  try {
    await seedRoles();
    await seedPermissionGroups();
    await seedPermissions();
    await seedRolePermissions();
    await seedUsers();

    console.log("🌱 ALL SEEDERS COMPLETED");
    process.exit();
  } catch (err) {
    console.error("❌ Seeder error:", err.message);
    process.exit(1);
  }
};

runSeeders();
