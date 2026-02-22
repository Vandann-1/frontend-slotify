import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import InviteMemberForm from "./InviteMemberForm";

const TeamMembers = ({ slug }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // ===== fetch members =====
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

  useEffect(() => {
    if (slug) fetchMembers();
  }, [slug]);

  if (!slug) {
    return (
      <div className="p-6 text-red-500 font-medium">
        Workspace slug missing
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ================= HEADER CARD ================= */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">
            Team Members
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            Manage your workspace team
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-blue-700 font-medium px-5 py-2.5 rounded-xl shadow hover:shadow-md transition"
        >
          + Invite Member
        </button>
      </div>

      {/* ================= MEMBERS CARD ================= */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading members...
          </div>
        ) : members.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No members yet.
          </div>
        ) : (
          <table className="min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Member
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Role
                </th>
                <th className="p-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Joined
                </th>
              </tr>
            </thead>

            <tbody>
              {members.map((m) => (
                <tr
                  key={m.id}
                  className="border-b last:border-0 hover:bg-gray-50 transition"
                >
                  {/* EMAIL + AVATAR */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
                        {m.email?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">
                        {m.email}
                      </span>
                    </div>
                  </td>

                  {/* ROLE BADGE */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        m.role === "OWNER"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {m.role}
                    </span>
                  </td>

                  {/* DATE */}
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(m.joined_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative p-6">
            {/* CLOSE */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-3 text-gray-400 hover:text-gray-600 text-lg"
            >
              ✕
            </button>

            <h3 className="text-xl font-semibold mb-5 text-gray-800">
              Invite New Member
            </h3>

            <InviteMemberForm
              workspaceSlug={slug}
              onInviteSuccess={() => {
                setShowModal(false);
                fetchMembers();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;