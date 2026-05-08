import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= LAYOUT ================= */
import MainLayout from "./layouts/MainLayout";

/* ================= AUTH ================= */
import Home from "./features/auth/pages/Home";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import InviteValidatePage from "./features/invite/InviteValidatePage";

/* ================= WORKSPACE ================= */
import AdminWorkspace from "./features/dashboard/Adminworkspaces";
import ProfessionalDashboard from "./features/professional/ProfessionalDashboard";


/* ================= MANAGEMENT ================= */
import WorkspaceList from "./features/dashboard/Listworkspaces";
import CreateDashboard from "./features/dashboard/CreateDashboard";

/* ================= PLANS ================= */
import PlansPage from "./features/Plans/PlansPage";

/* ================= team ================= */
import TeamMembers from "./features/Team/TeamMembers";
/* ================= PROTECTED ================= */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" replace />;
}

/* ================= APP ================= */
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ================= */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/invite-accept/:token" element={<InviteValidatePage />} />
        </Route>

        {/* ================= ADMIN WORKSPACE (MAIN SYSTEM) ================= */}
        <Route
          path="/admin/workspace/:slug/:page/:id?"
          element={
            <ProtectedRoute>
              <AdminWorkspace />
            </ProtectedRoute>
          }
        />

        {/* default page inside workspace */}
        <Route
          path="/admin/workspace/:slug"
          element={<Navigate to="/admin/workspace/default/overview" replace />}
        />

        {/* ================= PROFESSIONAL ================= */}
        <Route
          path="/professional/workspace/:slug/:page/:id?"
          element={
            <ProtectedRoute>
              <ProfessionalDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/professional/workspace/:slug"
          element={<Navigate to="/professional/workspace/default/overview" replace />}
        />

        {/* ================= MANAGEMENT ================= */}
        <Route
          path="/workspaces"
          element={<ProtectedRoute><WorkspaceList /></ProtectedRoute>}
        />

        <Route
          path="/create-dashboard"
          element={<ProtectedRoute><CreateDashboard /></ProtectedRoute>}
        />

        {/* ================= PLANS ================= */}
        <Route
          path="/plans"
          element={<ProtectedRoute><PlansPage /></ProtectedRoute>}
        />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;