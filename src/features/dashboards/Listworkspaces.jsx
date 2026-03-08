import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkspaces, deleteWorkspace } from "../../api/workspaceApi";

import {
  Building2,
  ArrowRight,
  Plus,
  LayoutGrid,
  LogOut,
  User,
  Menu,
  X,
  Search,
  Bell,
  Loader2,
  Trash2,
  Settings,
  Users
} from "lucide-react";

export default function ListWorkspaces() {

  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const data = await getWorkspaces();
      console.log("Workspace API:", data);
      setWorkspaces(data || []);
    } catch (err) {
      setError("Failed to load workspaces");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleEnter = (workspace) => {

    if (!workspace?.slug) return;

    const role = workspace?.myrole?.toUpperCase();

    if (role === "OWNER" || role === "ADMIN") {
      navigate(`/admin/workspace/${workspace.slug}`);
    } else {
      navigate(`/professional/workspace/${workspace.slug}`);
    }

  };

  const handleDeleteWorkspace = async (e, workspace) => {

    e.stopPropagation();

    const confirmDelete = window.confirm(
      `Delete workspace "${workspace.name}"?`
    );

    if (!confirmDelete) return;

    try {

      await deleteWorkspace(workspace.slug);

      setWorkspaces((prev) =>
        prev.filter((w) => w.slug !== workspace.slug)
      );

    } catch (error) {
      console.error(error);
      alert("Failed to delete workspace");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f8fafc]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] text-slate-900">

      {/* SIDEBAR */}

      <aside
        className={`transition-all duration-300 flex flex-col shadow-lg ${
          collapsed ? "w-16" : "w-56"
        } bg-gradient-to-b from-[#1e40af] to-[#1e3a8a] text-white`}
      >

        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">

          {!collapsed && (
            <span className="text-lg font-bold italic">
              Slotify
            </span>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hover:bg-white/10 p-1.5 rounded-md"
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>

        </div>

        <nav className="flex-1 px-2 py-4">

          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10">
            <LayoutGrid size={18} />
            {!collapsed && <span className="text-sm">Workspaces</span>}
          </button>

        </nav>

        <div className="p-3 border-t border-white/10">

          <div className={`flex items-center gap-2 mb-3 ${collapsed ? "justify-center" : ""}`}>

            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <User size={16}/>
            </div>

            {!collapsed && (
              <div>
                <p className="text-xs font-bold">Admin User</p>
                <p className="text-[10px] text-blue-200">
                  admin@slotify.com
                </p>
              </div>
            )}

          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-red-500 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={16}/>
            {!collapsed && <span className="text-xs">Sign out</span>}
          </button>

        </div>

      </aside>

      {/* MAIN AREA */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        <header className="h-14 bg-white border-b flex items-center justify-between px-6">

          <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-md w-60">
            <Search size={14} className="text-slate-400"/>
            <input
              type="text"
              placeholder="Search workspaces..."
              className="bg-transparent ml-2 text-sm outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <Bell size={18} className="text-slate-400"/>
            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              AD
            </div>
          </div>

        </header>

        {/* CONTENT */}

        <main className="flex-1 overflow-y-auto p-8">

          <div className="max-w-5xl mx-auto">

            <div className="flex items-center justify-between mb-10">

              <div>
                <h1 className="text-2xl font-bold">
                  Your Workspaces
                </h1>

                <p className="text-sm text-slate-500">
                  Select a workspace to continue
                </p>
              </div>

              <button
                onClick={() => navigate("/create-dashboard")}
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                <Plus size={16}/>
                New Workspace
              </button>

            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-6">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

              {workspaces.map((workspace) => {

                const role = workspace?.myrole?.toUpperCase() || "PROFESSIONAL";

                return (

                  <div
                    key={workspace.id}
                    onClick={() => handleEnter(workspace)}
                    className="group relative bg-white rounded-2xl p-6 border hover:shadow-xl cursor-pointer"
                  >

                    {/* ADMIN ACTIONS */}

                    {(role === "OWNER" || role === "ADMIN") && (

                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100">

                        <button
                          onClick={(e)=>{
                            e.stopPropagation();
                            navigate(`/admin/workspace/${workspace.slug}/settings`)
                          }}
                          className="p-1.5 rounded bg-slate-50 hover:bg-blue-50"
                        >
                          <Settings size={15}/>
                        </button>

                        <button
                          onClick={(e)=>handleDeleteWorkspace(e,workspace)}
                          className="p-1.5 rounded bg-slate-50 hover:bg-red-50"
                        >
                          <Trash2 size={15}/>
                        </button>

                      </div>

                    )}

                    <div className="flex justify-between mb-6">

                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
                        <Building2 size={22}/>
                      </div>

                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded">
                        {workspace.workspace_type || "TEAM"}
                      </span>

                    </div>

                    <h2 className="font-bold text-lg">
                      {workspace.name}
                    </h2>

                    <p className="text-xs text-slate-400 mt-1">
                      {workspace.slug}.slotify.io
                    </p>

                    <div className="mt-6 flex justify-between text-xs">

                      <div className="flex items-center gap-1 text-slate-400">
                        <Users size={14}/>
                        {workspace.team_size || "Team"}
                      </div>

                      <span className="bg-slate-50 px-2 py-1 rounded font-bold">
                        {role}
                      </span>

                    </div>

                    <div className="mt-6 flex justify-between items-center">

                      <span className="text-xs text-slate-400">
                        Open Workspace
                      </span>

                      <ArrowRight
                        size={16}
                        className="text-slate-300 group-hover:text-blue-500"
                      />

                    </div>

                  </div>

                );

              })}

            </div>

            {workspaces.length === 0 && (

              <div className="text-center py-16">

                <Building2 className="mx-auto w-8 h-8 text-slate-300 mb-3"/>

                <p className="text-sm text-slate-400">
                  No workspaces found
                </p>

              </div>

            )}

          </div>

        </main>

      </div>

    </div>
  );
}