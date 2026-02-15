import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Header = () => {

  const [productsOpen, setProductsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("access");

  return (

    <header className="bg-white border-b sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600"
        >
          Slotify
        </Link>


        {/* NAV LINKS */}
        <nav className="hidden md:flex items-center gap-8">

          {/* PRODUCTS */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >

            <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600">

              Products

              <ChevronDown size={16} />

            </button>


            {productsOpen && (

              <div className="absolute top-8 left-0 bg-white shadow-lg border rounded-lg w-56 p-3">

                <Link
                  to="/products/scheduling"
                  className="block px-3 py-2 hover:bg-gray-100 rounded"
                >
                  Scheduling
                </Link>

                <Link
                  to="/products/workspaces"
                  className="block px-3 py-2 hover:bg-gray-100 rounded"
                >
                  Workspaces
                </Link>

                <Link
                  to="/products/analytics"
                  className="block px-3 py-2 hover:bg-gray-100 rounded"
                >
                  Analytics
                </Link>

              </div>

            )}

          </div>


          {/* SERVICES */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >

            <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600">

              Services

              <ChevronDown size={16} />

            </button>


            {servicesOpen && (

              <div className="absolute top-8 left-0 bg-white shadow-lg border rounded-lg w-56 p-3">

                <Link
                  to="/services/doctors"
                  className="block px-3 py-2 hover:bg-gray-100 rounded"
                >
                  For Doctors
                </Link>

                <Link
                  to="/services/teachers"
                  className="block px-3 py-2 hover:bg-gray-100 rounded"
                >
                  For Teachers
                </Link>

                <Link
                  to="/services/freelancers"
                  className="block px-3 py-2 hover:bg-gray-100 rounded"
                >
                  For Freelancers
                </Link>

              </div>

            )}

          </div>


          {/* PRICING */}
          <Link
            to="/pricing"
            className="text-gray-700 hover:text-blue-600"
          >
            Pricing
          </Link>

        </nav>


        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {!isLoggedIn ? (

            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>

              <Link
                to="/create-workspace"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Create Workspace
              </Link>
            </>

          ) : (

            <Link
              to="/dashboard"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Dashboard
            </Link>

          )}

        </div>

      </div>

    </header>

  );

};

export default Header;
