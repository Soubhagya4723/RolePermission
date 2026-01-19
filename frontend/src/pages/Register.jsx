import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      localStorage.setItem("verifyEmail", form.email);
      navigate("/verify-otp");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={submit}>
        <h2>Register</h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <button>Create Account</button>

        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
