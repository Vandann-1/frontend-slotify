import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  LogOut,
  Zap,
  ChevronDown,
  BookOpen,
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
      { icon: <LayoutDashboard size={15} />, label: "Dashboard",    desc: "Manage all your bookings"   },
      { icon: <Users size={15} />,           label: "Team",          desc: "Invite & manage members"    },
      { icon: <BarChart2 size={15} />,        label: "Analytics",     desc: "Track performance metrics"  },
      { icon: <Settings size={15} />,         label: "Integrations",  desc: "Connect your stack"         },
    ],
  },
  { label: "Pricing",  href: "/pricing"  },
  { label: "Docs",     href: "/docs"     },
];

export default function Header() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const token = localStorage.getItem("access");
  const slug  = localStorage.getItem("workspace_slug");

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [openDropdown,    setOpenDropdown]    = useState(null);
  const [scrolled,        setScrolled]        = useState(false);
  const [mobileOpen,      setMobileOpen]      = useState(false);

  /* scroll detection for floating effect */
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
      {/* ─────────────────────────────────────────
          HEADER
      ───────────────────────────────────────── */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`
          fixed top-0 left-0 right-0 z-40
          transition-all duration-300
          ${scrolled
            ? "bg-white/90 backdrop-blur-md shadow-[0_1px_24px_rgba(37,99,235,0.08)] border-b border-blue-100"
            : "bg-white border-b border-blue-50"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-8">

          {/* ── LOGO ── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-shadow">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <span className="text-[17px] font-black tracking-tight text-slate-900">
              Slot<span className="text-blue-600">ify</span>
            </span>
          </Link>

          {/* ── CENTER NAV (desktop) ── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) =>
              item.dropdown ? (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    {item.label}
                    <motion.span
                      animate={{ rotate: openDropdown === item.label ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={13} />
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute top-full left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl shadow-blue-100/60 border border-blue-100 p-2 z-50"
                      >
                        {item.dropdown.map((d) => (
                          <button
                            key={d.label}
                            className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors group text-left"
                          >
                            <div className="mt-0.5 w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              {d.icon}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-800">{d.label}</div>
                              <div className="text-xs text-slate-400">{d.desc}</div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex items-center gap-2.5">

            {!token ? (
              <>
                <Link
                  to="/login"
                  className="hidden md:inline-flex items-center px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Sign in
                </Link>

                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: "0 4px 18px rgba(37,99,235,0.3)" }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-200 transition-colors"
                  >
                    <Zap size={13} className="fill-white" />
                    Get Started
                  </motion.button>
                </Link>
              </>
            ) : (
              <>
                {slug && (
                  <Link
                    to={`/workspace/${slug}`}
                    className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <LayoutDashboard size={15} />
                    Dashboard
                  </Link>
                )}

                <motion.button
                  onClick={() => setShowLogoutModal(true)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold px-4 py-2 rounded-xl border border-red-200 transition-colors"
                >
                  <LogOut size={14} />
                  Logout
                </motion.button>
              </>
            )}

            {/* mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-blue-50 text-slate-500 transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* ── MOBILE MENU ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="md:hidden overflow-hidden border-t border-blue-100 bg-white"
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((item) =>
                  item.dropdown ? (
                    <div key={item.label}>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 pt-3 pb-1">
                        {item.label}
                      </p>
                      {item.dropdown.map((d) => (
                        <button
                          key={d.label}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-left"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            {d.icon}
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{d.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  )
                )}

                <div className="border-t border-blue-100 mt-3 pt-3 flex flex-col gap-2">
                  {!token ? (
                    <>
                      <Link to="/login" onClick={() => setMobileOpen(false)}
                        className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 transition-colors">
                        Sign in
                      </Link>
                      <Link to="/register" onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center gap-1.5 bg-blue-600 text-white text-sm font-bold px-4 py-3 rounded-xl">
                        <Zap size={13} className="fill-white" /> Get Started
                      </Link>
                    </>
                  ) : (
                    <>
                      {slug && (
                        <Link to={`/workspace/${slug}`} onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 transition-colors">
                          <LayoutDashboard size={15} /> Dashboard
                        </Link>
                      )}
                      <button onClick={() => { setShowLogoutModal(true); setMobileOpen(false); }}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut size={15} /> Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* spacer so page content isn't hidden under fixed header */}
      <div className="h-16" />

      {/* ─────────────────────────────────────────
          LOGOUT MODAL
      ───────────────────────────────────────── */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setShowLogoutModal(false)}
            />

            {/* modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{   opacity: 0, scale: 0.93, y: 16 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative bg-white rounded-2xl shadow-2xl shadow-blue-100 border border-blue-100 w-full max-w-sm p-6"
            >
              {/* close x */}
              <button
                onClick={() => setShowLogoutModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X size={16} />
              </button>

              {/* icon */}
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                <AlertTriangle size={22} className="text-red-500" />
              </div>

              <h2 className="text-lg font-black text-slate-900 mb-1 tracking-tight">
                Sign out of Slotify?
              </h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                You'll need to sign back in to access your workspace and bookings.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors shadow-md shadow-red-200"
                >
                  <LogOut size={14} />
                  Sign out
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}