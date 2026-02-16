import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";


// ========================================
// LAYOUT
// ========================================

import MainLayout from "./layouts/MainLayout";


// ========================================
// AUTH PAGES
// ========================================

import Home from "./features/auth/pages/Home";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";


// ========================================
// ADMIN PAGE
// ========================================

// import Dashboard from "./features/dashboards/CreateDashboard";
import CreateDashboard from "./features/dashboards/CreateDashboard";


// ========================================
// CLIENT PAGE
// ========================================

// import UserProfile from "./features/user/pages/UserProfile";



// ========================================
// PROTECTED ROUTE
// Check if logged in
// ========================================

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("access");

  if (!token) {

    return <Navigate to="/login" replace />;

  }

  return children;

}



// ========================================
// ADMIN ROUTE
// Only admin can access dashboard
// ========================================

function AdminRoute({ children }) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) {

    return <Navigate to="/login" replace />;

  }

  if (user.role !== "admin") {

    return <Navigate to={`/u/${user.username}`} replace />;

  }

  return children;

}



// ========================================
// CLIENT ROUTE
// Only client can access profile
// ========================================

function ClientRoute({ children }) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) {

    return <Navigate to="/login" replace />;

  }

  if (user.role !== "client") {

    return <Navigate to="/createdashboard" replace />;

  }

  return children;

}



// ========================================
// APP COMPONENT
// ========================================

function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* PUBLIC ROUTES */}

        <Route element={<MainLayout />}>

          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />

        </Route>



        {/* ADMIN DASHBOARD */}

        <Route
          path="/createdashboard"
          element={
            <ProtectedRoute>
              <AdminRoute>
                <CreateDashboard />
              </AdminRoute>
            </ProtectedRoute>
          }
        />



        {/* CLIENT PROFILE */}

        {/* <Route
          path="/u/:username"
          element={
            <ProtectedRoute>
              <ClientRoute>
                <UserProfile />
              </ClientRoute>
            </ProtectedRoute>
          }
        /> */}



        {/* FALLBACK */}

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />


      </Routes>

    </BrowserRouter>

  );

}

export default App;
