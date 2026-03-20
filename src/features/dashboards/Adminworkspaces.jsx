import PlansPage from "../Plans/PlansPage";
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import TeamMembers from "../Adminside/TeamMembers";
import {
  LayoutDashboard, Users, Calendar, Settings,
  Menu, X, TrendingUp, Clock, Bell, Search,
  LogOut, User, IdCard, AlertCircle, RefreshCw,
  ArrowUpRight, ArrowDownRight, Zap,
} from "lucide-react";


/* ─── tab keys (match URL segments exactly) ──────────────────────────────── */
const TABS = {
  DASHBOARD: "dashboard",
  TEAM:      "team",
  BOOKINGS:  "bookings",
  PLANS:     "plans",
  SETTINGS:  "settings",
};


/* ═══════════════════════════════════════════════════════════════════════════
   ROOT LAYOUT
═══════════════════════════════════════════════════════════════════════════ */
export default function AdminWorkspace() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [collapsed,    setCollapsed]    = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [adminUser,    setAdminUser]    = useState(null);

  // Derive active tab from URL — single source of truth
  const page = location.pathname.split("/").pop();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      setAdminUser(stored);
    } catch { /* ignore */ }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!slug) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-red-500 text-sm gap-2">
        <AlertCircle size={16} />
        Workspace not found. Invalid URL.
      </div>
    );
  }

  const navItems = [
    { tab: TABS.DASHBOARD, label: "Dashboard",    icon: <LayoutDashboard size={18} /> },
    { tab: TABS.TEAM,      label: "Team Members", icon: <Users size={18} /> },
    { tab: TABS.BOOKINGS,  label: "Bookings",     icon: <Calendar size={18} /> },
    { tab: TABS.PLANS,     label: "Plans",        icon: <IdCard size={18} /> },
  ];

  const configItems = [
    { tab: TABS.SETTINGS, label: "Settings", icon: <Settings size={18} /> },
  ];

  const initials = adminUser?.email
    ? adminUser.email.slice(0, 2).toUpperCase()
    : "AD";

  /* ── sidebar shared across desktop + mobile ── */
  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-blue-600/30 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1" y="3" width="12" height="9" rx="2" stroke="#fff" strokeWidth="1.5" />
                <path d="M4 3V2.5a3 3 0 016 0V3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="7" cy="7.5" r="1" fill="#fff" />
              </svg>
            </div>
            <span className="text-white font-bold text-base tracking-tight">Slotify</span>
          </div>
        )}
        <button
          onClick={() => { setCollapsed(!collapsed); setMobileOpen(false); }}
          className="text-blue-200 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors"
        >
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ tab, label, icon }) => (
          <button
            key={tab}
            onClick={() => { navigate(`/admin/workspace/${slug}/${tab}`); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium
              ${page === tab
                ? "bg-white text-blue-700 shadow-sm font-semibold"
                : "text-blue-100 hover:bg-white/10 hover:text-white"
              }
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <span className={page === tab ? "text-blue-600" : "text-blue-200"}>
              {icon}
            </span>
            {!collapsed && label}
          </button>
        ))}

        {/* config section */}
        {!collapsed && (
          <p className="text-[10px] font-semibold text-blue-400/60 uppercase tracking-widest px-3 pt-5 pb-1">
            Configuration
          </p>
        )}
        {collapsed && <div className="pt-3" />}

        {configItems.map(({ tab, label, icon }) => (
          <button
            key={tab}
            onClick={() => { navigate(`/admin/workspace/${slug}/${tab}`); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm font-medium
              ${page === tab
                ? "bg-white text-blue-700 shadow-sm font-semibold"
                : "text-blue-100 hover:bg-white/10 hover:text-white"
              }
              ${collapsed ? "justify-center" : ""}
            `}
          >
            <span className={page === tab ? "text-blue-600" : "text-blue-200"}>
              {icon}
            </span>
            {!collapsed && label}
          </button>
        ))}
      </nav>

      {/* user + logout */}
      <div className="px-3 pb-4 pt-3 border-t border-blue-600/30 shrink-0 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {adminUser?.first_name || "Admin"}
              </p>
              <p className="text-[10px] text-blue-200/70 truncate">
                {adminUser?.email || "admin@slotify.com"}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-100
            hover:bg-red-500 hover:text-white transition-all duration-150 text-sm font-medium
            ${collapsed ? "justify-center" : ""}
          `}
        >
          <LogOut size={17} className="group-hover:-translate-x-0.5 transition-transform" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* ── desktop sidebar ── */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 h-full transition-all duration-300
          bg-blue-700 z-20 ${collapsed ? "w-16" : "w-56"}`}
      >
        <SidebarContent />
      </aside>

      {/* ── mobile sidebar overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="w-56 h-full bg-blue-700 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* ── main area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0 z-10">
          <div className="flex items-center gap-3">
            {/* mobile hamburger */}
            <button
              className="lg:hidden text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>

            {/* search */}
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-56">
              <Search size={13} className="text-gray-300 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search…"
                className="bg-transparent outline-none text-sm text-gray-800 placeholder-gray-300 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* notification bell */}
            <button className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
            </button>

            {/* workspace pill */}
            <div className="hidden sm:flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-1.5">
              <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="0.5" y="2" width="9" height="7.5" rx="1.5" stroke="#fff" strokeWidth="1.2" />
                  <path d="M3 2V1.5a2 2 0 014 0V2" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-blue-700 capitalize">
                {slug.replace(/-/g, " ")}
              </span>
            </div>

            {/* avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        </header>

        {/* page content */}
        <main className="flex-1 overflow-y-auto">
          {page === TABS.DASHBOARD && <DashboardHome slug={slug} />}
          {page === TABS.TEAM      && <TeamMembers   slug={slug} />}
          {page === TABS.PLANS     && <PlansPage     slug={slug} />}
          {page === TABS.BOOKINGS  && <PlaceholderTab title="Bookings" icon={<Calendar size={40} />} />}
          {page === TABS.SETTINGS  && <PlaceholderTab title="Settings" icon={<Settings size={40} />} />}
        </main>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   DASHBOARD HOME — fetches real data
═══════════════════════════════════════════════════════════════════════════ */
function DashboardHome({ slug }) {
  const [stats,      setStats]      = useState(null);
  const [activity,   setActivity]   = useState([]);
  const [bookings,   setBookings]   = useState([]);
  const [statsLoad,  setStatsLoad]  = useState(true);
  const [actLoad,    setActLoad]    = useState(true);
  const [bkLoad,     setBkLoad]     = useState(true);
  const [lastRefresh,setLastRefresh]= useState(new Date());

  const fetchStats = async () => {
    try {
      setStatsLoad(true);
      const res = await axiosInstance.get(`/workspaces/${slug}/stats/`);
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch error:", err);
      // fallback placeholder so UI doesn't break
      setStats({ total_bookings: "—", team_members: "—", revenue: "—", pending: "—" });
    } finally {
      setStatsLoad(false);
    }
  };

  const fetchActivity = async () => {
    try {
      setActLoad(true);
      const res = await axiosInstance.get(`/workspaces/${slug}/activity/`);
      setActivity(res.data.activity || res.data || []);
    } catch (err) {
      console.error("Activity fetch error:", err);
      setActivity([]);
    } finally {
      setActLoad(false);
    }
  };

  const fetchBookings = async () => {
    try {
      setBkLoad(true);
      const res = await axiosInstance.get(`/workspaces/${slug}/bookings/?limit=5`);
      setBookings(res.data.results || res.data.bookings || res.data || []);
    } catch (err) {
      console.error("Bookings fetch error:", err);
      setBookings([]);
    } finally {
      setBkLoad(false);
    }
  };

  const refresh = () => {
    setLastRefresh(new Date());
    fetchStats();
    fetchActivity();
    fetchBookings();
  };

  useEffect(() => {
    fetchStats();
    fetchActivity();
    fetchBookings();
  }, [slug]);

  const timeStr = lastRefresh.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const statCards = [
    {
      label:   "Total Bookings",
      value:   statsLoad ? "—" : (stats?.total_bookings ?? "0"),
      growth:  stats?.bookings_growth ?? null,
      iconBg:  "bg-blue-50",
      icon:    <Calendar size={16} className="text-blue-600" />,
    },
    {
      label:   "Team Members",
      value:   statsLoad ? "—" : (stats?.team_members ?? "0"),
      growth:  stats?.members_growth ?? null,
      iconBg:  "bg-green-50",
      icon:    <Users size={16} className="text-green-600" />,
    },
    {
      label:   "Revenue",
      value:   statsLoad ? "—" : (stats?.revenue ? `₹${Number(stats.revenue).toLocaleString("en-IN")}` : "₹0"),
      growth:  stats?.revenue_growth ?? null,
      iconBg:  "bg-amber-50",
      icon:    <TrendingUp size={16} className="text-amber-600" />,
    },
    {
      label:   "Pending Review",
      value:   statsLoad ? "—" : (stats?.pending ?? "0"),
      growth:  stats?.pending_growth ?? null,
      iconBg:  "bg-red-50",
      icon:    <Clock size={16} className="text-red-500" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 space-y-6">

      {/* header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5 capitalize">
            {slug.replace(/-/g, " ")} · updated at {timeStr}
          </p>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(({ label, value, growth, iconBg, icon }) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            growth={growth}
            iconBg={iconBg}
            icon={icon}
            loading={statsLoad}
          />
        ))}
      </div>

      {/* lower grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* bookings table */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-900">Recent Bookings</h3>
            <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
              View all
            </span>
          </div>

          {bkLoad ? (
            <div className="py-14 text-center text-sm text-gray-300">Loading bookings…</div>
          ) : bookings.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-2">
              <Calendar size={28} className="text-gray-200" />
              <p className="text-sm text-gray-400">No bookings yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {/* head */}
              <div className="grid grid-cols-[1fr_100px_90px_90px] px-5 py-2.5 bg-gray-50">
                {["Customer", "Service", "Date", "Status"].map((h) => (
                  <p key={h} className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{h}</p>
                ))}
              </div>
              {bookings.slice(0, 5).map((b, i) => (
                <div key={b.id || i} className="grid grid-cols-[1fr_100px_90px_90px] px-5 py-3 items-center hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {b.customer_name || b.customer_email || "—"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{b.customer_email || ""}</p>
                  </div>
                  <p className="text-xs text-gray-600 truncate">{b.service_name || b.service || "—"}</p>
                  <p className="text-xs text-gray-400">
                    {b.date ? new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                  </p>
                  <BookingStatusBadge status={b.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* activity feed */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
            <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
            <span className="text-[10px] bg-green-50 text-green-600 border border-green-100 px-2 py-0.5 rounded-full font-semibold">
              Live
            </span>
          </div>

          {actLoad ? (
            <div className="py-14 text-center text-sm text-gray-300">Loading…</div>
          ) : activity.length === 0 ? (
            <div className="py-14 flex flex-col items-center gap-2">
              <Zap size={24} className="text-gray-200" />
              <p className="text-sm text-gray-400">No activity yet</p>
            </div>
          ) : (
            <div className="px-5 py-3 space-y-0 divide-y divide-gray-50">
              {activity.slice(0, 6).map((a, i) => (
                <ActivityItem
                  key={a.id || i}
                  text={a.message || a.text || "—"}
                  time={a.created_at || a.time}
                  type={a.type || "info"}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


/* ─── stat card ──────────────────────────────────────────────────────────── */
function StatCard({ label, value, growth, iconBg, icon, loading }) {
  const isPositive = growth === null ? null : String(growth).startsWith("+") || Number(growth) > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:-translate-y-0.5 transition-transform">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        {growth !== null && growth !== undefined && (
          <div className={`flex items-center gap-0.5 text-[11px] font-semibold px-2 py-0.5 rounded-full
            ${isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
            {isPositive
              ? <ArrowUpRight size={11} />
              : <ArrowDownRight size={11} />
            }
            {String(growth).replace(/^[+-]/, "")}
          </div>
        )}
      </div>
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`text-2xl font-bold text-gray-900 mt-0.5 ${loading ? "animate-pulse text-gray-200" : ""}`}>
        {value}
      </p>
    </div>
  );
}


/* ─── booking status badge ───────────────────────────────────────────────── */
function BookingStatusBadge({ status }) {
  const map = {
    confirmed: "bg-green-50 text-green-700",
    pending:   "bg-amber-50 text-amber-700",
    cancelled: "bg-red-50 text-red-600",
    completed: "bg-blue-50 text-blue-700",
  };
  const cls = map[(status || "").toLowerCase()] || "bg-gray-100 text-gray-500";
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${cls}`}>
      {status || "—"}
    </span>
  );
}


/* ─── activity item ──────────────────────────────────────────────────────── */
function ActivityItem({ text, time, type }) {
  const dotColor = {
    success: "bg-green-500",
    error:   "bg-red-500",
    warning: "bg-amber-500",
    info:    "bg-blue-500",
  }[type] || "bg-gray-400";

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const diff  = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins  < 1)  return "just now";
    if (mins  < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="flex items-start gap-3 py-3">
      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${dotColor}`} />
      <div>
        <p className="text-xs font-medium text-gray-700 leading-snug">{text}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">{timeAgo(time)}</p>
      </div>
    </div>
  );
}


/* ─── placeholder tab ────────────────────────────────────────────────────── */
function PlaceholderTab({ title, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-20 h-20 bg-white border border-gray-200 rounded-3xl shadow-sm flex items-center justify-center text-gray-300 mb-5">
        {icon}
      </div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-400 mt-1">This module is under development.</p>
    </div>
  );
}