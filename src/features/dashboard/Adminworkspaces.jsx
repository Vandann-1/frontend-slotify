import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getDashboard } from "../../api/workspaceApi.js";
import { COMPONENT_MAP } from "../../layouts/componentMap.jsx";
import { SIDEBAR_CONFIG } from "../../layouts/sidebarConfig.js";

import {
  Menu, X, LogOut, Bell, HelpCircle,
  Search, ChevronDown, Settings, Grid, Zap
} from "lucide-react";

/* ═══════════════════════════════════════════════════════
   SLOTIFY — Salesforce Lightning Design System–style UI
   Navy #032D60 │ Brand #0176D3 │ Sky #1589EE
   Font: Nunito Sans (closest to Salesforce Sans)
   ALL original logic is 100% preserved — only styling changed
═══════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,300;0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;0,6..12,800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.sl {
  /* ── Salesforce-inspired palette ── */
  --navy:        #2a79db;
  --navy-mid:    #2575c6;
  --brand:       #0176D3;
  --brand-dark:  #378ce2;
  --sky:         #1589EE;
  --sky-light:   #D8EDFF;
  --sky-pale:    #EAF4FF;
  --teal:        #04844B;
  --red:         #C23934;
  --white:       #FFFFFF;
  --gray-50:     #F3F3F3;
  --gray-100:    #ECEBEA;
  --gray-200:    #DDDBDA;
  --gray-400:    #B0ADAB;
  --gray-500:    #939190;
  --gray-600:    #706E6B;
  --gray-800:    #3E3E3C;
  --text:        #1C1B1A;
  --text-muted:  #706E6B;
  --nav-w:       236px;
  --nav-col:     52px;
  --top-h:       48px;
  --sub-h:       42px;

  font-family: 'Nunito Sans', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  color: var(--text);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--gray-50);
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   TOP BAR — navy, full width
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.sl-top {
  height: var(--top-h);
  background: var(--navy);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

/* Brand section — matches sidebar width */
.sl-brand {
  width: var(--nav-w);
  min-width: var(--nav-w);
  height: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 0 14px;
  border-right: 1px solid rgba(255,255,255,0.10);
  flex-shrink: 0;
  transition: width .22s ease, min-width .22s ease;
  overflow: hidden;
}
.sl-brand.col { width: var(--nav-col); min-width: var(--nav-col); }

.sl-dots {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 3px;
  flex-shrink: 0;
}
.sl-dots span {
  display: block;
  width: 4px; height: 4px;
  background: rgba(255,255,255,0.45);
  border-radius: 1px;
}

.sl-logo {
  width: 26px; height: 26px;
  background: linear-gradient(135deg, #1589EE 0%, #0070D2 100%);
  border-radius: 5px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 0 1.5px rgba(255,255,255,0.2);
}
.sl-appname {
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.4px;
  white-space: nowrap;
  transition: opacity .18s;
}
.sl-brand.col .sl-logo-wrap { opacity: 0; pointer-events: none; }
.sl-logo-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: opacity .18s;
  overflow: hidden;
}

/* Global search */
.sl-search {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}
.sl-search-box {
  position: relative;
  width: 100%;
  max-width: 420px;
}
.sl-search-box svg {
  position: absolute;
  left: 10px; top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.4);
  pointer-events: none;
}
.sl-search-input {
  width: 100%;
  background: rgba(255,255,255,0.09);
  border: 1px solid rgba(255,255,255,0.14);
  border-radius: 18px;
  padding: 5px 14px 5px 34px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  outline: none;
  transition: background .15s, border-color .15s;
}
.sl-search-input::placeholder { color: rgba(255,255,255,0.38); }
.sl-search-input:focus {
  background: rgba(255,255,255,0.16);
  border-color: rgba(255,255,255,0.32);
}

/* Top action icons */
.sl-top-actions {
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 2px;
}
.sl-icon-btn {
  position: relative;
  width: 34px; height: 34px;
  background: transparent;
  border: none;
  border-radius: 50%;
  color: rgba(255,255,255,0.65);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .14s, color .14s;
}
.sl-icon-btn:hover { background: rgba(255,255,255,0.11); color: #fff; }
.sl-badge {
  position: absolute;
  top: 5px; right: 5px;
  width: 8px; height: 8px;
  background: #FF538A;
  border-radius: 50%;
  border: 1.5px solid var(--navy);
}

/* User pill */
.sl-user {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 4px 10px 4px 5px;
  background: rgba(255,255,255,0.09);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 18px;
  cursor: pointer;
  transition: background .14s;
  margin-left: 2px;
  border: none;
}
.sl-user:hover { background: rgba(255,255,255,0.17); }
.sl-avatar {
  width: 28px; height: 28px;
  background: linear-gradient(135deg,#1589EE,#0070D2);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  letter-spacing: .4px;
  flex-shrink: 0;
}
.sl-uname {
  font-size: 12.5px;
  font-weight: 700;
  color: rgba(255,255,255,0.85);
  white-space: nowrap;
}
.sl-user svg { color: rgba(255,255,255,0.45); }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   BODY — sidebar + content
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.sl-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SIDEBAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.sl-aside {
  width: var(--nav-w);
  min-width: var(--nav-w);
  background: var(--white);
  border-right: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width .22s ease, min-width .22s ease;
  overflow: hidden;
}
.sl-aside.col {
  width: var(--nav-col);
  min-width: var(--nav-col);
}

/* Workspace label row */
.sl-ws-row {
  height: var(--sub-h);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 9px 0 14px;
  border-bottom: 1px solid var(--gray-100);
  flex-shrink: 0;
  gap: 6px;
}
.sl-ws-name {
  font-size: 11.5px;
  font-weight: 800;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: .7px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity .18s;
}
.sl-aside.col .sl-ws-name { opacity: 0; }

.sl-col-btn {
  width: 26px; height: 26px;
  border: 1px solid var(--gray-200);
  border-radius: 5px;
  background: transparent;
  color: var(--gray-600);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: background .13s, border-color .13s, color .13s;
}
.sl-col-btn:hover {
  background: var(--sky-pale);
  border-color: var(--sky);
  color: var(--brand);
}

/* Nav scroll area */
.sl-nav { flex: 1; overflow-y: auto; overflow-x: hidden; padding: 6px 0; }
.sl-nav::-webkit-scrollbar { width: 3px; }
.sl-nav::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 3px; }

.sl-group-label {
  padding: 10px 16px 3px;
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: .9px;
  text-transform: uppercase;
  color: var(--gray-400);
  white-space: nowrap;
  overflow: hidden;
  transition: opacity .18s;
}
.sl-aside.col .sl-group-label { opacity: 0; }

.sl-divider { height: 1px; background: var(--gray-100); margin: 5px 0; }

/* Nav button */
.sl-nb {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  border: none;
  border-left: 3px solid transparent;
  background: transparent;
  color: var(--gray-800);
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  text-align: left;
  transition: background .12s, color .12s, border-color .12s;
  white-space: nowrap;
}
.sl-nb:hover { background: var(--sky-pale); color: var(--brand); }
.sl-nb.on {
  background: var(--sky-pale);
  color: var(--brand);
  border-left-color: var(--brand);
  font-weight: 700;
}
.sl-nb .sl-ni { flex-shrink: 0; }
.sl-nb .sl-nl {
  overflow: hidden;
  transition: opacity .18s, max-width .22s;
  max-width: 160px;
}
.sl-aside.col .sl-nl { opacity: 0; max-width: 0; }

/* Tooltip when collapsed */
.sl-aside.col .sl-nb:hover::after {
  content: attr(data-label);
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  background: var(--gray-800);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 5px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 300;
  box-shadow: 0 4px 16px rgba(0,0,0,.18);
}

/* Sidebar footer */
.sl-foot {
  border-top: 1px solid var(--gray-100);
  padding: 6px 0;
  flex-shrink: 0;
}
.sl-logout {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 14px;
  border: none;
  border-left: 3px solid transparent;
  background: transparent;
  color: var(--text-muted);
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: background .12s, color .12s;
  text-align: left;
  white-space: nowrap;
}
.sl-logout:hover { background: #FFF2F2; color: var(--red); }
.sl-logout .sl-nl {
  overflow: hidden;
  transition: opacity .18s, max-width .22s;
  max-width: 120px;
}
.sl-aside.col .sl-logout .sl-nl { opacity: 0; max-width: 0; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   RIGHT PANEL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.sl-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

/* Sub-header / breadcrumb bar */
.sl-subbar {
  height: var(--sub-h);
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}

.sl-bc {
  display: flex;
  align-items: center;
  gap: 0;
  font-size: 12.5px;
  color: var(--text-muted);
}
.sl-bc-root {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  text-transform: capitalize;
}
.sl-bc-sep { margin: 0 7px; color: var(--gray-400); }
.sl-bc-chip {
  background: var(--sky-light);
  color: var(--brand-dark);
  border-radius: 4px;
  padding: 2px 9px;
  font-size: 11.5px;
  font-weight: 800;
  text-transform: capitalize;
  letter-spacing: .15px;
}

.sl-subbar-r {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sl-live {
  display: flex;
  align-items: center;
  gap: 5px;
  background: #EFFAF4;
  border: 1px solid #91DB8B;
  border-radius: 4px;
  padding: 3px 9px;
  font-size: 11px;
  font-weight: 800;
  color: var(--teal);
  letter-spacing: .4px;
  text-transform: uppercase;
}
.sl-live-dot {
  width: 6px; height: 6px;
  background: var(--teal);
  border-radius: 50%;
  animation: sl-pulse 2s ease-in-out infinite;
}
@keyframes sl-pulse {
  0%,100% { opacity:1; }
  50%      { opacity:.3; }
}
.sl-cfg-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: var(--white);
  border: 1px solid var(--gray-200);
  border-radius: 5px;
  color: var(--text-muted);
  font-family: inherit;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background .12s, border-color .12s, color .12s;
}
.sl-cfg-btn:hover {
  background: var(--sky-pale);
  border-color: var(--sky);
  color: var(--brand);
}

/* Canvas */
.sl-canvas {
  flex: 1;
  overflow-y: auto;
  padding: 22px 24px;
  background: var(--gray-50);
}
.sl-canvas::-webkit-scrollbar { width: 6px; }
.sl-canvas::-webkit-scrollbar-thumb { background: var(--gray-200); border-radius: 3px; }

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LOADING SCREEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
.sl-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  height: 100vh;
  background: var(--gray-50);
  font-family: 'Nunito Sans', sans-serif;
}
.sl-loader-brand {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 6px;
}
.sl-loader-logo {
  width: 32px; height: 32px;
  background: linear-gradient(135deg,#1589EE,#0070D2);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.sl-loader-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--navy);
  letter-spacing: -0.4px;
}
.sl-spinner {
  width: 34px; height: 34px;
  border: 3px solid var(--gray-200);
  border-top-color: var(--brand);
  border-radius: 50%;
  animation: sl-spin .72s linear infinite;
}
@keyframes sl-spin { to { transform: rotate(360deg); } }
.sl-loader-label {
  font-size: 13.5px;
  font-weight: 700;
  color: var(--text-muted);
}
.sl-loader-sub {
  font-size: 12px;
  color: var(--gray-400);
  margin-top: -8px;
  font-weight: 500;
}

/* 404 */
.sl-404 {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  height: 60vh;
  color: var(--text-muted);
  font-family: inherit;
}
.sl-404 h3 { font-size: 16px; font-weight: 800; color: var(--gray-800); }
.sl-404 p  { font-size: 13px; font-weight: 500; }
`;

/* ─────────────────────────────────────────────────── */

export default function AdminWorkspace() {
  const { slug }     = useParams();
  const navigate     = useNavigate();
  const location     = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [dashboard, setDashboard] = useState(null);

const pathParts = location.pathname.split("/").filter(Boolean);
const page = pathParts[pathParts.length - 1];

// console.log("PAGE VALUE:", page); // ✅ NOW OK
  // ✅ USER LOAD  (unchanged)
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      setAdminUser(stored);
    } catch {}
  }, []);

  // ✅ FIXED API  (unchanged)
  useEffect(() => {
    getDashboard(slug)
      .then((res) => {
        console.log("API:", res);
        setDashboard(res.data || res);
      })
      .catch((err) => console.error("API ERROR:", err));
  }, [slug]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // ✅ LOADING  (unchanged logic)
  if (!dashboard) {
    return (
      <>
        <style>{CSS}</style>
        <div className="sl sl-loader">
          <div className="sl-loader-brand">
            <div className="sl-loader-logo">
              <Zap size={16} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="sl-loader-name">Slotify</span>
          </div>
          <div className="sl-spinner" />
          <span className="sl-loader-label">Loading workspace</span>
          <span className="sl-loader-sub">Fetching your dashboard…</span>
        </div>
      </>
    );
  }

  // ✅ ALL ORIGINAL LOGIC (unchanged)
  const initials      = adminUser?.email?.slice(0, 2).toUpperCase() || "AD";
  const userHandle    = adminUser?.email?.split("@")[0] || "Admin";
  const sections      = dashboard?.sections || [];
  const core          = sections.filter((s) => SIDEBAR_CONFIG[s]?.group === "core");
  const features      = sections.filter((s) => SIDEBAR_CONFIG[s]?.group === "features");
  const workspaceName = slug?.replace(/-/g, " ") || "Workspace";
  const currentLabel  = SIDEBAR_CONFIG[page]?.label || page;

  const Component =
    COMPONENT_MAP[page] ||
    (() => (
      <div className="sl-404">
        <h3>Page Not Found</h3>
        <p>The section <strong>"{page}"</strong> doesn't exist in this workspace.</p>
      </div>
    ));

  return (
    <>
      <style>{CSS}</style>
      <div className="sl">

        {/* ══ TOP BAR ══ */}
        <header className="sl-top">

          {/* Brand / App Launcher */}
          <div className={`sl-brand${collapsed ? " col" : ""}`}>
            <div className="sl-dots">
              {Array(9).fill(0).map((_, i) => <span key={i} />)}
            </div>
            <div className="sl-logo-wrap">
              <div className="sl-logo">
                <Zap size={14} color="#fff" strokeWidth={2.5} />
              </div>
              <span className="sl-appname">Slotify</span>
            </div>
          </div>

          {/* Search */}
          <div className="sl-search">
            <div className="sl-search-box">
              <Search size={14} />
              <input
                className="sl-search-input"
                placeholder="Search Slotify…"
                type="text"
              />
            </div>
          </div>

          {/* Action icons */}
          <div className="sl-top-actions">
            <button className="sl-icon-btn" title="Help">
              <HelpCircle size={17} />
            </button>
            <button className="sl-icon-btn" title="Notifications">
              <Bell size={17} />
              <span className="sl-badge" />
            </button>
            <button className="sl-icon-btn" title="Settings">
              <Settings size={17} />
            </button>
            <button className="sl-user">
              <div className="sl-avatar">{initials}</div>
              <span className="sl-uname">{userHandle}</span>
              <ChevronDown size={13} />
            </button>
          </div>
        </header>

        {/* ══ BODY ══ */}
        <div className="sl-body">

          {/* ── SIDEBAR ── */}
          <aside className={`sl-aside${collapsed ? " col" : ""}`}>

            {/* Workspace row */}
            <div className="sl-ws-row">
              <span
                className="sl-ws-name"
                title={workspaceName}
                style={{ textTransform: "capitalize" }}
              >
                {workspaceName}
              </span>
              <button
                className="sl-col-btn"
                onClick={() => setCollapsed((c) => !c)}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? <Menu size={13} /> : <X size={13} />}
              </button>
            </div>

            {/* Nav */}
            <nav className="sl-nav">

              {/* Core */}
              {core.map((key) => {
                const item = SIDEBAR_CONFIG[key];
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <button
                    key={key}
                    className={`sl-nb${page === key ? " on" : ""}`}
                    onClick={() => navigate(`/admin/workspace/${slug}/${key}`)}
                    data-label={item.label}
                  >
                    <span className="sl-ni"><Icon size={16} /></span>
                    <span className="sl-nl">{item.label}</span>
                  </button>
                );
              })}

              {/* Features */}
              {features.length > 0 && (
                <>
                  <div className="sl-divider" />
                  <div className="sl-group-label">Features</div>
                </>
              )}
              {features.map((key) => {
                const item = SIDEBAR_CONFIG[key];
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <button
                    key={key}
                    className={`sl-nb${page === key ? " on" : ""}`}
                    onClick={() => navigate(`/admin/workspace/${slug}/${key}`)}
                    data-label={item.label}
                  >
                    <span className="sl-ni"><Icon size={16} /></span>
                    <span className="sl-nl">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Logout */}
            <div className="sl-foot">
              <button className="sl-logout" onClick={handleLogout}>
                <LogOut size={16} />
                <span className="sl-nl">Log Out</span>
              </button>
            </div>
          </aside>

          {/* ── RIGHT PANEL ── */}
          <div className="sl-right">

            {/* Breadcrumb / sub-bar */}
            <div className="sl-subbar">
              <div className="sl-bc">
                <span className="sl-bc-root">
                  <Grid size={13} />
                  <span style={{ textTransform: "capitalize" }}>{workspaceName}</span>
                </span>
                {page && page !== slug && (
                  <>
                    <span className="sl-bc-sep">/</span>
                    <span className="sl-bc-chip">{currentLabel}</span>
                  </>
                )}
              </div>

              <div className="sl-subbar-r">
                <div className="sl-live">
                  <span className="sl-live-dot" />
                  Live
                </div>
                <button className="sl-cfg-btn">
                  <Settings size={13} />
                  Configure
                </button>
              </div>
            </div>

            {/* Page content */}
            <main className="sl-canvas">
              <Component slug={slug} />
            </main>
          </div>

        </div>
      </div>
    </>
  );
}