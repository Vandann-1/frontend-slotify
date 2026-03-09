import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import InviteMemberForm from "./InviteMemberForm";
import { useNavigate } from "react-router-dom";

import {
  UserPlus,
  Crown,
  Eye,
  Mail,
  Trash2,
  Users,
  Search
} from "lucide-react";

const TeamMembers = ({ slug }) => {

  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [workspaceType, setWorkspaceType] = useState(null);

  const [planName, setPlanName] = useState("Free");
  const [memberLimit, setMemberLimit] = useState(3);

  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const isSolo = workspaceType === "SOLO";

  /* ================= PLAN CALCULATIONS ================= */

  const membersUsed = members.length;

  const limitReached =
    memberLimit !== null && membersUsed >= memberLimit;

  const membersRemaining =
    memberLimit !== null
      ? Math.max(memberLimit - membersUsed, 0)
      : null;

  const usagePercent =
    memberLimit > 0
      ? Math.min((membersUsed / memberLimit) * 100, 100)
      : 0;

  /* ================= FETCH MEMBERS ================= */

  const fetchMembers = async () => {

    try {

      setLoading(true);

      const res = await axiosInstance.get(
        `/workspaces/${slug}/members/`
      );

      setMembers(res.data.members || []);
      setPlanName(res.data.plan || "Free");
      setMemberLimit(res.data.member_limit ?? 3);

    } catch (err) {

      console.error("Members fetch error:", err);

    } finally {

      setLoading(false);

    }

  };

  /* ================= FETCH WORKSPACE ================= */

  const fetchWorkspace = async () => {

    try {

      const res = await axiosInstance.get(
        `/workspaces/${slug}/`
      );

      setWorkspaceType(res.data.workspace_type);

    } catch (err) {

      console.error("Workspace fetch error:", err);

    }

  };

  useEffect(() => {

    if (!slug) return;

    fetchMembers();
    fetchWorkspace();

  }, [slug]);

  /* ================= REMOVE MEMBER ================= */

  const removeMember = async (userId) => {

    if (!window.confirm("Remove this member?")) return;

    try {

      await axiosInstance.post(
        `/workspaces/${slug}/remove-member/`,
        { user_id: userId }
      );

      fetchMembers();

    } catch (err) {

      console.error("Remove failed", err);

    }

  };

  /* ================= SEARCH FILTER ================= */

  const filteredMembers = members.filter((m) =>
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!slug) {
    return (
      <div className="p-8 text-center text-red-600">
        Workspace context missing
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Team Members
          </h1>

          <p className="text-gray-500">
            Manage your workspace team
          </p>

          {/* Stats */}

          <div className="flex gap-4 mt-4">

            <div className="bg-white border rounded-lg px-4 py-2 shadow-sm">
              <p className="text-xs text-gray-500">Members</p>
              <p className="font-semibold text-lg">{membersUsed}</p>
            </div>

            <div className="bg-white border rounded-lg px-4 py-2 shadow-sm">
              <p className="text-xs text-gray-500">Seats Remaining</p>
              <p className="font-semibold text-lg">{membersRemaining}</p>
            </div>

            <div className="bg-white border rounded-lg px-4 py-2 shadow-sm">
              <p className="text-xs text-gray-500">Plan</p>
              <p className="font-semibold text-lg">{planName}</p>
            </div>

          </div>

        </div>

        {!isSolo && (

          <button
            onClick={() => {

              if (limitReached) {
                navigate("/billing");
              } else {
                setShowModal(true);
              }

            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold
            ${limitReached
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 shadow-lg"
              }`}
          >

            {limitReached ? (
              <>
                <Crown size={18} />
                Upgrade Plan
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Invite Member
              </>
            )}

          </button>

        )}

      </div>

      {/* ================= PLAN CARD ================= */}

      {!isSolo && (

        <div
          className={`rounded-xl border p-6 shadow-sm
          ${limitReached
              ? "bg-red-50 border-red-200"
              : "bg-white border-gray-200"
            }`}
        >

          <div className="flex justify-between items-center">

            <div>

              <div className="flex items-center gap-2">

                <Crown
                  className={
                    limitReached
                      ? "text-red-600"
                      : "text-indigo-600"
                  }
                />

                <h3 className="font-semibold text-lg">
                  {planName} Plan
                </h3>

              </div>

              <p className="text-sm text-gray-600 mt-1">

                {membersUsed} / {memberLimit} members used

              </p>

              <p className="text-xs text-gray-500">

                {membersRemaining} seats remaining

              </p>

              {limitReached && (

                <p className="text-sm text-red-600 mt-1 font-medium">

                  Member limit reached. Upgrade your plan.

                </p>

              )}

            </div>

            <button
              onClick={() => navigate("/billing")}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Crown size={16} />
              Upgrade Plan
            </button>

          </div>

          {/* Progress Bar */}

          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">

            <div
              style={{ width: `${usagePercent}%` }}
              className={`h-full transition-all duration-500 ${limitReached
                  ? "bg-red-500"
                  : "bg-indigo-500"
                }`}
            />

          </div>

        </div>

      )}

      {/* ================= SEARCH ================= */}

      <div className="flex items-center gap-2 border rounded-lg px-4 py-2 w-72">

        <Search size={16} className="text-gray-400" />

        <input
          placeholder="Search members..."
          className="outline-none text-sm w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>

      {/* ================= MEMBERS TABLE ================= */}

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

        {loading ? (

          <div className="p-10 text-center text-gray-400">
            Loading members...
          </div>

        ) : filteredMembers.length === 0 ? (

          <div className="p-12 text-center">

            <Mail
              className="mx-auto text-gray-300 mb-3"
              size={40}
            />

            <p className="text-gray-500">
              No members found
            </p>

          </div>

        ) : (

          <table className="w-full">

            <thead className="bg-gray-50 text-xs uppercase text-gray-400">

              <tr>

                <th className="px-6 py-4 text-left">
                  Member
                </th>

                <th className="px-6 py-4 text-left">
                  Role
                </th>

                <th className="px-6 py-4 text-left">
                  Joined
                </th>

                <th className="px-6 py-4 text-right">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {filteredMembers.map((m) => (

                <tr
                  key={m.id}
                  className="hover:bg-indigo-50 transition duration-150"
                >

                  <td className="px-6 py-4 flex items-center gap-3">

                    <div className="relative w-9 h-9">

                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow">
                        {m.email?.[0]?.toUpperCase()}
                      </div>

                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>

                    </div>

                    <span className="font-medium">
                      {m.email}
                    </span>

                  </td>

                  <td className="px-6 py-4">

                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full
                      ${m.role === "OWNER"
                          ? "bg-purple-100 text-purple-700"
                          : m.role === "ADMIN"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      {m.role}
                    </span>

                  </td>

                  <td className="px-6 py-4 text-gray-500 text-sm">

                    {m.joined_at
                      ? new Date(m.joined_at).toLocaleDateString()
                      : "-"}

                  </td>

                  <td className="px-6 py-4 text-right">

                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() =>
                          navigate(
                            `/admin/professionals/${m.user_id}`
                          )
                        }
                        className="p-2 hover:bg-indigo-100 rounded-lg"
                      >
                        <Eye size={18} />
                      </button>

                      {m.role !== "OWNER" && (

                        <button
                          onClick={() =>
                            removeMember(m.user_id)
                          }
                          className="p-2 hover:bg-red-100 text-red-600 rounded-lg"
                        >
                          <Trash2 size={18} />
                        </button>

                      )}

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

      {/* ================= INVITE MODAL ================= */}

      {showModal && !limitReached && (

        <InviteMemberForm
          workspaceSlug={slug}
          onInviteSuccess={() => {

            setShowModal(false);
            fetchMembers();

          }}
        />

      )}

    </div>
  );
};

export default TeamMembers;