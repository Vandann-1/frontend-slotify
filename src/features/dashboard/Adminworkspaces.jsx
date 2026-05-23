// ============================================================
//  AdminWorkspace.jsx  –  Slotify SaaS Admin Dashboard
//  Deep Indigo (#3838d2) · Adamina Font · Real Router + Real Pages
// ============================================================

import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import { getDashboard } from "../../api/workspaceApi";
import { COMPONENT_MAP } from "../../layouts/componentMap";
import { NAV_CONFIG }    from "../../layouts/navConfig";

import {
  ChevronRight, ChevronLeft, Bell, Search,
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Download, Plus, Zap, Users, Activity, TrendingUp,
  AlertCircle, Settings,
} from "lucide-react";

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
// Primary     : #3838d2  deep indigo
// Primary-L   : #5a5ae8
// Accent      : #7c3aed  violet
// BG          : #f8f8ff  ghosted indigo
// Surface     : #ffffff
// Border      : #e0e0f5
// Text        : #1a1a3e
// Muted       : #6b6b9a
// Success     : #059669
// Warning     : #d97706
// Danger      : #dc2626
// ─────────────────────────────────────────────────────────────────────────────

// ── Google Fonts ──────────────────────────────────────────────────────────────
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Adamina&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #c4c4f0; border-radius: 999px; }
    ::-webkit-scrollbar-thumb:hover { background: #9898d8; }
    @keyframes sw-fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
    @keyframes sw-pulse  { 0%,100% { opacity: 1; } 50% { opacity: 0.35; } }
    @keyframes sw-spin   { to { transform: rotate(360deg); } }
  `}</style>
);

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({
  initials = "A",
  size     = 36,
  bg       = "linear-gradient(135deg,#3838d2,#7c3aed)",
  border   = "2px solid #e0e0f5",
}) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%", background: bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(size * 0.36), fontWeight: 700, color: "#fff",
      flexShrink: 0, border, cursor: "pointer",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {initials}
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, delta, up, icon: Icon, delay = 0 }) {
  return (
    <div
      style={{
        background: "#fff", borderRadius: 16, border: "1px solid #e0e0f5",
        padding: "20px 22px", position: "relative", overflow: "hidden",
        animation: `sw-fadeIn 0.4s ease ${delay}ms both`,
        transition: "box-shadow 0.2s, border-color 0.2s, transform 0.2s",
        cursor: "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow   = "0 8px 32px rgba(56,56,210,0.12)";
        e.currentTarget.style.borderColor = "#a5a5e8";
        e.currentTarget.style.transform   = "translateY(-1px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow   = "none";
        e.currentTarget.style.borderColor = "#e0e0f5";
        e.currentTarget.style.transform   = "none";
      }}
    >
      {/* top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: up
          ? "linear-gradient(90deg,#3838d2,#7c3aed)"
          : "linear-gradient(90deg,#dc2626,#f87171)",
      }} />

      {/* icon badge */}
      <div style={{
        position: "absolute", top: 16, right: 16,
        width: 38, height: 38, borderRadius: 10,
        background: up ? "rgba(56,56,210,0.08)" : "rgba(220,38,38,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {Icon && <Icon size={18} color={up ? "#3838d2" : "#dc2626"} />}
      </div>

      <p style={{
        fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em",
        textTransform: "uppercase", color: "#6b6b9a",
        fontFamily: "'DM Sans',sans-serif", marginBottom: 10,
      }}>
        {label}
      </p>

      <p style={{
        fontSize: 28, fontWeight: 800, color: "#1a1a3e",
        letterSpacing: "-0.04em", fontFamily: "'DM Sans',sans-serif", lineHeight: 1,
      }}>
        {value}
      </p>

      <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 2,
          background: up ? "rgba(5,150,105,0.1)" : "rgba(220,38,38,0.1)",
          color: up ? "#059669" : "#dc2626",
          borderRadius: 6, padding: "2px 7px",
          fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans',sans-serif",
        }}>
          {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {delta}
        </span>
        <span style={{ fontSize: 11, color: "#9999b8", fontFamily: "'DM Sans',sans-serif" }}>
          vs last month
        </span>
      </div>
    </div>
  );
}

// ── Sidebar Nav Item ──────────────────────────────────────────────────────────
function NavItem({ item, active, collapsed, onClick }) {
  const Icon = item.icon;
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: collapsed ? "10px 0" : "9px 12px",
        justifyContent: collapsed ? "center" : "flex-start",
        width: "100%", marginBottom: 2, borderRadius: 10,
        cursor: "pointer", border: "none", outline: "none",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13, fontWeight: active ? 700 : 500,
        letterSpacing: "-0.01em",
        background: active
          ? "rgba(255,255,255,0.22)"
          : hov ? "rgba(255,255,255,0.11)" : "transparent",
        color: "#ffffff",
        position: "relative", transition: "background 0.15s",
      }}
    >
      {active && (
        <span style={{
          position: "absolute", left: 0, top: "18%", bottom: "18%",
          width: 3, borderRadius: "0 3px 3px 0",
          background: "#fff", boxShadow: "0 0 8px rgba(255,255,255,0.7)",
        }} />
      )}

      {Icon && <Icon size={17} style={{ flexShrink: 0, opacity: active ? 1 : 0.75 }} />}

      {!collapsed && (
        <span style={{
          flex: 1, textAlign: "left",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {item.label}
        </span>
      )}

      {!collapsed && item.badge && (
        <span style={{
          background: "rgba(255,255,255,0.2)", color: "#fff",
          borderRadius: 20, padding: "1px 7px", fontSize: 10, fontWeight: 700,
        }}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

// ── Loading screen ────────────────────────────────────────────────────────────
function LoadingScreen({ slug }) {
  return (
    <>
      <FontStyle />
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", height: "100vh",
        background: "#f8f8ff", gap: 20,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <div style={{ position: "relative", width: 52, height: 52 }}>
          <div style={{
            width: 52, height: 52, borderRadius: "50%",
            border: "2.5px solid #e0e0f5", borderTopColor: "#3838d2",
            animation: "sw-spin 0.8s linear infinite",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%,-50%)",
            width: 26, height: 26, borderRadius: 7,
            background: "linear-gradient(135deg,#3838d2,#7c3aed)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 800, color: "#fff",
            fontFamily: "'Adamina', serif",
          }}>
            S
          </div>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{
            fontSize: 13, fontWeight: 700,
            letterSpacing: "0.15em", textTransform: "uppercase",
            color: "#3838d2",
          }}>
            Loading workspace
          </p>
          <p style={{ fontSize: 11.5, color: "#9999b8", marginTop: 4 }}>{slug}</p>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export default function AdminWorkspace() {
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams();

  const [dashboard, setDashboard] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  // ── fetch real dashboard ─────────────────────────────────────────────────
  useEffect(() => {
    if (!slug) return;
    getDashboard(slug)
      .then((res) => setDashboard(res.data || res))
      .catch((err) => console.error("Dashboard fetch error:", err));
  }, [slug]);

  if (!dashboard) return <LoadingScreen slug={slug} />;

  // ── resolve current page from URL ────────────────────────────────────────
  const pathParts = location.pathname.split("/").filter(Boolean);
  const page      = pathParts[pathParts.length - 1] || "overview";

  // ── build nav from backend sections ─────────────────────────────────────
  const allSections = dashboard?.sections?.length ? dashboard.sections : ["overview"];
  const coreKeys    = ["overview", "bookings", "services", "availability", "plans", "settings"];

  const coreItems = allSections
    .filter(k => coreKeys.includes(k))
    .map(k => ({ key: k, ...NAV_CONFIG[k] }))
    .filter(i => i.label);

  const featureItems = allSections
    .filter(k => !coreKeys.includes(k))
    .map(k => ({ key: k, ...NAV_CONFIG[k] }))
    .filter(i => i.label);

  // ── resolve real component from your COMPONENT_MAP ───────────────────────
  const Component = COMPONENT_MAP[page] || (() => (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "60px 20px", color: "#9999b8", gap: 12,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 16,
        background: "rgba(56,56,210,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26,
      }}>📄</div>
      <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1a3e", fontFamily: "'DM Sans',sans-serif" }}>
        {NAV_CONFIG[page]?.label || page}
      </p>
      <p style={{ fontSize: 13, color: "#9999b8", fontFamily: "'DM Sans',sans-serif" }}>
        This module is ready to be connected
      </p>
    </div>
  ));

  const currentLabel = NAV_CONFIG[page]?.label || page;
  const CurrentIcon  = NAV_CONFIG[page]?.icon;

  const goTo = (key) => navigate(`/admin/workspace/${slug}/${key}`);

  const STATS = [
    { label: "Total Users",     value: "12,840", delta: "+8.2%",  up: true,  icon: Users       },
    { label: "Active Sessions", value: "3,241",  delta: "+12.5%", up: true,  icon: Activity    },
    { label: "Revenue MTD",     value: "$94.2k", delta: "+5.3%",  up: true,  icon: TrendingUp  },
    { label: "Churn Rate",      value: "1.8%",   delta: "-0.4%",  up: false, icon: AlertCircle },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <FontStyle />

      <div style={{
        display: "flex", height: "100vh", overflow: "hidden",
        background: "#f8f8ff", fontFamily: "'DM Sans', sans-serif", color: "#1a1a3e",
      }}>

        {/* ════════════════════════════════════
            SIDEBAR
        ════════════════════════════════════ */}
        <aside style={{
          width:    collapsed ? 68 : 240,
          minWidth: collapsed ? 68 : 240,
          background: "linear-gradient(180deg,#3838d2 0%,#2d2daa 100%)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          transition:
            "width 0.25s cubic-bezier(0.4,0,0.2,1), min-width 0.25s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 50, position: "relative",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}>

          {/* Logo */}
          <div style={{
            padding: collapsed ? "18px 0" : "18px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
            display: "flex", alignItems: "center", gap: 10,
            minHeight: 62, justifyContent: collapsed ? "center" : "flex-start",
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, flexShrink: 0,
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 800, color: "#fff",
              fontFamily: "'Adamina', serif",
            }}>S</div>

            {!collapsed && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 15, fontWeight: 800, color: "#fff",
                  letterSpacing: "-0.02em", fontFamily: "'Adamina', serif",
                }}>Slotify</p>
                <p style={{
                  fontSize: 9.5, fontWeight: 600, textTransform: "uppercase",
                  letterSpacing: "0.12em", color: "rgba(255,255,255,0.55)", marginTop: 1,
                }}>Admin Console</p>
              </div>
            )}

            <button
              onClick={() => setCollapsed(c => !c)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.6)", padding: 4,
                borderRadius: 6, display: "flex", alignItems: "center",
                transition: "color 0.15s", flexShrink: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#fff"}
              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.6)"}
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Workspace badge */}
          {!collapsed && (
            <div style={{
              margin: "12px 12px 4px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: 10, padding: "8px 12px",
              border: "1px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#10b981", flexShrink: 0,
                animation: "sw-pulse 2s ease infinite",
                boxShadow: "0 0 6px #10b981",
              }} />
              <span style={{
                fontSize: 12.5, fontWeight: 600, color: "#fff",
                flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>{slug}</span>
              <span style={{
                background: "rgba(255,255,255,0.2)", color: "#fff",
                borderRadius: 20, padding: "1px 7px",
                fontSize: 9, fontWeight: 700, letterSpacing: "0.05em",
              }}>PRO</span>
            </div>
          )}

          {/* Scrollable nav */}
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 10px", scrollbarWidth: "none" }}>

            {/* Core */}
            {!collapsed && coreItems.length > 0 && (
              <p style={{
                fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
                padding: "10px 4px 6px", fontFamily: "'DM Sans',sans-serif",
              }}>Core</p>
            )}
            {coreItems.map(item => (
              <NavItem
                key={item.key}
                item={item}
                active={page === item.key}
                collapsed={collapsed}
                onClick={() => goTo(item.key)}
              />
            ))}

            {/* Features */}
            {featureItems.length > 0 && (
              <>
                {!collapsed && (
                  <p style={{
                    fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em",
                    textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
                    padding: "14px 4px 6px", fontFamily: "'DM Sans',sans-serif",
                  }}>Features</p>
                )}
                {featureItems.map(item => (
                  <NavItem
                    key={item.key}
                    item={item}
                    active={page === item.key}
                    collapsed={collapsed}
                    onClick={() => goTo(item.key)}
                  />
                ))}
              </>
            )}
          </div>

          {/* Upgrade nudge */}
          {!collapsed && (
            <div style={{
              margin: "0 10px 10px",
              background: "rgba(124,58,237,0.3)",
              border: "1px solid rgba(124,58,237,0.5)",
              borderRadius: 12, padding: "12px 14px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <Zap size={13} color="#c4b5fd" />
                <p style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>Slotify Scale</p>
              </div>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.45, marginBottom: 10 }}>
                Unlock white-label &amp; API access
              </p>
              <button style={{
                width: "100%", padding: "7px",
                background: "#fff", color: "#3838d2",
                border: "none", borderRadius: 8,
                fontSize: 12, fontWeight: 800,
                cursor: "pointer", fontFamily: "inherit",
              }}>
                Upgrade Plan →
              </button>
            </div>
          )}

          {/* User strip */}
          <div style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            padding: collapsed ? "12px 0" : "12px 14px",
            display: "flex", alignItems: "center", gap: 10,
            justifyContent: collapsed ? "center" : "flex-start",
            background: "rgba(0,0,0,0.15)",
          }}>
            <Avatar initials="AU" size={32} border="2px solid rgba(255,255,255,0.2)" />
            {!collapsed && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: 13, fontWeight: 700, color: "#fff",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>Admin User</p>
                  <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", marginTop: 1 }}>
                    Super Admin
                  </p>
                </div>
                <button
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "rgba(255,255,255,0.5)", display: "flex",
                    transition: "color 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = "#fff"}
                  onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                >
                  <MoreHorizontal size={16} />
                </button>
              </>
            )}
          </div>
        </aside>

        {/* ════════════════════════════════════
            MAIN
        ════════════════════════════════════ */}
        <div style={{
          flex: 1, minWidth: 0,
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>

          {/* Top bar */}
          <header style={{
            height: 62, minHeight: 62,
            background: "#fff", borderBottom: "1px solid #e0e0f5",
            display: "flex", alignItems: "center",
            padding: "0 24px", gap: 12,
          }}>
            {/* Breadcrumb */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11.5, color: "#9999b8" }}>Admin</span>
              <ChevronRight size={12} color="#c4c4f0" />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "#3838d2" }}>{slug}</span>
              <ChevronRight size={12} color="#c4c4f0" />
              <span style={{ fontSize: 13, fontWeight: 800, color: "#3838d2" }}>
                {currentLabel}
              </span>
            </div>

            {/* Search bar */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "#f8f8ff", border: "1px solid #e0e0f5",
              borderRadius: 10, padding: "8px 12px", width: 210,
            }}>
              <Search size={13} color="#9999b8" />
              <input
                placeholder="Search…"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  fontSize: 12.5, color: "#1a1a3e",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              <span style={{
                fontSize: 10, fontFamily: "monospace", color: "#c4c4f0",
                background: "#f0f0fb", borderRadius: 4, padding: "1px 5px",
                border: "1px solid #e0e0f5",
              }}>⌘K</span>
            </div>

            {/* Bell */}
            <button
              style={{
                position: "relative", width: 36, height: 36, borderRadius: 10,
                background: "#f8f8ff", border: "1px solid #e0e0f5",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "#6b6b9a",
                transition: "all 0.15s", flexShrink: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#a5a5e8"; e.currentTarget.style.color = "#3838d2"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0f5"; e.currentTarget.style.color = "#6b6b9a"; }}
            >
              <Bell size={15} />
              <span style={{
                position: "absolute", top: 8, right: 8,
                width: 7, height: 7, borderRadius: "50%",
                background: "#3838d2", border: "1.5px solid #fff",
              }} />
            </button>

            {/* Settings shortcut */}
            <button
              onClick={() => goTo("settings")}
              style={{
                width: 36, height: 36, borderRadius: 10,
                background: page === "settings" ? "rgba(56,56,210,0.1)" : "#f8f8ff",
                border: `1px solid ${page === "settings" ? "#a5a5e8" : "#e0e0f5"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                color: page === "settings" ? "#3838d2" : "#6b6b9a",
                transition: "all 0.15s", flexShrink: 0,
              }}
              onMouseEnter={e => {
                if (page !== "settings") {
                  e.currentTarget.style.borderColor = "#a5a5e8";
                  e.currentTarget.style.color = "#3838d2";
                }
              }}
              onMouseLeave={e => {
                if (page !== "settings") {
                  e.currentTarget.style.borderColor = "#e0e0f5";
                  e.currentTarget.style.color = "#6b6b9a";
                }
              }}
            >
              <Settings size={15} />
            </button>

            <div style={{ width: 1, height: 28, background: "#e0e0f5" }} />

            {/* User */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar initials="A" size={34} />
              <div>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: "#1a1a3e", lineHeight: 1.2 }}>
                  Admin User
                </p>
                <p style={{ fontSize: 10.5, color: "#9999b8" }}>Super Admin</p>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main style={{
            flex: 1, overflowY: "auto",
            padding: "26px 28px",
            scrollbarWidth: "thin",
            scrollbarColor: "#c4c4f0 transparent",
          }}>

            {/* Page heading */}
            <div style={{
              display: "flex", alignItems: "flex-start",
              justifyContent: "space-between", marginBottom: 24,
            }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                  <h1 style={{
                    fontSize: 26, fontWeight: 800, color: "#1a1a3e",
                    letterSpacing: "-0.04em",
                    fontFamily: "'Adamina', serif",
                  }}>
                    {currentLabel}
                  </h1>
                  <span style={{
                    background: "rgba(56,56,210,0.1)", color: "#3838d2",
                    borderRadius: 20, padding: "3px 10px",
                    fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em",
                  }}>LIVE</span>
                </div>
                <p style={{ fontSize: 12.5, color: "#9999b8" }}>
                  Workspace ·{" "}
                  <span style={{ fontWeight: 600, color: "#3838d2" }}>{slug}</span>
                </p>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "9px 16px", background: "#fff",
                    border: "1px solid #e0e0f5", borderRadius: 10,
                    fontSize: 13, fontWeight: 600, color: "#6b6b9a",
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#a5a5e8"; e.currentTarget.style.color = "#3838d2"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0f5"; e.currentTarget.style.color = "#6b6b9a"; }}
                >
                  <Download size={13} /> Export
                </button>
                <button
                  style={{
                    display: "flex", alignItems: "center", gap: 7,
                    padding: "9px 16px",
                    background: "linear-gradient(135deg,#3838d2,#5a5ae8)",
                    color: "#fff", border: "none", borderRadius: 10,
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    fontFamily: "inherit",
                    boxShadow: "0 4px 14px rgba(56,56,210,0.35)",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(56,56,210,0.45)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 4px 14px rgba(56,56,210,0.35)";
                  }}
                >
                  <Plus size={14} /> New Action
                </button>
              </div>
            </div>

            {/* Stats strip */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))",
              gap: 16, marginBottom: 24,
            }}>
              {STATS.map((s, i) => (
                <StatCard key={s.label} {...s} delay={i * 60} />
              ))}
            </div>

            {/* ── Dynamic section panel ── */}
            <div style={{
              background: "#fff", borderRadius: 18,
              border: "1px solid #e0e0f5", overflow: "hidden",
            }}>
              {/* Panel header */}
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom: "1px solid #f0f0fb",
                background: "#fdfdff",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: "rgba(56,56,210,0.08)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {CurrentIcon && <CurrentIcon size={15} color="#3838d2" />}
                  </div>
                  <h2 style={{
                    fontSize: 14.5, fontWeight: 800, color: "#1a1a3e",
                    letterSpacing: "-0.02em",
                    fontFamily: "'Adamina', serif",
                  }}>
                    {currentLabel}
                  </h2>
                </div>

                <div style={{ display: "flex", gap: 6 }}>
                  {["All", "Active", "Archived"].map((t, i) => (
                    <button
                      key={t}
                      style={{
                        padding: "5px 12px", borderRadius: 7,
                        fontSize: 12, fontWeight: i === 0 ? 700 : 500,
                        fontFamily: "'DM Sans',sans-serif", cursor: "pointer",
                        background: i === 0 ? "rgba(56,56,210,0.1)" : "transparent",
                        border: i === 0
                          ? "1px solid rgba(56,56,210,0.3)"
                          : "1px solid #e0e0f5",
                        color: i === 0 ? "#3838d2" : "#6b6b9a",
                        transition: "all 0.15s",
                      }}
                    >
                      {t}
                    </button>
                  ))}
                  <button style={{
                    width: 28, height: 28, borderRadius: 7,
                    background: "#f8f8ff", border: "1px solid #e0e0f5",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#9999b8",
                  }}>
                    <MoreHorizontal size={14} />
                  </button>
                </div>
              </div>

              {/* ── YOUR REAL PAGE COMPONENT RENDERS HERE ── */}
              <div
                key={page}
                style={{ padding: "20px 24px", animation: "sw-fadeIn 0.3s ease both" }}
              >
                <Component slug={slug} dashboard={dashboard} />
              </div>
            </div>

            <div style={{ height: 32 }} />
          </main>
        </div>
      </div>
    </>
  );
}