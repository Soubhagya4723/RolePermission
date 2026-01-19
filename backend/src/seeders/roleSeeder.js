import { query } from "../config/db.js";

const seedRoles = async () => {
  const roles = ["admin", "manager", "viewer"];

  for (const role of roles) {
    await query(
      "INSERT INTO roles (name) VALUES ($1) ON CONFLICT (name) DO NOTHING",
      [role]
    );
  }

  console.log("✅ Roles seeded (admin, manager, viewer)");
};

export default seedRoles;
