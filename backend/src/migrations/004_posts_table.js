import pool from "../config/db.js";

const createPostsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await pool.query(query);
  console.log("✅ posts table created");
};

export default createPostsTable;
