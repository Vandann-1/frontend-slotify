import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current URL path

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for access token to update login state
    const token = localStorage.getItem("access"); // Matches your Login logic
    setIsLoggedIn(!!token);
  }, [location]); // Re-run check when path changes

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("tenant");
    localStorage.removeItem("user_email");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // ============================================================
  // HIDE HEADER ON LOGIN PAGE
  // ============================================================
  // Add any other paths here where you want to hide the header
  if (location.pathname === "/login" || location.pathname === "/register") {
    return null;
  }

  return (
    <header className="bg-white shadow relative z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="text-xl font-bold text-blue-600">
          Slotify
        </Link>

        {/* RIGHT SIDE */}
        <div className="flex gap-4 items-center">
          {!isLoggedIn ? (
            <>
              {/* NOT LOGGED IN */}
              <Link to="/login" className="text-gray-600 hover:text-blue-600">
                Login
              </Link>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Create Workspace
              </Link>
            </>
          ) : (
            <>
              {/* LOGGED IN */}
              <Link
                to="/dashboard/CreateDashboard"
                className="text-gray-600 hover:text-blue-600"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}