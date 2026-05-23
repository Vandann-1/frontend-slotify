import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkspaces, deleteWorkspace } from "../../api/workspaceApi";
import {
  Plus, Building2, Users, ChevronRight, Loader2,
  LayoutGrid, LogOut, Search, Bell, Trash2,
  Settings, Crown, Zap, MoreVertical, RefreshCw,
  UserCheck, GraduationCap, Dumbbell, Briefcase,
  AlertCircle, X, Menu, Stethoscope, User, Clock,
  Activity, Sparkles, ArrowUpRight, Shield, Check,
  Filter, SlidersHorizontal, ChevronDown, Hash,
  Globe, Lock, Layers, TrendingUp,
} from "lucide-react";

// ─── design tokens ─────────────────────────────────────────────────────────────
const C = {
  prime: "#3838d2",
  primeLight: "#ececfb",
  primeMid: "#6060dd",
  primeDark: "#2626a0",
  primeText: "#1e1e8a",
  ink: "#0d0d1a",
  inkMid: "#3a3a5c",
  inkLight: "#6b6b94",
  inkFaint: "#b0b0cc",
  surface: "#ffffff",
  surfaceAlt: "#f5f5fc",
  surfaceMid: "#eeeef8",
  border: "#dcdcf0",
  borderMid: "#c8c8e8",
  borderPrime: "#a0a0e0",
};

// ─── tenant config ─────────────────────────────────────────────────────────────
const TENANT_META = {
  MENTOR:     { label: "Mentor",      Icon: UserCheck,    color: "#3838d2", bg: "#ececfb", border: "#c0c0f0" },
  TEACHER:    { label: "Teacher",     Icon: GraduationCap,color: "#0e7490", bg: "#ecfeff", border: "#a5f3fc" },
  FITNESS:    { label: "Fitness",     Icon: Dumbbell,     color: "#059669", bg: "#f0fdf4", border: "#a7f3d0" },
  CONSULTANT: { label: "Consultant",  Icon: Briefcase,    color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe" },
  DOCTOR:     { label: "Doctor",      Icon: Stethoscope,  color: "#dc2626", bg: "#fff1f2", border: "#fecaca" },
};

const FILTER_TYPES = ["ALL", "MENTOR", "TEACHER", "FITNESS", "CONSULTANT", "DOCTOR"];

function getTenantMeta(type) {
  return TENANT_META[(type || "").toUpperCase()] || {
    label: type || "Workspace",
    Icon: Building2,
    color: C.prime,
    bg: C.primeLight,
    border: C.borderPrime,
  };
}

// ─── avatar palette ────────────────────────────────────────────────────────────
const PALETTES = [
  { bg: "#3838d2", text: "#fff" },
  { bg: "#0e7490", text: "#fff" },
  { bg: "#059669", text: "#fff" },
  { bg: "#7c3aed", text: "#fff" },
  { bg: "#dc2626", text: "#fff" },
  { bg: "#d97706", text: "#fff" },
  { bg: "#db2777", text: "#fff" },
];
function pal(name = "") { return PALETTES[(name.charCodeAt(0) || 0) % PALETTES.length]; }

function fmtDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });
}

// ─── sub-components ────────────────────────────────────────────────────────────

function Avatar({ name, size = 40 }) {
  const p = pal(name);
  const init = (name || "WS").slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: 12,
      background: p.bg, color: p.text,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.28, fontWeight: 700, flexShrink: 0,
      fontFamily: "'DM Sans', system-ui, sans-serif",
      letterSpacing: "-0.02em",
    }}>{init}</div>
  );
}

function RoleBadge({ role }) {
  const r = (role || "").toUpperCase();
  if (r === "OWNER") return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 6,
      background: C.prime, color: "#fff",
      fontSize: 10, fontWeight: 700, letterSpacing: "0.02em",
    }}>
      <Crown size={8} /> OWNER
    </span>
  );
  if (r === "ADMIN") return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 6,
      background: C.primeLight, color: C.primeText,
      fontSize: 10, fontWeight: 700,
    }}>
      <Shield size={8} /> ADMIN
    </span>
  );
  return (
    <span style={{
      padding: "2px 8px", borderRadius: 6,
      background: C.surfaceAlt, color: C.inkLight,
      fontSize: 10, fontWeight: 600,
    }}>{role || "Member"}</span>
  );
}

function TypeBadge({ type }) {
  const meta = getTenantMeta(type);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 6,
      background: meta.bg, color: meta.color,
      border: `1px solid ${meta.border}`,
      fontSize: 10, fontWeight: 600,
    }}>
      <meta.Icon size={9} /> {meta.label}
    </span>
  );
}

function PlanBadge({ plan }) {
  if (!plan || plan.toUpperCase() === "FREE") return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 6,
      background: "#fffbeb", color: "#92400e",
      border: "1px solid #fde68a",
      fontSize: 10, fontWeight: 700,
    }}>
      <Crown size={8} /> {plan}
    </span>
  );
}

// Skeleton
function SkeletonCard() {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 16, padding: "20px",
    }} className="animate-pulse">
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: C.surfaceMid }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: 12, background: C.surfaceMid, borderRadius: 4, width: "65%", marginBottom: 8 }} />
          <div style={{ height: 10, background: C.surfaceMid, borderRadius: 4, width: "45%" }} />
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <div style={{ height: 20, width: 64, background: C.surfaceMid, borderRadius: 6 }} />
        <div style={{ height: 20, width: 48, background: C.surfaceMid, borderRadius: 6 }} />
      </div>
      <div style={{ height: 1, background: C.surfaceMid, marginBottom: 16 }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ height: 10, width: 80, background: C.surfaceMid, borderRadius: 4 }} />
        <div style={{ height: 10, width: 56, background: C.surfaceMid, borderRadius: 4 }} />
      </div>
    </div>
  );
}

// ─── workspace card ────────────────────────────────────────────────────────────
function WorkspaceCard({ ws, onEnter, onDelete, onSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const menuRef = useRef(null);

  const role    = (ws?.myrole || "MEMBER").toUpperCase();
  const isAdmin = role === "OWNER" || role === "ADMIN";
  const isOwner = role === "OWNER";
  const isFree  = (ws?.plan || "FREE").toUpperCase() === "FREE";

  // close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => { if (!menuRef.current?.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

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
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: C.surface,
        border: `1px solid ${hovered ? C.borderPrime : C.border}`,
        borderRadius: 16,
        padding: "18px 20px 16px",
        cursor: deleting ? "default" : "pointer",
        opacity: deleting ? 0.5 : 1,
        transition: "border-color 0.15s, box-shadow 0.15s, transform 0.1s",
        boxShadow: hovered ? `0 4px 24px rgba(56,56,210,0.10)` : "0 1px 3px rgba(0,0,0,0.04)",
        transform: hovered && !deleting ? "translateY(-1px)" : "translateY(0)",
        display: "flex", flexDirection: "column",
      }}
    >
      {deleting && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 16,
          background: "rgba(255,255,255,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10,
        }}>
          <Loader2 size={18} style={{ color: C.prime, animation: "spin 1s linear infinite" }} />
        </div>
      )}

      {/* top row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
          <Avatar name={ws.name} size={42} />
          <div style={{ minWidth: 0 }}>
            <p style={{
              margin: 0, fontSize: 14, fontWeight: 700,
              color: C.ink, letterSpacing: "-0.02em",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>{ws.name}</p>
            <p style={{
              margin: "2px 0 0", fontSize: 11, color: C.inkFaint,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              fontFamily: "'DM Mono', monospace",
            }}>/{ws.slug}</p>
          </div>
        </div>

        {isAdmin && (
          <div ref={menuRef} style={{ position: "relative", marginLeft: 8 }} onClick={e => e.stopPropagation()}>
            <button
              onClick={e => { e.stopPropagation(); setMenuOpen(o => !o); }}
              style={{
                width: 28, height: 28, border: "none", cursor: "pointer",
                borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                background: hovered || menuOpen ? C.surfaceMid : "transparent",
                color: menuOpen ? C.prime : C.inkLight,
                transition: "all 0.15s",
              }}
            >
              <MoreVertical size={14} />
            </button>

            {menuOpen && (
              <div style={{
                position: "absolute", right: 0, top: 34, zIndex: 40,
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 12, boxShadow: "0 8px 32px rgba(56,56,210,0.12)",
                padding: "6px", minWidth: 168, overflow: "hidden",
              }}>
                <MenuBtn icon={Settings} label="Settings" onClick={e => { e.stopPropagation(); setMenuOpen(false); onSettings(ws); }} />
                <MenuBtn icon={ArrowUpRight} label="Open workspace" onClick={e => { e.stopPropagation(); setMenuOpen(false); onEnter(ws); }} />
                {isOwner && (
                  <>
                    <div style={{ height: 1, background: C.border, margin: "4px 0" }} />
                    <MenuBtn icon={Trash2} label="Delete workspace" danger onClick={handleDelete} />
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* badges */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
        <TypeBadge type={ws.tenant_type} />
        <RoleBadge role={role} />
        <PlanBadge plan={ws.plan} />
      </div>

      {/* upgrade nudge */}
      {isFree && isAdmin && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
          border: "1px solid #fde68a", borderRadius: 10,
          padding: "8px 12px", marginBottom: 14,
        }}>
          <Zap size={11} style={{ color: "#d97706", flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 11, color: "#92400e", fontWeight: 600, flex: 1 }}>Upgrade to unlock all features</p>
          <button
            onClick={e => { e.stopPropagation(); onSettings(ws, "plans"); }}
            style={{
              background: "#fbbf24", border: "none", borderRadius: 6,
              padding: "3px 10px", fontSize: 10, fontWeight: 700,
              color: "#78350f", cursor: "pointer",
            }}
          >Upgrade</button>
        </div>
      )}

      {/* stats row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "10px 0", borderTop: `1px solid ${C.surfaceMid}`, borderBottom: `1px solid ${C.surfaceMid}`,
        marginBottom: 14,
      }}>
        {ws.member_count !== undefined && (
          <StatPill icon={Users} value={ws.member_count} label={ws.member_count === 1 ? "member" : "members"} />
        )}
        {ws.workspace_type && (
          <StatPill icon={ws.workspace_type?.toLowerCase() === "private" ? Lock : Globe} value={ws.workspace_type} />
        )}
        {ws.created_at && (
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, color: C.inkFaint }}>
            <Clock size={10} />
            <span style={{ fontSize: 10 }}>{fmtDate(ws.created_at)}</span>
          </div>
        )}
      </div>

      {/* footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <span style={{ fontSize: 11, color: C.inkLight, fontWeight: 500 }}>
          {isOwner ? "Owner access" : isAdmin ? "Admin access" : "View access"}
        </span>
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          color: hovered ? C.prime : C.inkFaint,
          transition: "color 0.15s",
        }}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>{isAdmin ? "Manage" : "Open"}</span>
          <ChevronRight size={13} />
        </div>
      </div>
    </div>
  );
}

function StatPill({ icon: Icon, value, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5, color: C.inkMid }}>
      <Icon size={11} style={{ color: C.inkFaint }} />
      <span style={{ fontSize: 11, fontWeight: 600, color: C.ink }}>{value}</span>
      {label && <span style={{ fontSize: 11, color: C.inkFaint }}>{label}</span>}
    </div>
  );
}

function MenuBtn({ icon: Icon, label, onClick, danger }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        width: "100%", border: "none", cursor: "pointer", borderRadius: 8,
        padding: "7px 10px", fontSize: 12, fontWeight: 500, textAlign: "left",
        background: h ? (danger ? "#fff1f2" : C.surfaceAlt) : "transparent",
        color: danger ? "#dc2626" : C.inkMid,
        transition: "background 0.1s",
      }}
    >
      <Icon size={13} style={{ color: danger ? "#dc2626" : C.inkLight }} />
      {label}
    </button>
  );
}

// ─── sidebar ────────────────────────────────────────────────────────────────────
function Sidebar({ user, initials, onLogout, onClose, mobile = false }) {
  const navigate = useNavigate();

  const navItems = [
    { label: "Workspaces", Icon: LayoutGrid, path: null, active: true },
    { label: "Profile",    Icon: User,       path: "/profile" },
    { label: "Activity",   Icon: Activity,   path: "/activity" },
    { label: "Analytics",  Icon: TrendingUp,  path: "/analytics" },
  ];

  const bottomItems = [
    { label: "Settings", Icon: Settings, path: "/settings" },
  ];

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%", position: "relative",
      background: C.ink, overflow: "hidden",
    }}>
      {/* subtle grid */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.04,
        backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }} />

      {/* prime accent top bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${C.prime}, ${C.primeMid})`, flexShrink: 0 }} />

      {/* logo */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 20px 16px",
        borderBottom: "1px solid rgba(255,255,255,0.06)", position: "relative", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9, flexShrink: 0,
            background: C.prime, display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Layers size={14} color="#fff" />
          </div>
          <span style={{
            color: "#fff", fontWeight: 800, fontSize: 16,
            letterSpacing: "-0.04em", fontFamily: "'DM Sans', system-ui, sans-serif",
          }}>Slotify</span>
        </div>
        {mobile && (
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", padding: 4 }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* nav */}
      <nav style={{ flex: 1, padding: "16px 12px", overflowY: "auto", position: "relative" }}>
        <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", textTransform: "uppercase", padding: "0 8px 10px", margin: 0 }}>Navigation</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map(({ label, Icon, path, active }) => (
            <SideNavItem key={label} label={label} Icon={Icon} active={active} onClick={() => path && navigate(path)} />
          ))}
        </div>
        <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em", textTransform: "uppercase", padding: "18px 8px 10px", margin: 0 }}>Account</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {bottomItems.map(({ label, Icon, path }) => (
            <SideNavItem key={label} label={label} Icon={Icon} onClick={() => navigate(path)} />
          ))}
        </div>
      </nav>

      {/* user */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px",
        position: "relative", flexShrink: 0,
      }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, padding: "8px 10px",
          borderRadius: 10, background: "rgba(255,255,255,0.04)",
          marginBottom: 4,
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            background: C.prime, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: "#fff", flexShrink: 0,
          }}>{initials}</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.first_name || user?.email?.split("@")[0] || "Admin"}</p>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.35)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user?.email || ""}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 8,
            padding: "8px 10px", borderRadius: 8, background: "none", border: "none",
            color: "rgba(255,255,255,0.35)", cursor: "pointer", fontSize: 12, fontWeight: 500,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(220,38,38,0.1)"; e.currentTarget.style.color = "#fca5a5"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
        >
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </div>
  );
}

function SideNavItem({ label, Icon, active, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "9px 10px", borderRadius: 9, width: "100%",
        border: "none", cursor: "pointer", textAlign: "left", fontSize: 13,
        fontWeight: active ? 700 : 500,
        background: active ? `rgba(56,56,210,0.25)` : h ? "rgba(255,255,255,0.06)" : "transparent",
        color: active ? "#a5b4fc" : h ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.45)",
        transition: "all 0.12s",
        position: "relative",
      }}
    >
      {active && (
        <div style={{
          position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
          width: 3, height: 16, borderRadius: "0 3px 3px 0", background: C.primeMid,
        }} />
      )}
      <Icon size={15} />
      {label}
    </button>
  );
}

// ─── topbar search ─────────────────────────────────────────────────────────────
function SearchBar({ value, onChange }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      background: focused ? C.surface : C.surfaceAlt,
      border: `1.5px solid ${focused ? C.borderPrime : C.border}`,
      borderRadius: 10, padding: "0 12px", width: 260,
      transition: "all 0.15s",
      boxShadow: focused ? `0 0 0 3px rgba(56,56,210,0.08)` : "none",
    }}>
      <Search size={13} style={{ color: focused ? C.prime : C.inkFaint, flexShrink: 0 }} />
      <input
        type="text"
        placeholder="Search workspaces…"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background: "none", border: "none", outline: "none",
          fontSize: 13, color: C.ink, width: "100%", padding: "9px 0",
          fontFamily: "'DM Sans', system-ui, sans-serif",
        }}
      />
      {value && (
        <button onClick={() => onChange("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, display: "flex", color: C.inkFaint }}>
          <X size={11} />
        </button>
      )}
    </div>
  );
}

// ─── filter chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, active, icon: Icon, color, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        padding: "5px 12px", borderRadius: 20, border: "1.5px solid",
        borderColor: active ? C.prime : h ? C.borderPrime : C.border,
        background: active ? C.primeLight : h ? C.surfaceAlt : C.surface,
        color: active ? C.primeText : C.inkMid,
        fontSize: 12, fontWeight: active ? 700 : 500,
        cursor: "pointer", transition: "all 0.12s", whiteSpace: "nowrap",
      }}
    >
      {Icon && <Icon size={11} style={{ color: active ? C.prime : color || C.inkFaint }} />}
      {label}
    </button>
  );
}

// ─── create card ──────────────────────────────────────────────────────────────
function CreateCard({ onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12,
        background: h ? C.primeLight : C.surfaceAlt,
        border: `2px dashed ${h ? C.prime : C.borderMid}`,
        borderRadius: 16, padding: "20px",
        minHeight: 200, cursor: "pointer",
        transition: "all 0.15s",
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 14,
        background: h ? `rgba(56,56,210,0.12)` : C.surface,
        border: `1.5px solid ${h ? C.borderPrime : C.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.15s",
      }}>
        <Plus size={18} style={{ color: h ? C.prime : C.inkFaint }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: h ? C.prime : C.inkMid, transition: "color 0.15s" }}>New workspace</p>
        <p style={{ margin: "3px 0 0", fontSize: 11, color: C.inkFaint }}>Set up a new environment</p>
      </div>
    </button>
  );
}

// ─── main component ────────────────────────────────────────────────────────────
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
  const [sortBy,      setSortBy]      = useState("recent");

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
      setError("Failed to load workspaces. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleEnter = (ws) => {
    if (!ws?.slug) return;
    const role = (ws?.myrole || "").toUpperCase();
    if (role === "OWNER" || role === "ADMIN") navigate(`/admin/workspace/${ws.slug}/dashboard`);
    else navigate(`/professional/workspace/${ws.slug}`);
  };

  const handleDelete = async (ws) => {
    try {
      await deleteWorkspace(ws.slug);
      setWorkspaces(p => p.filter(w => w.slug !== ws.slug));
    } catch { alert("Failed to delete workspace."); }
  };

  const handleSettings = (ws, tab = "general") => {
    navigate(`/admin/workspace/${ws.slug}/settings${tab !== "general" ? `/${tab}` : ""}`);
  };

  const handleLogout = () => { localStorage.clear(); navigate("/"); };

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "AD";

  const filtered = workspaces
    .filter(w => {
      const matchFilter = filter === "ALL" || (w.tenant_type || "").toUpperCase() === filter;
      const q = search.toLowerCase();
      const matchSearch = !q || (w.name || "").toLowerCase().includes(q) || (w.slug || "").toLowerCase().includes(q) || (w.tenant_type || "").toLowerCase().includes(q);
      return matchFilter && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "name") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "members") return (b.member_count || 0) - (a.member_count || 0);
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

  const sidebarProps = { user, initials, onLogout: handleLogout };

  return (
    <div style={{ display: "flex", height: "100vh", background: C.surfaceAlt, overflow: "hidden", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* google fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .ws-card { animation: fadeIn 0.3s ease both; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.borderMid}; border-radius: 4px; }
      `}</style>

      {/* desktop sidebar */}
      <aside style={{ width: 216, flexShrink: 0, display: "none" }} className="lg-sidebar">
        <style>{`.lg-sidebar { display: flex !important; } @media (max-width: 1023px) { .lg-sidebar { display: none !important; } }`}</style>
        <Sidebar {...sidebarProps} />
      </aside>

      {/* mobile overlay */}
      {mobileOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 50,
        }} onClick={() => setMobileOpen(false)}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }} />
          <aside
            style={{ position: "relative", width: 220, height: "100%" }}
            onClick={e => e.stopPropagation()}
          >
            <Sidebar {...sidebarProps} mobile onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        {/* topbar */}
        <header style={{
          height: 58, background: C.surface,
          borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileOpen(true)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: C.inkLight, padding: 6, borderRadius: 8, display: "none",
              }}
            >
              <Menu size={18} />
            </button>
            <style>{`@media (max-width: 1023px) { .mobile-menu-btn { display: flex !important; } }`}</style>

            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {/* sort */}
            <div style={{ position: "relative" }}>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  appearance: "none", background: C.surfaceAlt,
                  border: `1px solid ${C.border}`, borderRadius: 9,
                  padding: "7px 28px 7px 10px", fontSize: 12, color: C.inkMid,
                  cursor: "pointer", outline: "none", fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontWeight: 500,
                }}
              >
                <option value="recent">Recent</option>
                <option value="name">Name</option>
                <option value="members">Members</option>
              </select>
              <ChevronDown size={11} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", color: C.inkFaint, pointerEvents: "none" }} />
            </div>

            <IconBtn icon={RefreshCw} spinning={refreshing} onClick={() => fetchWorkspaces(true)} title="Refresh" />
            <NotifBtn />

            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: C.prime, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 800, color: "#fff",
            }}>{initials}</div>

            <button
              onClick={() => navigate("/create-dashboard")}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "7px 14px", background: C.prime,
                color: "#fff", border: "none", borderRadius: 9,
                fontSize: 12, fontWeight: 700, cursor: "pointer",
                transition: "background 0.15s", marginLeft: 4,
                fontFamily: "'DM Sans', system-ui, sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.background = C.primeDark}
              onMouseLeave={e => e.currentTarget.style.background = C.prime}
            >
              <Plus size={13} /> New workspace
            </button>
          </div>
        </header>

        {/* page content */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 28px 40px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>

            {/* page header */}
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{
                  margin: 0, fontSize: 22, fontWeight: 800,
                  color: C.ink, letterSpacing: "-0.04em",
                }}>Workspaces</h1>
                {!loading && (
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: C.inkLight }}>
                    {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
                    {search && filtered.length !== workspaces.length ? ` · ${filtered.length} result${filtered.length !== 1 ? "s" : ""}` : ""}
                  </p>
                )}
              </div>

              {/* mobile create btn */}
              <button
                onClick={() => navigate("/create-dashboard")}
                className="mobile-create"
                style={{
                  display: "none", alignItems: "center", gap: 6,
                  padding: "9px 16px", background: C.prime,
                  color: "#fff", border: "none", borderRadius: 10,
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                }}
              >
                <Plus size={14} /> New workspace
              </button>
              <style>{`@media (max-width: 640px) { .mobile-create { display: flex !important; } }`}</style>
            </div>

            {/* filter chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
              {FILTER_TYPES.map(f => {
                const meta = f === "ALL" ? null : getTenantMeta(f);
                return (
                  <FilterChip
                    key={f}
                    label={f === "ALL" ? "All types" : meta?.label}
                    icon={f === "ALL" ? Layers : meta?.Icon}
                    color={meta?.color}
                    active={filter === f}
                    onClick={() => setFilter(f)}
                  />
                );
              })}
            </div>

            {/* error */}
            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "#fff1f2", border: "1px solid #fecaca",
                color: "#991b1b", borderRadius: 12, padding: "12px 16px", marginBottom: 24, fontSize: 13,
              }}>
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1 }}>{error}</span>
                <button
                  onClick={() => fetchWorkspaces(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 700, color: "#991b1b", textDecoration: "underline" }}
                >Retry</button>
              </div>
            )}

            {/* skeleton */}
            {loading && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
              </div>
            )}

            {/* empty */}
            {!loading && filtered.length === 0 && !error && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 16 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: C.surface, border: `2px solid ${C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Building2 size={26} style={{ color: C.inkFaint }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.ink }}>{search ? "No results found" : "No workspaces yet"}</p>
                  <p style={{ margin: "6px 0 0", fontSize: 13, color: C.inkLight }}>
                    {search ? `No workspaces match "${search}"` : "Create your first workspace to get started"}
                  </p>
                </div>
                {!search ? (
                  <button
                    onClick={() => navigate("/create-dashboard")}
                    style={{
                      display: "flex", alignItems: "center", gap: 6,
                      padding: "10px 20px", background: C.prime, color: "#fff",
                      border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
                    }}
                  ><Plus size={14} /> Create workspace</button>
                ) : (
                  <button
                    onClick={() => setSearch("")}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: C.prime, fontWeight: 600 }}
                  >Clear search</button>
                )}
              </div>
            )}

            {/* grid */}
            {!loading && filtered.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {filtered.map((ws, idx) => (
                  <div key={ws.id || idx} className="ws-card" style={{ animationDelay: `${idx * 40}ms` }}>
                    <WorkspaceCard
                      ws={ws}
                      onEnter={handleEnter}
                      onDelete={handleDelete}
                      onSettings={handleSettings}
                    />
                  </div>
                ))}
                <div className="ws-card" style={{ animationDelay: `${filtered.length * 40}ms` }}>
                  <CreateCard onClick={() => navigate("/create-dashboard")} />
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}

// ─── icon button helpers ───────────────────────────────────────────────────────
function IconBtn({ icon: Icon, spinning, onClick, title }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 9, border: `1px solid ${h ? C.borderPrime : C.border}`,
        background: h ? C.surfaceAlt : C.surface,
        color: h ? C.prime : C.inkLight, cursor: "pointer", transition: "all 0.12s",
      }}
    >
      <Icon size={14} style={{ animation: spinning ? "spin 1s linear infinite" : "none" }} />
    </button>
  );
}

function NotifBtn() {
  const [h, setH] = useState(false);
  return (
    <button
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 9, border: `1px solid ${h ? C.borderPrime : C.border}`,
        background: h ? C.surfaceAlt : C.surface,
        color: h ? C.prime : C.inkLight, cursor: "pointer", transition: "all 0.12s",
        position: "relative",
      }}
    >
      <Bell size={14} />
      <span style={{
        position: "absolute", top: 7, right: 7, width: 6, height: 6,
        background: "#ef4444", borderRadius: "50%", border: "1.5px solid white",
      }} />
    </button>
  );
}