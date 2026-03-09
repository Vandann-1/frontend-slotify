import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const InviteValidatePage = () => {

  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {

    const runValidation = async () => {
      try {

        // If token missing check localStorage
        if (!token) {

          const pendingInvite = localStorage.getItem("pending_invite_token");

          if (pendingInvite) {
            navigate(`/invite/${pendingInvite}`);
            return;
          }

          setError("Invalid invitation link.");
          setLoading(false);
          return;
        }

        const res = await axiosInstance.post("/invitations/validate/", {
          token
        });

        setData(res.data);

        const accessToken = localStorage.getItem("access");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        // User not logged in
        if (!accessToken) {

          localStorage.setItem("pending_invite_token", token);
          navigate(`/login?invite=${token}`);
          return;
        }

        // Email mismatch
        if (user.email && res.data.email !== user.email) {

          localStorage.setItem("pending_invite_token", token);
          navigate(`/register?invite=${token}`);
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

    runValidation();

  }, [token, navigate]);


  const handleAccept = async () => {

    if (!data) return;

    try {

      setAccepting(true);

      const res = await axiosInstance.post("/invitations/accept/", {
        token
      });

      localStorage.removeItem("pending_invite_token");

      /*
        Backend should return something like:
        {
          workspace_slug: "acme"
        }
      */

      const workspaceSlug =
        res?.data?.workspace_slug ||
        data?.workspace_slug ||
        data?.slug;

      if (!workspaceSlug) {
        navigate("/dashboard");
        return;
      }

      navigate(`/workspace/${workspaceSlug}/dashboard`);

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

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Slotify
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            You've been invited to join a workspace
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">

          {loading && (
            <div className="text-center py-6 text-gray-500">
              Validating invitation…
            </div>
          )}

          {!loading && error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm text-center">
              {error}
            </div>
          )}

          {!loading && !error && data && (
            <>
              <div className="space-y-4 text-sm mb-6">

                <div className="flex justify-between">
                  <span className="text-gray-500">Workspace</span>
                  <span className="font-medium text-gray-900">
                    {data.tenant}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">
                    {data.email}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium text-gray-900">
                    {data.role}
                  </span>
                </div>

              </div>

              <button
                onClick={handleAccept}
                disabled={accepting}
                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-black transition"
              >
                {accepting
                  ? "Joining workspace…"
                  : "Accept Invitation"}
              </button>
            </>
          )}

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Secure access powered by Slotify
        </p>

      </div>

    </div>
  );
};

export default InviteValidatePage;