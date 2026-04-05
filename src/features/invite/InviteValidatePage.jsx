import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

/* ── keyframes ── */
const STYLES = `
  @keyframes slo-spin { to { transform: rotate(360deg); } }
  @keyframes slo-prog { from { width: 0% } to { width: 100% } }
  @keyframes slo-in   { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
  @keyframes slo-pop  { 0%{transform:scale(0.85);opacity:0} 60%{transform:scale(1.05)} 100%{transform:scale(1);opacity:1} }
  .slo-row { display:flex; justify-content:space-between; align-items:center;
    padding:12px 0; border-bottom:1px solid #F3F4F6; }
  .slo-row:last-child { border-bottom:none; }
`;

/* ════════════════════════════════════════════════════
   PROFESSION CONFIG  (same role → config mapping as
   the professional dashboard — keep in sync)
════════════════════════════════════════════════════ */
const PROFESSION_CONFIG = {
  teacher: {
    label: "Teacher",
    emoji: "🎓",
    gradient: ["#059669", "#0f766e"],   // emerald → teal
    lightBg:  "#ECFDF5",
    lightBorder: "#6EE7B7",
    lightText: "#065F46",
    clients: "students", bookings: "classes",
    joinAs: "a Teacher",
    welcomeNote: "You'll be able to manage classes and student bookings.",
  },
  doctor: {
    label: "Doctor",
    emoji: "🩺",
    gradient: ["#0284C7", "#0E7490"],
    lightBg:  "#F0F9FF",
    lightBorder: "#7DD3FC",
    lightText: "#0C4A6E",
    clients: "patients", bookings: "appointments",
    joinAs: "a Doctor",
    welcomeNote: "You'll be able to manage patient appointments and consultations.",
  },
  lawyer: {
    label: "Lawyer",
    emoji: "⚖️",
    gradient: ["#374151", "#1F2937"],
    lightBg:  "#F9FAFB",
    lightBorder: "#D1D5DB",
    lightText: "#111827",
    clients: "clients", bookings: "consultations",
    joinAs: "a Lawyer",
    welcomeNote: "You'll be able to manage client consultations and case meetings.",
  },
  fitness_coach: {
    label: "Fitness Coach",
    emoji: "🏋️",
    gradient: ["#EA580C", "#DC2626"],
    lightBg:  "#FFF7ED",
    lightBorder: "#FED7AA",
    lightText: "#7C2D12",
    clients: "members", bookings: "sessions",
    joinAs: "a Fitness Coach",
    welcomeNote: "You'll be able to manage training sessions and member schedules.",
  },
  consultant: {
    label: "Consultant",
    emoji: "💼",
    gradient: ["#7C3AED", "#6D28D9"],
    lightBg:  "#F5F3FF",
    lightBorder: "#C4B5FD",
    lightText: "#4C1D95",
    clients: "clients", bookings: "meetings",
    joinAs: "a Consultant",
    welcomeNote: "You'll be able to manage client meetings and advisory sessions.",
  },
  designer: {
    label: "Designer",
    emoji: "🎨",
    gradient: ["#EC4899", "#E11D48"],
    lightBg:  "#FFF1F2",
    lightBorder: "#FECDD3",
    lightText: "#881337",
    clients: "clients", bookings: "projects",
    joinAs: "a Designer",
    welcomeNote: "You'll be able to manage design projects and client sessions.",
  },
  music_teacher: {
    label: "Music Teacher",
    emoji: "🎵",
    gradient: ["#D97706", "#CA8A04"],
    lightBg:  "#FFFBEB",
    lightBorder: "#FDE68A",
    lightText: "#78350F",
    clients: "students", bookings: "lessons",
    joinAs: "a Music Teacher",
    welcomeNote: "You'll be able to manage music lessons and student schedules.",
  },
  tech_mentor: {
    label: "Tech Mentor",
    emoji: "💻",
    gradient: ["#4F46E5", "#1D4ED8"],
    lightBg:  "#EEF2FF",
    lightBorder: "#A5B4FC",
    lightText: "#3730A3",
    clients: "mentees", bookings: "sessions",
    joinAs: "a Tech Mentor",
    welcomeNote: "You'll be able to manage mentoring sessions and code reviews.",
  },
  nutritionist: {
    label: "Nutritionist",
    emoji: "🥗",
    gradient: ["#16A34A", "#059669"],
    lightBg:  "#F0FDF4",
    lightBorder: "#86EFAC",
    lightText: "#14532D",
    clients: "clients", bookings: "consultations",
    joinAs: "a Nutritionist",
    welcomeNote: "You'll be able to manage diet consultations and meal plans.",
  },
  therapist: {
    label: "Therapist",
    emoji: "🧠",
    gradient: ["#9333EA", "#7C3AED"],
    lightBg:  "#FAF5FF",
    lightBorder: "#D8B4FE",
    lightText: "#581C87",
    clients: "clients", bookings: "sessions",
    joinAs: "a Therapist",
    welcomeNote: "You'll be able to manage therapy sessions and client records.",
  },
  // generic professional / staff fallback
  professional: {
    label: "Professional",
    emoji: "🧑‍💼",
    gradient: ["#2563EB", "#1D4ED8"],
    lightBg:  "#EFF6FF",
    lightBorder: "#BFDBFE",
    lightText: "#1E3A8A",
    clients: "clients", bookings: "sessions",
    joinAs: "a Professional",
    welcomeNote: "You'll have access to your workspace dashboard right away.",
  },
};

/* role alias map — normalises API strings */
const ROLE_ALIASES = {
  teacher: "teacher", tutor: "teacher", educator: "teacher",
  doctor: "doctor", physician: "doctor", dentist: "doctor", surgeon: "doctor",
  lawyer: "lawyer", attorney: "lawyer", advocate: "lawyer",
  fitness_coach: "fitness_coach", trainer: "fitness_coach",
  yoga_teacher: "fitness_coach", coach: "fitness_coach",
  designer: "designer", ui_designer: "designer", graphic_designer: "designer",
  music_teacher: "music_teacher", musician: "music_teacher",
  tech_mentor: "tech_mentor", developer: "tech_mentor",
  software_engineer: "tech_mentor", mentor: "tech_mentor",
  nutritionist: "nutritionist", dietitian: "nutritionist",
  therapist: "therapist", counselor: "therapist", psychologist: "therapist",
  consultant: "consultant", advisor: "consultant",
  professional: "professional", member: "professional", staff: "professional",
};

function resolveProfession(rawRole = "") {
  const key = (rawRole || "").toLowerCase().replace(/\s+/g, "_");
  const resolved = ROLE_ALIASES[key] || "professional";
  return PROFESSION_CONFIG[resolved] || PROFESSION_CONFIG.professional;
}

/* ────────────────────────────────────────────────
   ROLE → ROUTE mapper
──────────────────────────────────────────────── */
const getRedirectPath = (role, slug) => {
  if (!slug) return "/workspaces";
  const r = (role || "").toLowerCase().trim();
  if (r === "admin" || r === "owner") return `/admin/workspace/${slug}/dashboard`;
  if (r === "professional" || r === "member" || r === "staff" || ROLE_ALIASES[r])
    return `/professional/workspace/${slug}`;
  return "/workspaces";
};

/* ── shared sub-components ── */

const Spin = ({ size = 28, color = "#2563EB" }) => (
  <span style={{
    display: "inline-block", width: size, height: size,
    border: `2.5px solid #E5E7EB`, borderTopColor: color,
    borderRadius: "50%", animation: "slo-spin 0.75s linear infinite", flexShrink: 0,
  }} />
);

/* Workspace initials avatar with profession-colour ring */
const WorkspaceAvatar = ({ name = "", prof }) => {
  const initials = (name || "WS").split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const [g1, g2] = prof?.gradient || ["#2563EB", "#1D4ED8"];
  return (
    <div style={{
      width: 48, height: 48, borderRadius: 12, flexShrink: 0,
      background: `linear-gradient(135deg, ${g1}, ${g2})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: -0.5,
      boxShadow: `0 0 0 3px ${prof?.lightBg || "#EFF6FF"}, 0 0 0 5px ${prof?.lightBorder || "#BFDBFE"}`,
    }}>
      {initials}
    </div>
  );
};

/* Profession badge — icon + label + colour */
const ProfessionBadge = ({ prof }) => {
  const [g1, g2] = prof.gradient;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700,
      background: `linear-gradient(135deg, ${g1}, ${g2})`, color: "#fff",
      letterSpacing: 0.1,
    }}>
      <span style={{ fontSize: 13 }}>{prof.emoji}</span>
      {prof.label}
    </span>
  );
};

/* ═══════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════ */
const InviteValidatePage = () => {
  const { token } = useParams();
  const navigate  = useNavigate();

  const [loading,   setLoading]   = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [accepted,  setAccepted]  = useState(false);
  const [data,      setData]      = useState(null);
  const [error,     setError]     = useState("");

  /* profession resolved from invitation role */
  const prof = data ? resolveProfession(data.role) : PROFESSION_CONFIG.professional;
  const [g1, g2] = prof.gradient;

  /* ── Step 1: validate ── */
  useEffect(() => {
    const run = async () => {
      try {
        if (!token) {
          const pending = localStorage.getItem("pending_invite_token");
          if (pending) { navigate(`/invite-accept/${pending}`, { replace: true }); return; }
          setError("Invalid invitation link.");
          setLoading(false);
          return;
        }

        const res = await axiosInstance.post("/invitations/validate/", { token });
        setData(res.data);

        const accessToken = localStorage.getItem("access");
        const user        = JSON.parse(localStorage.getItem("user") || "{}");

        if (!accessToken) {
          localStorage.setItem("pending_invite_token", token);
          navigate(`/login?invite=${token}`, { replace: true });
          return;
        }

        if (user.email && res.data.email !== user.email) {
          localStorage.setItem("pending_invite_token", token);
          navigate(`/register?invite=${token}`, { replace: true });
          return;
        }
      } catch (err) {
        setError(err?.response?.data?.detail || "Invitation is invalid or expired.");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [token, navigate]);

  /* ── Step 2: accept ── */
  const handleAccept = async () => {
    if (!data) return;
    try {
      setAccepting(true);
      const res = await axiosInstance.post("/invitations/accept/", { token });
      localStorage.removeItem("pending_invite_token");

      const slug = res?.data?.workspace_slug || res?.data?.slug || data?.workspace_slug || data?.slug;
      const role = res?.data?.role || data?.role || "";

      setAccepted(true);
      setTimeout(() => navigate(getRedirectPath(role, slug), { replace: true }), 2200);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to accept invitation. Please try again.");
    } finally {
      setAccepting(false);
    }
  };

  /* ── layout tokens ── */
  const labelSt = { fontSize: 12.5, color: "#9CA3AF", fontWeight: 500 };
  const valueSt = { fontSize: 13, color: "#111", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 };

  return (
    <>
      <style>{STYLES}</style>
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(160deg, ${prof.lightBg} 0%, #fff 55%)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "32px 16px",
        fontFamily: "'Inter', -apple-system, sans-serif",
        transition: "background 0.4s ease",
      }}>
        <div style={{ width: "100%", maxWidth: 430, animation: "slo-in 0.4s ease both" }}>

          {/* ── Logo ── */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, marginBottom:28 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 11,
              background: `linear-gradient(135deg, ${g1}, ${g2})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 14px ${g1}55`,
            }}>
              {/* calendar/lock icon */}
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="6" width="16" height="12" rx="2.5" stroke="#fff" strokeWidth="1.8"/>
                <path d="M7 6V5a4 4 0 018 0v1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/>
                <circle cx="11" cy="12" r="1.5" fill="#fff"/>
              </svg>
            </div>
            <span style={{ fontSize:18, fontWeight:700, color:"#0A0A0A", letterSpacing:-0.4 }}>Slotify</span>
            <span style={{ fontSize:12.5, color:"#9CA3AF" }}>Workspace invitation</span>
          </div>

          {/* ── Card ── */}
          <div style={{
            background: "#fff",
            border: `1.5px solid ${data && !error ? prof.lightBorder : "#E5E7EB"}`,
            borderRadius: 18,
            padding: "28px 24px",
            boxShadow: data && !error
              ? `0 4px 24px ${g1}18`
              : "0 2px 12px rgba(0,0,0,0.05)",
            transition: "border-color 0.4s, box-shadow 0.4s",
          }}>

            {/* ── LOADING ── */}
            {loading && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, padding:"16px 0" }}>
                <Spin/>
                <span style={{ fontSize:13, color:"#9CA3AF", fontWeight:500 }}>Validating your invitation…</span>
              </div>
            )}

            {/* ── ERROR ── */}
            {!loading && error && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:"8px 0", textAlign:"center" }}>
                <div style={{
                  width:48, height:48, borderRadius:"50%",
                  background:"#FEF2F2", border:"1px solid #FECACA",
                  display:"flex", alignItems:"center", justifyContent:"center",
                }}>
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle cx="11" cy="11" r="8.5" stroke="#EF4444" strokeWidth="1.6"/>
                    <path d="M11 7.5v5" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round"/>
                    <circle cx="11" cy="15" r="0.85" fill="#EF4444"/>
                  </svg>
                </div>
                <span style={{ fontSize:16, fontWeight:700, color:"#0A0A0A" }}>Link expired</span>
                <span style={{ fontSize:12.5, color:"#9CA3AF", lineHeight:1.6 }}>{error}</span>
                <button onClick={() => navigate("/login")} style={{
                  marginTop:4, background:"none", border:"none",
                  color:"#2563EB", fontSize:12.5, fontWeight:600,
                  cursor:"pointer", fontFamily:"inherit", padding:0,
                }}>Back to login</button>
              </div>
            )}

            {/* ── SUCCESS ── */}
            {!loading && !error && accepted && (
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:12, padding:"8px 0 4px", textAlign:"center" }}>
                <div style={{
                  width:56, height:56, borderRadius:"50%",
                  background: prof.lightBg, border:`1.5px solid ${prof.lightBorder}`,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  animation:"slo-pop 0.4s cubic-bezier(.34,1.56,.64,1) both",
                }}>
                  <span style={{ fontSize:28 }}>{prof.emoji}</span>
                </div>
                <span style={{ fontSize:18, fontWeight:800, color:"#0A0A0A" }}>You're in!</span>
                <span style={{ fontSize:12.5, color:"#9CA3AF", lineHeight:1.6 }}>
                  Welcome to <strong style={{ color:"#111" }}>{data?.tenant}</strong> as{" "}
                  <strong style={{ color: g1 }}>{prof.label}</strong>.
                  <br/>Redirecting to your dashboard…
                </span>
                {/* Progress bar */}
                <div style={{
                  width:"100%", height:3, background:"#F3F4F6",
                  borderRadius:99, overflow:"hidden", marginTop:6,
                }}>
                  <div style={{
                    height:"100%", borderRadius:99,
                    background: `linear-gradient(90deg, ${g1}, ${g2})`,
                    animation:"slo-prog 2.2s linear forwards",
                  }}/>
                </div>
              </div>
            )}

            {/* ── INVITE DETAIL ── */}
            {!loading && !error && data && !accepted && (
              <>
                {/* Workspace + profession header */}
                <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
                  <WorkspaceAvatar name={data.tenant} prof={prof}/>
                  <div>
                    <div style={{ fontSize:15, fontWeight:800, color:"#0A0A0A", marginBottom:4 }}>
                      {data.tenant}
                    </div>
                    <ProfessionBadge prof={prof}/>
                  </div>
                </div>

                <div style={{ height:1, background:"#F3F4F6", marginBottom:0 }}/>

                {/* Fields */}
                <div>
                  {[
                    { label: "Workspace", value: <span style={valueSt}>{data.tenant}</span> },
                    { label: "Email",     value: <span style={valueSt}>{data.email}</span>  },
                    {
                      label: "Role",
                      value: (
                        <span style={{
                          display:"inline-flex", alignItems:"center", gap:5,
                          padding:"3px 10px", borderRadius:99, fontSize:11.5, fontWeight:700,
                          background: prof.lightBg, color: prof.lightText,
                          border: `1px solid ${prof.lightBorder}`,
                        }}>
                          <span style={{ fontSize:12 }}>{prof.emoji}</span>
                          {prof.label}
                        </span>
                      ),
                    },
                  ].map(({ label, value }) => (
                    <div className="slo-row" key={label}>
                      <span style={labelSt}>{label}</span>
                      {value}
                    </div>
                  ))}
                </div>

                {/* Profession-specific info notice */}
                <div style={{
                  background: prof.lightBg,
                  border: `1px solid ${prof.lightBorder}`,
                  borderRadius: 10, padding:"12px 14px",
                  display:"flex", gap:9, alignItems:"flex-start",
                  margin:"18px 0",
                }}>
                  <span style={{ fontSize:16, flexShrink:0, marginTop:0 }}>{prof.emoji}</span>
                  <p style={{ fontSize:12.5, color: prof.lightText, lineHeight:1.6, margin:0 }}>
                    {prof.welcomeNote}{" "}
                    You can leave the workspace anytime from your account settings.
                  </p>
                </div>

                {/* Accept CTA — profession-coloured */}
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  style={{
                    width:"100%", padding:"13px 0",
                    border:"none", borderRadius:11,
                    background: accepting
                      ? "#D1D5DB"
                      : `linear-gradient(135deg, ${g1}, ${g2})`,
                    color: accepting ? "#9CA3AF" : "#fff",
                    fontSize:14, fontWeight:700,
                    fontFamily:"inherit",
                    cursor: accepting ? "not-allowed" : "pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                    boxShadow: accepting ? "none" : `0 4px 14px ${g1}40`,
                    transition:"all 0.15s",
                  }}
                >
                  {accepting ? (
                    <><Spin size={13} color="#9CA3AF"/> Joining as {prof.label}…</>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path d="M2.5 7.5l3.5 3.5 6.5-6.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Accept as {prof.joinAs}
                    </>
                  )}
                </button>

                {/* Decline */}
                <button
                  onClick={() => navigate("/")}
                  style={{
                    width:"100%", marginTop:10,
                    background:"#fff", border:"1.5px solid #E5E7EB",
                    borderRadius:10, color:"#9CA3AF",
                    fontSize:13, fontWeight:500,
                    fontFamily:"inherit", cursor:"pointer", padding:"11px 0",
                    transition:"border-color 0.15s, color 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor="#D1D5DB"; e.currentTarget.style.color="#6B7280"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor="#E5E7EB"; e.currentTarget.style.color="#9CA3AF"; }}
                >
                  Decline
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <p style={{ textAlign:"center", fontSize:11.5, color:"#D1D5DB", marginTop:20 }}>
            Secure access · Slotify
          </p>
        </div>
      </div>
    </>
  );
};

export default InviteValidatePage;