import "../styles/Dashboard.css";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  return (
    <div className="dashboard-page">

      {/* ================= WELCOME ================= */}
      <div className="dashboard-welcome">
        <h1>👋 Welcome, {user?.name || "User"}</h1>
        <p>You are logged in as <strong>{role}</strong></p>
      </div>

      {/* ================= ABOUT ================= */}
      <div className="dashboard-card">
        <h2>About This Application</h2>
        <p>
          This application is a <strong>Role & Permission Management System</strong>
          designed to securely manage users, roles, permissions, posts,
          marksheets, and teams.
        </p>

        <ul>
          <li>✔ Role-Based Access Control (RBAC)</li>
          <li>✔ Admin, Manager & Viewer roles</li>
          <li>✔ Permission-based module access</li>
          <li>✔ Secure authentication with OTP</li>
          <li>✔ Scalable & maintainable architecture</li>
        </ul>
      </div>

      {/* ================= FEATURES ================= */}
      <div className="dashboard-card">
        <h2>Core Features</h2>

        <div className="feature-grid">
          <div className="feature-box">
            <h3>📄 Posts</h3>
            <p>Create, view, edit, and delete posts with permission control.</p>
          </div>

          <div className="feature-box">
            <h3>🎓 Marksheets</h3>
            <p>Manage student marksheets with automatic calculations.</p>
          </div>

          <div className="feature-box">
            <h3>🛡️ Roles</h3>
            <p>Create and manage roles dynamically.</p>
          </div>

          <div className="feature-box">
            <h3>👥 Teams</h3>
            <p>Organize users into teams with specific permissions.</p>
          </div>

          <div className="feature-box">
            <h3>🔐 Permissions</h3>
            <p>Fine-grained permission control for every module.</p>
          </div>
        </div>
      </div>

      {/* ================= HOW IT WORKS ================= */}
      <div className="dashboard-card">
        <h2>How It Works</h2>
        <ol>
          <li>User logs in using email & OTP verification</li>
          <li>System identifies assigned role</li>
          <li>Permissions are loaded dynamically</li>
          <li>Sidebar & routes adapt automatically</li>
          <li>Unauthorized access is blocked</li>
        </ol>
      </div>

      {/* ================= SECURITY ================= */}
      <div className="dashboard-card">
        <h2>Security & Access Control</h2>
        <p>
          Security is a core part of this system. All routes are protected using
          middleware and permission checks.
        </p>

        <ul>
          <li>JWT-based authentication</li>
          <li>Role & permission validation</li>
          <li>Protected backend APIs</li>
          <li>Secure session handling</li>
        </ul>
      </div>

      {/* ================= FUTURE SCOPE ================= */}
      <div className="dashboard-card">
        <h2>Future Enhancements</h2>
        <ul>
          <li>📊 Analytics dashboard</li>
          <li>📁 File uploads & document management</li>
          <li>📨 Email & notification system</li>
          <li>🌗 Dark / Light mode</li>
          <li>📱 Mobile responsiveness</li>
        </ul>
      </div>

    </div>
  );
};

export default Dashboard;
