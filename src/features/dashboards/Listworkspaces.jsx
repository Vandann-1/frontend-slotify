import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkspaces, deleteWorkspace } from "../../api/workspaceApi";
import {
  Building2, Plus, LayoutGrid, LogOut,
  Menu, X, Search, Bell, Loader2, Trash2,
  Settings, ChevronRight, Crown, Users,
  Zap, MoreVertical,
} from "lucide-react";


// ─── workspace avatar colour pool ────────────────────────────────────────────
const WS_COLORS = [
  ["bg-blue-600",    "text-blue-600",    "bg-blue-50"],
  ["bg-violet-600",  "text-violet-600",  "bg-violet-50"],
  ["bg-cyan-600",    "text-cyan-600",    "bg-cyan-50"],
  ["bg-rose-600",    "text-rose-600",    "bg-rose-50"],
  ["bg-amber-600",   "text-amber-600",   "bg-amber-50"],
  ["bg-emerald-600", "text-emerald-600", "bg-emerald-50"],
];

function wsColor(name = "") {
  return WS_COLORS[(name.charCodeAt(0) || 0) % WS_COLORS.length];
}


// ─── role pill ────────────────────────────────────────────────────────────────
function RolePill({ role }) {
  const map = {
    OWNER:        "bg-gray-900 text-white",
    ADMIN:        "bg-blue-600 text-white",
    PROFESSIONAL: "bg-gray-100 text-gray-600",
    MEMBER:       "bg-gray-100 text-gray-600",
  };
  const cls = map[(role || "").toUpperCase()] || "bg-gray-100 text-gray-500";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
      {role || "Member"}
    </span>
  );
}


// ─── plan pill ────────────────────────────────────────────────────────────────
function PlanPill({ plan }) {
  const isFree = (plan || "FREE").toUpperCase() === "FREE";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold
      ${isFree ? "bg-gray-100 text-gray-500" : "bg-amber-50 text-amber-700 border border-amber-100"}`}>
      {!isFree && <Crown size={9} />}
      {plan || "Free"}
    </span>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
export default function ListWorkspaces() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [error,      setError]      = useState(null);
  const [search,     setSearch]     = useState("");
  const [menuOpen,   setMenuOpen]   = useState(null);
  const [user,       setUser]       = useState({});

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem("user") || "{}")); } catch {}
    fetchWorkspaces();
  }, []);

  // close context menu on outside click
  useEffect(() => {
    const close = () => setMenuOpen(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const data = await getWorkspaces();
      setWorkspaces(data || []);
    } catch {
      setError("Failed to load workspaces. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleEnter = (workspace) => {
    if (!workspace?.slug) return;
    const role = (workspace?.myrole || "").toUpperCase();
    if (role === "OWNER" || role === "ADMIN") {
      navigate(`/admin/workspace/${workspace.slug}/dashboard`);
    } else {
      navigate(`/professional/workspace/${workspace.slug}`);
    }
  };

  const handleDelete = async (e, workspace) => {
    e.stopPropagation();
    setMenuOpen(null);
    if (!window.confirm(`Delete workspace "${workspace.name}"? This cannot be undone.`)) return;
    try {
      await deleteWorkspace(workspace.slug);
      setWorkspaces((prev) => prev.filter((w) => w.slug !== workspace.slug));
    } catch {
      alert("Failed to delete workspace.");
    }
  };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "AD";

  const filtered = workspaces.filter((w) =>
    (w.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (w.slug || "").toLowerCase().includes(search.toLowerCase())
  );

  // ── sidebar (shared between desktop + mobile) ──
  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-blue-600/30 shrink-0">
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
      <nav className="flex-1 px-3 py-4">
        <button
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold
            bg-white text-blue-700 shadow-sm ${collapsed ? "justify-center" : ""}`}
        >
          <LayoutGrid size={17} className="text-blue-600 flex-shrink-0" />
          {!collapsed && "Workspaces"}
        </button>
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
                {user?.first_name || "Admin"}
              </p>
              <p className="text-[10px] text-blue-200/70 truncate">
                {user?.email || "admin@slotify.com"}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
            text-blue-100 hover:bg-red-500 hover:text-white transition-all text-sm font-medium
            ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={17} className="group-hover:-translate-x-0.5 transition-transform" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </div>
  );

  // ── loading screen ──
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 size={22} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col flex-shrink-0 h-full bg-blue-700 transition-all duration-300
          ${collapsed ? "w-16" : "w-56"}`}
      >
        <SidebarContent />
      </aside>

      {/* mobile overlay sidebar */}
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

      {/* main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-60">
              <Search size={13} className="text-gray-300 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search workspaces…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm text-gray-800 placeholder-gray-300 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <Bell size={15} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
          </div>
        </header>

        {/* page body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-8">
          <div className="max-w-5xl mx-auto">

            {/* page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Your Workspaces</h1>
                <p className="text-sm text-gray-400 mt-0.5">
                  {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""} · select one to continue
                </p>
              </div>
              <button
                onClick={() => navigate("/create-dashboard")}
                className="flex items-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm w-fit"
              >
                <Plus size={15} />
                New Workspace
              </button>
            </div>

            {/* error */}
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            {/* empty state */}
            {filtered.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-2xl flex items-center justify-center text-gray-200 shadow-sm">
                  <Building2 size={28} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    {search ? "No workspaces match your search" : "No workspaces yet"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {search ? "Try a different name" : "Create your first workspace to get started"}
                  </p>
                </div>
                {!search && (
                  <button
                    onClick={() => navigate("/create-dashboard")}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
                  >
                    <Plus size={14} />
                    Create workspace
                  </button>
                )}
              </div>
            )}

            {/* workspace grid */}
            {filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

                {filtered.map((workspace) => {
                  const role        = (workspace?.myrole || "MEMBER").toUpperCase();
                  const plan        = (workspace?.plan   || "FREE").toUpperCase();
                  const isFree      = plan === "FREE";
                  const isAdmin     = role === "OWNER" || role === "ADMIN";
                  const [bgCls, textCls, lightBg] = wsColor(workspace.name);
                  const nameInitials = (workspace.name || "W").slice(0, 2).toUpperCase();
                  const isMenuOpen  = menuOpen === workspace.id;

                  return (
                    <div
                      key={workspace.id}
                      onClick={() => handleEnter(workspace)}
                      className="group relative bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col gap-4"
                    >
                      {/* header row */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${bgCls} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                            {nameInitials}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate leading-tight">
                              {workspace.name}
                            </p>
                            <p className="text-[11px] text-gray-400 truncate mt-0.5">
                              {workspace.slug}.slotify.io
                            </p>
                          </div>
                        </div>

                        {/* ⋮ context menu — admin only */}
                        {isAdmin && (
                          <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => { e.stopPropagation(); setMenuOpen(isMenuOpen ? null : workspace.id); }}
                              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-300 hover:bg-gray-100 hover:text-gray-500 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <MoreVertical size={14} />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-40">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(null);
                                    navigate(`/admin/workspace/${workspace.slug}/settings`);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Settings size={13} className="text-gray-400" />
                                  Settings
                                </button>
                                <button
                                  onClick={(e) => handleDelete(e, workspace)}
                                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 size={13} />
                                  Delete workspace
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* pills */}
                      <div className="flex items-center flex-wrap gap-1.5">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${lightBg} ${textCls}`}>
                          {workspace.workspace_type || "TEAM"}
                        </span>
                        <RolePill role={role} />
                        <PlanPill plan={workspace.plan || "Free"} />
                      </div>

                      {/* member count */}
                      {workspace.member_count !== undefined && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                          <Users size={12} />
                          <span>
                            {workspace.member_count} member{workspace.member_count !== 1 ? "s" : ""}
                          </span>
                        </div>
                      )}

                      {/* upgrade nudge — free plan admins only */}
                      {isFree && isAdmin && (
                        <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl p-3">
                          <Zap size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[11px] font-semibold text-amber-700">Upgrade your plan</p>
                            <p className="text-[10px] text-amber-600/80 mt-0.5 leading-relaxed">
                              Unlock more members, analytics &amp; automation.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* footer */}
                      <div className="flex items-center justify-between mt-auto pt-1">
                        {isFree && isAdmin ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/admin/workspace/${workspace.slug}/plans`);
                            }}
                            className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-100 px-2.5 py-1.5 rounded-lg transition-colors"
                          >
                            <Crown size={11} />
                            Upgrade Plan
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-300">
                            {workspace.created_at
                              ? `Created ${new Date(workspace.created_at).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric",
                                })}`
                              : ""}
                          </span>
                        )}

                        <div className="flex items-center gap-1 text-gray-300 group-hover:text-blue-500 transition-colors">
                          <span className="text-[11px] font-semibold group-hover:text-blue-500">
                            {isAdmin ? "Manage" : "Open"}
                          </span>
                          <ChevronRight size={13} />
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* create new card */}
                <button
                  onClick={() => navigate("/create-dashboard")}
                  className="flex flex-col items-center justify-center gap-3 bg-white border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/30 rounded-2xl p-5 min-h-[180px] transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <Plus size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-400 group-hover:text-blue-600 transition-colors">
                      New workspace
                    </p>
                    <p className="text-xs text-gray-300 mt-0.5">Set up a new environment</p>
                  </div>
                </button>

              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}