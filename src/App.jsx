import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ================= LAYOUT ================= */
import MainLayout from "./layouts/MainLayout";

/* ================= AUTH ================= */
import Home from "./features/auth/pages/Home";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import InviteValidatePage from "./features/invite/InviteValidatePage";

/* ================= ADMIN CORE ================= */
import CreateService from "./features/dashboard/CreateService";
import CreateAvailability from "./features/dashboard/CreateAvailability";
import BookingsList from "./features/Bookings/BookingsList";

/* ================= PROFESSIONAL ================= */
import ProfessionalDashboard from "./features/professional/ProfessionalDashboard";
import ProfessionalProfile from "./features/professional/ProfessionalProfile";
import AdminProfessionalDetail from "./features/professional/AdminProfessionalDeatail";

/* ================= WORKSPACE ================= */
import CreateDashboard from "./features/dashboard/CreateDashboard";
import WorkspaceList from "./features/dashboard/Listworkspaces";
import AdminWorkspace from "./features/dashboard/Adminworkspaces";

/* ================= PLANS ================= */
import PlansPage from "./features/Plans/PlansPage";

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

        {/* ================= ADMIN STATIC ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="create-service" element={<CreateService />} />
          <Route path="create-availability" element={<CreateAvailability />} />
          <Route path="bookings" element={<BookingsList />} />

          {/* default */}
          <Route index element={<Navigate to="create-service" replace />} />
        </Route>

        {/* ================= WORKSPACE (ONLY ONE ROUTE) ================= */}
        <Route
          path="/admin/workspace/:slug/:page"
          element={
            <ProtectedRoute>
              <AdminWorkspace />
            </ProtectedRoute>
          }
        />

        {/* default workspace */}
        <Route
          path="/admin/workspace/:slug"
          element={<Navigate to="/admin/workspace/default/dashboard" replace />}
        />

        {/* ================= PROFESSIONAL ================= */}
        <Route
          path="/professional/workspace/:slug"
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

        {/* ================= ADMIN PROFESSIONAL ================= */}
        <Route
          path="/admin/professionals/:id"
          element={
            <ProtectedRoute>
              <MainLayout />
              <AdminProfessionalDetail />
            </ProtectedRoute>
          }
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