import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import InviteMemberForm from "./InviteMemberForm";
import { useNavigate } from "react-router-dom";
import {
  UserMinus,
  Eye,
  UserPlus,
  Mail,
  Calendar,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const TeamMembers = ({ slug }) => {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [workspaceType, setWorkspaceType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "",
  });
  const [removingUserId, setRemovingUserId] = useState(null);

  const isSolo = workspaceType === "SOLO";

  // ================= FETCH MEMBERS =================
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/workspaces/${slug}/members/`
      );
      setMembers(res.data);
    } catch (err) {
      console.error("Failed to fetch members:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH WORKSPACE =================
  const fetchWorkspace = async () => {
    try {
      const res = await axiosInstance.get(`/workspaces/${slug}/`);
      setWorkspaceType(res.data.workspace_type);
    } catch (err) {
      console.error("Failed to fetch workspace:", err);
    }
  };

  useEffect(() => {
    if (!slug) return;
    fetchMembers();
    fetchWorkspace();
  }, [slug]);

  // ================= REMOVE MEMBER =================
  const handleRemoveMember = async (userId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this member?"
      )
    )
      return;

    try {
      setRemovingUserId(userId);
      await axiosInstance.post(
        `/workspaces/${slug}/remove-member/`,
        { user_id: userId }
      );

      setNotification({
        message: "Member removed successfully",
        type: "success",
      });

      fetchMembers();
    } catch (err) {
      setNotification({
        message:
          err?.response?.data?.detail ||
          "Failed to remove member",
        type: "error",
      });
    } finally {
      setRemovingUserId(null);
    }
  };

  // ================= AUTO HIDE NOTIFICATION =================
  useEffect(() => {
    if (!notification.message) return;
    const t = setTimeout(
      () => setNotification({ message: "", type: "" }),
      3000
    );
    return () => clearTimeout(t);
  }, [notification]);

  if (!slug)
    return (
      <div className="p-8 text-center text-red-500 bg-red-50 rounded-xl m-6 border border-red-100">
        Workspace context missing.
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* ================= NOTIFICATIONS ================= */}
      {notification.message && (
        <div
          className={`fixed top-6 right-6 z-[60] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border transition-all ${
            notification.type === "success"
              ? "bg-white border-green-200 text-green-800"
              : "bg-white border-red-200 text-red-800"
          }`}
        >
          <div
            className={`p-1 rounded-full ${
              notification.type === "success"
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            {notification.type === "success" ? (
              <ShieldCheck size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
          </div>
          <p className="font-medium text-sm">
            {notification.message}
          </p>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Team Members
          </h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            Manage permissions and collaborate with your team.
            <span className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full border border-blue-100 font-semibold">
              {members.length} Members
            </span>
          </p>
        </div>

        {/* ⭐ HIDE FOR SOLO */}
        {!isSolo && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95"
          >
            <UserPlus size={18} />
            Invite Member
          </button>
        )}
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
            <p className="text-gray-400 font-medium tracking-wide">
              Fetching team data...
            </p>
          </div>
        ) : members.length === 0 ? (
          <div className="py-20 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-gray-300" size={32} />
            </div>

            <h3 className="text-lg font-semibold text-gray-800">
              {isSolo ? "You're working solo" : "No members found"}
            </h3>

            <p className="text-gray-500 max-w-xs mx-auto mt-2">
              {isSolo
                ? "This workspace is set to Just Me. Upgrade to team mode to invite members."
                : "Start by inviting colleagues to collaborate on this workspace."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50">
                {members.map((m) => (
                  <tr
                    key={m.id}
                    className="group hover:bg-indigo-50/30 transition-colors"
                  >
                    {/* USER */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-11 w-11 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-inner shadow-black/10">
                          {m.email?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 leading-none">
                            {m.email?.split("@")[0]}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {m.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${
                          m.role === "OWNER"
                            ? "bg-purple-100 text-purple-700 ring-1 ring-purple-200"
                            : "bg-blue-100 text-blue-700 ring-1 ring-blue-200"
                        }`}
                      >
                        {m.role}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar size={14} className="text-gray-400" />
                        {m.joined_at
                          ? new Intl.DateTimeFormat("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }).format(new Date(m.joined_at))
                          : "—"}
                      </div>
                    </td>

                    {/* ACTIONS */}
<td className="px-6 py-4 text-right">
  <div className="flex justify-end items-center gap-2">

    {/* VIEW PROFILE */}
    <button
      onClick={() => navigate(`/admin/professionals/${m.user_id}`)}
      className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-100 rounded-lg transition"
      title="View Profile"
    >
      <Eye size={18} />
    </button>

    {/* REMOVE MEMBER */}
    {!isSolo && (
      m.role?.toUpperCase() === "OWNER" ? (
        <button
          disabled
          className="p-2 text-gray-300 cursor-not-allowed rounded-lg"
          title="Owner cannot be removed"
        >
          <UserMinus size={18} />
        </button>
      ) : (
        <button
          onClick={() => handleRemoveMember(m.user_id)}
          disabled={removingUserId === m.user_id}
          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
          title="Remove Member"
        >
          <UserMinus size={18} />
        </button>
      )
    )}

  </div>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL ================= */}
{/* ================= MODAL ================= */}
{showModal && !isSolo && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">

    {/* Overlay */}
    <div
      onClick={() => setShowModal(false)}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
    />

    {/* Modal */}
    <div className="relative w-full max-w-lg mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">

      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-100 flex items-start justify-between">

        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Workspace
          </p>

          <h2 className="text-xl font-bold text-gray-900">
            Invite Member
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Add a new teammate to this workspace
          </p>
        </div>

        <button
          onClick={() => setShowModal(false)}
          className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 transition"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="px-8 py-7">

        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-6">
          <p className="text-xs text-gray-500 font-medium">
            Workspace
          </p>

          <p className="text-sm font-semibold text-gray-900">
            {slug}
          </p>
        </div>

        <InviteMemberForm
          workspaceSlug={slug}
          onInviteSuccess={() => {
            setNotification({
              message: "Invitation sent successfully!",
              type: "success",
            });

            setShowModal(false);
            fetchMembers();
          }}
        />

      </div>

    </div>
  </div>
)}
    </div>
  );
};

export default TeamMembers;