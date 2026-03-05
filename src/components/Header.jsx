import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("access");
  const slug = localStorage.getItem("workspace_slug");

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (["/login", "/register"].includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* LOGO */}
          <Link to="/" className="text-xl font-bold text-blue-600">
            Slotify
          </Link>

          {/* NAVIGATION */}
          <div className="flex items-center gap-5">

            {!token ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Create Workspace
                </Link>
              </>
            ) : (
              <>
                {slug && (
                  <Link
                    to={`/workspace/${slug}`}
                    className="text-gray-700 hover:text-blue-600 font-medium"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}

          </div>
        </div>
      </header>

      {/* ================= LOGOUT MODAL ================= */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowLogoutModal(false)}
          />

          {/* modal */}
          <div className="relative bg-white rounded-xl shadow-xl w-[380px] p-6">

            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Logout
            </h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Logout
              </button>

            </div>

          </div>
        </div>
      )}
    </>
  );
}

// 17036355569-kqo9lo3vmjli90a59qdk7p0v3g4qovjr.apps.googleusercontent.com