import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/rolePermission.css";

const PERMISSION_GROUPS = {
  dashboard: ["view"],
  marksheet: ["add", "view", "edit", "delete"],
  post: ["add", "view", "edit", "delete"]
};

const AddRoleModal = ({ onClose, onSuccess, role }) => {
  const isEdit = !!role;

  const [name, setName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  /* ================= LOAD ROLE (EDIT) ================= */
  useEffect(() => {
    if (!role) return;

    setName(role.name);

    API.get(`/rbac/roles/${role.id}/permissions`)
      .then((res) => {
        const perms = {};
        res.data.data.forEach((p) => (perms[p] = true));
        setPermissions(perms);
      })
      .catch(() => alert("Failed to load permissions"));
  }, [role]);

  /* ================= TOGGLE ================= */
  const togglePermission = (perm) => {
    setPermissions((prev) => ({
      ...prev,
      [perm]: !prev[perm]
    }));
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (!name.trim()) {
      alert("Role name required");
      return;
    }

    const selectedPermissions = Object.keys(permissions).filter(
      (p) => permissions[p]
    );

    if (!selectedPermissions.length) {
      alert("Select at least one permission");
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        // 🔥 UPDATE ROLE + PERMISSIONS
        await API.put(
          `/rbac/roles/${role.id}/permissions`,
          {
            name,
            permissions: selectedPermissions
          }
        );
      } else {
        // 🔥 CREATE ROLE + PERMISSIONS
        await API.post(
          "/rbac/create-role-with-permissions",
          {
            name,
            permissions: selectedPermissions
          }
        );
      }

      onSuccess();
      onClose();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Failed to save role"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        {/* HEADER */}
        <div className="modal-header">
          <h3>{isEdit ? "Edit Role" : "Add Role"}</h3>
          <button onClick={onClose}>×</button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          <label>Role Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
          />

          {Object.entries(PERMISSION_GROUPS).map(
            ([module, actions]) => (
              <div key={module} className="permission-section">
                <h4>{module.toUpperCase()}</h4>

                <div className="permission-row">
                  {actions.map((action) => {
                    const key = `${module}-${action}`;
                    return (
                      <label key={key}>
                        <input
                          type="checkbox"
                          checked={!!permissions[key]}
                          onChange={() =>
                            togglePermission(key)
                          }
                        />
                        {action.toUpperCase()}
                      </label>
                    );
                  })}
                </div>
              </div>
            )
          )}
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button onClick={submit} disabled={loading}>
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Role"
              : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoleModal;
