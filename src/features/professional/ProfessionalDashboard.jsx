import { useEffect, useState } from "react";
import professionalApi from "../../api/professionalApi";

const ProfessionalDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await professionalApi.getMyMemberships();
        setMemberships(res.data);
      } catch (err) {
        console.error("Membership load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded-xl" />
          <div className="h-24 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* ================= HEADER ================= */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Professional Dashboard
        </h2>
        <p className="text-sm text-gray-500">
          Manage your workspace memberships
        </p>
      </div>

      {/* ================= EMPTY STATE ================= */}
      {memberships.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center shadow-sm">
          <p className="text-gray-600 font-medium">
            No workspace membership yet
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Accept an invitation to see workspaces here.
          </p>
        </div>
      ) : (
        /* ================= MEMBERSHIP GRID ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {memberships.map((m, i) => (
            <div
              key={i}
              className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition"
            >
              {/* Workspace name */}
              <h3 className="text-lg font-semibold text-gray-800 capitalize">
                {m.workspace}
              </h3>

              {/* Role badge */}
              <div className="mt-3">
                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                  {m.role}
                </span>
              </div>

              {/* Footer */}
              <div className="mt-6 text-xs text-gray-400">
                Workspace membership
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfessionalDashboard;