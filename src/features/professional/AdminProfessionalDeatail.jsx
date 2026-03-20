import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import {
  ArrowLeft, Mail, Briefcase, GraduationCap, Link2,
  ShieldCheck, ShieldOff, CheckCircle2, Clock,
  MoreVertical, ExternalLink, Calendar, Star,
  AlertTriangle, Loader2, User,
} from "lucide-react";


// ─── helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff  = Date.now() - new Date(dateStr).getTime();
  const days  = Math.floor(diff / 86400000);
  const hours = Math.floor(diff / 3600000);
  if (hours < 1)   return "Just now";
  if (hours < 24)  return `${hours}h ago`;
  if (days < 30)   return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function initials(email = "") {
  return email.slice(0, 2).toUpperCase();
}


// ─── sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-gray-400">{icon}</span>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-xl font-bold text-gray-900">{value || "—"}</p>
    </div>
  );
}

function InfoRow({ label, value, link = false }) {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-50 last:border-none gap-4">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex-shrink-0 pt-0.5">
        {label}
      </span>
      {value ? (
        link ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium"
          >
            View profile <ExternalLink size={12} />
          </a>
        ) : (
          <span className="text-sm font-medium text-gray-900 text-right">{value}</span>
        )
      ) : (
        <span className="text-sm text-gray-300">—</span>
      )}
    </div>
  );
}

function ActionButton({ onClick, variant = "default", icon, children, loading }) {
  const styles = {
    default: "bg-gray-900 hover:bg-black text-white",
    danger:  "border border-red-200 text-red-500 hover:bg-red-50",
    ghost:   "border border-gray-200 text-gray-600 hover:bg-gray-50",
    success: "bg-green-600 hover:bg-green-700 text-white",
  };
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${styles[variant]}`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
    </button>
  );
}

// confirm modal
function ConfirmModal({ title, message, confirmLabel, variant, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-4
          ${variant === "danger" ? "bg-red-50 border border-red-100" : "bg-green-50 border border-green-100"}`}>
          {variant === "danger"
            ? <AlertTriangle size={20} className="text-red-500" />
            : <ShieldCheck size={20} className="text-green-500" />
          }
        </div>
        <h3 className="text-sm font-bold text-gray-900 text-center">{title}</h3>
        <p className="text-xs text-gray-400 text-center mt-1.5 leading-relaxed">{message}</p>
        <div className="flex gap-2.5 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-[2] py-2.5 rounded-xl text-sm font-semibold text-white transition-colors
              ${variant === "danger" ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════

const AdminProfessionalDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();

  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");
  const [confirm,       setConfirm]       = useState(null); // { type: "verify"|"suspend" }
  const [menuOpen,      setMenuOpen]      = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axiosInstance.get(`/auth/admin/professionals/${id}/`);
        setData(res.data);
      } catch (err) {
        setError(err?.response?.data?.detail || "Professional not found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // close menu on outside click
  useEffect(() => {
    const close = () => setMenuOpen(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const handleVerify = async () => {
    setConfirm(null);
    setActionLoading(true);
    setActionSuccess("");
    try {
      await axiosInstance.post(`/auth/admin/professionals/${id}/verify/`);
      setData((prev) => ({ ...prev, verified: true }));
      setActionSuccess("Professional verified successfully.");
    } catch (err) {
      setError(err?.response?.data?.detail || "Verification failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    setConfirm(null);
    setActionLoading(true);
    setActionSuccess("");
    try {
      await axiosInstance.post(`/auth/admin/professionals/${id}/suspend/`);
      setData((prev) => ({ ...prev, suspended: true }));
      setActionSuccess("Account suspended.");
    } catch (err) {
      setError(err?.response?.data?.detail || "Suspension failed.");
    } finally {
      setActionLoading(false);
    }
  };

  // ── loading ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 size={22} className="animate-spin text-blue-600" />
      </div>
    );
  }

  // ── error ──
  if (error && !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-3">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
          <AlertTriangle size={20} className="text-red-500" />
        </div>
        <p className="text-sm font-semibold text-gray-700">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-blue-600 font-semibold hover:underline"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!data) return null;

  const isVerified  = !!data.verified;
  const isSuspended = !!data.suspended;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* ── topbar ── */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        {/* more menu */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
          >
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-10 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-44">
              <button
                onClick={() => { setMenuOpen(false); navigate(`/admin/professionals/${id}/edit`); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50"
              >
                <User size={13} className="text-gray-400" />
                Edit profile
              </button>
              <button
                onClick={() => { setMenuOpen(false); setConfirm({ type: "suspend" }); }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-red-500 hover:bg-red-50"
              >
                <ShieldOff size={13} />
                Suspend account
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 space-y-6">

        {/* ── success / error banners ── */}
        {actionSuccess && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium px-4 py-3 rounded-xl">
            <CheckCircle2 size={14} className="flex-shrink-0" />
            {actionSuccess}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-3 rounded-xl">
            <AlertTriangle size={14} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── profile header card ── */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* colour strip */}
          <div className="h-24 bg-blue-700" />

          <div className="px-6 pb-6">
            {/* avatar overlapping strip */}
            <div className="flex items-end justify-between -mt-10 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-900 border-4 border-white flex items-center justify-center text-white text-xl font-bold shadow-md">
                {initials(data.email)}
              </div>

              {/* status badge */}
              <div className="flex items-center gap-2 mb-1">
                {isSuspended ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-xs font-semibold text-red-600">
                    <ShieldOff size={11} /> Suspended
                  </span>
                ) : isVerified ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-200 text-xs font-semibold text-green-700">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-700">
                    <Clock size={11} /> Pending verification
                  </span>
                )}
              </div>
            </div>

            {/* name / email */}
            <h1 className="text-lg font-bold text-gray-900">
              {data.first_name && data.last_name
                ? `${data.first_name} ${data.last_name}`
                : data.email
              }
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">{data.email}</p>

            {/* bio */}
            {data.bio && (
              <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-xl">
                {data.bio}
              </p>
            )}

            {/* quick meta pills */}
            <div className="flex flex-wrap gap-2 mt-4">
              {data.specialization && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-xs font-medium text-blue-700">
                  <Star size={10} /> {data.specialization}
                </span>
              )}
              {data.experience_years && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
                  <Briefcase size={10} /> {data.experience_years} yrs experience
                </span>
              )}
              {data.qualifications && (
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 rounded-lg text-xs font-medium text-gray-600">
                  <GraduationCap size={10} /> {data.qualifications}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── stat cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            icon={<Briefcase size={14} />}
            label="Experience"
            value={data.experience_years ? `${data.experience_years} yrs` : null}
          />
          <StatCard
            icon={<Star size={14} />}
            label="Specialization"
            value={data.specialization}
          />
          <StatCard
            icon={<GraduationCap size={14} />}
            label="Qualification"
            value={data.qualifications}
          />
          <StatCard
            icon={<Calendar size={14} />}
            label="Joined"
            value={timeAgo(data.created_at || data.date_joined)}
          />
        </div>

        {/* ── lower grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* contact info */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Contact info</h3>
            <InfoRow label="Email"          value={data.email} />
            <InfoRow label="Phone"          value={data.phone} />
            <InfoRow label="LinkedIn"       value={data.linkdin_url} link />
            <InfoRow label="Website"        value={data.website_url} link />
          </div>

          {/* professional details */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Professional details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              <InfoRow label="Verified"       value={isVerified  ? "Yes" : "No"} />
              <InfoRow label="Suspended"      value={isSuspended ? "Yes" : "No"} />
              <InfoRow label="Experience"     value={data.experience_years ? `${data.experience_years} years` : null} />
              <InfoRow label="Specialization" value={data.specialization} />
              <InfoRow label="Qualification"  value={data.qualifications} />
              <InfoRow label="Member since"   value={data.created_at ? new Date(data.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null} />
            </div>
          </div>
        </div>

        {/* ── admin actions ── */}
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Admin actions</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                These actions affect the professional's access and visibility.
              </p>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              {!isVerified && !isSuspended && (
                <ActionButton
                  variant="success"
                  icon={<ShieldCheck size={14} />}
                  loading={actionLoading}
                  onClick={() => setConfirm({ type: "verify" })}
                >
                  Verify professional
                </ActionButton>
              )}
              {isVerified && !isSuspended && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 border border-green-100 px-3 py-2 rounded-xl">
                  <CheckCircle2 size={13} /> Already verified
                </span>
              )}
              {!isSuspended ? (
                <ActionButton
                  variant="danger"
                  icon={<ShieldOff size={14} />}
                  loading={actionLoading}
                  onClick={() => setConfirm({ type: "suspend" })}
                >
                  Suspend account
                </ActionButton>
              ) : (
                <ActionButton
                  variant="ghost"
                  icon={<ShieldCheck size={14} />}
                  loading={actionLoading}
                  onClick={handleVerify}
                >
                  Reinstate account
                </ActionButton>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ── confirm modals ── */}
      {confirm?.type === "verify" && (
        <ConfirmModal
          title="Verify this professional?"
          message="This will mark the account as verified and make the professional visible to clients."
          confirmLabel="Yes, verify"
          variant="success"
          onConfirm={handleVerify}
          onCancel={() => setConfirm(null)}
        />
      )}

      {confirm?.type === "suspend" && (
        <ConfirmModal
          title="Suspend this account?"
          message="The professional will lose access to their workspace. You can reinstate them at any time."
          confirmLabel="Yes, suspend"
          variant="danger"
          onConfirm={handleSuspend}
          onCancel={() => setConfirm(null)}
        />
      )}

    </div>
  );
};

export default AdminProfessionalDetail;