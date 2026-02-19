import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  TrendingUp
} from "lucide-react";

export default function AdminWorkspace() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ================= SIDEBAR ================= */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col shadow-xl`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-blue-600">
          {!collapsed && (
            <h1 className="text-lg font-semibold tracking-wide">
              Slotify
            </h1>
          )}
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            collapsed={collapsed}
            active
          />
          <SidebarItem
            icon={<Users size={18} />}
            label="Team Members"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Calendar size={18} />}
            label="Bookings"
            collapsed={collapsed}
          />
          <SidebarItem
            icon={<Settings size={18} />}
            label="Settings"
            collapsed={collapsed}
          />
        </nav>

        {/* Profile */}
        <div className="px-4 py-4 border-t border-blue-600 flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-full"></div>
          {!collapsed && (
            <div>
              <p className="text-sm font-medium">Vandan</p>
              <p className="text-xs text-blue-200">Admin</p>
            </div>
          )}
        </div>
      </div>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col bg-white">

        {/* Top Navbar */}
        <div className="border-b border-gray-200 px-8 py-4 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg w-72">
            <Search size={16} className="text-gray-400" />
            <input
              placeholder="Search..."
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <Bell size={18} className="text-gray-600" />
            <div className="w-9 h-9 bg-blue-700 rounded-full"></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 space-y-10">

          {/* Header */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Dashboard Overview
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Monitor performance and manage workspace activity.
            </p>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-6">
            <StatCard title="Total Users" value="1,284" growth="+8%" />
            <StatCard title="Active Bookings" value="324" growth="+12%" />
            <StatCard title="Revenue" value="₹1,20,000" growth="+5%" />
            <StatCard title="Conversion Rate" value="24%" growth="+2%" />
          </div>

          {/* Analytics Section */}
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-700 mb-4">
                Revenue Analytics
              </h3>
              <div className="h-56 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                Chart Area
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-medium text-gray-700 mb-4">
                Recent Activity
              </h3>
              <ActivityItem name="New booking created" />
              <ActivityItem name="User joined workspace" />
              <ActivityItem name="Payment received" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/* Sidebar Item */
function SidebarItem({ icon, label, collapsed, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
        active
          ? "bg-white/20 text-white"
          : "text-blue-100 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </div>
  );
}

/* Stat Card */
function StatCard({ title, value, growth }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-semibold mt-2 text-gray-800">
        {value}
      </h3>
      <div className="flex items-center gap-1 mt-3 text-green-600 text-xs">
        <TrendingUp size={14} />
        {growth} this month
      </div>
    </div>
  );
}

/* Activity */
function ActivityItem({ name }) {
  return (
    <div className="text-sm text-gray-600 py-2 border-b border-gray-100 last:border-none">
      {name}
    </div>
  );
}
