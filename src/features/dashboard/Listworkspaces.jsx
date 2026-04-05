import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkspaces, deleteWorkspace } from "../../api/workspaceApi";
import {
  Plus, Building2, Users, ChevronRight, Loader2,
  LayoutGrid, LogOut, Search, Bell, Trash2,
  Settings, Crown, Zap, MoreVertical, RefreshCw,
  UserCheck, GraduationCap, Dumbbell, Briefcase,
  AlertCircle, X, Menu, Stethoscope, User, Clock,
  Activity,
} from "lucide-react";

// ─── tenant config ────────────────────────────────────────────────────────────

const TENANT_META = {
  MENTOR: {
    label: "Mentor",
    Icon: UserCheck,
    color: "#1d4ed8",
    bg: "#eff6ff",
    border: "#bfdbfe",
  },
  TEACHER: {
    label: "Teacher",
    Icon: GraduationCap,
    color: "#0891b2",
    bg: "#ecfeff",
    border: "#a5f3fc",
  },
  FITNESS: {
    label: "Fitness",
    Icon: Dumbbell,
    color: "#059669",
    bg: "#f0fdf4",
    border: "#a7f3d0",
  },
  CONSULTANT: {
    label: "Consultant",
    Icon: Briefcase,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "#ddd6fe",
  },
  DOCTOR: {
    label: "Doctor",
    Icon: Stethoscope,
    color: "#dc2626",
    bg: "#fff1f2",
    border: "#fecaca",
  },
};

const FILTER_TYPES = ["ALL", "MENTOR", "TEACHER", "FITNESS", "CONSULTANT", "DOCTOR"];

function getTenantMeta(type) {
  return (
    TENANT_META[(type || "").toUpperCase()] || {
      label: type || "Workspace",
      Icon: Building2,
      color: "#2563eb",
      bg: "#eff6ff",
      border: "#bfdbfe",
    }
  );
}

// ─── avatar palette (deterministic by name) ───────────────────────────────────

const AVATAR_PALETTES = [
  { bg: "#1d4ed8", text: "#fff" },
  { bg: "#0891b2", text: "#fff" },
  { bg: "#059669", text: "#fff" },
  { bg: "#7c3aed", text: "#fff" },
  { bg: "#dc2626", text: "#fff" },
  { bg: "#d97706", text: "#fff" },
];

function avatarPalette(name = "") {
  return AVATAR_PALETTES[(name.charCodeAt(0) || 0) % AVATAR_PALETTES.length];
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// ─── sub-components ───────────────────────────────────────────────────────────

function RoleBadge({ role }) {
  const r = (role || "").toUpperCase();
  if (r === "OWNER")
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0c1a3a] text-white">
        <Crown size={8} /> Owner
      </span>
    );
  if (r === "ADMIN")
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800">
        Admin
      </span>
    );
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#f0f7ff] text-[#5b8db8]">
      {role || "Member"}
    </span>
  );
}

function PlanBadge({ plan }) {
  if (!plan || plan.toUpperCase() === "FREE") return null;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
      <Crown size={8} /> {plan}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#c7dff7] rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[#e8f4ff]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-[#e8f4ff] rounded w-3/4" />
          <div className="h-2.5 bg-[#e8f4ff] rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 bg-[#e8f4ff] rounded-full" />
        <div className="h-5 w-12 bg-[#e8f4ff] rounded-full" />
      </div>
      <div className="h-px bg-[#e8f4ff] mb-4" />
      <div className="flex justify-between">
        <div className="h-2.5 w-20 bg-[#e8f4ff] rounded" />
        <div className="h-2.5 w-14 bg-[#e8f4ff] rounded" />
      </div>
    </div>
  );
}

// ─── workspace card ───────────────────────────────────────────────────────────

function WorkspaceCard({ ws, onEnter, onDelete, onSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const role    = (ws?.myrole || "MEMBER").toUpperCase();
  const isAdmin = role === "OWNER" || role === "ADMIN";
  const isOwner = role === "OWNER";
  const isFree  = (ws?.plan || "FREE").toUpperCase() === "FREE";
  const meta    = getTenantMeta(ws.tenant_type);
  const palette = avatarPalette(ws.name);
  const init    = (ws.name || "W").slice(0, 2).toUpperCase();

  const handleDelete = async (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (!window.confirm(`Delete "${ws.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    await onDelete(ws);
    setDeleting(false);
  };

  return (
    <div
      onClick={() => !deleting && onEnter(ws)}
      className={`group relative bg-white border border-[#c7dff7] hover:border-blue-400
        hover:shadow-lg rounded-2xl p-5 cursor-pointer transition-all duration-200 flex flex-col
        ${deleting ? "opacity-40 pointer-events-none" : ""}`}
    >
      {deleting && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/80 z-10">
          <Loader2 size={18} className="animate-spin text-blue-500" />
        </div>
      )}

      {/* top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: palette.bg, color: palette.text }}
          >
            {init}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#0c1a3a] truncate leading-snug">{ws.name}</p>
            <p className="text-[10px] text-[#5b8db8] truncate mt-0.5">{ws.slug}</p>
          </div>
        </div>

        {isAdmin && (
          <div className="relative ml-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o); }}
              className="w-6 h-6 flex items-center justify-center rounded-lg text-[#c7dff7]
                hover:bg-[#f0f7ff] hover:text-[#5b8db8] transition-all
                opacity-0 group-hover:opacity-100"
            >
              <MoreVertical size={13} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-7 z-30 bg-white border border-[#c7dff7]
                rounded-xl shadow-xl py-1.5 w-44">
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onSettings(ws); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium
                    text-[#0c1a3a] hover:bg-[#f0f7ff] transition-colors"
                >
                  <Settings size={12} className="text-[#5b8db8]" /> Settings
                </button>
                {isOwner && (
                  <>
                    <div className="h-px bg-[#f0f7ff] my-1" />
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium
                        text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={12} /> Delete workspace
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* badges */}
      <div className="flex items-center flex-wrap gap-1.5 mb-3">
        <span
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold border"
          style={{ background: meta.bg, color: meta.color, borderColor: meta.border }}
        >
          <meta.Icon size={10} />
          {meta.label}
        </span>
        <RoleBadge role={role} />
        <PlanBadge plan={ws.plan} />
      </div>

      {/* upgrade nudge */}
      {isFree && isAdmin && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-3">
          <Zap size={10} className="text-amber-500 flex-shrink-0" />
          <p className="text-[10px] text-amber-700 font-medium flex-1">Upgrade for more features</p>
          <button
            onClick={(e) => { e.stopPropagation(); onSettings(ws, "plans"); }}
            className="text-[10px] font-bold text-amber-700 hover:text-amber-800
              bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-md transition-colors"
          >
            View
          </button>
        </div>
      )}

      {/* stats */}
      <div className="flex items-center gap-4 py-2.5 border-t border-b border-[#f0f7ff] mb-3">
        {ws.member_count !== undefined && (
          <div className="flex items-center gap-1.5 text-[10px] text-[#5b8db8]">
            <Users size={11} />
            <span className="font-semibold text-[#0c1a3a]">{ws.member_count}</span>
            member{ws.member_count !== 1 ? "s" : ""}
          </div>
        )}
        <div className="text-[10px] text-[#5b8db8] capitalize">
          {(ws.workspace_type || "TEAM").toLowerCase()}
        </div>
        {ws.created_at && (
          <div className="text-[10px] text-[#94b4d1] ml-auto">{fmtDate(ws.created_at)}</div>
        )}
      </div>

      {/* footer */}
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[10px] text-[#94b4d1]">
          {isAdmin ? "Full access" : "View access"}
        </span>
        <div className="flex items-center gap-1 text-[#94b4d1] group-hover:text-blue-600 transition-colors">
          <span className="text-[10px] font-semibold">{isAdmin ? "Manage" : "Open"}</span>
          <ChevronRight size={12} />
        </div>
      </div>
    </div>
  );
}

// ─── sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ user, initials, onLogout, onClose, mobile = false }) {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col h-full relative overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0f1f4a 0%, #10255c 60%, #1a3a6e 100%)",
      }}
    >
      {/* grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)`,
          backgroundSize: "22px 22px",
        }}
      />

      {/* logo */}
      <div className="relative flex items-center justify-between px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <rect x="1" y="2.5" width="11" height="8.5" rx="2" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3"/>
              <path d="M4 2.5V2a2.5 2.5 0 015 0v.5" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" strokeLinecap="round"/>
              <circle cx="6.5" cy="7" r="1" fill="rgba(255,255,255,0.85)"/>
            </svg>
          </div>
          <span className="text-white font-bold text-base tracking-tight">Slotify</span>
        </div>
        {mobile && (
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
            <X size={17} />
          </button>
        )}
      </div>

      {/* nav */}
      <nav className="relative flex-1 px-3 py-5 space-y-0.5">
        <p className="text-[9px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-3">Main</p>

        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/12 border border-white/15 cursor-default">
          <LayoutGrid size={14} className="text-white flex-shrink-0" />
          <span className="text-sm font-semibold text-white">Workspaces</span>
        </div>

        {[
          { label: "Profile",  Icon: User,     path: "/profile" },
          { label: "Activity", Icon: Activity, path: "/activity" },
        ].map(({ label, Icon, path }) => (
          <button
            key={label}
            onClick={() => navigate(path)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/50
              hover:bg-white/8 hover:text-white/80 transition-all text-sm"
          >
            <Icon size={14} className="flex-shrink-0" />
            {label}
          </button>
        ))}

        <div className="pt-3">
          <p className="text-[9px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-2">Account</p>
          <button
            onClick={() => navigate("/settings")}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-white/50
              hover:bg-white/8 hover:text-white/80 transition-all text-sm"
          >
            <Settings size={14} className="flex-shrink-0" />
            Settings
          </button>
        </div>
      </nav>

      {/* user + logout */}
      <div className="relative border-t border-white/10 px-3 pb-5 pt-4">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-white/18 border border-white/25 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">{user?.first_name || "Admin"}</p>
            <p className="text-[10px] text-white/40 truncate">{user?.email || "admin@slotify.com"}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/40
            hover:bg-red-500/15 hover:text-red-300 transition-all text-sm font-medium"
        >
          <LogOut size={14} /> Sign out
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════

export default function ListWorkspaces() {
  const navigate = useNavigate();

  const [workspaces,  setWorkspaces]  = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [error,       setError]       = useState(null);
  const [search,      setSearch]      = useState("");
  const [filter,      setFilter]      = useState("ALL");
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [user,        setUser]        = useState({});

  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem("user") || "{}")); } catch {}
    fetchWorkspaces(false);
  }, []);

  const fetchWorkspaces = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setError(null);
      const data = await getWorkspaces();
      setWorkspaces(data || []);
    } catch {
      setError("Failed to load workspaces.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleEnter = (ws) => {
    if (!ws?.slug) return;
    const role = (ws?.myrole || "").toUpperCase();
    if (role === "OWNER" || role === "ADMIN") {
      navigate(`/admin/workspace/${ws.slug}/dashboard`);
    } else {
      navigate(`/professional/workspace/${ws.slug}`);
    }
  };

  const handleDelete = async (ws) => {
    try {
      await deleteWorkspace(ws.slug);
      setWorkspaces((p) => p.filter((w) => w.slug !== ws.slug));
    } catch {
      alert("Failed to delete workspace.");
    }
  };

  const handleSettings = (ws, tab = "general") => {
    navigate(`/admin/workspace/${ws.slug}/settings${tab !== "general" ? `/${tab}` : ""}`);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "AD";

  const filtered = workspaces.filter((w) => {
    const matchFilter =
      filter === "ALL" || (w.tenant_type || "").toUpperCase() === filter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (w.name || "").toLowerCase().includes(q) ||
      (w.tenant_type || "").toLowerCase().includes(q) ||
      (w.slug || "").toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const sidebarProps = { user, initials, onLogout: handleLogout };

  return (
    <div className="flex h-screen bg-[#f0f7ff] overflow-hidden">

      {/* desktop sidebar */}
      <aside className="hidden lg:flex relative w-52 flex-col flex-shrink-0 h-full overflow-hidden">
        <Sidebar {...sidebarProps} />
      </aside>

      {/* mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <aside
            className="relative w-52 h-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar {...sidebarProps} mobile onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* topbar */}
        <header className="h-14 bg-white border-b border-[#c7dff7] flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-[#5b8db8] hover:text-[#0c1a3a] p-1.5 rounded-lg hover:bg-[#f0f7ff] transition-colors"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={17} />
            </button>

            {/* search */}
            <div className="flex items-center gap-2 bg-[#f0f7ff] border border-[#c7dff7] rounded-xl px-3 py-2 w-56 sm:w-72 transition-all focus-within:border-blue-400">
              <Search size={12} className="text-[#94b4d1] flex-shrink-0" />
              <input
                type="text"
                placeholder="Search workspaces…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm text-[#0c1a3a] placeholder-[#94b4d1] w-full"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-[#94b4d1] hover:text-[#0c1a3a] transition-colors"
                >
                  <X size={11} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* refresh */}
            <button
              onClick={() => fetchWorkspaces(true)}
              className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#f0f7ff] border border-[#c7dff7]
                text-[#5b8db8] hover:text-blue-600 hover:border-blue-300 transition-all"
              title="Refresh"
            >
              <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            </button>

            {/* bell */}
            <button className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-[#f0f7ff] border border-[#c7dff7] text-[#5b8db8] hover:text-blue-600 hover:border-blue-300 transition-all">
              <Bell size={13} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white" />
            </button>

            {/* avatar */}
            <div className="w-8 h-8 rounded-full bg-[#0c1a3a] flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>

            {/* new workspace */}
            <button
              onClick={() => navigate("/create-dashboard")}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#0c1a3a] hover:bg-[#162d5e]
                text-white text-xs font-semibold rounded-xl transition-all shadow-sm ml-1"
            >
              <Plus size={12} /> New workspace
            </button>
          </div>
        </header>

        {/* page */}
        <main className="flex-1 overflow-y-auto px-5 sm:px-8 py-8">
          <div className="max-w-5xl mx-auto">

            {/* page header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl font-bold text-[#0c1a3a] tracking-tight">Your workspaces</h1>
                {!loading && (
                  <p className="text-sm text-[#5b8db8] mt-1">
                    {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
                    {search && filtered.length !== workspaces.length && ` · ${filtered.length} shown`}
                  </p>
                )}
              </div>
              <button
                onClick={() => navigate("/create-dashboard")}
                className="sm:hidden flex items-center gap-2 bg-[#0c1a3a] hover:bg-[#162d5e] text-white
                  px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm w-fit"
              >
                <Plus size={14} /> New workspace
              </button>
            </div>

            {/* filter chips */}
            <div className="flex items-center gap-2 flex-wrap mb-6">
              {FILTER_TYPES.map((f) => {
                const meta = f === "ALL" ? null : getTenantMeta(f);
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold
                      border transition-all
                      ${filter === f
                        ? "border-blue-400 bg-blue-50 text-blue-700"
                        : "border-[#c7dff7] bg-white text-[#5b8db8] hover:border-blue-300 hover:text-blue-600"
                      }`}
                  >
                    {meta && <meta.Icon size={11} style={{ color: filter === f ? "#1d4ed8" : meta.color }} />}
                    {f === "ALL" ? "All" : meta?.label}
                  </button>
                );
              })}
            </div>

            {/* error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3.5 rounded-xl mb-6">
                <AlertCircle size={15} className="flex-shrink-0" />
                <span>{error}</span>
                <button
                  onClick={() => fetchWorkspaces(false)}
                  className="ml-auto text-xs font-semibold underline underline-offset-2 hover:no-underline"
                >
                  Retry
                </button>
              </div>
            )}

            {/* skeletons */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* empty state */}
            {!loading && filtered.length === 0 && !error && (
              <div className="flex flex-col items-center justify-center py-24 gap-5">
                <div className="w-16 h-16 bg-white border-2 border-[#c7dff7] rounded-2xl flex items-center justify-center shadow-sm">
                  <Building2 size={26} className="text-[#94b4d1]" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-[#0c1a3a]">
                    {search ? "No results found" : "No workspaces yet"}
                  </p>
                  <p className="text-xs text-[#5b8db8] mt-1">
                    {search
                      ? `Nothing matches "${search}"`
                      : "Create your first workspace to get started"}
                  </p>
                </div>
                {!search && (
                  <button
                    onClick={() => navigate("/create-dashboard")}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700
                      text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-blue-200"
                  >
                    <Plus size={14} /> Create workspace
                  </button>
                )}
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="text-sm text-[#5b8db8] hover:text-[#0c1a3a] font-medium transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* grid */}
            {!loading && filtered.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((ws, idx) => (
                  <WorkspaceCard
                    key={ws.id || idx}
                    ws={ws}
                    onEnter={handleEnter}
                    onDelete={handleDelete}
                    onSettings={handleSettings}
                  />
                ))}

                {/* create card */}
                <button
                  onClick={() => navigate("/create-dashboard")}
                  className="flex flex-col items-center justify-center gap-3 bg-white border-2 border-dashed
                    border-[#c7dff7] hover:border-blue-400 hover:bg-blue-50/30 rounded-2xl p-5
                    min-h-[200px] transition-all duration-200 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#f0f7ff] group-hover:bg-blue-100 border border-[#c7dff7]
                    group-hover:border-blue-300 flex items-center justify-center transition-all">
                    <Plus size={18} className="text-[#94b4d1] group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-[#5b8db8] group-hover:text-blue-600 transition-colors">
                      New workspace
                    </p>
                    <p className="text-xs text-[#94b4d1] mt-0.5">Set up a new environment</p>
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