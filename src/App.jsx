import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ==============================
   LAYOUTS
============================== */
import MainLayout from "./layouts/MainLayout";

/* ==============================
   AUTH PAGES
============================== */
import Home from "./features/auth/pages/Home";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

/* ==============================
   PROFESSIONAL
============================== */
import ProfessionalDashboard from "./features/professional/ProfessionalDashboard";
import ProfessionalProfile from "./features/professional/ProfessionalProfile";
import AdminProfessionalDetail from "./features/professional/AdminProfessionalDeatail";

/* ==============================
   PLANS
============================== */
import PlansPage from "./features/Plans/PlansPage";

/* ==============================
   WORKSPACE
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
   APP ROUTER
============================== */

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* TEST */}
        <Route path="/test" element={<div>TEST PAGE</div>} />

        {/* ================= PUBLIC ROUTES ================= */}

        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/invite-accept/:token" element={<InviteValidatePage />} />
        </Route>


        {/* ================= ADMIN AREA ================= */}

        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          {/* Admin Professional Detail */}
          <Route
            path="/admin/professionals/:id"
            element={<AdminProfessionalDetail />}
          />
        </Route>


        {/* ================= ADMIN WORKSPACE TABS ================= */}
        {/* Each tab has its own URL — AdminWorkspace reads `page` from the URL internally */}

        <Route
          path="/admin/workspace/:slug/dashboard"
          element={<ProtectedRoute><AdminWorkspace /></ProtectedRoute>}
        />
        <Route
          path="/admin/workspace/:slug/team"
          element={<ProtectedRoute><AdminWorkspace /></ProtectedRoute>}
        />
        <Route
          path="/admin/workspace/:slug/bookings"
          element={<ProtectedRoute><AdminWorkspace /></ProtectedRoute>}
        />
        <Route
          path="/admin/workspace/:slug/plans"
          element={<ProtectedRoute><AdminWorkspace /></ProtectedRoute>}
        />
        <Route
          path="/admin/workspace/:slug/settings"
          element={<ProtectedRoute><AdminWorkspace /></ProtectedRoute>}
        />

        {/* Redirect bare /admin/workspace/:slug → dashboard */}
        <Route
          path="/admin/workspace/:slug"
          element={<Navigate to="dashboard" replace />}
        />


        {/* ================= WORKSPACE MANAGEMENT ================= */}

        <Route
          path="/workspaces"
          element={<ProtectedRoute><WorkspaceList /></ProtectedRoute>}
        />

        <Route
          path="/create-dashboard"
          element={<ProtectedRoute><CreateDashboard /></ProtectedRoute>}
        />


        {/* ================= PROFESSIONAL AREA ================= */}

        <Route
          path="/professional/workspace/:slug"
          element={<ProtectedRoute><ProfessionalDashboard /></ProtectedRoute>}
        />

        <Route
          path="/professional/profile"
          element={<ProtectedRoute><ProfessionalProfile /></ProtectedRoute>}
        />


        {/* ================= FALLBACK ================= */}

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;