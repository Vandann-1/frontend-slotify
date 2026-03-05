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
  const [showLoginModal, setShowLoginModal] = useState(false);

  // ================= VALIDATE INVITE =================

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
        const userEmail = JSON.parse(localStorage.getItem("user") || "{}")?.email;

        // ❌ NOT LOGGED IN
        if (!accessToken) {
          setShowLoginModal(true);
          return;
        }

        // ❌ WRONG USER
        if (userEmail && res.data.email !== userEmail) {
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

  // ================= ACCEPT INVITE =================

  const handleAccept = async () => {

    try {

      setAccepting(true);

      await axiosInstance.post("/invitations/accept/", {
        token
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
                disabled={accepting || showLoginModal}
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

      {/* LOGIN MODAL */}

      {showLoginModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">

            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Login Required
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              Please login to join this workspace invitation.
            </p>

            <div className="flex gap-3">

              <button
                onClick={() => navigate(`/login?invite=${token}`)}
                className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg"
              >
                Login
              </button>

              <button
                onClick={() => navigate(`/register?invite=${token}`)}
                className="flex-1 border border-gray-300 py-2.5 rounded-lg"
              >
                Register
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default InviteValidatePage;