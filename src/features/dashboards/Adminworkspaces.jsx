import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
  Menu,
  X,
  TrendingUp,
  Clock,
  AlertCircle,
  Bell,
  Search,
  LogOut,
  User
} from "lucide-react";

import TeamMembers from "../Adminside/TeamMembers";

/* ==============================
    CONSTANTS & STYLES
============================== */
const TABS = {
  DASHBOARD: "dashboard",
  TEAM: "team",
  BOOKINGS: "bookings",
  SETTINGS: "settings",
};

/**
 * Note: Add this to your index.css or a global style file for the thin scrollbar
 * * .custom-scrollbar::-webkit-scrollbar { width: 5px; }
 * .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
 * .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
 */

export default function AdminWorkspace() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);

  const handleLogout = () => {
    // Clear localStorage/Auth tokens here if necessary
    navigate("/");
  };

  if (!slug) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 font-medium bg-slate-50">
        <AlertCircle className="mr-2" /> Workspace not found. Invalid URL.
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      
      {/* ================= FIXED SIDEBAR ================= */}
      <aside
        className={`transition-all duration-300 ease-in-out h-full flex-shrink-0 flex flex-col shadow-2xl z-20 ${
          collapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-blue-700 to-blue-900 text-white`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10 shrink-0">
          {!collapsed && (
            <span className="text-xl font-bold tracking-tight text-white italic">
              Slotify
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-white/10 p-2 rounded-lg transition-colors text-blue-100"
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            collapsed={collapsed}
            active={activeTab === TABS.DASHBOARD}
            onClick={() => setActiveTab(TABS.DASHBOARD)}
          />
          <SidebarItem
            icon={<Users size={20} />}
            label="Team Members"
            collapsed={collapsed}
            active={activeTab === TABS.TEAM}
            onClick={() => setActiveTab(TABS.TEAM)}
          />
          <SidebarItem
            icon={<Calendar size={20} />}
            label="Bookings"
            collapsed={collapsed}
            active={activeTab === TABS.BOOKINGS}
            onClick={() => setActiveTab(TABS.BOOKINGS)}
          />
          
          <div className="pt-6 pb-2 px-4">
            {!collapsed && <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest opacity-70">Configuration</p>}
          </div>
          
          <SidebarItem
            icon={<Settings size={20} />}
            label="Settings"
            collapsed={collapsed}
            active={activeTab === TABS.SETTINGS}
            onClick={() => setActiveTab(TABS.SETTINGS)}
          />
        </nav>

        {/* ================= USER & LOGOUT (Sticky at Bottom) ================= */}
        <div className="p-4 border-t border-white/10 bg-black/10 shrink-0">
          <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : "px-2"} mb-4`}>
            <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center border border-blue-400 shadow-inner">
              <User size={18} className="text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <p className="text-sm font-bold truncate text-white">Admin User</p>
                <p className="text-[10px] text-blue-200 opacity-70 truncate">admin@slotify.com</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={handleLogout}
            className={`
              group flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300
              text-blue-100 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-900/40
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            {!collapsed && <span className="text-sm font-bold tracking-wide">Logout</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Fixed Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 w-64 shadow-sm">
            <Search size={16} className="text-slate-400" />
            <input 
               type="text" 
               placeholder="Search..." 
               className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full outline-none"
            />
          </div>

          <div className="flex items-center gap-5">
            <button className="text-slate-400 hover:text-slate-600 relative p-1.5 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-200">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar scroll-smooth">
          {activeTab === TABS.DASHBOARD && <DashboardHome slug={slug} />}
          {activeTab === TABS.TEAM && <TeamMembers slug={slug} />}
          {activeTab === TABS.BOOKINGS && <PlaceholderTab title="Bookings" icon={<Calendar size={48} />} />}
          {activeTab === TABS.SETTINGS && <PlaceholderTab title="Settings" icon={<Settings size={48} />} />}
        </main>
      </div>
    </div>
  );
}

/* ================= COMPONENT: SIDEBAR ITEM ================= */

function SidebarItem({ icon, label, collapsed, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${
        active 
          ? "bg-white text-blue-700 shadow-lg" 
          : "text-blue-100 hover:bg-white/10"
      }`}
    >
      <span className={`${active ? "text-blue-600" : "text-blue-200"}`}>{icon}</span>
      {!collapsed && <span className="text-sm font-semibold">{label}</span>}
    </button>
  );
}

/* ================= COMPONENT: DASHBOARD HOME ================= */

function DashboardHome({ slug }) {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1 uppercase text-xs font-bold tracking-widest">
            Workspace: <span className="text-blue-600">{slug.replace(/-/g, " ")}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Bookings" value="1,284" growth="+12.5%" icon={<Calendar className="text-blue-600" />} />
        <StatCard title="Team Members" value="12" growth="+2" icon={<Users className="text-indigo-600" />} />
        <StatCard title="Total Revenue" value="$8,450" growth="+18.2%" icon={<TrendingUp className="text-emerald-600" />} />
        <StatCard title="Pending Review" value="5" growth="-1" icon={<Clock className="text-amber-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
           <h3 className="font-bold text-slate-800 text-lg mb-6">Activity Overview</h3>
           <div className="h-64 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2">
              <TrendingUp size={32} />
              <span className="font-medium">Data visualization coming soon</span>
           </div>
        </div>
        
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 text-lg mb-6">Recent Activity</h3>
          <div className="space-y-6">
            <ActivityItem text="New member joined: Alex" time="15m ago" type="success" />
            <ActivityItem text="Booking #442 cancelled" time="2h ago" type="error" />
            <ActivityItem text="Server Updated to v1.2" time="5h ago" type="info" />
            <ActivityItem text="Admin changed settings" time="1d ago" type="info" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENT: STAT CARD ================= */

function StatCard({ title, value, growth, icon }) {
  const isPositive = growth.startsWith('+');
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:translate-y-[-4px] transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-slate-50 rounded-xl shadow-inner">{icon}</div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {growth}
        </span>
      </div>
      <div className="mt-5">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <h4 className="text-3xl font-extrabold text-slate-900 mt-1">{value}</h4>
      </div>
    </div>
  );
}

/* ================= COMPONENT: ACTIVITY ITEM ================= */

function ActivityItem({ text, time, type }) {
  const colors = { success: "bg-emerald-500", error: "bg-rose-500", info: "bg-blue-500" };
  return (
    <div className="flex gap-4">
      <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${colors[type]}`} />
      <div>
        <p className="text-sm text-slate-700 font-semibold leading-tight">{text}</p>
        <p className="text-[11px] text-slate-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

/* ================= COMPONENT: PLACEHOLDER TAB ================= */

function PlaceholderTab({ title, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 animate-in fade-in zoom-in duration-300">
      <div className="p-6 bg-white rounded-3xl shadow-xl shadow-slate-200 text-blue-600 mb-6">{icon}</div>
      <h2 className="text-2xl font-bold text-slate-900">{title} Module</h2>
      <p className="text-slate-500 mt-2 font-medium">This section is currently under development.</p>
    </div>
  );
}