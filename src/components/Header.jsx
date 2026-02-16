import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {

  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    const token = localStorage.getItem("access_token");

    setIsLoggedIn(!!token);

  }, []);


  const handleLogout = () => {

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    localStorage.removeItem("workspace");

    setIsLoggedIn(false);

    navigate("/login");

  };


  return (

    <header className="bg-white shadow">

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <Link
          to="/"
          className="text-xl font-bold text-blue-600"
        >
          Slotify
        </Link>


        {/* RIGHT SIDE */}
        <div className="flex gap-4 items-center">

          {!isLoggedIn ? (
            <>
              {/* NOT LOGGED IN */}

              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600"
              >
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
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
