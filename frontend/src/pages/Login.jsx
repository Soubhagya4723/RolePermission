// import { useState } from "react";
// import API from "../api/axios";
// import { useNavigate, Link } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post("/auth/login", { email, password });

//       // ✅ STORE AUTH DATA
//      localStorage.setItem("token", res.data.token);
// localStorage.setItem("user", JSON.stringify(res.data.user));
// localStorage.setItem("role", res.data.user.role);


//       navigate("/home");
//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={submit}>
//         <h2>Login</h2>

//         <input
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit">Login</button>

//         <p>
//           New user? <Link to="/register">Register</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;



// import { useState } from "react";
// import API from "../api/axios";
// import { useNavigate, Link } from "react-router-dom";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await API.post("/auth/login", { email, password });

//       // ✅ STORE AUTH + PERMISSIONS
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//       localStorage.setItem("role", res.data.user.role);
//       localStorage.setItem(
//         "permissions",
//         JSON.stringify(res.data.user.permissions)
//       );

//       navigate("/dashboard");
//     } catch (err) {
//       alert(err.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <form className="auth-form" onSubmit={submit}>
//         <h2>Login</h2>

//         <input
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit">Login</button>

//         <p>
//           New user? <Link to="/register">Register</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;


import { useState } from "react";
import API from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", { email, password });

      const { token, user, permissions } = res.data;

      // ✅ STORE AUTH DATA
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      // ✅ STORE PERMISSIONS OBJECT (IMPORTANT FIX)
      localStorage.setItem(
        "permissions",
        JSON.stringify(permissions || {})
      );

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={submit}>
        <h2>Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p>
          New user? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
