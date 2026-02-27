import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const InviteValidatePage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link.");
      setLoading(false);
      return;
    }

    const validateInvite = async () => {
      try {
        const res = await axiosInstance.post("/invitations/validate/", {
          token,
        });

        setData(res.data);

        const accessToken = localStorage.getItem("access");
        const userEmail = localStorage.getItem("user_email");

        if (!accessToken) {
          localStorage.setItem("pending_invite_token", token);
          navigate("/Register");
          return;
        }

        if (userEmail && res.data.email !== userEmail) {
          localStorage.setItem("pending_invite_token", token);
          navigate("/Rigister");
          return;
        }
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            "Invitation is invalid or expired."
        );
      } finally {
        setLoading(false);
      }
    };

    validateInvite();
  }, [token, navigate]);

  const handleAccept = async () => {
    try {
      setAccepting(true);

      await axiosInstance.post("/invitations/accept/", {
        token,
      });

      navigate("/professional/dashboard");
    } catch (err) {
      alert(
        err?.response?.data?.detail ||
          "Failed to accept invitation"
      );
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Slotify
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            You've been invited to join a workspace
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

          {/* Loading */}
          {loading && (
            <div className="text-center py-6 text-gray-500">
              Validating invitation…
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm text-center">
              {error}
            </div>
          )}

          {/* Success */}
          {!loading && !error && (
            <>
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-500">Workspace</span>
                  <span className="font-medium text-gray-900">
                    {data?.tenant}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">
                    {data?.email}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium text-gray-900">
                    {data?.role}
                  </span>
                </div>
              </div>

<button
  onClick={handleAccept}
  disabled={accepting}
  className="
    w-full relative flex items-center justify-center gap-2
    bg-gray-900 hover:bg-black active:bg-gray-950
    text-white font-medium
    rounded-lg py-3
    transition-all duration-200
    shadow-sm hover:shadow-md
    disabled:opacity-60 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-gray-900/20
  "
>
  {accepting && (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )}

  {accepting ? "Joining workspace…" : "Accept Invitation"}
</button>
            </>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Secure access powered by Slotify
        </p>
      </div>
    </div>
  );
};

export default InviteValidatePage;