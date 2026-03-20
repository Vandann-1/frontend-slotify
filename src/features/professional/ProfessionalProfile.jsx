import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {
  GraduationCap, Star, Briefcase, FileText,
  Link2, CheckCircle2, AlertTriangle, Loader2,
  User, Save,
} from "lucide-react";


// ─── shared input styles ──────────────────────────────────────────────────────
const inputCls = `w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900
  placeholder-gray-300 outline-none focus:border-blue-500 transition-colors bg-white`;


// ─── field wrapper ────────────────────────────────────────────────────────────
function Field({ label, hint, icon, children }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {icon && <span className="text-gray-400">{icon}</span>}
          {label}
        </label>
        {hint && <span className="text-[10px] text-gray-300">{hint}</span>}
      </div>
      {children}
    </div>
  );
}


// ─── avatar initials ──────────────────────────────────────────────────────────
function Avatar({ email = "", size = "lg" }) {
  const letters = email.slice(0, 2).toUpperCase() || "PR";
  const sz = size === "lg"
    ? "w-16 h-16 text-xl"
    : "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-2xl bg-gray-900 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {letters}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════

const ProfessionalProfile = () => {
  const navigate      = useNavigate();
  const redirectTimer = useRef(null);

  const [form, setForm] = useState({
    qualifications:   "",
    specialization:   "",
    experience_years: "",
    bio:              "",
    linkdin_url:      "",
  });

  const [userEmail, setUserEmail] = useState("");
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [success,   setSuccess]   = useState("");
  const [error,     setError]     = useState("");

  // ── load profile ──
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axiosInstance.get("/auth/professional/me/");

        if (!res?.data) {
          setError("Invalid response from server.");
          return;
        }

        setForm({
          qualifications:   res.data.qualifications   || "",
          specialization:   res.data.specialization   || "",
          experience_years: res.data.experience_years ?? "",
          bio:              res.data.bio              || "",
          linkdin_url:      res.data.linkdin_url      || "",
        });

        // grab email for avatar
        try {
          const stored = JSON.parse(localStorage.getItem("user") || "{}");
          setUserEmail(res.data.email || stored?.email || "");
        } catch { /* ignore */ }

      } catch (err) {
        console.error("Profile load failed:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => { if (redirectTimer.current) clearTimeout(redirectTimer.current); };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  // ── validation ──
  const validate = () => {
    if (form.linkdin_url && !form.linkdin_url.startsWith("http")) {
      return "Please enter a valid LinkedIn URL (must start with http).";
    }
    if (form.experience_years !== "" && Number(form.experience_years) < 0) {
      return "Experience cannot be negative.";
    }
    return "";
  };

  // ── save ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;

    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      await axiosInstance.put("/auth/professional/me/", {
        ...form,
        experience_years: form.experience_years === "" ? 0 : Number(form.experience_years),
      });

      setSuccess("Profile updated successfully.");

      redirectTimer.current = setTimeout(() => {
        navigate("/professional/dashboard", { replace: true });
      }, 1600);

    } catch (err) {
      console.error("Profile update failed:", err);
      setError(
        err?.response?.data?.detail ||
        "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ── loading ──
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={22} className="animate-spin text-blue-600" />
      </div>
    );
  }

  // ── completion % ──
  const fields = [
    form.qualifications, form.specialization,
    form.experience_years, form.bio, form.linkdin_url,
  ];
  const filled     = fields.filter(Boolean).length;
  const completion = Math.round((filled / fields.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8 space-y-6">

        {/* ── page header ── */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">Professional Profile</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Keep your information up to date so clients can find you.
          </p>
        </div>

        {/* ── profile summary card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-16 bg-blue-700" />
          <div className="px-5 pb-5">
            <div className="flex items-end justify-between -mt-8 mb-4">
              <Avatar email={userEmail} />
              {/* profile completeness */}
              <div className="flex flex-col items-end gap-1 mb-1">
                <span className="text-xs font-semibold text-gray-500">
                  Profile {completion}% complete
                </span>
                <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${completion}%` }}
                    className={`h-full rounded-full transition-all duration-500
                      ${completion === 100 ? "bg-green-500" : completion >= 60 ? "bg-blue-500" : "bg-amber-500"}`}
                  />
                </div>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-900">{userEmail || "Professional"}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {form.specialization || "No specialization set"}{form.experience_years ? ` · ${form.experience_years} yrs exp` : ""}
            </p>
          </div>
        </div>

        {/* ── banners ── */}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-4 py-3 rounded-xl">
            <CheckCircle2 size={14} className="flex-shrink-0" />
            {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-3 rounded-xl">
            <AlertTriangle size={14} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── form ── */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* card 1 — credentials */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-blue-50 flex items-center justify-center">
                <GraduationCap size={13} className="text-blue-600" />
              </div>
              <h2 className="text-sm font-bold text-gray-900">Credentials</h2>
            </div>

            <Field label="Qualification" icon={<GraduationCap size={12} />}>
              <input
                name="qualifications"
                value={form.qualifications}
                onChange={handleChange}
                placeholder="e.g. BSc Computer Science, MBBS"
                className={inputCls}
              />
            </Field>

            <Field label="Specialization" icon={<Star size={12} />}>
              <input
                name="specialization"
                value={form.specialization}
                onChange={handleChange}
                placeholder="e.g. Web Development, Cardiology"
                className={inputCls}
              />
            </Field>

            <Field label="Years of experience" icon={<Briefcase size={12} />}>
              <input
                type="number"
                name="experience_years"
                value={form.experience_years}
                onChange={handleChange}
                min="0"
                max="60"
                placeholder="e.g. 5"
                className={inputCls}
              />
            </Field>
          </div>

          {/* card 2 — about + links */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center">
                <User size={13} className="text-green-600" />
              </div>
              <h2 className="text-sm font-bold text-gray-900">About &amp; Links</h2>
            </div>

            <Field label="Bio" icon={<FileText size={12} />} hint="optional">
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={4}
                placeholder="Tell clients about your background, expertise and approach…"
                className={`${inputCls} resize-none`}
              />
            </Field>

            <Field label="LinkedIn URL" icon={<Link2 size={12} />} hint="optional">
              <input
                name="linkdin_url"
                value={form.linkdin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/your-profile"
                className={inputCls}
              />
            </Field>
          </div>

          {/* actions */}
          <div className="flex items-center justify-between pb-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-400 hover:text-gray-600 font-medium transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save size={14} />
                  Save profile
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ProfessionalProfile;