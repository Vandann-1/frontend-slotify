import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  Zap,
  ChevronDown,
  Users,
  BarChart2,
  Settings,
  X,
  Menu,
  AlertTriangle,
} from "lucide-react";

const NAV_LINKS = [
  {
    label: "Product",
    dropdown: [
      { icon: <LayoutDashboard size={15} />, label: "Dashboard", desc: "Manage all your bookings" },
      { icon: <Users size={15} />, label: "Team", desc: "Invite & manage members" },
      { icon: <BarChart2 size={15} />, label: "Analytics", desc: "Track performance metrics" },
      { icon: <Settings size={15} />, label: "Integrations", desc: "Connect your stack" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("access");
  const slug = localStorage.getItem("workspace_slug");

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (["/login", "/register"].includes(location.pathname.toLowerCase())) {
    return null;
  }

  return (
    <>
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={`
          fixed top-0 left-0 right-0 z-40
          transition-all duration-500
          ${scrolled
            ? "bg-[#FBF9F7]/80 backdrop-blur-xl border-b border-stone-200/50 py-2"
            : "bg-white border-b border-transparent py-4"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* ── LOGO (Serif Style) ── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-[#0F172A] flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-slate-900" style={{ fontFamily: "Charter, serif" }}>
              Slotify
            </span>
          </Link>

          {/* ── CENTER NAV ── */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((item) =>
              item.dropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-medium text-slate-600 hover:text-slate-900 hover:bg-stone-100/50 transition-all">
                    {item.label}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${openDropdown === item.label ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                        className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-stone-200/60 p-2 overflow-hidden"
                      >
                        <div className="grid gap-1">
                          {item.dropdown.map((d) => (
                            <button
                              key={d.label}
                              className="w-full flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#FBF9F7] transition-colors group text-left"
                            >
                              <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center text-slate-600 group-hover:bg-white group-hover:shadow-sm transition-all">
                                {d.icon}
                              </div>
                              <div>
                                <div className="text-[14px] font-semibold text-slate-900">{d.label}</div>
                                <div className="text-[12px] text-slate-500 leading-tight">{d.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-4 py-2 rounded-full text-[14px] font-medium text-slate-600 hover:text-slate-900 hover:bg-stone-100/50 transition-all"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex items-center gap-3">
            {!token ? (
              <>
                <Link to="/login" className="hidden md:inline-flex text-[14px] font-medium text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors">
                  Sign in
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#0F172A] text-white text-[14px] font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-slate-200 transition-all"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </>
            ) : (
              <>
                {slug && (
                  <Link to={`/workspace/${slug}`} className="hidden md:flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-stone-200 text-[14px] font-semibold text-slate-600 hover:bg-stone-50 transition-all"
                >
                  <LogOut size={16} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-slate-900">
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Logout Modal Overhaul */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0F172A]/20 backdrop-blur-md"
              onClick={() => setShowLogoutModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-[32px] border border-stone-200 p-8 w-full max-w-sm shadow-[0_30px_100px_rgba(0,0,0,0.15)]"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2" style={{ fontFamily: "Charter, serif" }}>
                Sign out?
              </h2>
              <p className="text-slate-500 text-[15px] mb-8 leading-relaxed">
                You will be signed out of your current workspace and redirected to the login page.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-3.5 rounded-2xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-100"
                >
                  Sign out
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-3.5 rounded-2xl bg-white border border-stone-200 text-slate-600 font-semibold hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}