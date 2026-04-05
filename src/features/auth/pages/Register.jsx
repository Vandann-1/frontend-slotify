import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../../api/authApi";
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ full_name:"", username:"", email:"", password:"" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      await registerUser(form);
      setSuccess("Account created! Redirecting…");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      if (err.response?.data)  setError(Object.values(err.response.data).flat().join(" "));
      else if (err.request)    setError("Server not reachable.");
      else                     setError("Registration failed.");
    } finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700;800&family=Geist:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --blue:       #2563EB;
          --blue-dark:  #1D4ED8;
          --blue-light: #EFF6FF;
          --blue-mid:   #BFDBFE;
          --slate-900:  #1E3A5F;
          --slate-600:  #475569;
          --slate-400:  #94A3B8;
          --slate-200:  #E2E8F0;
          --slate-100:  #F1F5F9;
          --white:      #FFFFFF;
          --body-font:  'Geist', 'DM Sans', sans-serif;
          --head-font:  'Bricolage Grotesque', sans-serif;
        }

        .page {
          min-height: 100vh;
          display: flex;
          font-family: var(--body-font);
          background: var(--white);
        }

        /* ─────────────── LEFT PANEL ─────────────── */
        .panel-left {
          width: 48%;
          background: var(--blue);
          position: relative;
          display: flex;
          flex-direction: column;
          padding: 48px 52px;
          overflow: hidden;
          gap: 0;
        }

        /* Animated radial grid */
        .panel-left::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.06) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%);
          pointer-events: none;
        }

        /* Dot grid */
        .panel-left::after {
          content: '';
          position: absolute; inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px);
          background-size: 30px 30px;
          pointer-events: none;
        }

        .left-z { position: relative; z-index: 2; }

        /* Brand */
        .logo-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: auto;
          padding-bottom: 64px;
        }
        .logo-icon {
          width: 38px; height: 38px;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 11px;
          display: flex; align-items: center; justify-content: center;
        }
        .logo-icon svg { display: block; }
        .logo-text {
          font-family: var(--head-font);
          font-size: 20px; font-weight: 800;
          color: #fff; letter-spacing: -0.3px;
        }

        /* Big headline */
        .left-headline {
          font-family: var(--head-font);
          font-size: 44px;
          font-weight: 800;
          color: #fff;
          line-height: 1.05;
          letter-spacing: -1.5px;
          margin-bottom: 18px;
        }
        .left-headline .muted { color: rgba(255,255,255,0.5); }

        .left-desc {
          font-size: 14.5px;
          color: rgba(255,255,255,0.7);
          line-height: 1.75;
          max-width: 300px;
          margin-bottom: 48px;
        }

        /* Floating UI card mockup */
        .card-float {
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 20px;
          backdrop-filter: blur(8px);
          margin-bottom: 20px;
          animation: floatUp 3.5s ease-in-out infinite alternate;
        }
        @keyframes floatUp {
          from { transform: translateY(0px); }
          to   { transform: translateY(-8px); }
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }
        .card-title {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.9);
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .card-badge {
          background: rgba(255,255,255,0.2);
          border-radius: 100px;
          padding: 3px 10px;
          font-size: 10.5px;
          font-weight: 600;
          color: #fff;
        }

        .slot-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }
        .slot {
          height: 32px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          cursor: default;
        }
        .slot.free {
          background: rgba(255,255,255,0.15);
          color: rgba(255,255,255,0.85);
          border: 1px solid rgba(255,255,255,0.2);
        }
        .slot.taken {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.3);
          text-decoration: line-through;
        }
        .slot.selected {
          background: #fff;
          color: var(--blue);
          font-weight: 700;
        }

        /* Testimonial */
        .testi {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 14px;
          padding: 18px 20px;
          animation: floatUp 4.2s ease-in-out 0.8s infinite alternate;
        }
        .testi-text {
          font-size: 12.5px;
          color: rgba(255,255,255,0.78);
          line-height: 1.65;
          font-style: italic;
          margin-bottom: 12px;
        }
        .testi-author {
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .testi-av {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          font-size: 10.5px; font-weight: 700; color: #fff;
          flex-shrink: 0;
        }
        .testi-name  { font-size: 12px; font-weight: 700; color: #fff; }
        .testi-role  { font-size: 10.5px; color: rgba(255,255,255,0.55); }

        /* ─────────────── RIGHT PANEL ─────────────── */
        .panel-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 56px 48px;
          background: #FAFCFF;
          overflow-y: auto;
        }

        .form-wrap { width: 100%; max-width: 390px; }

        /* Progress */
        .progress {
          display: flex;
          align-items: center;
          gap: 5px;
          margin-bottom: 36px;
        }
        .prog-bar {
          height: 3px;
          border-radius: 3px;
          transition: width .3s;
        }
        .prog-bar.active { background: var(--blue); width: 32px; }
        .prog-bar.done   { background: var(--blue-mid); width: 14px; }
        .prog-bar.todo   { background: var(--slate-200); width: 14px; }
        .prog-label {
          font-size: 11px;
          color: var(--slate-400);
          font-weight: 600;
          margin-left: 6px;
          letter-spacing: 0.4px;
          text-transform: uppercase;
        }

        /* Header */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--blue-light);
          border: 1px solid var(--blue-mid);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 11.5px;
          font-weight: 600;
          color: var(--blue);
          margin-bottom: 18px;
        }
        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--blue);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.5; transform:scale(0.8); }
        }

        .form-title {
          font-family: var(--head-font);
          font-size: 28px;
          font-weight: 800;
          color: var(--slate-900);
          letter-spacing: -0.8px;
          line-height: 1.15;
          margin-bottom: 6px;
        }
        .form-sub {
          font-size: 14px;
          color: var(--slate-400);
          margin-bottom: 32px;
          font-weight: 400;
          line-height: 1.6;
        }

        /* Alerts */
        .alert {
          display: flex; align-items: flex-start; gap: 8px;
          padding: 12px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 500;
          margin-bottom: 18px; line-height: 1.5;
        }
        .alert-err { background: #FFF1F2; border: 1px solid #FECDD3; color: #BE123C; }
        .alert-ok  { background: #F0FDF4; border: 1px solid #BBF7D0; color: #15803D; }

        /* Grid */
        .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

        /* Fields */
        .field { margin-bottom: 16px; }
        .field label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          color: var(--slate-600);
          margin-bottom: 6px;
          letter-spacing: 0.1px;
        }
        .inp-wrap { position: relative; }

        .field input {
          width: 100%;
          height: 46px;
          padding: 0 14px;
          font-family: var(--body-font);
          font-size: 14px;
          font-weight: 400;
          color: var(--slate-600);
          background: var(--white);
          border: 1.5px solid var(--slate-200);
          border-radius: 11px;
          outline: none;
          transition: border-color .18s, box-shadow .18s;
          -webkit-appearance: none;
        }
        .field input::placeholder { color: #C0CCDA; font-weight: 300; }
        .field input:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 4px rgba(37,99,235,0.09);
        }
        .field input.eye-pad { padding-right: 44px; }

        .eye-btn {
          position: absolute; right: 12px; top: 14px;
          background: none; border: none; cursor: pointer;
          color: var(--slate-400); display: flex;
          transition: color .15s;
          padding: 0;
        }
        .eye-btn:hover { color: var(--blue); }

        /* Submit */
        .btn-submit {
          width: 100%; height: 48px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: var(--blue);
          color: #fff;
          font-family: var(--body-font);
          font-size: 15px; font-weight: 600;
          border: none; border-radius: 12px; cursor: pointer;
          box-shadow: 0 4px 18px rgba(37,99,235,0.28);
          transition: background .18s, transform .15s, box-shadow .18s;
          margin-top: 6px;
          letter-spacing: 0.1px;
        }
        .btn-submit:hover:not(:disabled) {
          background: var(--blue-dark);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(37,99,235,0.35);
        }
        .btn-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }

        .spin {
          width: 17px; height: 17px;
          border: 2.5px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Perks row */
        .perks {
          display: flex; align-items: center; justify-content: center;
          gap: 18px;
          margin-top: 18px;
        }
        .perk {
          display: flex; align-items: center; gap: 5px;
          font-size: 11.5px; color: var(--slate-400); font-weight: 500;
        }
        .perk-check {
          width: 15px; height: 15px;
          background: var(--blue-light);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 20px 0 0;
        }
        .div-line { flex: 1; height: 1px; background: var(--slate-200); }
        .div-text  { font-size: 12px; color: var(--slate-400); font-weight: 500; }

        .form-foot {
          text-align: center; font-size: 13px;
          color: var(--slate-400); margin-top: 20px;
        }
        .form-foot a {
          color: var(--blue); font-weight: 600;
          text-decoration: none; margin-left: 3px;
        }
        .form-foot a:hover { text-decoration: underline; }

        /* ──── MOBILE ──── */
        @media (max-width: 900px) {
          .panel-left { width: 44%; padding: 40px 36px; }
          .left-headline { font-size: 34px; }
        }

        @media (max-width: 700px) {
          .page { flex-direction: column; }

          .panel-left {
            width: 100%;
            padding: 28px 24px 36px;
            flex-direction: column;
          }

          .logo-row { padding-bottom: 32px; }

          .left-headline { font-size: 28px; letter-spacing: -0.8px; }
          .left-desc { font-size: 13.5px; margin-bottom: 24px; max-width: 100%; }

          .slot-grid { grid-template-columns: repeat(4, 1fr); }
          .card-float { margin-bottom: 14px; }
          .testi { display: none; }

          .panel-right {
            padding: 36px 24px 48px;
            align-items: flex-start;
            background: #fff;
          }
          .form-wrap { max-width: 100%; }

          .progress { margin-bottom: 28px; }
          .form-title { font-size: 24px; }
          .form-sub   { font-size: 13.5px; margin-bottom: 24px; }
          .perks { flex-direction: column; gap: 8px; align-items: flex-start; padding-left: 4px; }
        }

        @media (max-width: 420px) {
          .panel-left { padding: 22px 18px 28px; }
          .left-headline { font-size: 24px; }
          .row2 { grid-template-columns: 1fr; }
          .panel-right { padding: 28px 18px 40px; }
          .btn-submit { height: 46px; font-size: 14px; }
        }
      `}</style>

      <div className="page">

        {/* ══ LEFT ══ */}
        <div className="panel-left">

          <div className="logo-row left-z">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8"  y1="2" x2="8"  y2="6"/>
                <line x1="3"  y1="10" x2="21" y2="10"/>
                <polyline points="9 16 11 18 15 14"/>
              </svg>
            </div>
            <span className="logo-text">Slotify</span>
          </div>

          <div className="left-z" style={{ flex: 1 }}>
            <h1 className="left-headline">
              Schedule<br />
              <span className="muted">without the</span><br />
              chaos.
            </h1>
            <p className="left-desc">
              Real-time slot management for teams who move fast. No more back-and-forth, just clean bookings.
            </p>

            {/* Calendar mockup */}
            <div className="card-float">
              <div className="card-header">
                <span className="card-title">Today's slots</span>
                <span className="card-badge">12 open</span>
              </div>
              <div className="slot-grid">
                {["9:00","9:30","10:00","10:30","11:00","11:30","1:00","1:30","2:00","2:30","3:00","3:30"].map((t, i) => (
                  <div
                    key={t}
                    className={`slot ${i===3||i===6||i===9?"taken": i===1?"selected":"free"}`}
                  >
                    {t}
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            <div className="testi">
              <p className="testi-text">"Slotify replaced 3 tools. Our booking rate went up 60% in the first week."</p>
              <div className="testi-author">
                <div className="testi-av">RK</div>
                <div>
                  <p className="testi-name">Riya Kapoor</p>
                  <p className="testi-role">Head of Ops · Pulse Studio</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ RIGHT ══ */}
        <div className="panel-right">
          <div className="form-wrap">

            <div className="progress">
              <div className="prog-bar active" />
              <div className="prog-bar todo"   />
              <div className="prog-bar todo"   />
              <span className="prog-label">Step 1 of 3</span>
            </div>

            <div className="badge">
              <div className="badge-dot" />
              Free forever · No card needed
            </div>

            <h2 className="form-title">Create your account</h2>
            <p className="form-sub">Join thousands of teams already using Slotify.</p>

            {success && (
              <div className="alert alert-ok">
                <Check size={14} style={{ marginTop: 1, flexShrink: 0 }} />
                {success}
              </div>
            )}
            {error && (
              <div className="alert alert-err">⚠&nbsp; {error}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row2">
                <div className="field">
                  <label>Full name</label>
                  <input type="text" name="full_name" value={form.full_name} onChange={handleChange} placeholder="Jane Smith" required />
                </div>
                <div className="field">
                  <label>Username</label>
                  <input type="text" name="username" value={form.username} onChange={handleChange} placeholder="janesmith" required />
                </div>
              </div>

              <div className="field">
                <label>Work email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@company.com" required />
              </div>

              <div className="field">
                <label>Password</label>
                <div className="inp-wrap">
                  <input
                    className="eye-pad"
                    type={showPwd ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    required
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPwd(p => !p)}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading
                  ? <><div className="spin" /> Creating your account…</>
                  : <>Get started free <ArrowRight size={16} /></>}
              </button>
            </form>

            <div className="perks">
              {["No credit card","Cancel anytime","Free forever plan"].map(p => (
                <div className="perk" key={p}>
                  <div className="perk-check">
                    <Check size={9} color="var(--blue)" strokeWidth={3} />
                  </div>
                  {p}
                </div>
              ))}
            </div>

            <div className="divider">
              <div className="div-line" />
              <span className="div-text">Already have an account?</span>
              <div className="div-line" />
            </div>

            <p className="form-foot">
              <Link to="/login">Sign in to Slotify →</Link>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}