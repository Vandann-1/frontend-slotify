import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

/* ── keyframes ── */
const STYLES = `
  @keyframes slo-spin { to { transform: rotate(360deg); } }
  @keyframes slo-prog { from { width: 0% } to { width: 100% } }
  @keyframes slo-in   { from { opacity:0; transform:translateY(6px) } to { opacity:1; transform:none } }
  .slo-row { display:flex; justify-content:space-between; align-items:center;
    padding:11px 0; border-bottom:1px solid #F3F4F6; }
  .slo-row:last-child { border-bottom:none; }
`;

/* ────────────────────────────────────────────────
   ROLE → ROUTE mapper
   Matches the exact routes defined in App.jsx:
     admin       → /admin/workspace/:slug/dashboard
     professional→ /professional/workspace/:slug
   Falls back to /workspaces if role is unknown.
──────────────────────────────────────────────── */
const getRedirectPath = (role, slug) => {
  if (!slug) return "/workspaces";

  const r = (role || "").toLowerCase().trim();

  if (r === "admin" || r === "owner") {
    return `/admin/workspace/${slug}/dashboard`;
  }

  if (r === "professional" || r === "member" || r === "staff") {
    return `/professional/workspace/${slug}`;
  }

  // Unknown role — send to workspace list, let them pick
  return "/workspaces";
};

/* ── sub-components ── */

const Spin = ({ size = 28, color = "#2563EB" }) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      border: `2.5px solid #E5E7EB`,
      borderTopColor: color,
      borderRadius: "50%",
      animation: "slo-spin 0.75s linear infinite",
      flexShrink: 0,
    }}
  />
);

const WorkspaceAvatar = ({ name = "" }) => {
  const initials = (name || "WS")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 10,
        background: "#EFF6FF",
        border: "1px solid #DBEAFE",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 14,
        fontWeight: 700,
        color: "#1D4ED8",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
};

const RoleBadge = ({ role }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "2px 10px",
      borderRadius: 99,
      fontSize: 11.5,
      fontWeight: 600,
      background: "#EFF6FF",
      color: "#1D4ED8",
      border: "1px solid #DBEAFE",
    }}
  >
    {role}
  </span>
);

/* ── page ── */

const InviteValidatePage = () => {
  const { token } = useParams();
  const navigate  = useNavigate();

  const [loading,   setLoading]   = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [accepted,  setAccepted]  = useState(false);
  const [data,      setData]      = useState(null);   // validate response
  const [error,     setError]     = useState("");

  /* ── Step 1: validate token on mount ── */
  useEffect(() => {
    const run = async () => {
      try {
        /* No token in URL — check localStorage fallback */
        if (!token) {
          const pending = localStorage.getItem("pending_invite_token");
          if (pending) {
            navigate(`/invite-accept/${pending}`, { replace: true });
            return;
          }
          setError("Invalid invitation link.");
          setLoading(false);
          return;
        }

        const res = await axiosInstance.post("/invitations/validate/", { token });
        setData(res.data);

        const accessToken = localStorage.getItem("access");
        const user        = JSON.parse(localStorage.getItem("user") || "{}");

        /* Not logged in — save token and send to login */
        if (!accessToken) {
          localStorage.setItem("pending_invite_token", token);
          navigate(`/login?invite=${token}`, { replace: true });
          return;
        }

        /* Logged in but wrong email — send to register */
        if (user.email && res.data.email !== user.email) {
          localStorage.setItem("pending_invite_token", token);
          navigate(`/register?invite=${token}`, { replace: true });
          return;
        }

        /* All good — show the accept UI */
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
          "Invitation is invalid or expired."
        );
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [token, navigate]);

  /* ── Step 2: accept invite ── */
  const handleAccept = async () => {
    if (!data) return;

    try {
      setAccepting(true);

      const res = await axiosInstance.post("/invitations/accept/", { token });

      /* Clear pending invite from storage */
      localStorage.removeItem("pending_invite_token");

      /*
        Backend should return:
        {
          workspace_slug: "acme-corp",
          role: "professional"          ← used for routing
        }

        We fall back to the role/slug from the validate response
        if accept doesn't return them.
      */
      const slug = res?.data?.workspace_slug
                || res?.data?.slug
                || data?.workspace_slug
                || data?.slug;

      const role = res?.data?.role
                || data?.role
                || "";

      setAccepted(true);

      const path = getRedirectPath(role, slug);

      /* Short delay so the success state is visible */
      setTimeout(() => navigate(path, { replace: true }), 2200);

    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        "Failed to accept invitation. Please try again."
      );
    } finally {
      setAccepting(false);
    }
  };

  /* ── shared tokens ── */
  const labelStyle = { fontSize: 12.5, color: "#9CA3AF", fontWeight: 500 };
  const valueStyle = {
    fontSize: 13,
    color: "#111",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: 6,
  };

  return (
    <>
      <style>{STYLES}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px",
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            animation: "slo-in 0.4s ease both",
          }}
        >
          {/* ── Logo ── */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              marginBottom: 32,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                background: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="6" width="16" height="12" rx="2.5" stroke="#fff" strokeWidth="1.8" />
                <path d="M7 6V5a4 4 0 018 0v1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="11" cy="12" r="1.5" fill="#fff" />
              </svg>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A", letterSpacing: -0.4 }}>
              Slotify
            </span>
            <span style={{ fontSize: 12.5, color: "#9CA3AF" }}>Workspace invitation</span>
          </div>

          {/* ── Card ── */}
          <div
            style={{
              background: "#fff",
              border: "1.5px solid #E5E7EB",
              borderRadius: 16,
              padding: "28px 24px",
            }}
          >
            {/* LOADING */}
            {loading && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 0",
                }}
              >
                <Spin />
                <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>
                  Validating your invitation…
                </span>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 0",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle cx="11" cy="11" r="8.5" stroke="#EF4444" strokeWidth="1.6" />
                    <path d="M11 7.5v5" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="11" cy="15" r="0.85" fill="#EF4444" />
                  </svg>
                </div>
                <span style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>
                  Link expired
                </span>
                <span style={{ fontSize: 12.5, color: "#9CA3AF", lineHeight: 1.6 }}>
                  {error}
                </span>
                <button
                  onClick={() => navigate("/login")}
                  style={{
                    marginTop: 4,
                    background: "none",
                    border: "none",
                    color: "#2563EB",
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    padding: 0,
                  }}
                >
                  Back to login
                </button>
              </div>
            )}

            {/* SUCCESS */}
            {!loading && !error && accepted && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  padding: "8px 0 4px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: "50%",
                    background: "#F0FDF4",
                    border: "1px solid #BBF7D0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                    <path
                      d="M6 13.5l5 5 9.5-10"
                      stroke="#22C55E"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span style={{ fontSize: 17, fontWeight: 700, color: "#0A0A0A" }}>
                  You're in!
                </span>
                <span style={{ fontSize: 12.5, color: "#9CA3AF", lineHeight: 1.6 }}>
                  Welcome to {data?.tenant}. Redirecting to your dashboard…
                </span>
                <div
                  style={{
                    width: "100%",
                    height: 2,
                    background: "#F3F4F6",
                    borderRadius: 99,
                    overflow: "hidden",
                    marginTop: 6,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      background: "#2563EB",
                      borderRadius: 99,
                      animation: "slo-prog 2.2s linear forwards",
                    }}
                  />
                </div>
              </div>
            )}

            {/* INVITE DETAIL */}
            {!loading && !error && data && !accepted && (
              <>
                {/* Workspace header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 13,
                    marginBottom: 18,
                  }}
                >
                  <WorkspaceAvatar name={data.tenant} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A" }}>
                      {data.tenant}
                    </div>
                    <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>
                      Invited to join as {data.role}
                    </div>
                  </div>
                </div>

                <div style={{ height: 1, background: "#F3F4F6" }} />

                {/* Fields */}
                <div>
                  {[
                    { label: "Workspace", value: <span style={valueStyle}>{data.tenant}</span> },
                    { label: "Email",     value: <span style={valueStyle}>{data.email}</span> },
                    { label: "Role",      value: <RoleBadge role={data.role} /> },
                  ].map(({ label, value }) => (
                    <div className="slo-row" key={label}>
                      <span style={labelStyle}>{label}</span>
                      {value}
                    </div>
                  ))}
                </div>

                {/* Info notice */}
                <div
                  style={{
                    background: "#F0F9FF",
                    border: "1px solid #BAE6FD",
                    borderRadius: 9,
                    padding: "11px 13px",
                    display: "flex",
                    gap: 9,
                    alignItems: "flex-start",
                    margin: "18px 0",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    style={{ flexShrink: 0, marginTop: 1 }}
                  >
                    <circle cx="7" cy="7" r="6.3" stroke="#0EA5E9" strokeWidth="1.2" />
                    <path d="M7 6.5v3.5" stroke="#0EA5E9" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="7" cy="4.5" r="0.7" fill="#0EA5E9" />
                  </svg>
                  <p style={{ fontSize: 12, color: "#0369A1", lineHeight: 1.55, margin: 0 }}>
                    Accepting gives you workspace access. You can leave anytime from your account settings.
                  </p>
                </div>

                {/* Accept CTA */}
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  style={{
                    width: "100%",
                    padding: "13px 0",
                    border: "none",
                    borderRadius: 10,
                    background: accepting ? "#D1D5DB" : "#2563EB",
                    color: accepting ? "#9CA3AF" : "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: "inherit",
                    cursor: accepting ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    transition: "background 0.15s",
                  }}
                >
                  {accepting ? (
                    <>
                      <Spin size={13} color="#9CA3AF" />
                      Joining workspace…
                    </>
                  ) : (
                    <>
                      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                        <path
                          d="M2.5 7.5l3.5 3.5 6.5-6.5"
                          stroke="#fff"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Accept invitation
                    </>
                  )}
                </button>

                {/* Decline */}
                <button
                  onClick={() => navigate("/")}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    background: "#fff",
                    border: "1.5px solid #E5E7EB",
                    borderRadius: 10,
                    color: "#9CA3AF",
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: "inherit",
                    cursor: "pointer",
                    padding: "11px 0",
                    transition: "border-color 0.15s, color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#D1D5DB";
                    e.currentTarget.style.color = "#6B7280";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#E5E7EB";
                    e.currentTarget.style.color = "#9CA3AF";
                  }}
                >
                  Decline
                </button>
              </>
            )}
          </div>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: 11.5, color: "#D1D5DB", marginTop: 20 }}>
            Secure access · Slotify
          </p>
        </div>
      </div>
    </>
  );
};

export default InviteValidatePage;