import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2, ChevronRight, Loader2, User, Users,
  ArrowLeft, ArrowRight, Sparkles, LayoutDashboard,
} from "lucide-react";

// ─── tenant config ────────────────────────────────────────────────────────────

const TENANT_TYPES = [
  {
    id: "MENTOR",
    label: "Mentor",
    tagline: "Guide students & clients",
    description: "1:1 mentoring, group sessions, progress tracking and notes.",
    sections: ["students", "sessions", "notes"],
    color: "#2563eb",
    light: "#eff6ff",
    border: "#bfdbfe",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="9" cy="8" r="3.5" stroke="#2563eb" strokeWidth="1.8"/>
        <path d="M2 21c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M18 12l2 2 4-4" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "TEACHER",
    label: "Teacher",
    tagline: "Educate & manage classes",
    description: "Student rosters, assignments, attendance and lesson planning.",
    sections: ["students", "assignments", "attendance"],
    color: "#0891b2",
    light: "#ecfeff",
    border: "#a5f3fc",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <rect x="2" y="4" width="22" height="15" rx="2" stroke="#0891b2" strokeWidth="1.8"/>
        <path d="M7 9h12M7 13h8" stroke="#0891b2" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M13 19v3M9 22h8" stroke="#0891b2" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "FITNESS",
    label: "Fitness",
    tagline: "Train clients, track results",
    description: "Client management, workout plans and progress milestones.",
    sections: ["clients", "workouts", "progress"],
    color: "#059669",
    light: "#f0fdf4",
    border: "#a7f3d0",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M3 13h3M20 13h3" stroke="#059669" strokeWidth="1.8" strokeLinecap="round"/>
        <rect x="6" y="10" width="14" height="6" rx="3" stroke="#059669" strokeWidth="1.8"/>
        <circle cx="13" cy="13" r="2" fill="#059669"/>
      </svg>
    ),
  },
  {
    id: "CONSULTANT",
    label: "Consultant",
    tagline: "Manage clients & meetings",
    description: "Client pipeline, meeting scheduling and professional reports.",
    sections: ["clients", "meetings", "reports"],
    color: "#7c3aed",
    light: "#f5f3ff",
    border: "#ddd6fe",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <rect x="4" y="3" width="18" height="20" rx="2" stroke="#7c3aed" strokeWidth="1.8"/>
        <path d="M8 9h10M8 13h10M8 17h6" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "DOCTOR",
    label: "Doctor",
    tagline: "Manage patients & records",
    description: "Patients, appointments, medical records and AI checkup system.",
    sections: ["patients", "appointments", "medical_records", "checkup_system_ai"],
    color: "#dc2626",
    light: "#fff1f2",
    border: "#fecaca",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M13 5v16M5 13h16" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"/>
        <rect x="3" y="3" width="20" height="20" rx="4" stroke="#dc2626" strokeWidth="1.8"/>
      </svg>
    ),
  },
];

const TEAM_SIZE_MAP = {
  "Just me": "JUST_ME",
  "2–5":     "SMALL",
  "6–15":    "MEDIUM",
  "16–50":   "LARGE",
  "50+":     "ENTERPRISE",
};

// ─── step indicator ───────────────────────────────────────────────────────────

function Steps({ current }) {
  const steps = ["Workspace type", "Details", "Contact"];
  return (
    <div className="flex items-center mb-10">
      {steps.map((s, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={s} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${active ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : done   ? "bg-blue-100 text-blue-600"
                :          "bg-gray-100 text-gray-400"}`}>
                {done ? <CheckCircle2 size={13} /> : i + 1}
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap transition-colors
                ${active ? "text-gray-900" : done ? "text-blue-500" : "text-gray-400"}`}>
                {s}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-10 h-px mx-3 ${done ? "bg-blue-300" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function SectionBadge({ label, color }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize"
      style={{ background: color + "15", color }}
    >
      {label}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════

export default function CreateWorkspace() {
  const navigate = useNavigate();

  const [step,          setStep]          = useState(0);
  const [selectedType,  setSelectedType]  = useState(null);
  const [workspaceMode, setWorkspaceMode] = useState("SOLO");
  const [teamSize,      setTeamSize]      = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [success,       setSuccess]       = useState(false);

  const [form, setForm] = useState({ name: "", email: "", phone: "", description: "" });

  const handleChange = (e) => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const tenant = TENANT_TYPES.find(t => t.id === selectedType);

  const canNext0 = !!selectedType;
  const canNext1 = form.name.trim() !== "";

  const handleSubmit = async () => {
    setError("");
    try {
      setLoading(true);
      const payload = {
        name:           form.name,
        template_type:  selectedType,
        workspace_type: workspaceMode,
        email:          form.email,
        phone:          form.phone,
        description:    form.description,
        team_size:      workspaceMode === "SOLO" ? "JUST_ME" : (TEAM_SIZE_MAP[teamSize] || "JUST_ME"),
      };

      const res = await axiosInstance.post("/workspaces/", payload);
      const createdSlug    = res.data?.slug        || "";
      const returnedTenant = res.data?.tenant_type || selectedType;

      if (createdSlug) {
        try {
          const meta = JSON.parse(localStorage.getItem("workspace_meta") || "{}");
          meta[createdSlug] = { tenant_type: returnedTenant, workspace_type: workspaceMode };
          localStorage.setItem("workspace_meta", JSON.stringify(meta));
        } catch (_) {}
      }

      setSuccess(true);
      if (createdSlug) {
        setTimeout(() => {
          navigate(`/admin/workspace/${createdSlug}/dashboard`);
        }, 1500);
      }

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data) ||
        "Failed to create workspace."
      );
    } finally {
      setLoading(false);
    }
  };

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();
  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "AD";

  const inp = `w-full px-4 py-3 border border-[#c7dff7] rounded-xl text-sm text-[#0c1a3a]
    placeholder-[#94b4d1] outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-50
    transition-all bg-white`;

  // ── success ────────────────────────────────────────────────────────────────
  if (success) return (
    <div className="min-h-screen bg-[#f0f7ff] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl border border-[#c7dff7] p-12 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h2 className="text-xl font-bold text-[#0c1a3a] mb-1">You're all set!</h2>
        <p className="text-sm text-[#5b8db8] mb-6">
          Your <span className="font-semibold text-[#0c1a3a]">{form.name}</span> workspace is ready.
        </p>
        <div className="flex items-center gap-2 justify-center text-xs text-[#5b8db8]">
          <Loader2 size={12} className="animate-spin" />
          Taking you to your dashboard…
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f0f7ff] flex">

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex w-80 flex-col flex-shrink-0 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1d4ed8 0%, #2563eb 55%, #3b82f6 100%)" }}
      >
        {/* grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }} />

        {/* glow orbs */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-10 w-48 h-48 bg-blue-300/20 rounded-full blur-2xl pointer-events-none" />

        {/* logo */}
        <div className="relative flex items-center gap-3 px-7 py-7">
          <div className="w-8 h-8 bg-white/20 border border-white/30 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="3.5" width="14" height="10" rx="2.5" stroke="#fff" strokeWidth="1.6"/>
              <path d="M5 3.5V3a3 3 0 016 0v.5" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
              <circle cx="8" cy="8.5" r="1.2" fill="#fff"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Slotify</span>
        </div>

        {/* main copy + preview */}
        <div className="relative flex-1 px-7 flex flex-col justify-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 px-3 py-1 rounded-full mb-4">
              <Sparkles size={11} className="text-blue-100" />
              <span className="text-[11px] font-semibold text-blue-100 tracking-wide uppercase">New Workspace</span>
            </div>
            <h2 className="text-[1.6rem] font-bold text-white leading-tight mb-3">
              Build your<br />professional space
            </h2>
            <p className="text-sm text-blue-100/70 leading-relaxed">
              Pick a template, add your details, and start managing bookings in minutes.
            </p>
          </div>

          {/* preview card */}
          {tenant ? (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/90">
                  {tenant.icon}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{tenant.label}</p>
                  <p className="text-[11px] text-blue-100/70">{tenant.tagline}</p>
                </div>
              </div>
              <p className="text-[11px] text-blue-100/50 mb-4 leading-relaxed">{tenant.description}</p>
              <div className="border-t border-white/15 pt-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <LayoutDashboard size={10} className="text-blue-200/60" />
                  <p className="text-[10px] font-semibold text-blue-200/60 uppercase tracking-widest">Your sections</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["dashboard", ...tenant.sections, "bookings", "plans", "team", "settings"].map(s => (
                    <span key={s}
                      className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/12 text-white/70 border border-white/15 capitalize">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/8 border border-white/15 rounded-2xl p-5">
              <div className="flex flex-col items-center gap-2 py-2">
                <LayoutDashboard size={20} className="text-blue-200/40" />
                <p className="text-xs text-blue-200/40 text-center leading-relaxed">
                  Select a workspace type to preview your dashboard sections
                </p>
              </div>
            </div>
          )}
        </div>

        {/* user chip */}
        <div className="relative px-7 pb-7 pt-4 border-t border-white/15">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.first_name || "Admin"}</p>
              <p className="text-[10px] text-blue-200/60 truncate">{user?.email || "admin@slotify.com"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT: form area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* topbar */}
        <header className="h-14 bg-white border-b border-[#c7dff7] flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/workspaces")}
              className="text-[#5b8db8] hover:text-[#0c1a3a] flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={13} />
              <span className="text-xs font-medium">Workspaces</span>
            </button>
            <ChevronRight size={12} className="text-[#c7dff7]" />
            <span className="text-xs font-semibold text-[#0c1a3a]">New workspace</span>
          </div>
          <span className="text-xs text-[#5b8db8] font-medium bg-[#f0f7ff] px-3 py-1 rounded-full border border-[#c7dff7]">
            Step {step + 1} of 3
          </span>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#f0f7ff]">
          <div className="max-w-2xl mx-auto px-6 sm:px-10 py-10">
            <Steps current={step} />

            {/* ── STEP 0: Type picker ── */}
            {step === 0 && (
              <div>
                <div className="mb-7">
                  <h1 className="text-2xl font-bold text-[#0c1a3a] tracking-tight">What type of workspace?</h1>
                  <p className="text-sm text-[#5b8db8] mt-1.5">
                    This sets your dashboard layout and available features.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {TENANT_TYPES.map((t) => {
                    const active = selectedType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedType(t.id)}
                        className={`relative text-left p-5 rounded-2xl border-2 transition-all duration-200
                          ${active
                            ? "shadow-md"
                            : "border-[#c7dff7] bg-white hover:border-blue-300 hover:shadow-sm"
                          }`}
                        style={active ? { borderColor: t.color, background: t.light } : {}}
                      >
                        {active && (
                          <div
                            className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: t.color }}
                          >
                            <CheckCircle2 size={12} className="text-white" />
                          </div>
                        )}

                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                          style={{ background: active ? "#fff" : t.light, border: `1.5px solid ${t.border}` }}
                        >
                          {t.icon}
                        </div>

                        <p className="text-base font-bold text-[#0c1a3a] mb-0.5">{t.label}</p>
                        <p className="text-xs font-medium mb-3" style={{ color: t.color }}>{t.tagline}</p>
                        <p className="text-xs text-[#5b8db8] leading-relaxed mb-3">{t.description}</p>

                        <div className="flex flex-wrap gap-1">
                          {t.sections.map(s => <SectionBadge key={s} label={s} color={t.color} />)}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => canNext0 && setStep(1)}
                    disabled={!canNext0}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-[#c7dff7] disabled:text-white disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-blue-200"
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 1: Details ── */}
            {step === 1 && (
              <div>
                <div className="mb-7">
                  <h1 className="text-2xl font-bold text-[#0c1a3a] tracking-tight">Name your workspace</h1>
                  <p className="text-sm text-[#5b8db8] mt-1.5">Give it a name and choose how you'll use it.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#5b8db8] uppercase tracking-widest">Workspace name</label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={`e.g. ${tenant?.label || "My"} Studio`}
                      className={inp}
                      autoFocus
                    />
                    {tenant && (
                      <p className="text-[11px] text-[#5b8db8] pl-1">
                        This will be your <span className="font-semibold text-blue-600">{tenant.label}</span> workspace on Slotify.
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#5b8db8] uppercase tracking-widest">How will you use Slotify?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "SOLO", label: "Just me",       sub: "Solo professional", icon: <User size={16} /> },
                        { value: "TEAM", label: "I have a team", sub: "With collaborators", icon: <Users size={16} /> },
                      ].map(({ value, label, sub, icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setWorkspaceMode(value)}
                          className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all
                            ${workspaceMode === value
                              ? "border-blue-500 bg-blue-50"
                              : "border-[#c7dff7] bg-white hover:border-blue-300"}`}
                        >
                          <span className={`mt-0.5 ${workspaceMode === value ? "text-blue-600" : "text-[#5b8db8]"}`}>
                            {icon}
                          </span>
                          <div>
                            <p className={`text-sm font-semibold ${workspaceMode === value ? "text-blue-700" : "text-[#0c1a3a]"}`}>
                              {label}
                            </p>
                            <p className="text-[11px] text-[#5b8db8] mt-0.5">{sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {workspaceMode === "TEAM" && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#5b8db8] uppercase tracking-widest">Team size</label>
                      <div className="grid grid-cols-5 gap-2">
                        {Object.keys(TEAM_SIZE_MAP).map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setTeamSize(s)}
                            className={`py-2.5 rounded-xl border-2 text-xs font-semibold transition-all
                              ${teamSize === s
                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                : "border-[#c7dff7] bg-white text-[#5b8db8] hover:border-blue-300"}`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => setStep(0)}
                    className="flex items-center gap-1.5 text-sm text-[#5b8db8] hover:text-[#0c1a3a] font-medium transition-colors"
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                  <button
                    onClick={() => canNext1 && setStep(2)}
                    disabled={!canNext1}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-[#c7dff7] disabled:text-white disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-blue-200"
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: Contact ── */}
            {step === 2 && (
              <div>
                <div className="mb-7">
                  <h1 className="text-2xl font-bold text-[#0c1a3a] tracking-tight">Contact details</h1>
                  <p className="text-sm text-[#5b8db8] mt-1.5">
                    How can clients and team members reach this workspace?
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl mb-5">
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#5b8db8] uppercase tracking-widest">Contact email</label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="hello@example.com"
                        className={inp}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-[#5b8db8] uppercase tracking-widest">Phone number</label>
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={inp}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#5b8db8] uppercase tracking-widest">Description</label>
                      <span className="text-[10px] text-[#94b4d1]">optional</span>
                    </div>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Briefly describe what this workspace is for…"
                      rows={3}
                      className={`${inp} resize-none`}
                    />
                  </div>

                  {/* summary */}
                  {tenant && (
                    <div className="bg-white border border-[#c7dff7] rounded-2xl p-4">
                      <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-widest mb-2.5">Summary</p>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                        <div>
                          <span className="text-[#5b8db8]">Type </span>
                          <span className="font-semibold text-[#0c1a3a]">{tenant.label}</span>
                        </div>
                        <div>
                          <span className="text-[#5b8db8]">Mode </span>
                          <span className="font-semibold text-[#0c1a3a]">{workspaceMode === "SOLO" ? "Solo" : "Team"}</span>
                        </div>
                        {form.name && (
                          <div className="col-span-2">
                            <span className="text-[#5b8db8]">Name </span>
                            <span className="font-semibold text-[#0c1a3a]">{form.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-sm text-[#5b8db8] hover:text-[#0c1a3a] font-medium transition-colors"
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading || !form.email || !form.phone}
                    className="flex items-center gap-2 px-7 py-2.5 bg-[#0c1a3a] hover:bg-[#162d5e] disabled:bg-[#c7dff7] disabled:text-white disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all shadow-sm"
                  >
                    {loading
                      ? <><Loader2 size={14} className="animate-spin" /> Creating…</>
                      : <><Sparkles size={14} /> Create workspace</>
                    }
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}