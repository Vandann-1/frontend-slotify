import { loginUser } from "../../../api/authApi";
import { getWorkspaces } from "../../../api/workspaceApi";
import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

/* ── keyframes ── */
const STYLES = `
  @keyframes slo-spin { to { transform: rotate(360deg); } }
  @keyframes slo-in { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
  .slo-input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #E5E7EB;
    border-radius: 9px;
    font-size: 14px;
    color: #111;
    font-family: 'Inter', -apple-system, sans-serif;
    outline: none;
    transition: border-color 0.15s;
    background: #fff;
  }
  .slo-input:focus { border-color: #2563EB; }
  .slo-input::placeholder { color: #D1D5DB; }
  .slo-google-btn:hover { border-color: #D1D5DB !important; background: #FAFAFA !important; }
  .slo-link:hover { color: #2563EB !important; }
  .slo-forgot:hover { color: #2563EB !important; }
`;

const Spin = () => (
  <span style={{ display:"inline-block", width:14, height:14, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"slo-spin 0.75s linear infinite", flexShrink:0 }} />
);

const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M16.5 8.68c0-.57-.05-1.12-.14-1.64H8.5v3.1h4.48a3.83 3.83 0 01-1.66 2.51v2.09h2.69C15.56 13.26 16.5 11.14 16.5 8.68z" fill="#4285F4" />
    <path d="M8.5 17c2.25 0 4.14-.75 5.51-2.02l-2.69-2.09c-.74.5-1.7.79-2.82.79-2.17 0-4.01-1.47-4.67-3.44H1.07v2.16A8.5 8.5 0 008.5 17z" fill="#34A853" />
    <path d="M3.83 10.24A5.1 5.1 0 013.56 8.5c0-.6.1-1.19.27-1.74V4.6H1.07A8.5 8.5 0 000 8.5c0 1.37.33 2.67.91 3.82l2.92-2.08z" fill="#FBBC05" />
    <path d="M8.5 3.38c1.22 0 2.32.42 3.18 1.24l2.39-2.39C12.63.84 10.74 0 8.5 0A8.5 8.5 0 001.07 4.6l2.76 2.16C4.49 4.85 6.33 3.38 8.5 3.38z" fill="#EA4335" />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form,    setForm]    = useState({ email:"", password:"" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  /* ── Save invite token from URL immediately ── */
  useEffect(() => {
    const inviteToken = searchParams.get("invite");
    if (inviteToken) localStorage.setItem("pending_invite_token", inviteToken);
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  /* ─────────────────────────────────────────────────────────────────
     ROLE-BASED REDIRECT — matched exactly to App.jsx routes:

     App.jsx routes:
       Admin   →  /admin/workspace/:slug/dashboard
       Member  →  /professional/workspace/:slug
       No ws   →  /create-dashboard
       Invite  →  /invite-accept/:token  (always first)

     How role is detected (in priority order):
       1. user.role === "admin" / "owner"
       2. user.is_admin === true
       3. user.user_type === "admin" / "owner"
       4. user owns a workspace (workspace.owner === user.id
                               OR workspace.owner_email === user.email)
       5. Fallback → treat as professional/member
  ───────────────────────────────────────────────────────────────── */
  const handleRedirect = async (user) => {

    // ── Step 1: pending invite always wins ──
    const pendingInvite = localStorage.getItem("pending_invite_token");
    if (pendingInvite) {
      navigate(`/invite-accept/${pendingInvite}`);
      return;
    }

    // ── Step 2: read role from user object ──
    // Covers all common Django REST patterns — adjust if your API differs
    const roleStr  = (user?.role || user?.user_type || "").toLowerCase();
    const isAdminFlag = user?.is_admin === true || user?.is_staff === true;
    const isAdminRole = roleStr === "admin" || roleStr === "owner";

    // ── Step 3: try fetching workspaces ──
    try {
      const workspaces = await getWorkspaces();
      const hasWorkspaces = Array.isArray(workspaces) && workspaces.length > 0;

      if (!hasWorkspaces) {
        // ── No workspaces returned ──
        // If flagged as admin/owner → let them create one
        // If member → they were invited so shouldn't create — go to /workspaces
        if (isAdminRole || isAdminFlag) {
          navigate("/create-dashboard");
        } else {
          // Member with no workspace yet (e.g. invite not accepted yet)
          navigate("/workspaces");
        }
        return;
      }

      const first = workspaces[0];
      const slug  = first?.slug;

      if (!slug) {
        navigate("/create-dashboard");
        return;
      }

      // ── Step 4: check workspace ownership as extra signal ──
      const isOwner =
        (user?.id   && first?.owner       === user.id)   ||
        (user?.email && first?.owner_email === user.email) ||
        (user?.email && first?.created_by_email === user.email);

      const isAdmin = isAdminRole || isAdminFlag || isOwner;

      if (isAdmin) {
        // ✅ Admin / owner  →  /admin/workspace/:slug/dashboard
        navigate(`/admin/workspace/${slug}/dashboard`);
      } else {
        // ✅ Professional / member  →  /professional/workspace/:slug
        navigate(`/professional/workspace/${slug}`);
      }

    } catch {
      // API failed — safe fallback
      navigate("/create-dashboard");
    }
  };

  /* ── Email / password login ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await loginUser(form);
      localStorage.setItem("access",  data.access);
      localStorage.setItem("user",    JSON.stringify(data.user));
      await handleRedirect(data.user);
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ── Google login ── */
  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/google/", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok || !data.access) {
        setError(data?.detail || "Google sign-in failed. Please try again.");
        return;
      }
      localStorage.setItem("access", data.access);
      localStorage.setItem("user",   JSON.stringify(data.user));
      await handleRedirect(data.user);
    } catch {
      setError("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const labelStyle = {
    display:"block", fontSize:12, fontWeight:600, color:"#6B7280",
    marginBottom:6, letterSpacing:"0.3px", textTransform:"uppercase",
  };

  return (
    <>
      <style>{STYLES}</style>

      <div style={{ minHeight:"100vh", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", padding:"32px 16px", fontFamily:"'Inter', -apple-system, sans-serif" }}>
        <div style={{ width:"100%", maxWidth:400, animation:"slo-in 0.4s ease both" }}>

          {/* ── Logo ── */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, marginBottom:36 }}>
            <div style={{ width:44, height:44, borderRadius:11, background:"#111", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="3" y="6" width="16" height="12" rx="2.5" stroke="#fff" strokeWidth="1.8" />
                <path d="M7 6V5a4 4 0 018 0v1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="11" cy="12" r="1.5" fill="#fff" />
              </svg>
            </div>
            <span style={{ fontSize:18, fontWeight:700, color:"#0A0A0A", letterSpacing:-0.4 }}>Slotify</span>
            <span style={{ fontSize:12.5, color:"#9CA3AF" }}>Sign in to your account</span>
          </div>

          {/* ── Error banner ── */}
          {error && (
            <div style={{ display:"flex", alignItems:"center", gap:8, background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:9, padding:"10px 14px", fontSize:12.5, color:"#DC2626", marginBottom:18 }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink:0 }}>
                <circle cx="7" cy="7" r="6.3" stroke="#DC2626" strokeWidth="1.2" />
                <path d="M7 4.5v3.5" stroke="#DC2626" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="7" cy="10" r="0.7" fill="#DC2626" />
              </svg>
              {error}
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} noValidate>

            <div style={{ marginBottom:16 }}>
              <label style={labelStyle}>Email</label>
              <input className="slo-input" type="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} required autoComplete="email" />
            </div>

            <div style={{ marginBottom:8 }}>
              <label style={labelStyle}>Password</label>
              <input className="slo-input" type="password" name="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} required autoComplete="current-password" />
            </div>

            <div style={{ textAlign:"right", marginBottom:20 }}>
              <Link to="/forgot-password" className="slo-forgot"
                style={{ fontSize:12, color:"#6B7280", textDecoration:"none", transition:"color 0.15s" }}>
                Forgot password?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              style={{ width:"100%", padding:"13px 0", border:"none", borderRadius:10, background:loading?"#D1D5DB":"#111", color:loading?"#9CA3AF":"#fff", fontSize:14, fontWeight:700, fontFamily:"inherit", cursor:loading?"not-allowed":"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"background 0.15s" }}>
              {loading ? <><Spin />Signing in…</> : "Sign in"}
            </button>

          </form>

          {/* ── Divider ── */}
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
            <div style={{ flex:1, height:1, background:"#F3F4F6" }} />
            <span style={{ fontSize:12, color:"#D1D5DB", whiteSpace:"nowrap" }}>or continue with</span>
            <div style={{ flex:1, height:1, background:"#F3F4F6" }} />
          </div>

          {/* ── Google ── */}
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => setError("Google sign-in failed. Please try again.")}
            render={(renderProps) => (
              <button onClick={renderProps.onClick} disabled={renderProps.disabled || loading}
                className="slo-google-btn"
                style={{ width:"100%", padding:"11px 0", border:"1.5px solid #E5E7EB", borderRadius:10, background:"#fff", fontSize:13.5, fontWeight:600, fontFamily:"inherit", color:"#374151", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10, transition:"border-color 0.15s, background 0.15s" }}>
                <GoogleIcon />
                Continue with Google
              </button>
            )}
          />

          {/* ── Register link ── */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:24, fontSize:13, color:"#9CA3AF" }}>
            <span>Don't have an account?</span>
            <Link to="/register" className="slo-link"
              style={{ color:"#111", fontWeight:600, textDecoration:"none", transition:"color 0.15s" }}>
              Create account
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}

