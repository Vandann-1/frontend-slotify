import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkspaces } from "../../api/workspaceApi";
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
  Loader2
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
    if (!workspace.slug) return;
    navigate(`/workspace/${workspace.slug}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fafc]">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans antialiased text-slate-900">
      
      {/* ================= FIXED SIDEBAR ================= */}
      <aside
        className={`transition-all duration-300 ease-in-out h-full flex-shrink-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 ${
          collapsed ? "w-16" : "w-56"
        } bg-gradient-to-b from-[#1e40af] to-[#1e3a8a] text-white`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/5 shrink-0">
          {!collapsed && <span className="text-lg font-bold tracking-tight italic">Slotify</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="hover:bg-white/10 p-1.5 rounded-md text-blue-100 transition-colors">
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-0.5">
          <div className="px-3 py-2 mb-1 text-[10px] font-bold text-blue-200/50 uppercase tracking-[0.1em]">
            {!collapsed && "Platform"}
          </div>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white/10 text-white border border-white/10 shadow-sm">
            <LayoutGrid size={18} />
            {!collapsed && <span className="text-[13px] font-semibold">Workspaces</span>}
          </button>
        </nav>

        <div className="p-3 border-t border-white/5 bg-black/5 shrink-0">
          <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : "px-1"} mb-3`}>
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center border border-blue-400/50 shadow-sm shrink-0">
              <User size={16} className="text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <p className="text-[12px] font-bold truncate text-white leading-tight">Admin User</p>
                <p className="text-[10px] text-blue-200/60 truncate">admin@slotify.com</p>
              </div>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className={`group flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-blue-100 hover:bg-red-500 hover:text-white transition-all ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            {!collapsed && <span className="text-[12px] font-bold">Sign out</span>}
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Modern Header */}
        <header className="h-14 bg-white border-b border-slate-200/60 flex items-center justify-between px-6 z-10 shrink-0">
          <div className="flex items-center bg-slate-100/80 px-3 py-1.5 rounded-md border border-slate-200/50 w-60 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <Search size={14} className="text-slate-400" />
            <input type="text" placeholder="Search workspaces..." className="bg-transparent border-none focus:ring-0 text-[12px] ml-2 w-full outline-none placeholder:text-slate-400" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-[#1e40af] text-white flex items-center justify-center font-bold text-[11px] shadow-sm">AD</div>
          </div>
        </header>

        {/* Scrollable Main */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="max-w-5xl mx-auto">
            
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Your Workspaces</h1>
                <p className="text-[13px] text-slate-500 mt-0.5">Select a workspace to manage your scheduling infrastructure.</p>
              </div>
              <button
                onClick={() => navigate("/create-dashboard")}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold text-[12px] shadow-[0_4px_12px_rgba(37,99,235,0.2)] transition-all active:scale-[0.98]"
              >
                <Plus size={16} />
                New Workspace
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-[12px] rounded-lg mb-8">
                {error}
              </div>
            )}

            {/* Premium Card Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((workspace) => (
                <div
                  key={workspace.id}
                  onClick={() => handleEnter(workspace)}
                  className="group relative bg-white rounded-2xl p-6 
                             border border-slate-200/60 transition-all duration-500 cursor-pointer
                             hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:border-blue-500/30 
                             hover:-translate-y-1.5 overflow-hidden"
                >
                  {/* Premium Gradient Background Blur */}
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50/50 rounded-full blur-3xl group-hover:bg-blue-100/50 transition-colors duration-500" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      {/* Enhanced Icon Container */}
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-50 to-slate-100 
                                      text-slate-600 rounded-xl flex items-center justify-center 
                                      ring-1 ring-slate-200/50 shadow-sm
                                      group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white 
                                      group-hover:shadow-blue-200 transition-all duration-500">
                        <Building2 size={22} strokeWidth={1.5} />
                      </div>

                      <div className="h-8 w-8 rounded-full flex items-center justify-center 
                                      text-slate-300 group-hover:text-blue-500 group-hover:bg-blue-50 
                                      transition-all duration-300">
                        <ArrowRight size={18} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-[16px] font-bold text-slate-900 tracking-tight 
                                     group-hover:text-blue-700 transition-colors duration-300">
                        {workspace.name}
                      </h2>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
                          {workspace.slug}.slotify.io
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                      {/* Designer Role Badge */}
                      <span className="text-[9px] font-black uppercase tracking-[0.1em] 
                                       bg-slate-50 text-slate-500 border border-slate-100 
                                       px-2.5 py-1 rounded-md group-hover:bg-blue-50 
                                       group-hover:text-blue-600 group-hover:border-blue-100 
                                       transition-all duration-300">
                        {workspace.myrole || "Admin"}
                      </span>
                      
                      <span className="text-[11px] font-bold text-slate-300 group-hover:text-blue-400 transition-colors">
                        Enter Workspace
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {!loading && workspaces.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200/80">
                <Building2 className="mx-auto w-8 h-8 text-slate-300 mb-3" />
                <p className="text-[13px] text-slate-400 font-medium">No workspaces found. Create your first one to get started.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}