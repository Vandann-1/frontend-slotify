import { useEffect, useState } from "react";
import professionalApi from "../../api/professionalApi";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  ChevronLeft,
  CalendarDays,
  Clock,
  CreditCard,
  Users,
  Settings,
} from "lucide-react";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState("");

  // ================= LOAD MEMBERSHIPS =================
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await professionalApi.getMyMemberships();
        if (!mounted) return;

        const data = res?.data;
        setMemberships(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Membership load failed:", err);
        if (mounted) {
          setError("Failed to load workspaces");
          setMemberships([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse space-y-4 w-80">
          <div className="h-6 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* ================= SIDEBAR ================= */}
      <aside
        className={`${
          collapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-blue-700 to-blue-600 text-white p-4 hidden md:flex md:flex-col transition-all duration-300`}
      >
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between mb-10">
          {!collapsed && (
            <h1 className="text-xl font-bold tracking-wide">
              Slotify Pro
            </h1>
          )}

          <button
            onClick={() => setCollapsed((s) => !s)}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="space-y-2 flex-1">
          {/* MAIN */}
          <p
            className={`text-xs uppercase text-white/60 mb-2 ${
              collapsed ? "hidden" : ""
            }`}
          >
            Main
          </p>

          <NavLink
            to="/professional/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <LayoutDashboard size={18} />
            {!collapsed && <span>Overview</span>}
          </NavLink>

          <NavLink
            to="/professional/bookings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <CalendarDays size={18} />
            {!collapsed && <span>Bookings</span>}
          </NavLink>

          <NavLink
            to="/professional/slots"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <Clock size={18} />
            {!collapsed && <span>Availability</span>}
          </NavLink>

          <NavLink
            to="/professional/plans"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <CreditCard size={18} />
            {!collapsed && <span>Plans</span>}
          </NavLink>

          <NavLink
            to="/professional/clients"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <Users size={18} />
            {!collapsed && <span>Clients</span>}
          </NavLink>

          {/* ACCOUNT */}
          <p
            className={`text-xs uppercase text-white/60 mt-6 mb-2 ${
              collapsed ? "hidden" : ""
            }`}
          >
            Account
          </p>

          <NavLink
            to="/professional/profile"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <User size={18} />
            {!collapsed && <span>My Profile</span>}
          </NavLink>

          <NavLink
            to="/professional/settings"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                isActive ? "bg-white/20" : "hover:bg-white/10"
              }`
            }
          >
            <Settings size={18} />
            {!collapsed && <span>Settings</span>}
          </NavLink>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 mt-6 px-3 py-2 rounded-lg bg-red-500/90 hover:bg-red-500 transition text-sm font-medium"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">
        {/* ===== TOPBAR ===== */}
        <header className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm">
          <h2 className="font-semibold text-gray-800">
            Professional Dashboard
          </h2>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">
                {user?.email || "User"}
              </p>
              <p className="text-xs text-gray-500">Professional</p>
            </div>

            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white flex items-center justify-center font-bold shadow">
              {(user?.email?.[0] || "U").toUpperCase()}
            </div>
          </div>
        </header>

        {/* ===== CONTENT ===== */}
        <main className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back 👋
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your workspace memberships
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-600 text-sm border">
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-md border">
              <p className="text-sm text-gray-500">Total Workspaces</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {memberships.length}
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border">
              <p className="text-sm text-gray-500">Account Type</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                Professional
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-md border">
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                Active
              </p>
            </div>
          </div>

          {/* Workspaces */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Your Workspaces
            </h3>

            {memberships.length === 0 ? (
              <div className="bg-white border rounded-2xl p-16 text-center shadow-md">
                <p className="text-gray-700 font-medium">
                  No workspace membership yet
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Accept an invitation to see workspaces here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {memberships.map((m, i) => (
                  <div
                    key={i}
                    className="bg-white border rounded-2xl p-6 shadow-md hover:shadow-xl transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 capitalize">
                      {m?.workspace || "Workspace"}
                    </h3>

                    <span className="mt-3 inline-block text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      {m?.role || "Member"}
                    </span>

                    <p className="mt-4 text-xs text-gray-400">
                      Workspace membership
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;