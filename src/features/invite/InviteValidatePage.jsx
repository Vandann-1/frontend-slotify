import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const InviteValidatePage = () => {
  // ================= URL TOKEN =================
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  // ================= STATE =================
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  // ================= VALIDATE INVITE =================
  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link.");
      setLoading(false);
      return;
    }

    const validateInvite = async () => {
      try {
        console.log("🔍 Validating token:", token);

        const res = await axiosInstance.post("/invitations/validate/", {
          token,
        });

        setData(res.data);

        // ================= AUTH CHECK =================
        const accessToken = localStorage.getItem("access");
        const userEmail = localStorage.getItem("user_email"); // ⚠️ must be saved at login

        // 🚨 CASE 1 — NOT LOGGED IN
        if (!accessToken) {
          console.log("⛔ Not logged in → redirect to login");

          localStorage.setItem("pending_invite_token", token);
          navigate("/login");
          return;
        }

        // 🚨 CASE 2 — LOGGED IN BUT WRONG EMAIL
        if (userEmail && res.data.email !== userEmail) {
          console.log("⛔ Email mismatch");

          alert(
            `This invite was sent to ${res.data.email}. Please login with that account.`
          );

          localStorage.setItem("pending_invite_token", token);
          navigate("/login");
          return;
        }
      } catch (err) {
        console.error("❌ Validation failed:", err);

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

  // ================= ACCEPT INVITATION =================
  const handleAccept = async () => {
    if (!token) {
      alert("Missing invitation token.");
      return;
    }

    try {
      setAccepting(true);

      console.log("🚀 Accepting invite:", token);

      await axiosInstance.post("/invitations/accept/", {
        token,
      });

      alert("Invitation accepted successfully.");

      // ✅ IMPORTANT — real redirect
      navigate("/professional/dashboard"); // change if needed
    } catch (err) {
      console.error("❌ Accept failed:", err);
      console.log("SERVER RESPONSE:", err?.response?.data);

      alert(
        err?.response?.data?.detail ||
          "Failed to accept invitation"
      );
    } finally {
      setAccepting(false);
    }
  };

  // ================= UI STATES =================

  if (loading) {
    return <div>Validating invitation...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  return (
    <div>
      <h2>You are invited</h2>

      <p><b>Workspace:</b> {data?.tenant}</p>
      <p><b>Email:</b> {data?.email}</p>
      <p><b>Role:</b> {data?.role}</p>

      <button onClick={handleAccept} disabled={accepting}>
        {accepting ? "Joining..." : "Accept Invitation"}
      </button>
    </div>
  );
};

export default InviteValidatePage;