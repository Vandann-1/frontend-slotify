import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ==============================
   LAYOUT
============================== */
import MainLayout from "./layouts/MainLayout";

/* ==============================
   AUTH PAGES (PUBLIC)
============================== */
import Home from "./features/auth/pages/Home";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

/* ==============================
   PROFESSIONAL PAGES
============================== */
import ProfessionalDashboard from "./features/professional/ProfessionalDashboard";
import ProfessionalProfile from "./features/professional/ProfessionalProfile";
import AdminProfessionalDetail from "./features/professional/AdminProfessionalDeatail";

/* ==============================
   WORKSPACE PAGES
============================== */
import CreateDashboard from "./features/dashboards/CreateDashboard";
import WorkspaceList from "./features/dashboards/Listworkspaces";
import AdminWorkspace from "./features/dashboards/Adminworkspaces";
import InviteValidatePage from "./features/invite/InviteValidatePage";

/* ==============================
   PROTECTED ROUTE
============================== */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" replace />;
}

/* ==============================
   APP COMPONENT
============================== */
function App() {
  return (
    <BrowserRouter>
      <Routes>
<Route path="/test" element={<div>TEST PAGE</div>} />
        {/* ================= PUBLIC ROUTES ================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/invite" element={<InviteValidatePage />} />
          <Route path="/professional/profile"element={<ProfessionalProfile/>}/>    
          <Route path="/admin/professionals/:id" element={<AdminProfessionalDetail />}/> 
        </Route>
 
        {/* ================= WORKSPACE (PROTECTED) ================= */}
        <Route
          path="/workspaces"
          element={
            <ProtectedRoute>
              <WorkspaceList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-dashboard"
          element={
            <ProtectedRoute>
              <CreateDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/workspace/:slug"
          element={
            <ProtectedRoute>
              <AdminWorkspace />
            </ProtectedRoute>
          }
        />

        {/* ================= PROFESSIONAL (PROTECTED) ================= */}
        <Route
          path="/professional/dashboard"
          element={
            <ProtectedRoute>
              <ProfessionalDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/professional/profile"
          element={
            <ProtectedRoute>
              <ProfessionalProfile />
            </ProtectedRoute>
          }
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;