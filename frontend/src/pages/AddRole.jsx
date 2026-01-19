import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const AddRole = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    if (!name.trim()) {
      alert("Role name required");
      return;
    }

    try {
      await API.post("/roles/create", { name });
      navigate("/roles");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create role");
    }
  };

  return (
    <div className="roles-page">
      <div className="roles-card" style={{ maxWidth: 400 }}>
        <h2>Add Role</h2>

        <input
          type="text"
          placeholder="Enter role name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div style={{ marginTop: 16 }}>
          <button onClick={() => navigate("/roles")}>
            Cancel
          </button>

          <button onClick={submit} style={{ marginLeft: 10 }}>
            Create Role
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRole;
