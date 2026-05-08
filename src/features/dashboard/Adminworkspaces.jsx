// ============================================================
//  AdminWorkspace.jsx  –  Slotify SaaS Admin Dashboard
//  Premium White · Sky-Blue Light Theme · Tailwind CSS
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import { getDashboard } from "../../api/workspaceApi";
import { COMPONENT_MAP } from "../../layouts/componentMap";
import { NAV_CONFIG } from "../../layouts/navConfig";

// ─── Slotify Light Brand Tokens ───────────────────────────────────────────────
// Primary    : #0EA5E9  (sky-500)
// Accent     : #38BDF8  (sky-400)
// Light bg   : #F0F7FF
// Surface    : #FFFFFF
// Surface 2  : #F7FAFF
// Border     : #BFDBFE
// Border dim : #DBEAFE
// Sidebar    : #0C1E3A  (deep navy)
// Muted txt  : #64748B
// ─────────────────────────────────────────────────────────────────────────────

// ─── Reusable micro-components ───────────────────────────────────────────────

function SlotifyMark({ size = 32, shadow = true }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 9,
        background: "linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.42,
        fontWeight: 800,
        color: "#fff",
        flexShrink: 0,
        boxShadow: shadow ? "0 4px 14px rgba(14,165,233,0.38)" : "none",
        letterSpacing: "-0.03em",
      }}
    >
      S
    </div>
  );
}

function Avatar({ initials = "A", size = 34, gradient = "linear-gradient(135deg,#0369a1,#0ea5e9)", border = "2px solid #BFDBFE", fontSize = 13 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: gradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
        border,
        cursor: "pointer",
      }}
    >
      {initials}
    </div>
  );
}

function ChevronRight({ color = "#94A3B8", size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function ChevronLeft({ color = "#94A3B8", size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, delta, up }) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-blue-100 bg-white p-5 transition-all duration-200 hover:border-sky-300 hover:shadow-lg hover:shadow-sky-100"
      style={{ fontFamily: "'DM Sans', 'Sora', ui-sans-serif, sans-serif" }}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] rounded-t-2xl"
        style={{ background: up ? "linear-gradient(90deg, transparent, #0EA5E9, transparent)" : "linear-gradient(90deg, transparent, #f87171, transparent)", opacity: 0.6 }}
      />
      {/* Corner glow */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-sky-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p
        className="text-[26px] font-extrabold leading-none tracking-tight text-slate-800"
        style={{ letterSpacing: "-0.05em" }}
      >
        {value}
      </p>
      <div className={`mt-2.5 flex items-center gap-1 text-[11px] font-semibold ${up ? "text-sky-500" : "text-red-400"}`}>
        <span
          className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[9.5px] font-bold"
          style={{
            background: up ? "rgba(14,165,233,0.1)" : "rgba(248,113,113,0.1)",
            color: up ? "#0369a1" : "#dc2626",
          }}
        >
          {up ? "↑" : "↓"} {delta}
        </span>
        <span className="text-slate-400">vs last month</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AdminWorkspace() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { slug }   = useParams();

  const [dashboard,  setDashboard]  = useState(null);
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Fetch dashboard ──────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    getDashboard(slug)
      .then((res) => { setDashboard(res.data || res); })
      .catch((err) => { console.error("Dashboard fetch error:", err); });
  }, [slug]);

  // ── Loading ──────────────────────────────────────────────
  if (!dashboard) {
    return (
      <div
        className="flex h-screen flex-col items-center justify-center gap-4"
        style={{ background: "#F0F7FF", fontFamily: "'DM Sans','Sora',ui-sans-serif,sans-serif" }}
      >
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-2 border-sky-200 border-t-sky-500 animate-spin" />
          <SlotifyMark size={28} shadow={false}
            // centered inside spinner
            style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}
          />
        </div>
        <div className="text-center">
          <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-sky-500">
            Loading workspace
          </p>
          <p className="mt-1 text-[11px] text-slate-400">{slug}</p>
        </div>
      </div>
    );
  }

  // ── Nav items from backend ───────────────────────────────
  const navItems = (dashboard?.sections?.length
    ? dashboard.sections
    : ["overview"]
  )
    .map((key) => ({ key, ...NAV_CONFIG[key] }))
    .filter((item) => item.label);

  // ── Current page ─────────────────────────────────────────
  const pathParts = location.pathname.split("/").filter(Boolean);
  const page      = pathParts[pathParts.length - 1] || "overview";

  // ── Component loader ─────────────────────────────────────
  const Component = COMPONENT_MAP[page] || (() => (
    <div className="flex h-60 items-center justify-center text-sky-400/60 text-sm">
      Page not found
    </div>
  ));

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#F0F7FF", fontFamily: "'DM Sans','Sora',ui-sans-serif,sans-serif", color: "#0c2340" }}
    >
      {/* ══════════════════════════════════════════════════
          SIDEBAR — Deep Navy (brand contrast)
      ══════════════════════════════════════════════════ */}
<aside
  className="bg-gradient-to-r from-blue-600 to-blue-500"
  style={{
    width: collapsed ? 68 : 236,
    minWidth: collapsed ? 68 : 236,
    borderRight: "1px solid #60A5FA", // Tailwind blue-400
    display: "flex",
    flexDirection: "column",
    transition: "width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1)",
    overflow: "hidden",
    zIndex: 50,
    position: "relative",
  }}
>
  {/* ── Logo strip ── */}
  <div
    style={{
      padding: collapsed ? "18px 0" : "18px 18px",
      borderBottom: "1px solid #60A5FA",
      display: "flex",
      alignItems: "center",
      gap: 10,
      minHeight: 62,
      justifyContent: collapsed ? "center" : "flex-start",
    }}
  >
    <SlotifyMark size={32} color="#FFFFFF" />

    {!collapsed && (
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-bold leading-tight" style={{ color: "#FFFFFF", letterSpacing: "-0.02em" }}>
          Slotify
        </p>
        <p className="mt-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em]" style={{ color: "#DBEAFE" }}> {/* blue-100 */}
          Admin Console
        </p>
      </div>
    )}

    {!collapsed ? (
      <button
        onClick={() => setCollapsed(true)}
        title="Collapse sidebar"
        className="ml-auto flex items-center rounded-md p-1 transition-colors hover:bg-white/15"
        style={{ background: "none", border: "none", cursor: "pointer", color: "#DBEAFE" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#DBEAFE"; }}
      >
        <ChevronLeft size={16} color="currentColor" />
      </button>
    ) : (
      <button
        onClick={() => setCollapsed(false)}
        title="Expand sidebar"
        className="flex items-center rounded-md p-1 transition-colors hover:bg-white/15"
        style={{ background: "none", border: "none", cursor: "pointer", color: "#DBEAFE" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#DBEAFE"; }}
      >
        <ChevronRight size={16} color="currentColor" />
      </button>
    )}
  </div>

  {/* ── Workspace badge ── */}
  {!collapsed && (
    <div
      className="mx-3 my-3 flex items-center gap-2 rounded-lg px-3 py-2"
      style={{ background: "#1E40AF", border: "1px solid #60A5FA" }} // blue-800 background
    >
      <span
        className="h-2 w-2 flex-shrink-0 rounded-full"
        style={{ background: "#10B981", boxShadow: "0 0 8px rgba(16, 185, 129, 0.6)" }} 
      />
      <span className="truncate text-[12px] font-semibold" style={{ color: "#FFFFFF" }}>
        {slug || "workspace"}
      </span>
      <span
        className="ml-auto flex-shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
        style={{ background: "rgba(255, 255, 255, 0.9)", color: "#1E40AF" }}
      >
        Live
      </span>
    </div>
  )}

  {/* ── Scrollable Navigation ── */}
  <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#60A5FA transparent" }}>
    
    {/* ── Section 1: Core ── */}
    {!collapsed && (
      <p className="px-5 pb-1.5 pt-2 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "#DBEAFE", opacity: 0.8 }}>
        Core
      </p>
    )}
    <nav className="px-2 py-1">
      {navItems
        .filter(item => ['overview', 'team', 'plans'].includes(item.key))
        .map((item) => {
          const Icon = item.icon;
          const active = page === item.key;

          return (
            <button
              key={item.key}
              onClick={() => navigate(`/admin/workspace/${slug}/${item.key}`)}
              title={collapsed ? item.label : undefined}
              className="relative mb-1 w-full rounded-lg border-0 outline-none transition-all duration-150"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: collapsed ? "10px 0" : "8px 11px",
                justifyContent: collapsed ? "center" : "flex-start",
                cursor: "pointer",
                background: active ? "rgba(255, 255, 255, 0.25)" : "transparent", 
                color: "#FFFFFF",
                fontWeight: active ? 600 : 500,
                fontSize: 13,
                letterSpacing: "-0.01em",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              {active && (
                <span
                  className="absolute left-0 rounded-r-full"
                  style={{ top: "15%", bottom: "15%", width: 3, background: "#FFFFFF", boxShadow: "0 0 8px #FFFFFF" }}
                />
              )}
              {Icon && <Icon size={18} style={{ flexShrink: 0, color: "inherit", opacity: active ? 1 : 0.8 }} />}
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
    </nav>

    {/* ── Section 2: Features ── */}
    {!collapsed && (
      <p className="px-5 pb-1.5 pt-4 text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "#DBEAFE", opacity: 0.8 }}>
        Features
      </p>
    )}
    <nav className="px-2 py-1">
      {navItems
        .filter(item => !['overview', 'team', 'plans'].includes(item.key))
        .map((item) => {
          const Icon = item.icon;
          const active = page === item.key;

          return (
            <button
              key={item.key}
              onClick={() => navigate(`/admin/workspace/${slug}/${item.key}`)}
              title={collapsed ? item.label : undefined}
              className="relative mb-1 w-full rounded-lg border-0 outline-none transition-all duration-150"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: collapsed ? "10px 0" : "8px 11px",
                justifyContent: collapsed ? "center" : "flex-start",
                cursor: "pointer",
                background: active ? "rgba(255, 255, 255, 0.25)" : "transparent",
                color: "#FFFFFF",
                fontWeight: active ? 600 : 500,
                fontSize: 13,
                letterSpacing: "-0.01em",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)";
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent";
              }}
            >
              {active && (
                <span
                  className="absolute left-0 rounded-r-full"
                  style={{ top: "15%", bottom: "15%", width: 3, background: "#FFFFFF", boxShadow: "0 0 8px #FFFFFF" }}
                />
              )}
              {Icon && <Icon size={18} style={{ flexShrink: 0, color: "inherit", opacity: active ? 1 : 0.8 }} />}
              {!collapsed && <span className="truncate">{item.label}</span>}
              
              {!collapsed && item.badge && (
                <span
                  className="ml-auto rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                  style={{ background: "rgba(255,255,255,0.2)", color: "#FFFFFF" }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
    </nav>
  </div>

  {/* ── Upgrade nudge (collapsed: hidden) ── */}
  {!collapsed && (
    <div
      className="mx-3 mb-3 mt-2 rounded-xl p-3 shadow-lg"
      style={{ 
        background: "rgba(255, 255, 255, 0.15)", 
        border: "1px solid #60A5FA" 
      }}
    >
      <p className="text-[12px] font-bold" style={{ color: "#FFFFFF" }}>Slotify Pro</p>
      <p className="mt-1 text-[11px] leading-snug" style={{ color: "#DBEAFE" }}>Unlock advanced routing & priority team support</p>
      <button
        className="mt-3 w-full rounded-lg py-1.5 text-[11px] font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-px"
        style={{ 
          background: "#FFFFFF", 
          color: "#2563EB", // blue-600 text for the button
          border: "none", 
          cursor: "pointer", 
          fontFamily: "inherit" 
        }}
      >
        Upgrade Plan ↗
      </button>
    </div>
  )}

  {/* ── Bottom user strip ── */}
  <div
    style={{
      borderTop: "1px solid #60A5FA",
      padding: collapsed ? "12px 0" : "12px 14px",
      display: "flex",
      alignItems: "center",
      gap: 10,
      justifyContent: collapsed ? "center" : "flex-start",
      background: "#1D4ED8" // Tailwind blue-700 to anchor the footer cleanly
    }}
  >
    <Avatar 
      initials="AU" 
      size={32} 
      border="2px solid rgba(255,255,255,0.2)" 
      background="#FFFFFF" 
      textColor="#2563EB" 
    />

    {!collapsed && (
      <>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-bold leading-tight" style={{ color: "#FFFFFF" }}>
            Admin User
          </p>
          <p className="mt-0.5 truncate text-[11px] font-medium" style={{ color: "#DBEAFE" }}>
            Super Admin
          </p>
        </div>
        <button
          style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#DBEAFE" }}
          className="rounded-md transition-colors hover:bg-white/15"
          title="Account Settings"
          onMouseEnter={(e) => { e.currentTarget.style.color = "#FFFFFF"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#DBEAFE"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /><circle cx="5" cy="12" r="1.5" />
          </svg>
        </button>
      </>
    )}
  </div>
</aside>

      {/* ══════════════════════════════════════════════════
          MAIN AREA
      ══════════════════════════════════════════════════ */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden" style={{ background: "#F0F7FF" }}>

        {/* ── Top bar ── */}
        <header
          className="flex items-center gap-3 border-b border-blue-100 bg-white px-6"
          style={{ height: 62, minHeight: 62 }}
        >
          {/* Breadcrumb */}
          <div className="flex flex-1 items-center gap-1.5">
            <span className="text-[11.5px] text-slate-400">Admin</span>
            <ChevronRight color="#CBD5E1" />
            <span className="text-[11.5px] font-medium text-sky-600">{slug}</span>
            <ChevronRight color="#CBD5E1" />
            <span className="text-[13px] font-bold text-sky-500">
              {NAV_CONFIG[page]?.label || page}
            </span>
          </div>

          {/* Search */}
          <div
            className="flex items-center gap-2 rounded-xl border border-blue-100 bg-slate-50 px-3 py-2 transition-all hover:border-sky-300 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100"
            style={{ width: 210 }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              placeholder="Search…"
              className="flex-1 bg-transparent text-[12px] text-slate-700 outline-none placeholder:text-slate-400"
              style={{ fontFamily: "inherit" }}
            />
            <span
              className="rounded border border-blue-100 px-1.5 py-0.5 font-mono text-[9.5px] text-slate-400"
            >
              ⌘K
            </span>
          </div>

          {/* Notification bell */}
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-white text-slate-500 transition-all hover:border-sky-300 hover:text-sky-500 hover:shadow-sm"
            style={{ cursor: "pointer" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span
              className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-sky-500"
              style={{ boxShadow: "0 0 5px rgba(14,165,233,0.6)" }}
            />
          </button>

          {/* Settings */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-100 bg-white text-slate-500 transition-all hover:border-sky-300 hover:text-sky-500 hover:shadow-sm"
            style={{ cursor: "pointer" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>

          {/* Divider */}
          <div className="h-7 w-px bg-blue-100" />

          {/* Avatar */}
          <div className="flex items-center gap-2">
            <Avatar initials="A" size={34} border="2px solid #BFDBFE" />
            <div className="hidden sm:block">
              <p className="text-[12px] font-semibold leading-tight text-slate-700">Admin User</p>
              <p className="text-[10px] text-slate-400">Super Admin</p>
            </div>
          </div>
        </header>

        {/* ── Page content ── */}
        <main
          className="flex-1 overflow-y-auto"
          style={{ padding: "24px 30px", scrollbarWidth: "thin", scrollbarColor: "#BFDBFE transparent" }}
        >
          {/* ── Page heading ── */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1
                  className="text-[23px] font-extrabold text-slate-800"
                  style={{ letterSpacing: "-0.03em", lineHeight: 1.15 }}
                >
                  {NAV_CONFIG[page]?.label || page}
                </h1>
                <span
                  className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: "rgba(14,165,233,0.1)", color: "#0369a1" }}
                >
                  Live
                </span>
              </div>
              <p className="mt-1.5 text-[12.5px] text-slate-400">
                Workspace ·{" "}
                <span className="font-semibold text-sky-600">{slug}</span>
              </p>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-2.5">
              <button
                className="flex items-center gap-2 rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-[12.5px] font-semibold text-slate-600 shadow-sm transition-all hover:border-sky-300 hover:text-sky-600"
                style={{ cursor: "pointer", fontFamily: "inherit" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Export
              </button>
              <button
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12.5px] font-bold text-white shadow-md transition-all hover:shadow-sky-200 hover:-translate-y-px active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg,#0EA5E9 0%,#0284c7 100%)",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(14,165,233,0.35)",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New Action
              </button>
            </div>
          </div>

          {/* ── Stats strip ── */}
          <div
            className="mb-6 grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}
          >
            {[
              { label: "Total Users",     value: "12,840", delta: "+8.2%",  up: true  },
              { label: "Active Sessions", value: "3,241",  delta: "+12.5%", up: true  },
              { label: "Revenue",         value: "$94.2k", delta: "+5.3%",  up: true  },
              { label: "Churn Rate",      value: "1.8%",   delta: "-0.4%",  up: false },
            ].map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* ── Dynamic component area ── */}
          <div
            className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm"
          >
            {/* Section header */}
            <div className="flex items-center justify-between border-b border-blue-100 bg-slate-50/60 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="h-7 w-7 flex-shrink-0 rounded-lg"
                  style={{ background: "linear-gradient(135deg,rgba(14,165,233,0.15),rgba(56,189,248,0.08))", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                  </svg>
                </div>
                <h2
                  className="text-[14.5px] font-bold text-slate-700"
                  style={{ letterSpacing: "-0.02em" }}
                >
                  {NAV_CONFIG[page]?.label || page}
                </h2>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-2">
                {["All", "Active", "Archived"].map((t, i) => (
                  <button
                    key={t}
                    className="rounded-lg px-3 py-1.5 text-[11.5px] font-medium transition-all"
                    style={{
                      cursor: "pointer",
                      fontFamily: "inherit",
                      background: i === 0 ? "rgba(14,165,233,0.1)" : "transparent",
                      border: i === 0 ? "1px solid rgba(14,165,233,0.35)" : "1px solid #DBEAFE",
                      color: i === 0 ? "#0369a1" : "#64748b",
                      fontWeight: i === 0 ? 600 : 400,
                    }}
                  >
                    {t}
                  </button>
                ))}

                {/* More options */}
                <button
                  className="ml-1 flex h-7 w-7 items-center justify-center rounded-lg border border-blue-100 bg-white text-slate-400 transition-all hover:border-sky-300 hover:text-sky-500"
                  style={{ cursor: "pointer" }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Actual page component */}
            <div key={page} className="p-6">
              <Component slug={slug} dashboard={dashboard} />
            </div>
          </div>

          {/* ── Bottom spacer ── */}
          <div className="h-8" />
        </main>
      </div>
    </div>
  );
}