import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import invitationApi from "../../api/invitationApi";
import { useNavigate } from "react-router-dom";
import {
  UserPlus, Crown, Eye, Mail, Trash2, Search,
  X, Send, CheckCircle2, Clock, ChevronDown,
  Zap, Users, RefreshCw, User,
} from "lucide-react";


// ─── helpers ──────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-gray-900", "bg-blue-600", "bg-violet-600",
  "bg-cyan-600",  "bg-rose-600",  "bg-amber-600",
];

function avatarColor(str = "") {
  return AVATAR_COLORS[str.charCodeAt(0) % AVATAR_COLORS.length];
}

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)   return "just now";
  if (mins  < 60)  return `${mins}m ago`;
  if (hours < 24)  return `${hours}h ago`;
  if (days  < 30)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}


// ─── role badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }) {
  const map = {
    OWNER:        "bg-gray-100 text-gray-700",
    ADMIN:        "bg-blue-50 text-blue-700",
    PROFESSIONAL: "bg-green-50 text-green-700",
    MEMBER:       "bg-green-50 text-green-700",
  };
  const cls = map[(role || "").toUpperCase()] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${cls}`}>
      {role}
    </span>
  );
}


// ─── upgrade modal ────────────────────────────────────────────────────────────

function UpgradeModal({ planName, membersUsed, memberLimit, onClose, onUpgrade }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-sm p-7 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-4">
          <Crown size={26} className="text-amber-500" />
        </div>

        <h2 className="text-lg font-bold text-gray-900">You've hit your limit</h2>
        <p className="text-sm text-gray-400 mt-1.5 leading-relaxed">
          Your <span className="font-semibold text-gray-700">{planName}</span> plan allows{" "}
          <span className="font-semibold text-gray-700">{memberLimit}</span> members.
          You're currently at <span className="font-semibold text-gray-700">{membersUsed}</span>.
          Upgrade to invite more people.
        </p>

        <div className="flex gap-2.5 mt-5 mb-6">
          {[
            { name: "Starter", seats: "5 seats",  price: "₹499/mo",  highlight: false },
            { name: "Pro",     seats: "20 seats", price: "₹1499/mo", highlight: true  },
            { name: "Business",seats: "Unlimited",price: "₹3999/mo", highlight: false },
          ].map((p) => (
            <div
              key={p.name}
              className={`flex-1 rounded-xl border p-3 text-left transition-all
                ${p.highlight ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50"}`}
            >
              <p className={`text-xs font-bold ${p.highlight ? "text-blue-700" : "text-gray-700"}`}>
                {p.name}
                {p.highlight && (
                  <span className="ml-1.5 bg-blue-600 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </p>
              <p className={`text-[11px] mt-0.5 ${p.highlight ? "text-blue-600" : "text-gray-400"}`}>
                {p.seats}
              </p>
              <p className={`text-xs font-semibold mt-1 ${p.highlight ? "text-blue-700" : "text-gray-600"}`}>
                {p.price}
              </p>
            </div>
          ))}
        </div>

        <button
          onClick={onUpgrade}
          className="w-full py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Zap size={14} />
          View all plans
        </button>
        <button
          onClick={onClose}
          className="mt-2.5 w-full py-2.5 border border-gray-200 text-gray-400 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}


// ─── invite modal ─────────────────────────────────────────────────────────────

function InviteModal({ workspaceSlug, onClose, onSuccess }) {
  const [email,   setEmail]   = useState("");
  const [role,    setRole]    = useState("PROFESSIONAL");
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState("");

  const handleSend = async () => {
    const trimmedEmail = email.trim();
    setError("");
    if (!workspaceSlug) { setError("Workspace not loaded yet."); return; }
    if (!trimmedEmail)  { setError("Please enter an email address."); return; }

    try {
      setLoading(true);
      await invitationApi.sendProfessionalInvite(workspaceSlug, { email: trimmedEmail, role });
      setSent(true);
      onSuccess?.();
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data) ||
        "Failed to send invitation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xl w-full max-w-md p-7">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-gray-900">Invite team member</h2>
            <p className="text-xs text-gray-400 mt-0.5">They'll receive an email with a join link</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors flex-shrink-0"
          >
            <X size={15} />
          </button>
        </div>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 border border-green-100 flex items-center justify-center">
              <CheckCircle2 size={24} className="text-green-500" />
            </div>
            <p className="text-base font-bold text-gray-900">Invitation sent!</p>
            <p className="text-sm text-gray-400">
              An invite was sent to <span className="font-medium text-gray-700">{email}</span>
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded-lg">
                <X size={13} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Email address
              </label>
              <input
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-300 outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-blue-500 bg-white cursor-pointer transition-colors"
              >
                <option value="PROFESSIONAL">Professional</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={loading || !email.trim() || !workspaceSlug}
                className="flex-[2] py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send invitation
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


// ─── role change dropdown ─────────────────────────────────────────────────────

function RoleDropdown({ currentRole, userId, slug, onChanged }) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);

  const roles = ["PROFESSIONAL", "ADMIN"];

  const changeRole = async (newRole) => {
    if (newRole === currentRole) { setOpen(false); return; }
    try {
      setLoading(true);
      await axiosInstance.post(`/workspaces/${slug}/change-role/`, { user_id: userId, role: newRole });
      onChanged?.();
    } catch (err) {
      console.error("Role change failed:", err);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={loading}
        className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
      >
        {loading
          ? <span className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          : <ChevronDown size={12} />
        }
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-36">
          {roles.map((r) => (
            <button
              key={r}
              onClick={() => changeRole(r)}
              className={`w-full text-left px-3.5 py-2 text-xs font-medium transition-colors
                ${r === currentRole ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:bg-gray-50"}`}
            >
              {r.charAt(0) + r.slice(1).toLowerCase()}
              {r === currentRole && (
                <span className="ml-1.5 text-[10px] text-blue-400">current</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


// ─── main component ───────────────────────────────────────────────────────────

const TeamMembers = ({ slug }) => {
  const navigate = useNavigate();

  const [members,          setMembers]          = useState([]);
  const [pendingInvites,   setPendingInvites]   = useState([]);
  const [workspaceType,    setWorkspaceType]    = useState(null);
  const [workspaceLoading, setWorkspaceLoading] = useState(true); // ← separate flag for race-condition fix
  const [planName,         setPlanName]         = useState("Free");
  const [memberLimit,      setMemberLimit]      = useState(3);
  const [loading,          setLoading]          = useState(true);
  const [activeTab,        setActiveTab]        = useState("members");
  const [showInvite,       setShowInvite]       = useState(false);
  const [showUpgrade,      setShowUpgrade]      = useState(false);
  const [searchTerm,       setSearchTerm]       = useState("");

  // ── isSolo is ONLY derived once workspace type has fully resolved ──
  // Before that, workspaceLoading=true keeps all invite UI hidden.
  const workspaceResolved = !workspaceLoading;
  const isSolo            = workspaceResolved && workspaceType === "SOLO";

  const membersUsed  = members.length;
  const limitReached = memberLimit !== null && membersUsed >= memberLimit;
  const membersLeft  = memberLimit !== null ? Math.max(memberLimit - membersUsed, 0) : null;
  const usagePct     = memberLimit > 0 ? Math.min((membersUsed / memberLimit) * 100, 100) : 0;
  const nearLimit    = !limitReached && memberLimit > 0 && usagePct >= 80;

  // ── fetchers ──
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/workspaces/${slug}/members/`);
      setMembers(res.data.members || []);
      setPlanName(res.data.plan || "Free");
      setMemberLimit(res.data.member_limit ?? 3);
    } catch (err) {
      console.error("Members fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingInvites = async () => {
    try {
      const res = await axiosInstance.get(`/workspaces/${slug}/invitations/`);
      setPendingInvites(res.data.invitations || res.data || []);
    } catch (err) {
      console.error("Pending invites fetch error:", err);
    }
  };

  const fetchWorkspace = async () => {
    try {
      setWorkspaceLoading(true);

      // ── fast path: read from localStorage meta written by CreateWorkspace ──
      // This avoids a round-trip AND eliminates the loading window entirely
      // on the first visit right after workspace creation.
      try {
        const meta = JSON.parse(localStorage.getItem("workspace_meta") || "{}");
        if (meta[slug]?.workspace_type) {
          setWorkspaceType(meta[slug].workspace_type);
          setWorkspaceLoading(false);
          return;
        }
      } catch { /* non-fatal */ }

      // ── fallback: fetch from API ──
      const res = await axiosInstance.get(`/workspaces/${slug}/`);
      setWorkspaceType(res.data.workspace_type);
    } catch (err) {
      console.error("Workspace fetch error:", err);
      setWorkspaceType(null); // unknown on error — do NOT default to SOLO
    } finally {
      setWorkspaceLoading(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetchMembers();
    fetchWorkspace();
    fetchPendingInvites();
  }, [slug]);

  // ── if workspace resolves to SOLO while on "pending" tab, snap back to "members" ──
  useEffect(() => {
    if (workspaceResolved && isSolo && activeTab === "pending") {
      setActiveTab("members");
    }
  }, [workspaceResolved, isSolo, activeTab]);

  // ── actions ──
  const removeMember = async (userId) => {
    if (!window.confirm("Remove this member from the workspace?")) return;
    try {
      await axiosInstance.post(`/workspaces/${slug}/remove-member/`, { user_id: userId });
      fetchMembers();
    } catch (err) {
      console.error("Remove failed:", err);
    }
  };

  const revokeInvite = async (inviteId) => {
    if (!window.confirm("Revoke this invitation?")) return;
    try {
      await axiosInstance.delete(`/workspaces/${slug}/invitations/${inviteId}/`);
      fetchPendingInvites();
    } catch (err) {
      console.error("Revoke failed:", err);
    }
  };

  const resendInvite = async (inviteId) => {
    try {
      await axiosInstance.post(`/workspaces/${slug}/invitations/${inviteId}/resend/`);
    } catch (err) {
      console.error("Resend failed:", err);
    }
  };

  // ── triple guard: workspace must be resolved, not solo, and not loading ──
  const handleInviteClick = () => {
    if (!workspaceResolved || isSolo) return;
    if (limitReached) {
      setShowUpgrade(true);
    } else {
      setShowInvite(true);
    }
  };

  const filteredMembers = members.filter((m) =>
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!slug) {
    return <div className="p-10 text-center text-red-500 text-sm">Workspace context missing.</div>;
  }

  // ── tabs: "Pending invites" only appears for resolved TEAM workspaces ──
  const tabs = [
    { key: "members", label: "Members", count: members.length },
    ...(workspaceResolved && !isSolo
      ? [{ key: "pending", label: "Pending invites", count: pendingInvites.length }]
      : []
    ),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-5">

        {/* ── solo workspace notice ── */}
        {workspaceResolved && isSolo && (
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-700">Solo workspace</p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                This is a solo workspace — only you can be a member. Upgrade to a Team plan to invite others.
              </p>
            </div>
            <button
              onClick={() => navigate("/billing")}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Zap size={12} />
              Upgrade
            </button>
          </div>
        )}

        {/* ── near-limit banner (TEAM only) ── */}
        {workspaceResolved && !isSolo && nearLimit && (
          <div className="flex items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <div className="flex items-center gap-2.5">
              <Crown size={15} className="text-amber-500 flex-shrink-0" />
              <p className="text-xs text-amber-800 font-medium">
                You're using <span className="font-bold">{membersUsed}/{memberLimit}</span> seats on the{" "}
                <span className="font-bold">{planName}</span> plan. Only{" "}
                <span className="font-bold">{membersLeft}</span> seat{membersLeft === 1 ? "" : "s"} remaining.
              </p>
            </div>
            <button
              onClick={() => navigate("/billing")}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Zap size={12} />
              Upgrade
            </button>
          </div>
        )}

        {/* ── header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isSolo ? "Workspace Members" : "Team Members"}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {isSolo ? "Solo workspace — just you" : "Manage your workspace team"}
            </p>

            <div className="flex flex-wrap gap-2.5 mt-4">
              {[
                { label: "Members", value: membersUsed },
                { label: "Plan",    value: planName },
                // seats + pending only meaningful for team
                ...(!isSolo ? [
                  { label: "Seats left", value: membersLeft ?? "∞" },
                  { label: "Pending",    value: pendingInvites.length },
                ] : []),
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-2 shadow-sm min-w-[80px]"
                >
                  <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                  <p className="text-lg font-bold text-gray-900 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* invite button: hidden while loading AND hidden for solo */}
          {workspaceResolved && !isSolo && (
            <button
              onClick={handleInviteClick}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors flex-shrink-0 w-fit
                ${limitReached ? "bg-amber-500 hover:bg-amber-600" : "bg-gray-900 hover:bg-black"}`}
            >
              {limitReached ? <Crown size={15} /> : <UserPlus size={15} />}
              {limitReached ? "Upgrade to invite" : "Invite Member"}
            </button>
          )}
        </div>

        {/* ── plan card (TEAM only) ── */}
        {workspaceResolved && !isSolo && (
          <div className={`rounded-xl border p-5 ${limitReached ? "bg-red-50 border-red-200" : "bg-white border-gray-200"}`}>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Crown size={15} className={limitReached ? "text-red-500" : "text-blue-600"} />
                  <span className="text-sm font-bold text-gray-900">{planName} Plan</span>
                  {limitReached && (
                    <span className="text-[10px] bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                      Limit reached
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {membersUsed} / {memberLimit} members used · {membersLeft} seats remaining
                </p>
                <div className="mt-3 h-1.5 w-full max-w-xs bg-gray-100 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${usagePct}%` }}
                    className={`h-full rounded-full transition-all duration-500
                      ${limitReached ? "bg-red-500" : nearLimit ? "bg-amber-500" : "bg-blue-600"}`}
                  />
                </div>
              </div>
              <button
                onClick={() => navigate("/billing")}
                className={`flex items-center gap-2 px-4 py-2 text-white text-xs font-semibold rounded-xl transition-colors flex-shrink-0 w-fit
                  ${limitReached ? "bg-red-500 hover:bg-red-600" : "bg-blue-600 hover:bg-blue-700"}`}
              >
                <Zap size={13} />
                {limitReached ? "Upgrade now" : "Upgrade Plan"}
              </button>
            </div>
          </div>
        )}

        {/* ── tabs + search ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors
                  ${activeTab === t.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {t.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
                  ${activeTab === t.key ? "bg-gray-100 text-gray-600" : "bg-gray-200 text-gray-500"}`}>
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 w-full sm:w-56 shadow-sm">
            <Search size={13} className="text-gray-300 flex-shrink-0" />
            <input
              type="text"
              placeholder={activeTab === "members" ? "Search members…" : "Search invites…"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-sm text-gray-900 placeholder-gray-300 bg-transparent w-full"
            />
          </div>
        </div>

        {/* ── members table ── */}
        {activeTab === "members" && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="hidden sm:grid grid-cols-[1fr_130px_110px_110px_90px] bg-gray-50 border-b border-gray-100 px-5 py-3">
              {["Member", "Role", "Joined", "Last seen", ""].map((h) => (
                <div key={h} className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide last:text-right">
                  {h}
                </div>
              ))}
            </div>

            {loading ? (
              <div className="py-16 text-center text-sm text-gray-300">Loading members…</div>
            ) : filteredMembers.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-2">
                <Users size={32} className="text-gray-200" />
                <p className="text-sm text-gray-400">No members found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {filteredMembers.map((m) => (
                  <div
                    key={m.id}
                    className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_130px_110px_110px_90px] items-center px-5 py-3.5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`relative w-8 h-8 rounded-full ${avatarColor(m.email)} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {m.email?.[0]?.toUpperCase()}
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border-2 border-white rounded-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{m.email}</p>
                        <p className="text-xs text-gray-400 sm:hidden mt-0.5">
                          {m.role} · {m.joined_at ? new Date(m.joined_at).toLocaleDateString() : "—"}
                        </p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-1.5">
                      <RoleBadge role={m.role} />
                      {/* role dropdown: TEAM only, non-owners only */}
                      {!isSolo && m.role !== "OWNER" && (
                        <RoleDropdown
                          currentRole={m.role}
                          userId={m.user_id}
                          slug={slug}
                          onChanged={fetchMembers}
                        />
                      )}
                    </div>

                    <div className="hidden sm:block text-xs text-gray-400">
                      {m.joined_at ? new Date(m.joined_at).toLocaleDateString() : "—"}
                    </div>

                    <div className="hidden sm:block text-xs text-gray-400">
                      {timeAgo(m.last_seen)}
                    </div>

                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => navigate(`/admin/professionals/${m.user_id}`)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                        title="View profile"
                      >
                        <Eye size={15} />
                      </button>
                      {/* remove: TEAM only, non-owners only */}
                      {!isSolo && m.role !== "OWNER" && (
                        <button
                          onClick={() => removeMember(m.user_id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Remove member"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── pending invites (only reachable for TEAM — tab not rendered for SOLO) ── */}
        {activeTab === "pending" && workspaceResolved && !isSolo && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="hidden sm:grid grid-cols-[1fr_120px_130px_100px] bg-gray-50 border-b border-gray-100 px-5 py-3">
              {["Email", "Role", "Sent", ""].map((h) => (
                <div key={h} className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide last:text-right">
                  {h}
                </div>
              ))}
            </div>

            {pendingInvites.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-2">
                <Mail size={32} className="text-gray-200" />
                <p className="text-sm text-gray-400">No pending invitations</p>
                <button
                  onClick={handleInviteClick}
                  className="mt-1 text-xs text-blue-600 font-semibold hover:underline"
                >
                  Send your first invite
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pendingInvites
                  .filter((inv) => (inv.email || "").toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((inv) => (
                    <div
                      key={inv.id}
                      className="grid grid-cols-[1fr_auto] sm:grid-cols-[1fr_120px_130px_100px] items-center px-5 py-3.5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center flex-shrink-0">
                          <Clock size={13} className="text-gray-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-700 truncate">{inv.email}</p>
                          <p className="text-xs text-gray-400 sm:hidden mt-0.5">
                            {inv.role} · {timeAgo(inv.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="hidden sm:block">
                        <RoleBadge role={inv.role} />
                      </div>

                      <div className="hidden sm:block text-xs text-gray-400">
                        {timeAgo(inv.created_at)}
                      </div>

                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => resendInvite(inv.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                          title="Resend invite"
                        >
                          <RefreshCw size={14} />
                        </button>
                        <button
                          onClick={() => revokeInvite(inv.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
                          title="Revoke invite"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* ── modals — triple guard on all three conditions ── */}
      {showInvite && workspaceResolved && !isSolo && !limitReached && (
        <InviteModal
          workspaceSlug={slug}
          onClose={() => setShowInvite(false)}
          onSuccess={() => {
            setShowInvite(false);
            fetchMembers();
            fetchPendingInvites();
          }}
        />
      )}

      {showUpgrade && workspaceResolved && !isSolo && (
        <UpgradeModal
          planName={planName}
          membersUsed={membersUsed}
          memberLimit={memberLimit}
          onClose={() => setShowUpgrade(false)}
          onUpgrade={() => { setShowUpgrade(false); navigate("/billing"); }}
        />
      )}
    </div>
  );
};

export default TeamMembers;