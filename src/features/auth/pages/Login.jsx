import { loginUser } from "../../../api/authApi";
import { getWorkspaces } from "../../../api/workspaceApi";
import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= HANDLE INVITE TOKEN =================

  useEffect(() => {


    const inviteToken = searchParams.get("invite");

    if (inviteToken) {
      localStorage.setItem("pending_invite_token", inviteToken);
    }


  }, [searchParams]);

  // ================= INPUT HANDLER =================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));


  };

  // ================= REDIRECT LOGIC =================

  const handleRedirect = async () => {


    const pendingInvite = localStorage.getItem("pending_invite_token");

    if (pendingInvite) {

      localStorage.removeItem("pending_invite_token");

      navigate(`/invite-accept/${pendingInvite}`);

      return;
    }

    try {

      const workspaces = await getWorkspaces();

      if (Array.isArray(workspaces) && workspaces.length > 0) {
        navigate("/workspaces");
      } else {
        navigate("/create-dashboard");
      }

    } catch (err) {

      console.error("Workspace fetch error:", err);
      navigate("/create-dashboard");

    }


  };

  // ================= EMAIL LOGIN =================

  const handleSubmit = async (e) => {


    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const data = await loginUser(form);

      localStorage.setItem("access", data.access);
      localStorage.setItem("user", JSON.stringify(data.user));

      await handleRedirect();

    } catch (err) {

      const message =
        err?.response?.data?.detail ||
        "Invalid email or password";

      setError(message);

    } finally {
      setLoading(false);
    }


  };

  // ================= GOOGLE LOGIN =================

  const handleGoogleLogin = async (credentialResponse) => {


    try {

      const res = await fetch(
        "http://127.0.0.1:8000/api/auth/google/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: credentialResponse.credential,
          }),
        }
      );

      const data = await res.json();

      if (!data.access) {
        console.error("No access token returned");
        return;
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("user", JSON.stringify(data.user));

      await handleRedirect();

    } catch (err) {

      console.error("Google login error:", err);

    }


  };

  // ================= UI =================

  return (


    <div className="flex min-h-screen">

      <div className="w-full lg:w-5/12 flex items-center justify-center">

        <div className="max-w-md w-full">

          <h2 className="text-3xl font-bold mb-6">
            Welcome Back
          </h2>

          {error && (
            <div className="text-red-500 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full border-b py-2"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full border-b py-2"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <div className="mt-6 flex justify-center">

            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => console.log("Google Login Failed")}
            />

          </div>

          <div className="mt-4 text-sm text-center">
            <Link to="/register">
              Create account
            </Link>
          </div>

        </div>

      </div>

    </div>


  );
}

