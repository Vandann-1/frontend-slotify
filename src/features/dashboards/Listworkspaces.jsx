import React, { useEffect, useState } from "react";
import { getWorkspaces } from "../../api/workspaceApi";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  PlusCircle,
  Stethoscope,
  Laptop,
  Dumbbell,
  Scale,
  Building2
} from "lucide-react";

export default function ListWorkspaces() {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const data = await getWorkspaces();
      setWorkspaces(data);
    } catch (err) {
      setError("Failed to load workspaces");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (workspace) => {
    localStorage.setItem("current_workspace_slug", workspace.slug);
    navigate(`/workspace/${workspace.slug}`);
  };

  // CATEGORY DETECTOR
  const getWorkspaceTheme = (name) => {
    const lower = name.toLowerCase();

    if (lower.includes("doctor") || lower.includes("clinic") || lower.includes("hospital")) {
      return {
        icon: <Stethoscope size={20} />,
        gradient: "from-emerald-500 to-teal-600",
        badge: "bg-emerald-50 text-emerald-600"
      };
    }

    if (lower.includes("tech") || lower.includes("it") || lower.includes("software")) {
      return {
        icon: <Laptop size={20} />,
        gradient: "from-indigo-500 to-blue-600",
        badge: "bg-indigo-50 text-indigo-600"
      };
    }

    if (lower.includes("gym") || lower.includes("fitness")) {
      return {
        icon: <Dumbbell size={20} />,
        gradient: "from-orange-500 to-red-500",
        badge: "bg-orange-50 text-orange-600"
      };
    }

    if (lower.includes("law") || lower.includes("legal")) {
      return {
        icon: <Scale size={20} />,
        gradient: "from-purple-500 to-violet-600",
        badge: "bg-purple-50 text-purple-600"
      };
    }

    return {
      icon: <Building2 size={20} />,
      gradient: "from-blue-500 to-indigo-600",
      badge: "bg-blue-50 text-blue-600"
    };
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white">

      {/* SIDEBAR */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
        <div className="h-full bg-gradient-to-b from-blue-600 to-blue-800 text-white flex flex-col shadow-2xl">

          <div className="flex items-center justify-between px-5 py-6">
            {sidebarOpen && <h1 className="text-xl font-semibold">Slotify</h1>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-blue-700 rounded-lg">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <nav className="flex-1 px-3 space-y-3">
            <SidebarItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              sidebarOpen={sidebarOpen}
              onClick={() => navigate("/dashboard")}
            />

            <SidebarItem
              icon={<PlusCircle size={18} />}
              label="Create Workspace"
              sidebarOpen={sidebarOpen}
              onClick={() => navigate("/create-workspace")}
            />
          </nav>

          <div className="px-4 py-5 border-t border-blue-500/40">
            {sidebarOpen ? (
              <div className="text-sm opacity-80">
                Logged in as <br />
                <span className="font-medium">Vandan</span>
              </div>
            ) : (
              <div className="text-center font-semibold">V</div>
            )}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
{/* MAIN CONTENT */}
<div className="flex-1 px-8 py-8">

  {/* Header */}
  <div className="flex items-center justify-between mb-8">
    <h1 className="text-2xl font-semibold text-gray-800">
      Your Workspaces
    </h1>

    <button
      onClick={() => navigate("/create-workspace")}
      className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-blue-700 transition text-sm"
    >
      + Create Workspace
    </button>
  </div>

  {workspaces.length === 0 && (
    <p className="text-gray-500 text-sm">No workspaces found.</p>
  )}

  {/* Grid */}
  <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
    {workspaces.map((workspace) => {
      const theme = getWorkspaceTheme(workspace.name);

      return (
        <div
          key={workspace.id}
          onClick={() => handleEnter(workspace)}
          className="relative bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 group overflow-hidden"
        >
          {/* Top Accent */}
          <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.gradient}`}></div>

          {/* Header */}
          <div className="flex items-center gap-3 mt-2">

            {/* Smaller Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm bg-gradient-to-br ${theme.gradient}`}>
              {theme.icon}
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-800">
                {workspace.name}
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                {workspace.slug}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-5 flex items-center justify-between">
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${theme.badge}`}>
              {workspace.myrole}
            </span>

            <span className="text-xs text-gray-400 group-hover:text-blue-600 transition">
              Enter →
            </span>
          </div>

        </div>
      );
    })}
  </div>

</div>

    </div>
  );
}

function SidebarItem({ icon, label, sidebarOpen, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-blue-700 transition cursor-pointer"
    >
      <div className="w-8 h-8 flex items-center justify-center">
        {icon}
      </div>

      {sidebarOpen && (
        <span className="text-sm font-medium">
          {label}
        </span>
      )}
    </div>
  );
}
