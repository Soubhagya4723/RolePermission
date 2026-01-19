import { useEffect, useState } from "react";
import API from "../api/axios";
import AddRoleModal from "../components/AddRoleModal";
import "../styles/Roles.css";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editRole, setEditRole] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  /* ================= FETCH ROLES ================= */
  const fetchRoles = async () => {
    try {
      const res = await API.get("/rbac/roles");
      setRoles(res.data.data || []);
    } catch (err) {
      console.error("Fetch roles failed", err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  /* ================= DELETE ROLE ================= */
  const deleteRole = async (id) => {
    if (!window.confirm("Delete this role?")) return;

    try {
      await API.delete(`/rbac/roles/${id}`);
      fetchRoles();
    } catch {
      alert("Failed to delete role");
    }
  };

  /* ================= EDIT ROLE ================= */
  const handleEdit = (role) => {
    setEditRole(role);
    setOpen(true);
  };

  return (
    <div className="roles-page">
      <div className="roles-card">
        {/* HEADER */}
        <div className="roles-header">
          <h2>Roles</h2>

          {isAdmin && (
            <button
              className="add-role-btn"
              onClick={() => {
                setEditRole(null);
                setOpen(true);
              }}
            >
              + Add Role
            </button>
          )}
        </div>

        {/* TABLE */}
        <table className="roles-table">
          <thead>
            <tr>
              <th>Role Name</th>
              {isAdmin && <th>Action</th>}
            </tr>
          </thead>

          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan={2} className="roles-empty">
                  No roles found
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id}>
                  <td>{role.name}</td>

                  {isAdmin && (
                    <td>
                      <div className="role-actions">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(role)}
                        >
                          Edit
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() => deleteRole(role.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* MODAL */}
        {open && (
          <AddRoleModal
            role={editRole}           // 👈 edit mode if not null
            onClose={() => setOpen(false)}
            onSuccess={fetchRoles}
          />
        )}
      </div>
    </div>
  );
};

export default Roles;
