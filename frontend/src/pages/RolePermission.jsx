// import { useState } from "react";
// import "../styles/rolePermission.css";

// const PERMISSIONS = {
//   Dashboard: ["view"],
//   Marksheet: ["add", "view", "edit", "delete"],
//   Post: ["add", "view", "edit", "delete"]
// };

// const RolePermission = () => {
//   const [open, setOpen] = useState(false);
//   const [roleName, setRoleName] = useState("");
//   const [permissions, setPermissions] = useState({});

//   const togglePermission = (module, action) => {
//     const key = `${module}.${action}`;
//     setPermissions((prev) => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   const closeModal = () => {
//     setOpen(false);
//     setRoleName("");
//     setPermissions({});
//   };

//   const submit = () => {
//     if (!roleName.trim()) {
//       alert("Role name is required");
//       return;
//     }

//     console.log("Role:", roleName);
//     console.log("Permissions:", permissions);

//     // later → API call here
//     closeModal();
//   };

//   return (
//     <div className="rp-page">
//       {/* HEADER */}
//       <div className="rp-header-bar">
//         <h2>Role Permissions</h2>

//         <button className="rp-add-btn" onClick={() => setOpen(true)}>
//           + Add Role & Permission
//         </button>
//       </div>

//       {/* MODAL */}
//       {open && (
//         <div className="rp-overlay">
//           <div className="rp-modal">
//             <h3 className="rp-title">Add New Role</h3>

//             <label className="rp-label">Role Name</label>
//             <input
//               className="rp-input"
//               placeholder="Enter role name"
//               value={roleName}
//               onChange={(e) => setRoleName(e.target.value)}
//             />

//             {Object.entries(PERMISSIONS).map(([module, actions]) => (
//               <div key={module} className="rp-section">
//                 <div className="rp-section-title">{module}</div>

//                 <div className="rp-checkbox-row">
//                   {actions.map((action) => (
//                     <label key={action} className="rp-checkbox">
//                       <input
//                         type="checkbox"
//                         checked={!!permissions[`${module}.${action}`]}
//                         onChange={() =>
//                           togglePermission(module, action)
//                         }
//                       />
//                       {action.toUpperCase()}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             ))}

//             {/* FOOTER */}
//             <div className="rp-footer">
//               <button
//                 className="rp-btn-cancel"
//                 onClick={closeModal}
//               >
//                 Cancel
//               </button>

//               <button
//                 className="rp-btn-save"
//                 onClick={submit}
//               >
//                 Create Role
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RolePermission;
import { useState } from "react";
import API from "../api/axios";
import "../styles/rolePermission.css";

const PERMISSIONS = {
  Dashboard: ["view"],
  Marksheet: ["add", "view", "edit", "delete"],
  Post: ["add", "view", "edit", "delete"]
};

const RolePermission = () => {
  const [open, setOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  const togglePermission = (module, action) => {
    const key = `${module}.${action}`;
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const closeModal = () => {
    if (loading) return;
    setOpen(false);
    setRoleName("");
    setPermissions({});
  };

  const submit = async () => {
    if (!roleName.trim()) {
      alert("Role name is required");
      return;
    }

    const selectedPermissions = Object.entries(permissions)
      .filter(([_, checked]) => checked)
      .map(([key]) => key.replace(".", "-").toLowerCase());

    if (selectedPermissions.length === 0) {
      alert("Please select at least one permission");
      return;
    }

    try {
      setLoading(true);

      await API.post("/roles/create", {
        name: roleName,
        permissions: selectedPermissions
      });

      alert("Role created successfully ✅");
      closeModal();
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to create role"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-page">
      {/* HEADER */}
      <div className="rp-header-bar">
        <h2>Role Permissions</h2>

        <button
          className="rp-add-btn"
          onClick={() => setOpen(true)}
        >
          + Add Role & Permission
        </button>
      </div>

      {/* MODAL */}
      {open && (
        <div className="rp-overlay">
          <div className="rp-modal">
            <h3 className="rp-title">Add New Role</h3>

            <label className="rp-label">Role Name</label>
            <input
              className="rp-input"
              placeholder="Enter role name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              disabled={loading}
            />

            {Object.entries(PERMISSIONS).map(([module, actions]) => (
              <div key={module} className="rp-section">
                <div className="rp-section-title">
                  {module}
                </div>

                <div className="rp-checkbox-row">
                  {actions.map((action) => (
                    <label key={action} className="rp-checkbox">
                      <input
                        type="checkbox"
                        checked={
                          !!permissions[`${module}.${action}`]
                        }
                        onChange={() =>
                          togglePermission(module, action)
                        }
                        disabled={loading}
                      />
                      {action.toUpperCase()}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* FOOTER */}
            <div className="rp-footer">
              <button
                className="rp-btn-cancel"
                onClick={closeModal}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                className="rp-btn-save"
                onClick={submit}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Role"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RolePermission;
