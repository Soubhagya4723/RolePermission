import { query } from "../config/db.js";

/* ============ CREATE ============ */
export const createMarksheet = async (req, res) => {
  try {
    const { student_name, physics, chemistry, mathematics } = req.body;

    if (
      !student_name ||
      physics === undefined ||
      chemistry === undefined ||
      mathematics === undefined
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (
      typeof physics !== "number" ||
      typeof chemistry !== "number" ||
      typeof mathematics !== "number"
    ) {
      return res.status(400).json({ message: "Marks must be numbers" });
    }

    const result = await query(
      `INSERT INTO marksheets
       (student_name, physics, chemistry, mathematics)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [student_name, physics, chemistry, mathematics]
    );

    res.status(201).json({
      success: true,
      message: "Marksheet created",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("❌ CREATE MARKSHEET ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============ READ ALL ============ */
export const getAllMarksheets = async (req, res) => {
  console.log(req.user)
  try {
    const result = await query(
      "SELECT * FROM marksheets ORDER BY id DESC"
    );

    res.json({ success: true, data: result.rows });

  } catch (err) {
    console.error("❌ GET ALL MARKSHEETS ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============ READ ONE ============ */
export const getMarksheetById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      "SELECT * FROM marksheets WHERE id = $1",
      [id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Marksheet not found" });
    }

    res.json({ success: true, data: result.rows[0] });

  } catch (err) {
    console.error("❌ GET MARKSHEET ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============ UPDATE ============ */
export const updateMarksheet = async (req, res) => {
  try {
    const { id } = req.params;
    const { physics, chemistry, mathematics } = req.body;

    // 1️⃣ Check marksheet exists
    const existing = await query(
      "SELECT * FROM marksheets WHERE id = $1",
      [id]
    );

    if (!existing.rowCount) {
      return res.status(404).json({ message: "Marksheet not found" });
    }

    const old = existing.rows[0];

    // 2️⃣ Preserve old values if not provided
    const newPhysics = physics ?? old.physics;
    const newChemistry = chemistry ?? old.chemistry;
    const newMathematics = mathematics ?? old.mathematics;

    // 3️⃣ Validate numbers
    if (
      typeof newPhysics !== "number" ||
      typeof newChemistry !== "number" ||
      typeof newMathematics !== "number"
    ) {
      return res.status(400).json({ message: "Marks must be numbers" });
    }

    // 4️⃣ Update ONLY base columns
    const result = await query(
      `UPDATE marksheets
       SET physics=$1,
           chemistry=$2,
           mathematics=$3,
           updated_at=NOW()
       WHERE id=$4
       RETURNING *`,
      [
        newPhysics,
        newChemistry,
        newMathematics,
        id
      ]
    );

    res.json({
      success: true,
      message: "Marksheet updated",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("❌ UPDATE MARKSHEET ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ============ DELETE ============ */
export const deleteMarksheet = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      "DELETE FROM marksheets WHERE id = $1 RETURNING *",
      [id]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Marksheet not found" });
    }

    res.json({ success: true, message: "Marksheet deleted" });

  } catch (err) {
    console.error("❌ DELETE MARKSHEET ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
