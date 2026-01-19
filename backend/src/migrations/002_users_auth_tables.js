import { query } from "../config/db.js";

const createUserAuthTables = async () => {
  /* ================= USERS ================= */
  const usersSql = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      password TEXT NOT NULL,

      is_verified BOOLEAN DEFAULT FALSE,
      is_admin BOOLEAN DEFAULT FALSE,

      parent_id INT NULL
        REFERENCES users(id)
        ON DELETE SET NULL,

      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  /* ================= EMAIL OTPs ================= */
  const emailOtpsSql = `
    CREATE TABLE IF NOT EXISTS email_otps (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,
      otp VARCHAR(6) NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;

  await query(usersSql);
  await query(emailOtpsSql);

  console.log("✅ Users, parent_id & Email OTP tables created successfully");
};

export default createUserAuthTables;
