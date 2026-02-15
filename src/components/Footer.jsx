import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  ShieldCheck,
  Globe,
  Circle
} from "lucide-react";

const Footer = () => {

  return (

    <footer className="bg-[#0B0F19] text-slate-400">

      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">

          {/* BRAND */}
          <div className="lg:col-span-2">

            <div className="flex items-center gap-2 mb-4">

              <Calendar className="text-blue-500" size={24} />

              <span className="text-white text-2xl font-bold">
                Slotify
              </span>

            </div>

            <p className="text-sm leading-relaxed mb-6 max-w-sm">
              Modern scheduling infrastructure for professionals and teams.
              Manage bookings, clients, and workflows from one unified workspace.
            </p>

            {/* TRUST BADGES */}
            <div className="flex items-center gap-5 text-xs text-slate-500">

              <div className="flex items-center gap-1">
                <ShieldCheck size={14}/>
                Enterprise Security
              </div>

              <div className="flex items-center gap-1">
                <Globe size={14}/>
                Global Infrastructure
              </div>

            </div>

            {/* CTA */}
            <Link
              to="/create-workspace"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-3 rounded-lg font-medium transition shadow-lg shadow-blue-600/20"
            >
              Create Workspace →
            </Link>

          </div>


          {/* PRODUCT */}
          <div>

            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Product
            </h3>

            <ul className="space-y-3 text-sm">

              <li>
                <Link to="#" className="hover:text-white transition">
                  Scheduling
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-white transition">
                  Workspaces
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-white transition">
                  Client Management
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-white transition">
                  Analytics
                </Link>
              </li>

            </ul>

          </div>


          {/* SOLUTIONS */}
          <div>

            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Solutions
            </h3>

            <ul className="space-y-3 text-sm">

              <li>
                <Link to="#" className="hover:text-white">
                  Doctors
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-white">
                  Freelancers
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-white">
                  Consultants
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-white">
                  Teams
                </Link>
              </li>

            </ul>

          </div>


          {/* COMPANY */}
          <div>

            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Company
            </h3>

            <ul className="space-y-3 text-sm">

              <li>
                <Link to="#" className="hover:text-white">
                  About
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-white">
                  Careers
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-white">
                  Blog
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-white">
                  Contact
                </Link>
              </li>

            </ul>

          </div>


          {/* LEGAL */}
          <div>

            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">
              Legal
            </h3>

            <ul className="space-y-3 text-sm">

              <li>
                <Link to="#" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-white">
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-white">
                  Security
                </Link>
              </li>

              <li>
                <Link to="#" className="hover:text-white">
                  Status
                </Link>
              </li>

            </ul>

          </div>

        </div>


        {/* GRADIENT SEPARATOR */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-14"></div>


        {/* BOTTOM */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

          {/* LEFT */}
          <div className="flex items-center gap-3 text-xs text-slate-500">

            <span>
              © 2026 Slotify Inc.
            </span>

            <span>
              All rights reserved.
            </span>

            {/* STATUS */}
            <div className="flex items-center gap-1 text-green-400">

              <Circle size={8} fill="currentColor" />

              All systems operational

            </div>

          </div>


          {/* RIGHT */}
          <div className="flex gap-6 text-xs text-slate-500">

            <Link to="#" className="hover:text-white">
              Docs
            </Link>

            <Link to="#" className="hover:text-white">
              API
            </Link>

            <Link to="#" className="hover:text-white">
              Support
            </Link>

            <Link to="#" className="hover:text-white">
              Contact
            </Link>

          </div>

        </div>

      </div>

    </footer>

  );

};

export default Footer;
