import { useEffect, useState } from "react";
import professionalApi from "../../api/professionalApi";
import { useDynamicNav } from "./main";
import {
  Loader2, Calendar, Clock, User, CreditCard,
  ChevronRight, CheckCircle2, XCircle, ExternalLink,
  Briefcase, Star, Bell, Settings, LogOut, Menu, X, Check,
  Stethoscope, BookOpen, Activity, FileText, TrendingUp,
  BrainCircuit, ClipboardList, Users,
} from "lucide-react";

/* ─── palette ───────────────────────────────────────── */
const C = {
  blue:         "#1a56db",
  blueDark:     "#1240a8",
  blueLight:    "#e8effd",
  blueMid:      "#c7d9fb",
  white:        "#ffffff",
  offWhite:     "#f7f8fa",
  border:       "#dde3ef",
  borderStrong: "#c2cde0",
  textPrimary:  "#0d1726",
  textSecond:   "#4b5a74",
  textMuted:    "#8896b0",
  greenDot:     "#22c55e",
  red:          "#ef4444",
  sidebarW:     240,
};

/* ════════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════════ */
export default function ProfessionalDashboard() {
  const [profile,   setProfile]   = useState(null);
  const [form,      setForm]      = useState({});
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [railOpen,  setRailOpen]  = useState(false);

  const loadProfile = async () => {
    try {
      const res = await professionalApi.getMyProfile();
      setProfile(res.data);
      setForm(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProfile(); }, []);

  // ── dynamic nav from specialization ──
  const specialization = profile?.specialization || "";
  const { fixed, dynamic } = useDynamicNav(specialization);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setSaving(true);
    try {
      await professionalApi.upsertMyProfile({
        qualifications:   form.qualifications,
        specialization:   form.specialization,
        bio:              form.bio,
        linkdin_url:      form.linkdin_url,
        experience_years: form.experience_years ? Number(form.experience_years) : null,
      });
      alert("Profile updated");
      await loadProfile();
    } catch (err) {
      console.error(err);
      alert("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={S.loaderWrap}>
      <Loader2 size={28} style={{ color: C.blue, animation: "spin 1s linear infinite" }} />
    </div>
  );

  const firstName = profile?.user?.first_name || "Professional";
  const initials  = firstName.slice(0, 2).toUpperCase();
  const verified  = profile?.verified;

  const navigate = (key) => { setActiveTab(key); setRailOpen(false); };

  // Active label for breadcrumb — search both fixed and dynamic
  const allNav    = [...fixed, ...dynamic];
  const activeNav = allNav.find((n) => n.key === activeTab);

  return (
    <div style={S.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pd-navbtn:hover { background: ${C.blueLight} !important; color: ${C.blue} !important; }
        .pd-navbtn:hover svg { color: ${C.blue} !important; }
        .pd-input:focus { outline: none; border-color: ${C.blue} !important; box-shadow: 0 0 0 3px ${C.blueMid}; }
        .pd-savebtn:hover:not(:disabled) { background: ${C.blueDark} !important; }
        .pd-savebtn:disabled { opacity: 0.55; cursor: not-allowed; }
        .pd-statcard:hover { box-shadow: 0 4px 16px rgba(26,86,219,0.10) !important; }
        .pd-plancard { transition: box-shadow 0.15s, transform 0.15s; }
        .pd-plancard:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(26,86,219,0.13) !important; }
        .pd-overlay { position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:98; }
        @media (min-width: 768px) {
          .pd-hamburger { display: none !important; }
          .pd-sidebar { position: sticky !important; transform: none !important; }
          .pd-closebtn { display: none !important; }
        }
        @media (max-width: 767px) {
          .pd-sidebar { position: fixed !important; transform: translateX(-100%); }
          .pd-sidebar.open { transform: translateX(0) !important; }
          .pd-form-grid { grid-template-columns: 1fr !important; }
        }
        .pd-section { animation: fadeUp 0.28s ease both; }
      `}</style>

      {railOpen && <div className="pd-overlay" onClick={() => setRailOpen(false)} />}

      {/* ── SIDEBAR ── */}
      <aside className={`pd-sidebar${railOpen ? " open" : ""}`} style={S.sidebar}>

        {/* Logo */}
        <div style={S.logoRow}>
          <div style={S.logoBadge}>S</div>
          <span style={S.logoText}>Slotify</span>
          <button className="pd-closebtn" style={S.iconBtn} onClick={() => setRailOpen(false)}>
            <X size={15} />
          </button>
        </div>

        {/* User card */}
        <div style={S.userCard}>
          <div style={S.userAvatar}>{initials}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={S.userName}>{firstName}</div>
            <div style={S.userRole}>{specialization || "Professional"}</div>
          </div>
          {verified
            ? <CheckCircle2 size={14} style={{ color: C.greenDot, flexShrink: 0 }} />
            : <XCircle      size={14} style={{ color: C.red,      flexShrink: 0 }} />}
        </div>

        {/* ── FIXED nav ── */}
        <nav style={S.navSection}>
          <div style={S.navGroup}>MAIN MENU</div>
          <NavGroup items={fixed} activeTab={activeTab} navigate={navigate} />
        </nav>

        {/* ── DYNAMIC nav — only shown if profession has features ── */}
        {dynamic.length > 0 && (
          <nav style={{ ...S.navSection, paddingTop: 0 }}>
            <div style={S.navGroup}>{specialization.toUpperCase()}</div>
            <NavGroup items={dynamic} activeTab={activeTab} navigate={navigate} />
          </nav>
        )}

        <div style={{ flex: 1 }} />

        {/* Bottom */}
        <div style={S.sidebarBottom}>
          <button className="pd-navbtn" style={S.navBtn}>
            <Settings size={14} style={{ color: C.textMuted }} />
            <span style={S.navBtnLabel}>Settings</span>
          </button>
          <button className="pd-navbtn" style={S.navBtn}>
            <LogOut size={14} style={{ color: C.textMuted }} />
            <span style={S.navBtnLabel}>Log Out</span>
          </button>
        </div>

        <div style={S.verifiedStrip}>
          <Briefcase size={11} style={{ color: C.blue }} />
          <span>{profile?.experience_years || 0} yrs · {verified ? "Verified" : "Unverified"}</span>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={S.main}>

        {/* Topbar */}
        <header style={S.topbar}>
          <button className="pd-hamburger" style={S.iconBtn} onClick={() => setRailOpen(true)}>
            <Menu size={18} />
          </button>

          <div style={S.breadcrumb}>
            <span style={S.breadcrumbRoot}>Slotify</span>
            <ChevronRight size={12} style={{ color: C.textMuted }} />
            <span style={S.breadcrumbPage}>{activeNav?.label || "Dashboard"}</span>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={S.statusPill}>
              <span style={{ ...S.dot, background: verified ? C.greenDot : C.red }} />
              {verified ? "Verified" : "Unverified"}
            </div>
            <button style={S.bellBtn}><Bell size={15} style={{ color: C.textSecond }} /></button>
          </div>
        </header>

        {/* Page */}
        <main style={S.pageWrap}>

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="pd-section" style={S.section}>
              <PageHeader title={`Good day, ${firstName}`} sub="Here's an overview of your professional profile." />
              <div style={S.statsGrid}>
                <StatCard icon="🎯" label="Specialization" value={specialization || "—"} />
                <StatCard icon="📅" label="Experience"     value={`${profile?.experience_years || 0} years`} />
                <StatCard icon="🎓" label="Qualifications" value={profile?.qualifications || "—"} />
                <StatCard icon="🔰" label="Status"         value={verified ? "Verified" : "Not Verified"} accent={verified} />
              </div>
              {profile?.bio && (
                <div style={S.bioBox}>
                  <div style={S.bioLabel}>BIO</div>
                  <p style={S.bioText}>{profile.bio}</p>
                </div>
              )}
              {profile?.linkdin_url && (
                <a href={profile.linkdin_url} target="_blank" rel="noreferrer" style={S.linkedinLink}>
                  <ExternalLink size={12} /> LinkedIn Profile
                </a>
              )}
            </div>
          )}

          {/* BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="pd-section" style={S.section}>
              <PageHeader title="Bookings" sub="View and manage all your appointments." />
              <EmptyState icon={<Calendar size={30} style={{ color: C.blue }} />}
                message="No bookings yet. Once clients schedule with you, they'll appear here." />
            </div>
          )}

          {/* AVAILABILITY */}
          {activeTab === "availability" && (
            <div className="pd-section" style={S.section}>
              <PageHeader title="Availability" sub="Define when you're open for bookings." />
              <EmptyState icon={<Clock size={30} style={{ color: C.blue }} />}
                message="No slots configured. Add your weekly schedule to start accepting bookings." />
            </div>
          )}

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="pd-section" style={S.section}>
              <PageHeader title="Edit Profile" sub="Update your professional information." />
              <div style={S.formCard}>
                <div className="pd-form-grid" style={S.formGrid}>
                  <FormField label="Qualifications">
                    <input className="pd-input" name="qualifications" value={form.qualifications || ""} onChange={handleChange} placeholder="e.g. MD, PhD, CFA" style={S.input} />
                  </FormField>
                  <FormField label="Specialization">
                    <input className="pd-input" name="specialization" value={form.specialization || ""} onChange={handleChange} placeholder="e.g. Cardiologist" style={S.input} />
                  </FormField>
                  <FormField label="Years of Experience">
                    <input className="pd-input" type="number" name="experience_years" value={form.experience_years || ""} onChange={handleChange} placeholder="e.g. 8" style={S.input} />
                  </FormField>
                  <FormField label="LinkedIn URL">
                    <input className="pd-input" name="linkdin_url" value={form.linkdin_url || ""} onChange={handleChange} placeholder="https://linkedin.com/in/..." style={S.input} />
                  </FormField>
                </div>
                <FormField label="Bio">
                  <textarea className="pd-input" name="bio" value={form.bio || ""} onChange={handleChange} placeholder="Describe your professional background..." rows={4} style={{ ...S.input, resize: "vertical" }} />
                </FormField>
                <div style={S.formFooter}>
                  <button className="pd-savebtn" onClick={handleSave} disabled={saving} style={S.saveBtn}>
                    {saving
                      ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Saving…</>
                      : <><Check size={13} /> Save Changes</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PLANS */}
          {activeTab === "plans" && (
            <div className="pd-section" style={S.section}>
              <PageHeader title="Plans & Billing" sub="Choose the plan that fits your practice." />
              <div style={S.plansGrid}>
                <PlanCard name="Starter"      price="Free"   period=""       features={["Up to 5 bookings/month","Basic profile page","Email support"]} />
                <PlanCard name="Professional" price="₹999"   period="/month" features={["Unlimited bookings","Verified badge","Priority support","Analytics"]} highlight />
                <PlanCard name="Enterprise"   price="Custom" period=""       features={["Everything in Pro","Dedicated manager","Custom integrations","SLA"]} />
              </div>
            </div>
          )}

          {/* ── DYNAMIC PAGES — feature tabs ── */}
          {dynamic.map(({ key, label, icon: Icon }) =>
            activeTab === key ? (
              <div key={key} className="pd-section" style={S.section}>
                <PageHeader title={label} sub={`Manage your ${label.toLowerCase()} here.`} />
                <EmptyState
                  icon={<Icon size={30} style={{ color: C.blue }} />}
                  message={`${label} feature is coming soon. Check back after setup.`}
                />
              </div>
            ) : null
          )}

        </main>
      </div>
    </div>
  );
}

/* ─── NavGroup — shared by fixed + dynamic ───────── */
function NavGroup({ items, activeTab, navigate }) {
  return items.map(({ key, label, icon: Icon }) => {
    const active = activeTab === key;
    return (
      <button
        key={key}
        className="pd-navbtn"
        onClick={() => navigate(key)}
        style={{ ...S.navBtn, ...(active ? S.navBtnActive : {}) }}
      >
        <Icon size={15} style={{ color: active ? C.blue : C.textMuted, flexShrink: 0 }} />
        <span style={S.navBtnLabel}>{label}</span>
        {active && <div style={S.activeBar} />}
      </button>
    );
  });
}

/* ─── SUB-COMPONENTS ──────────────────────────────── */
function PageHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <h1 style={{ fontSize: 21, fontWeight: 700, color: C.textPrimary, marginBottom: 4, fontFamily: "'IBM Plex Sans', sans-serif", letterSpacing: "-0.3px" }}>{title}</h1>
      <p  style={{ fontSize: 13, color: C.textMuted, fontFamily: "'IBM Plex Sans', sans-serif" }}>{sub}</p>
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="pd-statcard" style={{
      background: C.white,
      border: `1px solid ${accent ? C.blueMid : C.border}`,
      borderRadius: 10,
      padding: "18px 16px",
      display: "flex", flexDirection: "column", gap: 8,
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.15s",
    }}>
      <span style={{ fontSize: 20 }}>{icon}</span>
      <div style={{ fontSize: 14, fontWeight: 700, color: accent ? C.blue : C.textPrimary, fontFamily: "'IBM Plex Sans', sans-serif", wordBreak: "break-word" }}>{value}</div>
      <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", fontFamily: "'IBM Plex Sans', sans-serif" }}>{label}</div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 10, fontWeight: 700, color: C.textSecond, letterSpacing: "0.7px", textTransform: "uppercase", fontFamily: "'IBM Plex Sans', sans-serif" }}>{label}</label>
      {children}
    </div>
  );
}

function EmptyState({ icon, message }) {
  return (
    <div style={{
      background: C.white, border: `1.5px dashed ${C.borderStrong}`,
      borderRadius: 12, padding: "60px 32px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 14, textAlign: "center",
    }}>
      <div style={{ background: C.blueLight, borderRadius: "50%", padding: 16 }}>{icon}</div>
      <p style={{ fontSize: 13, color: C.textMuted, maxWidth: 300, lineHeight: 1.65, fontFamily: "'IBM Plex Sans', sans-serif" }}>{message}</p>
    </div>
  );
}

function PlanCard({ name, price, period, features, highlight }) {
  return (
    <div className="pd-plancard" style={{
      background: highlight ? C.blue : C.white,
      border: `1px solid ${highlight ? C.blue : C.border}`,
      borderRadius: 12, padding: "26px 22px",
      display: "flex", flexDirection: "column", gap: 14,
      position: "relative",
      boxShadow: highlight ? "0 8px 28px rgba(26,86,219,0.22)" : "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      {highlight && (
        <div style={{
          position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
          background: C.textPrimary, color: C.white, borderRadius: 20,
          padding: "3px 13px", fontSize: 10, fontWeight: 700,
          display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
          fontFamily: "'IBM Plex Sans', sans-serif", letterSpacing: "0.5px",
        }}>
          <Star size={9} fill="white" /> MOST POPULAR
        </div>
      )}
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: highlight ? "rgba(255,255,255,0.65)" : C.textMuted, marginBottom: 8, fontFamily: "'IBM Plex Sans', sans-serif" }}>{name}</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: highlight ? C.white : C.textPrimary, fontFamily: "'IBM Plex Mono', monospace" }}>{price}</span>
          <span style={{ fontSize: 13, color: highlight ? "rgba(255,255,255,0.55)" : C.textMuted, fontFamily: "'IBM Plex Sans', sans-serif" }}>{period}</span>
        </div>
      </div>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
        {features.map(f => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: highlight ? "rgba(255,255,255,0.85)" : C.textSecond, fontFamily: "'IBM Plex Sans', sans-serif" }}>
            <CheckCircle2 size={13} style={{ color: highlight ? C.white : C.blue, flexShrink: 0, marginTop: 1 }} />
            {f}
          </li>
        ))}
      </ul>
      <button style={{
        padding: "10px", background: highlight ? C.white : C.blue,
        color: highlight ? C.blue : C.white, border: "none",
        borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: "pointer",
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}>
        {highlight ? "Upgrade Now" : "Get Started"}
      </button>
    </div>
  );
}

/* ─── STYLES ──────────────────────────────────────── */
const S = {
  root: {
    display: "flex", minHeight: "100vh",
    background: C.offWhite,
    fontFamily: "'IBM Plex Sans', sans-serif",
    color: C.textPrimary,
  },
  loaderWrap: {
    height: "100vh", display: "flex",
    alignItems: "center", justifyContent: "center",
    background: C.white,
  },
  sidebar: {
    width: C.sidebarW, minWidth: C.sidebarW,
    background: C.white,
    borderRight: `1px solid ${C.border}`,
    display: "flex", flexDirection: "column",
    height: "100vh", top: 0, left: 0,
    zIndex: 100, overflowY: "auto",
    transition: "transform 0.22s cubic-bezier(.4,0,.2,1)",
  },
  logoRow: {
    display: "flex", alignItems: "center", gap: 9,
    padding: "17px 16px 15px",
    borderBottom: `1px solid ${C.border}`,
  },
  logoBadge: {
    width: 28, height: 28, borderRadius: 7,
    background: C.blue, color: C.white,
    fontWeight: 800, fontSize: 14,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  logoText: { fontWeight: 800, fontSize: 14, color: C.textPrimary, letterSpacing: "-0.3px", flex: 1 },
  iconBtn: { background: "none", border: "none", cursor: "pointer", color: C.textMuted, padding: 4, borderRadius: 6, display: "flex", alignItems: "center" },
  userCard: {
    display: "flex", alignItems: "center", gap: 10,
    padding: "13px 16px",
    borderBottom: `1px solid ${C.border}`,
    background: C.offWhite,
  },
  userAvatar: {
    width: 32, height: 32, borderRadius: "50%",
    background: C.blue, color: C.white,
    fontWeight: 700, fontSize: 12,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  userName: { fontSize: 12, fontWeight: 700, color: C.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  userRole: { fontSize: 11, color: C.textMuted, marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  navSection: { padding: "12px 10px" },
  navGroup: { fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", color: C.textMuted, padding: "4px 8px 8px", textTransform: "uppercase" },
  navBtn: {
    display: "flex", alignItems: "center", gap: 10,
    width: "100%", padding: "9px 12px",
    borderRadius: 7, border: "none", background: "none",
    color: C.textSecond, cursor: "pointer",
    fontSize: 13, fontWeight: 500, textAlign: "left",
    marginBottom: 2, position: "relative",
    fontFamily: "'IBM Plex Sans', sans-serif",
    transition: "background 0.12s, color 0.12s",
  },
  navBtnActive: { background: C.blueLight, color: C.blue, fontWeight: 700 },
  navBtnLabel: { flex: 1 },
  activeBar: {
    position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)",
    width: 3, height: 16, borderRadius: "3px 0 0 3px", background: C.blue,
  },
  sidebarBottom: { borderTop: `1px solid ${C.border}`, padding: "10px 10px 4px" },
  verifiedStrip: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "10px 16px 14px",
    fontSize: 11, color: C.textMuted, fontWeight: 600,
  },
  main: { flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: C.offWhite },
  topbar: {
    display: "flex", alignItems: "center",
    padding: "0 24px", height: 54,
    background: C.white, borderBottom: `1px solid ${C.border}`,
    position: "sticky", top: 0, zIndex: 10, gap: 8,
  },
  breadcrumb: { display: "flex", alignItems: "center", gap: 6 },
  breadcrumbRoot: { fontSize: 13, color: C.textMuted, fontWeight: 500 },
  breadcrumbPage: { fontSize: 13, color: C.textPrimary, fontWeight: 700 },
  statusPill: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "4px 10px",
    background: C.offWhite, border: `1px solid ${C.border}`,
    borderRadius: 20, fontSize: 12, fontWeight: 600, color: C.textSecond,
  },
  dot: { width: 7, height: 7, borderRadius: "50%", display: "inline-block" },
  bellBtn: { background: "none", border: "none", cursor: "pointer", padding: 7, borderRadius: 8, display: "flex", alignItems: "center" },
  pageWrap: { flex: 1, overflowY: "auto", padding: "30px 26px 80px" },
  section: { maxWidth: 860 },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
    gap: 13, marginBottom: 20,
  },
  bioBox: {
    background: C.white, border: `1px solid ${C.border}`,
    borderRadius: 10, padding: "16px 18px", marginBottom: 14,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  bioLabel: { fontSize: 9, fontWeight: 700, letterSpacing: "1.2px", color: C.blue, marginBottom: 8, textTransform: "uppercase" },
  bioText:  { fontSize: 13, color: C.textSecond, lineHeight: 1.75 },
  linkedinLink: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "7px 13px",
    background: C.white, border: `1px solid ${C.border}`,
    borderRadius: 7, fontSize: 13, fontWeight: 600, color: C.blue,
    textDecoration: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
  },
  formCard: {
    background: C.white, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: "26px 24px", maxWidth: 600,
    boxShadow: "0 1px 5px rgba(0,0,0,0.05)",
  },
  formGrid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "18px 16px", marginBottom: 18,
  },
  input: {
    width: "100%", background: C.offWhite,
    border: `1px solid ${C.border}`, borderRadius: 7,
    padding: "9px 11px", fontSize: 13, color: C.textPrimary,
    fontFamily: "'IBM Plex Sans', sans-serif",
    transition: "border-color 0.15s, box-shadow 0.15s",
  },
  formFooter: {
    borderTop: `1px solid ${C.border}`, paddingTop: 18, marginTop: 4,
    display: "flex", justifyContent: "flex-end",
  },
  saveBtn: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "9px 20px", background: C.blue, color: C.white,
    border: "none", borderRadius: 7, fontWeight: 700, fontSize: 13,
    cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif",
    transition: "background 0.15s",
  },
  plansGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(215px, 1fr))",
    gap: 15, alignItems: "start",
  },
};