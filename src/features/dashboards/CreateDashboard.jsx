import { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import {
  Building2, Users, CreditCard, Settings,
  CheckCircle2, ChevronRight, Loader2,
  User, Briefcase,
} from "lucide-react";


// ─── constants (unchanged from original) ─────────────────────────────────────

const INDUSTRIES = [
  "Healthcare", "Education", "Consulting",
  "Freelancing", "Technology", "Agency", "Finance", "Other",
];

const TEAM_SIZES = [
  "Just me", "2–5 members", "5–10 members",
  "10–25 members", "25–50 members", "50+ members",
];

const INDUSTRY_TO_TENANT = {
  Healthcare:  "DOCTOR",
  Education:   "TEACHER",
  Freelancing: "FREELANCER",
  Consulting:  "MENTOR",
  Technology:  "COMPANY",
  Agency:      "COMPANY",
  Finance:     "COMPANY",
  Other:       "COMPANY",
};

const TEAM_SIZE_MAP = {
  "Just me":       "JUST_ME",
  "2–5 members":   "SMALL",
  "5–10 members":  "SMALL",
  "10–25 members": "MEDIUM",
  "25–50 members": "LARGE",
  "50+ members":   "ENTERPRISE",
};


// ─── sidebar step item ────────────────────────────────────────────────────────

function StepItem({ icon, label, active, done }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
        ${active ? "bg-white text-blue-700 shadow-sm font-semibold"
        : done  ? "text-blue-200"
        : "text-blue-300 opacity-60"}`}
    >
      <span className={active ? "text-blue-600" : done ? "text-blue-300" : "text-blue-400"}>
        {done ? <CheckCircle2 size={17} /> : icon}
      </span>
      {label}
    </div>
  );
}


// ─── field wrapper ────────────────────────────────────────────────────────────

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {label}
        </label>
        {hint && <span className="text-[10px] text-gray-300">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

const inputCls = `w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900
  placeholder-gray-300 outline-none focus:border-blue-500 transition-colors bg-white`;


// ═══════════════════════════════════════════════════════════════════════════════

export default function CreateWorkspace() {
  const navigate = useNavigate();

  const [workspaceMode, setWorkspaceMode] = useState("SOLO");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [success,       setSuccess]       = useState(false);

  const [form, setForm] = useState({
    name:        "",
    industry:    "",
    email:       "",
    phone:       "",
    team_size:   "",
    description: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const payload = {
        name:           form.name,
        tenant_type:    INDUSTRY_TO_TENANT[form.industry] || "COMPANY",
        workspace_type: workspaceMode,
        email:          form.email,
        phone:          form.phone,
        team_size:      workspaceMode === "SOLO" ? "JUST_ME" : (TEAM_SIZE_MAP[form.team_size] || "JUST_ME"),
      };

      await axiosInstance.post("/workspaces/", payload);

      setSuccess(true);
      setTimeout(() => navigate("/workspaces"), 1800);
    } catch (err) {
      console.error(err.response?.data);
      setError(
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data) ||
        "Failed to create workspace. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  })();

  const initials = user?.email ? user.email.slice(0, 2).toUpperCase() : "AD";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── sidebar ── */}
      <aside className="hidden lg:flex w-56 flex-col flex-shrink-0 bg-blue-700 h-full">

        {/* logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b border-blue-600/30">
          <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="3" width="12" height="9" rx="2" stroke="#fff" strokeWidth="1.5" />
              <path d="M4 3V2.5a3 3 0 016 0V3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="7" cy="7.5" r="1" fill="#fff" />
            </svg>
          </div>
          <span className="text-white font-bold text-base tracking-tight">Slotify</span>
        </div>

        {/* setup steps */}
        <nav className="flex-1 px-3 py-5 space-y-0.5">
          <p className="text-[10px] font-semibold text-blue-400/60 uppercase tracking-widest px-3 mb-3">
            Setup steps
          </p>
          <StepItem icon={<Building2 size={17} />} label="Workspace Setup" active />
          <StepItem icon={<Users size={17} />}     label="Members"          />
          <StepItem icon={<CreditCard size={17} />} label="Plans"           />
          <StepItem icon={<Settings size={17} />}  label="Settings"         />
        </nav>

        {/* user */}
        <div className="px-3 pb-4 pt-3 border-t border-blue-600/30">
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
        </div>
      </aside>

      {/* ── main ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span className="text-gray-300">Workspaces</span>
            <ChevronRight size={13} />
            <span className="font-semibold text-gray-700">New workspace</span>
          </div>
        </header>

        {/* page body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-10 py-8">
          <div className="max-w-2xl mx-auto">

            {/* heading */}
            <div className="mb-8">
              <h1 className="text-xl font-bold text-gray-900">Create your workspace</h1>
              <p className="text-sm text-gray-400 mt-1">
                Your workspace holds your team, bookings, and services.
              </p>
            </div>

            {/* success state */}
            {success ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 flex flex-col items-center gap-4 text-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-500" />
                </div>
                <div>
                  <p className="text-base font-bold text-gray-900">Workspace created!</p>
                  <p className="text-sm text-gray-400 mt-1">Redirecting you to your workspaces…</p>
                </div>
                <div className="w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full animate-[grow_1.8s_linear_forwards]" style={{ width: "100%", animation: "none", transition: "width 1.8s linear" }} />
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* error */}
                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                {/* card 1 — basics */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Building2 size={13} className="text-blue-600" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-900">Basic info</h2>
                  </div>

                  {/* workspace name */}
                  <Field label="Workspace name">
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Slotify Clinic"
                      className={inputCls}
                      required
                    />
                  </Field>

                  {/* mode toggle */}
                  <Field label="How will you use Slotify?">
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { value: "SOLO", label: "Just me",     sub: "Solo professional", icon: <User size={16} /> },
                        { value: "TEAM", label: "I have a team", sub: "Multiple members",  icon: <Users size={16} /> },
                      ].map(({ value, label, sub, icon }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setWorkspaceMode(value)}
                          className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all
                            ${workspaceMode === value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                          <span className={`mt-0.5 ${workspaceMode === value ? "text-blue-600" : "text-gray-400"}`}>
                            {icon}
                          </span>
                          <div>
                            <p className={`text-sm font-semibold ${workspaceMode === value ? "text-blue-700" : "text-gray-700"}`}>
                              {label}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </Field>

                  {/* industry */}
                  <Field label="Industry">
                    <select
                      name="industry"
                      value={form.industry}
                      onChange={handleChange}
                      className={inputCls}
                      required
                    >
                      <option value="">Select industry</option>
                      {INDUSTRIES.map((i) => (
                        <option key={i} value={i}>{i}</option>
                      ))}
                    </select>
                  </Field>

                  {/* team size — only for TEAM */}
                  {workspaceMode === "TEAM" && (
                    <Field label="Team size">
                      <select
                        name="team_size"
                        value={form.team_size}
                        onChange={handleChange}
                        className={inputCls}
                        required
                      >
                        <option value="">Select team size</option>
                        {TEAM_SIZES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                  )}
                </div>

                {/* card 2 — contact */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center">
                      <Briefcase size={13} className="text-green-600" />
                    </div>
                    <h2 className="text-sm font-bold text-gray-900">Contact details</h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Contact email">
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="clinic@example.com"
                        className={inputCls}
                        required
                      />
                    </Field>

                    <Field label="Phone number">
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className={inputCls}
                        required
                      />
                    </Field>
                  </div>

                  <Field label="Description" hint="optional">
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="Briefly describe what this workspace is for…"
                      rows={3}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                </div>

                {/* submit */}
                <div className="flex items-center justify-between pb-4">
                  <button
                    type="button"
                    onClick={() => navigate("/workspaces")}
                    className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Creating…
                      </>
                    ) : (
                      <>
                        Create workspace
                        <ChevronRight size={14} />
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}