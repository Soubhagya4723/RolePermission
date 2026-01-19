import bcrypt from "bcryptjs";
import { query } from "../config/db.js";

const seedUsers = async () => {
  const hash = await bcrypt.hash("admin123", 10);

  const role = await query(
    "SELECT id FROM roles WHERE name='admin'"
  );

  await query(
    `INSERT INTO users (name,email,password,role_id,is_verified)
     VALUES ('Admin','admin@gmail.com',$1,$2,true)
     ON CONFLICT (email) DO NOTHING`,
    [hash, role.rows[0].id]
  );

  console.log("✅ Admin user seeded");
};

export default seedUsers;
