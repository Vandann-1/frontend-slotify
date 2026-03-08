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
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {

    if (!token) {
      setError("Invalid invitation link.");
      setLoading(false);
      return;
    }

    const validateInvite = async () => {

      try {

        const res = await axiosInstance.post("/invitations/validate/", {
          token
        });

        setData(res.data);

        const accessToken = localStorage.getItem("access");
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!accessToken) {
          localStorage.setItem("pending_invite_token", token);
          setShowRegisterModal(true);
          return;
        }

        if (user.email && res.data.email !== user.email) {
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

    validateInvite();

  }, [token, navigate]);



  const handleAccept = async () => {

    if (!data) return;

    try {

      setAccepting(true);

      await axiosInstance.post("/invitations/accept/", {
        token
      });

      localStorage.removeItem("pending_invite_token");

      if (data.role === "OWNER" || data.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/professional/dashboard");
      }

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
                disabled={accepting || showRegisterModal}
                className="w-full bg-gray-900 text-white py-3 rounded-lg hover:bg-black transition"
              >
                {accepting ? "Joining workspace…" : "Accept Invitation"}
              </button>
            </>
          )}

        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Secure access powered by Slotify
        </p>

      </div>

      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Create an Account
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              You must create an account to join this workspace.
            </p>

            <button
              onClick={() => navigate(`/register?invite=${token}`)}
              className="w-full bg-gray-900 text-white py-2.5 rounded-lg"
            >
              Register to Join
            </button>

          </div>

        </div>
      )}

    </div>

  );
};

export default InviteValidatePage;