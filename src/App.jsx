import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ==============================
   LAYOUT
============================== */
import MainLayout from "./layouts/MainLayout";

/* ==============================
   AUTH PAGES
============================== */
import Home from "./features/auth/pages/Home";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";

/* ==============================
   WORKSPACE PAGES
============================== */
import CreateDashboard from "./features/dashboards/CreateDashboard";
import WorkspaceList from "./features/dashboards/Listworkspaces";
import AdminWorkspace from "./features/dashboards/Adminworkspaces";

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

        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
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

        {/* Dynamic Workspace Route */}
        <Route
          path="/workspace/:slug"
          element={
            <ProtectedRoute>
              <AdminWorkspace />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
