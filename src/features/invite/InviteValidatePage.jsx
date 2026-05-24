import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  UserPlus, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronRight,
  ArrowLeft,
  Mail,
  Zap
} from "lucide-react";
import axiosInstance from "../../api/axiosInstance";

const PROFESSION_CONFIG = {
  teacher: { label: "Teacher", color: "#10b981", bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" },
  doctor: { label: "Doctor", color: "#0ea5e9", bg: "bg-sky-50", text: "text-sky-600", border: "border-sky-100" },
  tech_mentor: { label: "Tech Mentor", color: "#4f46e5", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
  professional: { label: "Professional", color: "#6366f1", bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-100" },
};

const ROLE_ALIASES = {
  teacher: "teacher", doctor: "doctor", tech_mentor: "tech_mentor",
  professional: "professional", staff: "professional", owner: "professional"
};

const resolveProfession = (rawRole = "") => {
  const key = (rawRole || "").toLowerCase().replace(/\s+/g, "_");
  const resolved = ROLE_ALIASES[key] || "professional";
  return PROFESSION_CONFIG[resolved] || PROFESSION_CONFIG.professional;
};

const InviteValidatePage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const prof = data ? resolveProfession(data.role) : PROFESSION_CONFIG.professional;

  useEffect(() => {
    const validateToken = async () => {
      try {
        if (!token) {
          const pending = localStorage.getItem("pending_invite_token");
          if (pending) { navigate(`/invite-accept/${pending}`, { replace: true }); return; }
          setError("Broken Link: No invitation token found.");
          return;
        }
        const res = await axiosInstance.post("/invitations/validate/", { token });
        setData(res.data);

        const accessToken = localStorage.getItem("access");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

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
        setError(err?.response?.data?.detail || "This invitation has expired or been revoked.");
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, [token, navigate]);

  const handleAccept = async () => {
    if (!data) return;
    try {
      setAccepting(true);
      const res = await axiosInstance.post("/invitations/accept/", { token });
      localStorage.removeItem("pending_invite_token");
      const slug = res?.data?.workspace_slug || data?.workspace_slug || data?.slug;
      setAccepted(true);
      setTimeout(() => navigate(`/professional/workspace/${slug}`, { replace: true }), 2200);
    } catch (err) {
      setError("Authorization Error: Please check your connection and try again.");
    } finally {
      setAccepting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white font-['DM_Sans']">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-50 border-t-indigo-600 rounded-full animate-spin" />
        <Zap className="w-6 h-6 text-indigo-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <p className="mt-6 text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px]">Securing Access</p>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAFAFC] font-['DM_Sans'] relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-sky-50 rounded-full blur-3xl opacity-50" />

      <div className="w-full max-w-[460px] relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-[#3838d2] rounded-[1.5rem] shadow-2xl shadow-indigo-200 flex items-center justify-center text-white mb-4 transition-transform hover:scale-110">
            <Zap className="w-8 h-8 fill-white" />
          </div>
          <h1 className="text-3xl font-black text-[#0A0A0A] tracking-tight">Slotify</h1>
          <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mt-2">Professional Invite</p>
        </div>

        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 sm:p-10 transition-all">
          
          {error ? (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-rose-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-2">Expired Invite</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 px-4">{error}</p>
              <button onClick={() => navigate("/login")} className="w-full py-4 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:shadow-xl transition-all flex items-center justify-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Return to Login
              </button>
            </div>
          ) : accepted ? (
            <div className="text-center py-4 scale-in-center">
              <div className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 relative">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 relative z-10" />
                <div className="absolute inset-0 bg-emerald-200 rounded-[2rem] animate-ping opacity-20" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 mb-2">Welcome!</h2>
              <p className="text-gray-400 font-medium mb-10">You've successfully joined <span className="text-gray-900 font-bold">{data?.tenant}</span></p>
              
              <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full animate-grow" />
              </div>
              <p className="mt-4 text-[10px] font-black text-gray-300 uppercase tracking-widest">Entering Workspace...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Workspace Identity */}
              <div className={`p-6 rounded-[2rem] border ${prof.border} ${prof.bg} relative overflow-hidden group transition-all`}>
                <div className="flex items-center gap-5 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-gray-900">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{data?.tenant}</h3>
                    <div className={`mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border ${prof.border} ${prof.text} text-[10px] font-black uppercase tracking-wider`}>
                      <UserPlus className="w-3 h-3" /> {prof.label}
                    </div>
                  </div>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 transition-transform group-hover:scale-110">
                  <Building2 className="w-32 h-32" />
                </div>
              </div>

              {/* Email Detail */}
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3 text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Invited As</span>
                </div>
                <span className="text-sm font-bold text-gray-900">{data?.email}</span>
              </div>

              {/* Action Section */}
              <div className="space-y-4 pt-4">
                <button
                  onClick={handleAccept}
                  disabled={accepting}
                  className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3
                    ${accepting 
                      ? "bg-gray-100 text-gray-300" 
                      : "bg-[#3838d2] text-white hover:bg-[#2a2aab] shadow-2xl shadow-indigo-100 active:scale-[0.98]"}`}
                >
                  {accepting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Join Workspace <ChevronRight className="w-5 h-5" /></>
                  )}
                </button>
                
                <button 
                  onClick={() => navigate("/")}
                  className="w-full py-2 text-[10px] font-black text-gray-300 hover:text-rose-500 uppercase tracking-[0.2em] transition-colors"
                >
                  Decline Invitation
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-center mt-12 text-[10px] font-black text-gray-300 uppercase tracking-[0.4em]">
          Secure Infrastructure &bull; 2026
        </p>
      </div>

      <style>{`
        @keyframes grow { from { width: 0% } to { width: 100% } }
        .animate-grow { animation: grow 2.2s ease-in-out forwards; }
        .scale-in-center { animation: scale-in-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
        @keyframes scale-in-center {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default InviteValidatePage;