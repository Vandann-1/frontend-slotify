import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkspaces } from "../../api/workspaceApi";
import { Building2, ArrowRight } from "lucide-react";

export default function ListWorkspaces() {

  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const data = await getWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      setError("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (workspace) => {
    if (!workspace.slug) return;
    navigate(`/workspace/${workspace.slug}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading workspaces...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-12">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Your Workspaces
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Select a workspace to manage bookings and team.
          </p>
        </div>

        <button
          onClick={() => navigate("/create-dashboard")}
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg text-sm shadow-sm transition"
        >
          + Create Workspace
        </button>
      </div>

      {/* Empty State */}
      {workspaces.length === 0 && (
        <div className="bg-white p-10 rounded-2xl shadow-sm border text-center">
          <p className="text-gray-500">No workspaces found.</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            onClick={() => handleEnter(workspace)}
            className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            {/* Top Icon */}
            <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center text-white shadow-sm mb-5">
              <Building2 size={20} />
            </div>

            {/* Name */}
            <h2 className="text-lg font-semibold text-gray-800">
              {workspace.name}
            </h2>

            {/* Slug */}
            <p className="text-xs text-gray-400 mt-1">
              {workspace.slug}
            </p>

            {/* Footer */}
            <div className="mt-6 flex items-center justify-between">
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {workspace.myrole}
              </span>

              <span className="flex items-center gap-1 text-sm text-gray-400 group-hover:text-blue-700 transition">
                Enter
                <ArrowRight size={14} />
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
