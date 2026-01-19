import { query } from "../config/db.js";

const createMarksheetTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS marksheets (
      id SERIAL PRIMARY KEY,
      student_name VARCHAR(150) NOT NULL,

      physics INT NOT NULL CHECK (physics BETWEEN 0 AND 100),
      chemistry INT NOT NULL CHECK (chemistry BETWEEN 0 AND 100),
      mathematics INT NOT NULL CHECK (mathematics BETWEEN 0 AND 100),

      total INT GENERATED ALWAYS AS (physics + chemistry + mathematics) STORED,
      percentage NUMERIC(5,2) GENERATED ALWAYS AS
        ((physics + chemistry + mathematics) / 3.0) STORED,

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  await query(sql);
  console.log("✅ Marksheet table created");
};

export default createMarksheetTable;
