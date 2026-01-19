// import { useState } from "react";
// import "../styles/addTeamModal.css";

// const AddTeamModal = ({ onClose }) => {
//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     role: "",
//     password: ""
//   });

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const submit = () => {
//     if (!form.firstName || !form.email || !form.role) {
//       alert("Please fill required fields");
//       return;
//     }

//     console.log(form);
//     onClose();
//   };

//   return (
//     <div className="tm-overlay">
//       <div className="tm-modal">
//         {/* HEADER */}
//         <div className="tm-header">
//           <h3>Add New Team</h3>
//           <button className="tm-close" onClick={onClose}>
//             ✕
//           </button>
//         </div>

//         {/* BODY */}
//         <div className="tm-body">
//           <div className="tm-field">
//             <label>First Name</label>
//             <input
//               name="firstName"
//               value={form.firstName}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="tm-field">
//             <label>Last Name</label>
//             <input
//               name="lastName"
//               value={form.lastName}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="tm-field">
//             <label>Email</label>
//             <input
//               name="email"
//               value={form.email}
//               onChange={handleChange}
//             />
//           </div>

//           <div className="tm-field">
//             <label>Role</label>
//             <select
//               name="role"
//               value={form.role}
//               onChange={handleChange}
//             >
//               <option value="">Select Role</option>
//               <option value="manager">Manager</option>
//               <option value="viewer">Viewer</option>
//             </select>
//           </div>

//           <div className="tm-field">
//             <label>Password</label>
//             <input
//               type="password"
//               name="password"
//               value={form.password}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         {/* FOOTER */}
//         <div className="tm-footer">
//           <button className="tm-btn-secondary" onClick={onClose}>
//             Close
//           </button>
//           <button className="tm-btn-primary" onClick={submit}>
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddTeamModal;

import { useEffect, useState } from "react";
import API from "../api/axios";
import "../styles/addTeamModal.css";

const AddTeamModal = ({ onClose }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role_id: ""
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(true);
  const [roleError, setRoleError] = useState("");

  /* ================= FETCH ROLES ================= */
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setRoleLoading(true);
      const res = await API.get("/roles");

      console.log("ROLES RESPONSE 👉", res.data); // 🔍 DEBUG

      if (res.data?.success) {
        setRoles(res.data.data);
      } else {
        setRoleError("Failed to load roles");
      }
    } catch (err) {
      console.error("Failed to fetch roles", err.response?.data || err.message);
      setRoleError("You are not authorized or server error");
    } finally {
      setRoleLoading(false);
    }
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "role_id" ? Number(value) : value
    });
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    if (!form.firstName || !form.email || !form.role_id) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await API.post("/auth/create-team", {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        role_id: form.role_id
      });

      alert("Team member added. Credentials sent via email.");
      onClose();

    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Failed to add team member"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tm-overlay">
      <div className="tm-modal">

        {/* HEADER */}
        <div className="tm-header">
          <h3>Add New Team</h3>
          <button className="tm-close" onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="tm-body">

          <div className="tm-field">
            <label>First Name *</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="tm-field">
            <label>Last Name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="tm-field">
            <label>Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="tm-field">
            <label>Role *</label>

            {roleLoading ? (
              <select disabled>
                <option>Loading roles...</option>
              </select>
            ) : roleError ? (
              <select disabled>
                <option>{roleError}</option>
              </select>
            ) : (
              <select
                name="role_id"
                value={form.role_id}
                onChange={handleChange}
              >
                <option value="">Select Role</option>

                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                  </option>
                ))}
              </select>
            )}
          </div>

        </div>

        {/* FOOTER */}
        <div className="tm-footer">
          <button
            className="tm-btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="tm-btn-primary"
            onClick={submit}
            disabled={loading || roleLoading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddTeamModal;
