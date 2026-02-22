import { useState } from "react";
import invitationApi from "../../api/invitationApi";

/*
  InviteMemberForm (Upgraded UI)

  Responsibilities:
  • Collect email + role
  • Call invite API
  • Notify parent on success
*/

const InviteMemberForm = ({ workspaceSlug, onInviteSuccess }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("PROFESSIONAL");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===== INVITE HANDLER =====
  const handleInvite = async () => {
    const trimmedEmail = email.trim();
    setError("");

    // Guard: slug
    if (!workspaceSlug) {
      setError("Workspace not loaded yet.");
      return;
    }

    // Guard: email
    if (!trimmedEmail) {
      setError("Please enter an email.");
      return;
    }

    try {
      setLoading(true);

      await invitationApi.sendProfessionalInvite(workspaceSlug, {
        email: trimmedEmail,
        role,
      });

      // success reset
      setEmail("");

      // notify parent (refresh list)
      if (onInviteSuccess) {
        onInviteSuccess();
      }
    } catch (err) {
      console.error("Invite failed:", err);

      const message =
        err?.response?.data?.detail ||
        JSON.stringify(err?.response?.data) ||
        "Failed to send invitation";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* ERROR MESSAGE */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {/* EMAIL FIELD */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Professional Email
        </label>

        <input
          type="email"
          placeholder="example@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-2.5 rounded-lg transition"
        />
      </div>

      {/* ROLE FIELD */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role
        </label>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none p-2.5 rounded-lg transition"
        >
          <option value="PROFESSIONAL">Professional</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* ACTION BUTTON */}
      <button
        onClick={handleInvite}
        disabled={loading || !email.trim() || !workspaceSlug}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-2.5 rounded-xl shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        {loading ? "Sending Invitation..." : "Send Invitation"}
      </button>
    </div>
  );
};

export default InviteMemberForm;