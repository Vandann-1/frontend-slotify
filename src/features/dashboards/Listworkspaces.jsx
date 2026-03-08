
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
  Users,
  Sparkles
} from "lucide-react";

export default function ListWorkspaces() {

  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const data = await getWorkspaces();
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

      setWorkspaces(prev =>
        prev.filter(w => w.slug !== workspace.slug)
      );

    } catch {
      alert("Failed to delete workspace");
    }

  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-slate-900">

      {/* SIDEBAR */}

      <aside
        className={`transition-all duration-300 flex flex-col shadow-xl ${
          collapsed ? "w-16" : "w-60"
        } bg-gradient-to-b from-[#1e40af] to-[#1e3a8a] text-white`}
      >

        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">

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

        <nav className="flex-1 px-3 py-6">

          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition">

            <LayoutGrid size={18} />

            {!collapsed && (
              <span className="text-sm font-medium">
                Workspaces
              </span>
            )}

          </button>

        </nav>

        <div className="p-3 border-t border-white/10">

          <div className={`flex items-center gap-3 mb-4 ${collapsed ? "justify-center" : ""}`}>

            <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center">
              <User size={16}/>
            </div>

            {!collapsed && (
              <div>
                <p className="text-xs font-semibold">Admin User</p>
                <p className="text-[10px] text-blue-200">
                  admin@slotify.com
                </p>
              </div>
            )}

          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-red-500 transition ${
              collapsed ? "justify-center" : ""
            }`}
          >

            <LogOut size={16}/>

            {!collapsed && (
              <span className="text-xs">
                Sign out
              </span>
            )}

          </button>

        </div>

      </aside>

      {/* MAIN */}

      <div className="flex-1 flex flex-col">

        {/* HEADER */}

        <header className="h-14 bg-white/80 backdrop-blur border-b flex items-center justify-between px-8">

          <div className="flex items-center bg-slate-100 px-3 py-1.5 rounded-md w-72">

            <Search size={14} className="text-slate-400"/>

            <input
              type="text"
              placeholder="Search workspace..."
              className="bg-transparent ml-2 text-sm outline-none w-full"
            />

          </div>

          <div className="flex items-center gap-5">

            <Bell size={18} className="text-slate-400"/>

            <div className="h-9 w-9 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
              AD
            </div>

          </div>

        </header>

        {/* PAGE */}

        <main className="flex-1 overflow-y-auto p-10">

          <div className="max-w-6xl mx-auto">

            <div className="flex items-center justify-between mb-10">

              <div>

                <h1 className="text-3xl font-bold">
                  Your Workspaces
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Access and manage your environments
                </p>

              </div>

              <button
                onClick={() => navigate("/create-dashboard")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm shadow-md"
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

            {/* GRID */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

              {workspaces.map(workspace => {

                const role = workspace?.myrole?.toUpperCase() || "PROFESSIONAL";
                const plan = workspace?.plan || "FREE";

                return (

                  <div
                    key={workspace.id}
                    onClick={() => handleEnter(workspace)}
                    className="group relative bg-white rounded-2xl border hover:border-blue-400 hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                  >

                    <div className="h-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative">

                      <div className="absolute -bottom-6 left-6 w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center">
                        <Building2 size={20}/>
                      </div>

                      {(role === "OWNER" || role === "ADMIN") && (

                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">

                          <button
                            onClick={(e)=>{
                              e.stopPropagation();
                              navigate(`/admin/workspace/${workspace.slug}/settings`)
                            }}
                            className="p-1.5 rounded bg-white/90 hover:bg-blue-50"
                          >
                            <Settings size={14}/>
                          </button>

                          <button
                            onClick={(e)=>handleDeleteWorkspace(e,workspace)}
                            className="p-1.5 rounded bg-white/90 hover:bg-red-50"
                          >
                            <Trash2 size={14}/>
                          </button>

                        </div>

                      )}

                    </div>

                    <div className="pt-10 pb-6 px-6">

                      <h2 className="font-semibold text-lg">
                        {workspace.name}
                      </h2>

                      <p className="text-xs text-slate-400 mt-1">
                        {workspace.slug}.slotify.io
                      </p>

                      <div className="flex gap-2 mt-4">

                        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-semibold">
                          {workspace.workspace_type || "TEAM"}
                        </span>

                        <span className={`text-[10px] px-2 py-1 rounded-full font-semibold ${
                          plan === "FREE"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-green-50 text-green-600"
                        }`}>
                          {plan}
                        </span>

                      </div>

                      {plan === "FREE" && (

                        <p className="text-[11px] text-slate-400 mt-4">
                          Upgrade to unlock more members, analytics and automation
                        </p>

                      )}

                      <div className="mt-6 flex justify-between items-center">

                        {plan === "FREE" && (role === "OWNER" || role === "ADMIN") && (

                          <button
                            onClick={(e)=>{
                              e.stopPropagation();
                              navigate(`/admin/workspace/${workspace.slug}/upgrade`)
                            }}
                            className="flex items-center gap-1 text-xs bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-md shadow hover:shadow-md hover:scale-[1.03] transition"
                          >
                            <Sparkles size={12}/>
                            Upgrade Plan
                          </button>

                        )}

                        <ArrowRight
                          size={16}
                          className="text-slate-300 group-hover:text-blue-500 transition"
                        />

                      </div>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        </main>

      </div>

    </div>

  );

}

