import { loginUser } from "../../../api/authApi";
import { getWorkspaces } from "../../../api/workspaceApi";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  // ================= STATE =================
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ================= HANDLE LOGIN =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const data = await loginUser(form);
      localStorage.setItem("access", data.access);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("user_email", data.user?.email);

      if (data.tenant) {
        localStorage.setItem("tenant", JSON.stringify(data.tenant));
      } else {
        localStorage.removeItem("tenant");
      }

      const pendingInvite = localStorage.getItem("pending_invite_token");
      if (pendingInvite) {
        localStorage.removeItem("pending_invite_token");
        navigate(`/invite?token=${pendingInvite}`);
        return;
      }

      const rawRole = data.user?.role || data.user?.user_type || data.user?.account_type || data.role || "";
      const role = rawRole.toString().toUpperCase();
      const PROFESSIONAL_ROLES = ["PROFESSIONAL", "MEMBER", "PRO"];

      if (PROFESSIONAL_ROLES.includes(role)) {
        navigate("/professional/dashboard");
        return;
      }

      try {
        const workspaces = await getWorkspaces();
        const isMemberUser = Array.isArray(workspaces) && workspaces.length > 0 && role !== "OWNER" && role !== "ADMIN";

        if (isMemberUser) {
          navigate("/professional/dashboard");
          return;
        }

        if (Array.isArray(workspaces) && workspaces.length > 0) {
          navigate("/workspaces");
        } else {
          navigate("/create-dashboard");
        }
      } catch (wsError) {
        navigate("/create-dashboard");
      }
    } catch (err) {
      const message = err?.detail || err?.response?.data?.detail || err?.response?.data?.non_field_errors?.[0] || "Invalid email or password";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-sans antialiased text-gray-900">
      
      {/* LEFT SIDE: Branding Panel */}
      <div className="hidden lg:flex lg:w-7/12 bg-[#2D38E1] text-white p-20 flex-col justify-between relative overflow-hidden">
        {/* Subtle Background Art */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 20 Q 50 0 100 20 T 200 20" fill="none" stroke="white" strokeWidth="0.2" />
            <path d="M0 40 Q 50 20 100 40 T 200 40" fill="none" stroke="white" strokeWidth="0.2" />
            <path d="M0 60 Q 50 40 100 60 T 200 60" fill="none" stroke="white" strokeWidth="0.2" />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="mb-12">
             <span className="text-6xl">✳️</span> {/* Replace with your actual SVG logo */}
          </div>
          
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            Hello <br /> Slotify! 👋
          </h1>
          
          <p className="text-xl text-blue-100 max-w-md font-light leading-relaxed">
            Skip repetitive and manual scheduling tasks. Get highly productive through automation and save tons of time!
          </p>
        </div>

        <div className="relative z-10 text-sm opacity-60">
          © 2026 Slotify. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center px-8 sm:px-16 lg:px-24 bg-white">
        <div className="max-w-md w-full mx-auto">
          
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Slotify</h2>
          </div>

          <div className="mb-10">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Welcome Back!</h3>
            <p className="text-gray-500 text-sm">
              Don't have an account? 
              <Link to="/register" className="text-gray-900 font-semibold underline ml-1">
                Create a new account now,
              </Link>
              <br /> It's FREE! Takes less than a minute.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 mb-6 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* EMAIL */}
            <div className="relative">
              <input
                type="email"
                name="email"
                placeholder="Email address"
                value={form.email}
                onChange={handleChange}
                className="w-full py-3 border-b border-gray-300 focus:border-black outline-none transition-colors placeholder-gray-400 text-lg"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full py-3 border-b border-gray-300 focus:border-black outline-none transition-colors placeholder-gray-400 text-lg"
                required
              />
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A1A1A] text-white py-4 rounded-lg font-bold hover:bg-black transition-all disabled:opacity-50 mt-4"
            >
              {loading ? "Logging in..." : "Login Now"}
            </button>

            {/* GOOGLE LOGIN */}
            <button
              type="button"
              className="w-full bg-white border border-gray-300 py-3 rounded-lg font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all text-gray-700"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Login with Google
            </button>

            <div className="text-center">
              <Link to="/forgot-password/email" className="text-gray-400 text-sm hover:text-gray-600">
                Forget password <span className="text-gray-900 font-bold underline ml-1 cursor-pointer">Click here</span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}