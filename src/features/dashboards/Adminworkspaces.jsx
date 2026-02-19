import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Menu,
  X
} from "lucide-react";
// import TeamMembers from "./TeamMembers";

export default function AdminWorkspace() {

  const { slug } = useParams();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* SIDEBAR */}
      <div
        className={`transition-all duration-300 ${
          collapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-blue-700 to-blue-900 text-white flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-blue-600">
          {!collapsed && <h1 className="text-lg font-semibold">Slotify</h1>}
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-2">

          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            collapsed={collapsed}
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />

          <SidebarItem
            icon={<Users size={18} />}
            label="Team Members"
            collapsed={collapsed}
            active={activeTab === "team"}
            onClick={() => setActiveTab("team")}
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
      </div>

      {/* MAIN */}
      <div className="flex-1 bg-white p-10">

        {activeTab === "dashboard" && (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              {slug.replace("-", " ")} Dashboard
            </h2>
            <p className="text-gray-500">
              Welcome to your workspace admin panel.
            </p>
          </>
        )}

        {activeTab === "team" && (
          <TeamMembers slug={slug} />
        )}

      </div>
    </div>
  );
}

function SidebarItem({ icon, label, collapsed, active, onClick }) {
  return (
    <div
      onClick={onClick}
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
