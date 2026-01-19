import { query } from "../config/db.js";

const groups = [
  { name: "Dashboard", slug: "dashboard" },
  { name: "Posts", slug: "posts" },
  { name: "Marksheets", slug: "marksheets" },
  { name: "Teams", slug: "teams" },
  { name: "Roles & Permissions", slug: "rbac" }
];

const seedPermissionGroups = async () => {
  for (const g of groups) {
    await query(
      `INSERT INTO permission_groups (name, slug)
       VALUES ($1,$2)
       ON CONFLICT (slug) DO NOTHING`,
      [g.name, g.slug]
    );
  }

  console.log("✅ Permission groups seeded");
};

export default seedPermissionGroups;
