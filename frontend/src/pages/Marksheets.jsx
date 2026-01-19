import { useEffect, useState } from "react";
import API from "../api/axios";
import { hasPermission } from "../utils/hasPermission";
import "../styles/Marksheets.css";

const Marksheets = () => {
  const [marksheets, setMarksheets] = useState([]);
  const [form, setForm] = useState({
    student_name: "",
    physics: "",
    chemistry: "",
    mathematics: ""
  });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /* ================= PERMISSIONS ================= */
  const canView = hasPermission("marksheet-view");
  const canCreate = hasPermission("marksheet-create");
  const canEdit = hasPermission("marksheet-edit");
  const canDelete = hasPermission("marksheet-delete");

  /* ================= FETCH ================= */
  const fetchMarksheets = async () => {
    if (!canView) return;

    try {
      setLoading(true);
      const res = await API.get("/marksheets/get");
      setMarksheets(res.data.data || []);
    } catch {
      setMarksheets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarksheets();
  }, []);

  /* ================= CALCULATIONS ================= */
  const getTotal = (m) =>
    Number(m.physics) +
    Number(m.chemistry) +
    Number(m.mathematics);

  const getPercentage = (m) =>
    ((getTotal(m) / 300) * 100).toFixed(2);

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (
      !form.student_name ||
      form.physics === "" ||
      form.chemistry === "" ||
      form.mathematics === ""
    ) {
      return alert("All fields are required");
    }

    const payload = {
      student_name: form.student_name,
      physics: Number(form.physics),
      chemistry: Number(form.chemistry),
      mathematics: Number(form.mathematics)
    };

    try {
      setSubmitting(true);

      if (editId) {
        if (!canEdit) return alert("No edit permission");
        await API.put(`/marksheets/${editId}`, payload);
      } else {
        if (!canCreate) return alert("No create permission");
        await API.post("/marksheets", payload);
      }

      resetForm();
      fetchMarksheets();
    } catch {
      alert("Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= DELETE ================= */
  const remove = async (id) => {
    if (!canDelete) return alert("No delete permission");
    if (!window.confirm("Delete this marksheet?")) return;

    await API.delete(`/marksheets/${id}`);
    fetchMarksheets();
  };

  /* ================= EDIT ================= */
  const edit = (m) => {
    setForm({
      student_name: m.student_name,
      physics: m.physics,
      chemistry: m.chemistry,
      mathematics: m.mathematics
    });
    setEditId(m.id);
    setShowModal(true);
  };

  /* ================= RESET ================= */
  const resetForm = () => {
    setForm({
      student_name: "",
      physics: "",
      chemistry: "",
      mathematics: ""
    });
    setEditId(null);
    setShowModal(false);
  };

  if (!canView) {
    return <p className="empty-text">No permission to view marksheets</p>;
  }

  return (
    <div className="marksheets-page">
      {/* ===== HEADER ===== */}
      <div className="page-header">
        <h2>Marksheets</h2>

        {canCreate && (
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Add Marksheet
          </button>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>{editId ? "Edit Marksheet" : "Create Marksheet"}</h3>
              <span className="close-btn" onClick={resetForm}>
                ✕
              </span>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Student Name</label>
                <input
                  placeholder="Enter student name"
                  value={form.student_name}
                  onChange={(e) =>
                    setForm({ ...form, student_name: e.target.value })
                  }
                />
              </div>

              <div className="marks-grid">
                <div className="form-group">
                  <label>Physics</label>
                  <input
                    type="number"
                    placeholder="0 - 100"
                    value={form.physics}
                    onChange={(e) =>
                      setForm({ ...form, physics: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Chemistry</label>
                  <input
                    type="number"
                    placeholder="0 - 100"
                    value={form.chemistry}
                    onChange={(e) =>
                      setForm({ ...form, chemistry: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Mathematics</label>
                  <input
                    type="number"
                    placeholder="0 - 100"
                    value={form.mathematics}
                    onChange={(e) =>
                      setForm({ ...form, mathematics: e.target.value })
                    }
                  />
                </div>
              </div>
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
      <div className="marksheet-card">
        {loading ? (
          <p>Loading...</p>
        ) : marksheets.length === 0 ? (
          <p className="empty-text">No marksheets found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Student</th>
                <th>Physics</th>
                <th>Chemistry</th>
                <th>Maths</th>
                <th>Total</th>
                <th>%</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {marksheets.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td>{m.student_name}</td>
                  <td>{m.physics}</td>
                  <td>{m.chemistry}</td>
                  <td>{m.mathematics}</td>
                  <td>{getTotal(m)}</td>
                  <td>{getPercentage(m)}%</td>
                  <td className="actions">
                    {canEdit && (
                      <button
                        className="edit-btn"
                        onClick={() => edit(m)}
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="delete-btn"
                        onClick={() => remove(m.id)}
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

export default Marksheets;
