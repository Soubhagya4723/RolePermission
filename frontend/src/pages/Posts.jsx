import { useEffect, useState } from "react";
import API from "../api/axios";
import { hasPermission } from "../utils/hasPermission";
import "../styles/Posts.css";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* ================= PERMISSIONS ================= */
  const canView = hasPermission("post-view");
  const canCreate = hasPermission("post-add");
  const canEdit = hasPermission("post-edit");
  const canDelete = hasPermission("post-delete");

  /* ================= FETCH POSTS ================= */
  const fetchPosts = async () => {
    if (!canView) return;

    try {
      setLoading(true);
      const res = await API.get("/posts");
      setPosts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      return alert("All fields are required");
    }

    try {
      setSubmitting(true);

      if (editId) {
        if (!canEdit) return alert("No edit permission");
        await API.put(`/posts/${editId}`, form);
      } else {
        if (!canCreate) return alert("No create permission");
        await API.post("/posts", form);
      }

      resetForm();
      fetchPosts();
    } catch {
      alert("Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (!canDelete) return alert("No delete permission");
    if (!window.confirm("Delete post?")) return;

    await API.delete(`/posts/${id}`);
    fetchPosts();
  };

  /* ================= EDIT ================= */
  const edit = (post) => {
    setForm({ title: post.title, content: post.content });
    setEditId(post.id);
    setShowModal(true);
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setForm({ title: "", content: "" });
    setEditId(null);
    setShowModal(false);
  };

  if (!canView) {
    return <p className="empty-text">No permission to view posts</p>;
  }

  return (
    <div className="posts-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <h2>Posts</h2>

        {canCreate && (
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Add Post
          </button>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editId ? "Edit Post" : "Create Post"}</h3>
              <span className="close-btn" onClick={resetForm}>
                ✕
              </span>
            </div>

            <div className="modal-body">
              <input
                placeholder="Title"
                value={form.title}
                onChange={(e) =>
                  setForm({ ...form, title: e.target.value })
                }
              />

              <textarea
                placeholder="Content"
                rows="4"
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
              />
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={submit}
                disabled={submitting}
              >
                {submitting
                  ? "Saving..."
                  : editId
                  ? "Update"
                  : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TABLE ===== */}
      <div className="post-table-card">
        {loading ? (
          <p className="empty-text">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="empty-text">No posts found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Content</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td>{post.title}</td>
                  <td className="content-cell">{post.content}</td>
                  <td className="actions">
                    {canEdit && (
                      <button
                        className="edit-btn"
                        onClick={() => edit(post)}
                      >
                        Edit
                      </button>
                    )}

                    {canDelete && (
                      <button
                        className="delete-btn"
                        onClick={() => remove(post.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Posts;
