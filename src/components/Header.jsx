import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Calendar,
  LayoutDashboard,
  BarChart,
  Stethoscope,
  GraduationCap,
  Briefcase
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {

  const [productsOpen, setProductsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const isLoggedIn = localStorage.getItem("access");

  return (

    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">


        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          Slotify
        </Link>



        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">


          {/* PRODUCTS */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >

            <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium">

              Products <ChevronDown size={16} />

            </button>


            <AnimatePresence>

              {productsOpen && (

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-10 left-0 w-72 bg-white rounded-xl shadow-xl border p-3"
                >

                  <DropdownItem
                    icon={<Calendar size={18} />}
                    title="Scheduling"
                    desc="Manage bookings and appointments"
                    to="/products/scheduling"
                  />

                  <DropdownItem
                    icon={<LayoutDashboard size={18} />}
                    title="Workspaces"
                    desc="Organize teams and workflows"
                    to="/products/workspaces"
                  />

                  <DropdownItem
                    icon={<BarChart size={18} />}
                    title="Analytics"
                    desc="Track performance and insights"
                    to="/products/analytics"
                  />

                </motion.div>

              )}

            </AnimatePresence>

          </div>



          {/* SERVICES */}
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >

            <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium">

              Services <ChevronDown size={16} />

            </button>


            <AnimatePresence>

              {servicesOpen && (

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-10 left-0 w-72 bg-white rounded-xl shadow-xl border p-3"
                >

                  <DropdownItem
                    icon={<Stethoscope size={18} />}
                    title="Doctors"
                    desc="Manage patient appointments"
                    to="/services/doctors"
                  />

                  <DropdownItem
                    icon={<GraduationCap size={18} />}
                    title="Teachers"
                    desc="Schedule classes and sessions"
                    to="/services/teachers"
                  />

                  <DropdownItem
                    icon={<Briefcase size={18} />}
                    title="Freelancers"
                    desc="Manage client bookings"
                    to="/services/freelancers"
                  />

                </motion.div>

              )}

            </AnimatePresence>

          </div>



          {/* Pricing */}
          <Link
            to="/pricing"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Pricing
          </Link>


        </nav>



        {/* Right side */}
        <div className="flex items-center gap-4">


          {!isLoggedIn ? (

            <>

              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </Link>


              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >

                <Link
                  to="/Register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg shadow-md"
                >
                  Get Started
                </Link>

              </motion.div>

            </>

          ) : (

            <motion.div whileHover={{ scale: 1.05 }}>

              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-lg shadow-md"
              >
                Dashboard
              </Link>

            </motion.div>

          )}

        </div>

      </div>

    </header>

  );

};



function DropdownItem({ icon, title, desc, to }) {

  return (

    <Link
      to={to}
      className="flex gap-3 p-3 rounded-lg hover:bg-gray-100 transition"
    >

      <div className="text-blue-600">
        {icon}
      </div>

      <div>

        <div className="font-medium text-gray-900">
          {title}
        </div>

        <div className="text-sm text-gray-500">
          {desc}
        </div>

      </div>

    </Link>

  );

}

export default Header;
