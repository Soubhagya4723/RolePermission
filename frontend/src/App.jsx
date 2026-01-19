// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
//   Outlet
// } from "react-router-dom";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import VerifyOTP from "./pages/VerifyOTP";

// import Dashboard from "./pages/Dashboard";
// import Posts from "./pages/Posts";
// import Marksheets from "./pages/Marksheets";
// import Roles from "./pages/Roles";              // ✅ FIX
// import AddRole from "./pages/AddRole";          // ✅ NEW
// import RolePermission from "./pages/RolePermission"; // optional
// import Teams from "./pages/Teams";

// import Sidebar from "./components/Sidebar";
// import ProtectedRoute from "./components/ProtectedRoute";

// /* ================= LAYOUT ================= */
// const Layout = () => (
//   <div style={{ display: "flex" }}>
//     <Sidebar />
//     <div style={{ flex: 1, padding: "16px" }}>
//       <Outlet />
//     </div>
//   </div>
// );

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* DEFAULT */}
//         <Route path="/" element={<Navigate to="/login" replace />} />

//         {/* AUTH */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/verify-otp" element={<VerifyOTP />} />

//         {/* LOGGED-IN USERS */}
//         <Route
//           element={
//             <ProtectedRoute>
//               <Layout />
//             </ProtectedRoute>
//           }
//         >
//           <Route path="/dashboard" element={<Dashboard />} />

//           <Route
//             path="/posts"
//             element={
//               <ProtectedRoute permission="posts-view">
//                 <Posts />
//               </ProtectedRoute>
//             }
//           />

//           <Route
//             path="/marksheets"
//             element={
//               <ProtectedRoute permission="marksheets-view">
//                 <Marksheets />
//               </ProtectedRoute>
//             }
//           />

//           {/* ✅ ROLES */}
//           <Route path="/roles" element={<Roles />} />
//           <Route path="/roles/create" element={<AddRole />} />
//           <Route path="/roles/:id/edit" element={<AddRole />} />

//           {/* OPTIONAL: permissions page */}
//           <Route path="/role-permissions" element={<RolePermission />} />

//           <Route path="/teams" element={<Teams />} />
//         </Route>

//         {/* FALLBACK */}
//         <Route path="*" element={<Navigate to="/dashboard" replace />} />

//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;




import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Dashboard from "./pages/Dashboard";
import Posts from "./pages/Posts";
import Marksheets from "./pages/Marksheets";
import Roles from "./pages/Roles";
import Teams from "./pages/Teams";

import Sidebar from "./components/Sidebar";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = () => (
  <div style={{ display: "flex" }}>
    <Sidebar />
    <div style={{ flex: 1, padding: "16px" }}>
      <Outlet />
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/marksheets" element={<Marksheets />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/teams" element={<Teams />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
