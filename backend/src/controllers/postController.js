import pool from "../config/db.js";

/* CREATE */
export const createPost = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *",
      [title, content]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* READ ALL */
export const getPosts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM posts ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* READ ONE */
export const getPostById = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM posts WHERE id = $1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
export const updatePost = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  try {
    const result = await pool.query(
      `UPDATE posts
       SET title = $1,
           content = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [title, content, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* DELETE */
export const deletePost = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
