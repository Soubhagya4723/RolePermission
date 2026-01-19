import pool from "../config/db.js";

/* ======================================================
   GET ALL ROLES (ADMIN ONLY)
====================================================== */
export const getRoles = async (req, res) => {
  try {
   
    const adminId = req.user.is_admin ? req.user.id : req.user.parent_id;
   

    const result = await pool.query(
      `SELECT id, name
       FROM roles
       WHERE parent_id = $1
       ORDER BY id ASC`,
      [adminId]
    );

    res.json({
      success: true,
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   GET ROLE BY ID
====================================================== */
export const getRoleById = async (req, res) => {
  try {
    const adminId = req.user.is_admin ? req.user.id : req.user.parent_id;
    const { id } = req.params;

    const result = await pool.query(
      `SELECT id, name
       FROM roles
       WHERE id = $1 AND parent_id = $2`,
      [id, adminId]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   UPDATE ROLE
====================================================== */
export const updateRole = async (req, res) => {
  try {
    const adminId = req.user.is_admin ? req.user.id : req.user.parent_id;
    const { id } = req.params;
    const { name } = req.body;

    const result = await pool.query(
      `UPDATE roles
       SET name = $1
       WHERE id = $2 AND parent_id = $3
       RETURNING id, name`,
      [name.toLowerCase(), id, adminId]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({
      success: true,
      message: "Role updated successfully",
      role: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ======================================================
   DELETE ROLE ✅ (FIXES YOUR ERROR)
====================================================== */
export const deleteRole = async (req, res) => {
  try {
    const adminId = req.user.is_admin ? req.user.id : req.user.parent_id;
    const { id } = req.params;

    // Remove role-permission mapping first
    await pool.query(
      "DELETE FROM role_permissions WHERE role_id = $1",
      [id]
    );

    // Delete role (admin scoped)
    const result = await pool.query(
      `DELETE FROM roles
       WHERE id = $1 AND parent_id = $2
       RETURNING id`,
      [id, adminId]
    );

    if (!result.rowCount) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.json({
      success: true,
      message: "Role deleted successfully"
    });
  } catch (err) {
    console.error("DELETE ROLE ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
