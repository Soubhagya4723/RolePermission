import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "./layout.css";

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
