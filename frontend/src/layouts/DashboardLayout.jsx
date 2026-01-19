import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  return (
    <>
      <Sidebar />
      <div className="page-wrapper">
        <Outlet />
      </div>
    </>
  );
};

export default DashboardLayout;
