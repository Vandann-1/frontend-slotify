import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Menu,
  X,
} from "lucide-react";

import TeamMembers from "../Adminside/TeamMembers";

/* ==============================
   TAB CONSTANTS
============================== */
const TABS = {
  DASHBOARD: "dashboard",
  TEAM: "team",
  BOOKINGS: "bookings",
  SETTINGS: "settings",
};

export default function AdminWorkspace() {
  // ==============================
  // CHANGE 1: Get slug from router
  // This is the SINGLE source of truth
  // ==============================
  const { slug } = useParams();

  // Debug — remove later
  console.log("Admin workspace slug:", slug);

  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);

  // ==============================
  // CHANGE 2: Safety guard
  // Prevents undefined workspace crashes
  // ==============================
  if (!slug) {
    return (
      <div className="p-6 text-red-500">
        Workspace not found. Invalid URL.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* ================= SIDEBAR ================= */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-blue-600">
          {!collapsed && (
            <h1 className="text-lg font-semibold tracking-wide">
              Slotify
            </h1>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-white/10 p-1 rounded"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            collapsed={collapsed}
            active={activeTab === TABS.DASHBOARD}
            onClick={() => setActiveTab(TABS.DASHBOARD)}
          />

          <SidebarItem
            icon={<Users size={18} />}
            label="Team Members"
            collapsed={collapsed}
            active={activeTab === TABS.TEAM}
            onClick={() => setActiveTab(TABS.TEAM)}
          />

          <SidebarItem
            icon={<Calendar size={18} />}
            label="Bookings"
            collapsed={collapsed}
            active={activeTab === TABS.BOOKINGS}
            onClick={() => setActiveTab(TABS.BOOKINGS)}
          />

          <SidebarItem
            icon={<Settings size={18} />}
            label="Settings"
            collapsed={collapsed}
            active={activeTab === TABS.SETTINGS}
            onClick={() => setActiveTab(TABS.SETTINGS)}
          />
        </nav>
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 bg-white p-10">
        {/* ================= DASHBOARD TAB ================= */}
        {activeTab === TABS.DASHBOARD && (
          <>
            <h2 className="text-2xl font-semibold mb-4 capitalize">
              {slug.replace(/-/g, " ")} Dashboard
            </h2>
            <p className="text-gray-500">
              Welcome to your workspace admin panel.
            </p>
          </>
        )}

        {/* ================= TEAM MEMBERS TAB ================= */}
        {activeTab === TABS.TEAM && (
          <>
            {/* 
              CHANGE 3 (MOST IMPORTANT):

              We PASS the slug down to TeamMembers.
              TeamMembers MUST forward it to InviteMemberForm.
            */}
            <TeamMembers slug={slug} />
          </>
        )}

        {/* ================= BOOKINGS TAB ================= */}
        {activeTab === TABS.BOOKINGS && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Bookings</h2>
            <p className="text-gray-500">
              Bookings module coming soon.
            </p>
          </div>
        )}

        {/* ================= SETTINGS TAB ================= */}
        {activeTab === TABS.SETTINGS && (
          <div>
            <h2 className="text-2xl font-semibold mb-2">Settings</h2>
            <p className="text-gray-500">
              Settings module coming soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= REUSABLE SIDEBAR ITEM ================= */

function SidebarItem({ icon, label, collapsed, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
        active
          ? "bg-white/20 text-white"
          : "text-blue-100 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {!collapsed && (
        <span className="text-sm font-medium tracking-wide">
          {label}
        </span>
      )}
    </div>
  );
}