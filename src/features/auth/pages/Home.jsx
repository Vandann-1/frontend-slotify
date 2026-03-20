import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, LogOut, Zap, ChevronDown,
  Users, BarChart2, Settings, X, Menu, AlertTriangle,
} from "lucide-react";

/* ─────────────────────────────────────────
   THEME TOKENS
───────────────────────────────────────── */
const T = {
  bg:        "#f0f7ff",
  surface:   "#ffffff",
  surfaceAlt:"#e8f2ff",
  border:    "#c7dff7",
  borderHard:"#93c5fd",
  brand:     "#2563eb",
  brandHover:"#1d4ed8",
  brandLight:"#dbeafe",
  brandMid:  "#bfdbfe",
  text:      "#0c1a3a",
  textSub:   "#3b5e8c",
  textMuted: "#6b8ab0",
  white:     "#ffffff",
  success:   "#059669",
  warning:   "#d97706",
};

/* ─────────────────────────────────────────
   ANIMATION HELPERS
───────────────────────────────────────── */
const fadeUp  = { hidden:{opacity:0,y:36}, show:{opacity:1,y:0,transition:{duration:0.55,ease:"easeOut"}} };
const stagger = { hidden:{}, show:{transition:{staggerChildren:0.1}} };

function Reveal({ children, style={} }) {
  const ref    = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-70px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView?"show":"hidden"} style={style}>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   HEADER DATA
───────────────────────────────────────── */
const NAV_LINKS = [
  {
    label: "Product",
    dropdown: [
      { icon: <LayoutDashboard size={15} />, label:"Dashboard",   desc:"Manage all your bookings"  },
      { icon: <Users size={15} />,           label:"Team",         desc:"Invite & manage members"   },
      { icon: <BarChart2 size={15} />,        label:"Analytics",    desc:"Track performance metrics" },
      { icon: <Settings size={15} />,         label:"Integrations", desc:"Connect your stack"        },
    ],
  },
  { label:"Pricing", href:"#pricing" },
  { label:"Docs",    href:"/docs"    },
];

/* ─────────────────────────────────────────
   PAGE DATA
───────────────────────────────────────── */
const features = [
  { icon:"⚡", title:"Instant Workspace Setup",   desc:"Go from signup to live in under 5 minutes. Configure your slots, branding, and team in one smooth flow." },
  { icon:"🔒", title:"Enterprise-grade Security",  desc:"JWT auth, role-based access, and AES-256 encryption — your data stays private and protected." },
  { icon:"📊", title:"Real-time Analytics",        desc:"Live dashboards reveal booking trends, utilisation rates, and team performance at a glance." },
  { icon:"🔔", title:"Smart Notifications",        desc:"Automated email reminders cut no-shows and keep clients informed without any manual effort." },
  { icon:"🗓️", title:"Calendar Sync",              desc:"Two-way sync with Google Calendar and Outlook so scheduling conflicts are a thing of the past." },
  { icon:"🌐", title:"Public Booking Pages",       desc:"Share a branded link — clients can book directly, no account required on their end." },
];

const steps = [
  { n:"01", col:T.brand,   title:"Create your workspace", desc:"Sign up, name your workspace, and set your availability in under 5 minutes." },
  { n:"02", col:"#0891b2", title:"Invite clients & team", desc:"Share your booking link or add team members with fine-grained role permissions." },
  { n:"03", col:T.success, title:"Manage everything",     desc:"Accept bookings, monitor workloads, and automate reminders from one dashboard." },
];

const testimonials = [
  { name:"Priya Mehta",  role:"Independent Consultant",     av:"PM", col:T.brand,   quote:"Slotify replaced 3 different tools I was juggling. Client onboarding is now fully automated." },
  { name:"Rohan Sharma", role:"Clinic Manager, MedCare",    av:"RS", col:"#0891b2", quote:"Patient scheduling used to take half our admin day. With Slotify it's down to 20 minutes." },
  { name:"Ayesha Khan",  role:"Founder, DesignLab Agency",  av:"AK", col:T.success, quote:"The multi-workspace feature is a game changer. Each client gets their own clean environment." },
  { name:"Dev Patel",    role:"Engineering Lead, Xcelerate", av:"DP", col:T.warning, quote:"We integrated Slotify's API into our internal tools in under a day. Docs are excellent." },
];

const pricing = [
  {
    plan:"Starter", price:"Free", sub:"Forever free", highlight:false,
    features:["1 Workspace","50 bookings / mo","Public booking page","Email notifications","Basic analytics"],
    cta:"Get Started",
  },
  {
    plan:"Pro", price:"₹999", sub:"per month", highlight:true,
    features:["5 Workspaces","Unlimited bookings","Calendar sync","Custom branding","Priority support","Advanced analytics"],
    cta:"Start Free Trial",
  },
  {
    plan:"Enterprise", price:"Custom", sub:"contact us", highlight:false,
    features:["Unlimited workspaces","SSO / SAML","Dedicated support","SLA guarantee","Custom integrations","On-prem option"],
    cta:"Contact Sales",
  },
];

const faqs = [
  { q:"Is Slotify really free to start?",           a:"Yes — the Starter plan is free forever, no card required. You get 1 workspace and 50 bookings/month." },
  { q:"How does workspace isolation work?",          a:"Each workspace has its own team, booking pages, availability rules, and analytics." },
  { q:"Can I embed the booking widget on my site?",  a:"Every workspace generates an iframe snippet and a shareable public booking link." },
  { q:"Is my data secure?",                          a:"AES-256 encryption at rest, TLS in transit, JWT auth, and SOC 2 Type II audit in progress." },
  { q:"What integrations do you support?",           a:"Google Calendar, Outlook, Slack, Zapier, Stripe, Zoom, and a full REST API with webhooks on Pro+." },
];

/* Real brand SVG paths from simpleicons.org */
const integrations = [
  {
    name:"Google Calendar", iconColor:"#4285F4", bubbleBg:"#EAF0FB",
    viewBox:"0 0 24 24",
    path:"M18.316 5.684H24v12.632h-5.684v-2.21h3.79v-8.21h-3.79V5.684zM0 18.316V5.684h5.684v2.21H1.895v8.21h3.789v2.211H0zm6.316-14.58h11.368v2.264H6.316V3.737zm0 16.526v-2.263h11.368v2.263H6.316zM6.316 9.79h11.368v4.42H6.316V9.79zm2.21 2.21v.001h6.948V12H8.526z",
  },
  {
    name:"Outlook", iconColor:"#0078D4", bubbleBg:"#E5F2FB",
    viewBox:"0 0 24 24",
    path:"M24 7.387v10.478c0 .23-.09.44-.255.6a.844.844 0 0 1-.606.247h-9.954v-5.523l1.701 1.29a.848.848 0 0 0 1.03-.004L24 7.387zM13.185 12.45V18.71H.86a.844.844 0 0 1-.606-.247A.848.848 0 0 1 0 17.865V7.387l7.08 6.072a.85.85 0 0 0 1.031.004l5.074-3.854v3.841zM23.17 6.288H.83L12 15.24 23.17 6.288z",
  },
  {
    name:"Slack", iconColor:"#4A154B", bubbleBg:"#F4EEF4",
    viewBox:"0 0 24 24",
    path:"M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z",
  },
  {
    name:"Zapier", iconColor:"#FF4A00", bubbleBg:"#FFF0EB",
    viewBox:"0 0 24 24",
    path:"M13.559 11.998L13.56 12l-.001.002h.001v-.004zm.001.002l6.074 6.072-1.413 1.414-6.072-6.074-.149.588-1.371 5.425H8.37l1.37-5.426.149-.587-6.072 6.075L2.403 18.07l6.075-6.073-.587-.149-5.426-1.37V8.63l5.426 1.37.588.149L2.403 4.077 3.818 2.663l6.072 6.075.149-.588L11.408.725h2.258l-1.37 5.426-.15.587 6.072-6.075 1.415 1.414-6.073 6.072.587.149 5.426 1.37v2.257l-5.426-1.37-.587-.15z",
  },
  {
    name:"Stripe", iconColor:"#635BFF", bubbleBg:"#EEEEFF",
    viewBox:"0 0 24 24",
    path:"M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z",
  },
  {
    name:"Zoom", iconColor:"#2D8CFF", bubbleBg:"#E8F3FF",
    viewBox:"0 0 24 24",
    path:"M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-5.5-4.5h-8A2.5 2.5 0 0 0 8 10v5.5h8a2.5 2.5 0 0 0 2.5-2.5V7.5zM5.5 9v6l3-1.8V10.8L5.5 9z",
  },
  {
    name:"Notion", iconColor:"#000000", bubbleBg:"#F5F5F5",
    viewBox:"0 0 24 24",
    path:"M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933z",
  },
  {
    name:"Google Meet", iconColor:"#00BFA5", bubbleBg:"#E0F7F4",
    viewBox:"0 0 24 24",
    path:"M22.58 11.99C22.58 11.07 22.5 10.18 22.36 9.32H12V14.03H17.96C17.7 15.38 16.95 16.52 15.82 17.29V20.3H19.36C21.4 18.42 22.58 15.46 22.58 11.99ZM12 23.22C15.01 23.22 17.54 22.23 19.37 20.3L15.83 17.29C14.84 17.95 13.56 18.34 12 18.34C9.12 18.34 6.68 16.45 5.81 13.84H2.15V16.94C3.97 20.57 7.72 23.22 12 23.22ZM5.81 13.84C5.59 13.18 5.46 12.47 5.46 11.74C5.46 11.01 5.59 10.3 5.81 9.64V6.54H2.15C1.41 8.01 1 9.63 1 11.74C1 13.85 1.41 15.47 2.15 16.94L5.81 13.84ZM12 5.14C13.73 5.14 15.28 5.74 16.5 6.9L19.43 3.97C17.54 2.2 15.01 1.14 12 1.14C7.72 1.14 3.97 3.79 2.15 7.42L5.81 10.52C6.68 7.91 9.12 5.14 12 5.14Z",
  },
];

/* ══════════════════════════════════════════════════
   HEADER COMPONENT (embedded — home page only)
══════════════════════════════════════════════════ */
function Header({ onDemoClick }) {
  const navigate       = useNavigate();
  const token          = localStorage.getItem("access");
  const slug           = localStorage.getItem("workspace_slug");
  const [scrolled,     setScrolled]     = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [showLogout,   setShowLogout]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  return (
    <>
      <motion.header
        initial={{ y:-20, opacity:0 }}
        animate={{ y:0,   opacity:1 }}
        transition={{ duration:0.5, ease:"easeOut" }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-md shadow-[0_1px_24px_rgba(37,99,235,0.08)] border-b border-blue-100"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between gap-8">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-shadow">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <span className="text-[17px] font-black tracking-tight text-slate-900">
              Slot<span className="text-blue-600">ify</span>
            </span>
          </Link>

          {/* CENTER NAV */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((item) =>
              item.dropdown ? (
                <div key={item.label} className="relative"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                    {item.label}
                    <motion.span animate={{ rotate: openDropdown === item.label ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={13} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity:0, y:8, scale:0.97 }}
                        animate={{ opacity:1, y:0, scale:1 }}
                        exit={{ opacity:0, y:6, scale:0.97 }}
                        transition={{ duration:0.18 }}
                        className="absolute top-full left-0 mt-2 w-60 bg-white rounded-2xl shadow-xl shadow-blue-100/60 border border-blue-100 p-2 z-50"
                      >
                        {item.dropdown.map((d) => (
                          <button key={d.label} className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors group text-left">
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
                <Link key={item.label} to={item.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-2.5">
            {!token ? (
              <>
                <Link to="/login" className="hidden md:inline-flex items-center px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  Sign in
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale:1.04, boxShadow:"0 4px 18px rgba(37,99,235,0.3)" }}
                    whileTap={{ scale:0.97 }}
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-md shadow-blue-200 transition-colors"
                  >
                    <Zap size={13} className="fill-white" />
                    Get Started
                  </motion.button>
                </Link>
                <motion.button
                  onClick={onDemoClick}
                  whileHover={{ scale:1.04 }}
                  whileTap={{ scale:0.97 }}
                  className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-blue-600 border border-blue-200 hover:bg-blue-50 rounded-xl transition-colors"
                >
                  ▶ Demo
                </motion.button>
              </>
            ) : (
              <>
                {slug && (
                  <Link to={`/workspace/${slug}`}
                    className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                )}
                <motion.button
                  onClick={() => setShowLogout(true)}
                  whileHover={{ scale:1.04 }}
                  whileTap={{ scale:0.97 }}
                  className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold px-4 py-2 rounded-xl border border-red-200 transition-colors"
                >
                  <LogOut size={14} /> Logout
                </motion.button>
              </>
            )}

            {/* Mobile toggle */}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-blue-50 text-slate-500 transition-colors">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity:0, height:0 }}
              animate={{ opacity:1, height:"auto" }}
              exit={{ opacity:0, height:0 }}
              transition={{ duration:0.22 }}
              className="md:hidden overflow-hidden border-t border-blue-100 bg-white"
            >
              <div className="px-5 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((item) =>
                  item.dropdown ? (
                    <div key={item.label}>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2 pt-3 pb-1">{item.label}</p>
                      {item.dropdown.map((d) => (
                        <button key={d.label} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-left">
                          <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">{d.icon}</div>
                          <span className="text-sm font-semibold text-slate-700">{d.label}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <Link key={item.label} to={item.href} onClick={() => setMobileOpen(false)}
                      className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      {item.label}
                    </Link>
                  )
                )}
                <div className="border-t border-blue-100 mt-3 pt-3 flex flex-col gap-2">
                  {!token ? (
                    <>
                      <Link to="/login" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 transition-colors">Sign in</Link>
                      <Link to="/register" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-1.5 bg-blue-600 text-white text-sm font-bold px-4 py-3 rounded-xl">
                        <Zap size={13} className="fill-white" /> Get Started
                      </Link>
                    </>
                  ) : (
                    <>
                      {slug && (
                        <Link to={`/workspace/${slug}`} onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 transition-colors">
                          <LayoutDashboard size={15} /> Dashboard
                        </Link>
                      )}
                      <button onClick={() => { setShowLogout(true); setMobileOpen(false); }}
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

      {/* LOGOUT MODAL */}
      <AnimatePresence>
        {showLogout && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setShowLogout(false)} />
            <motion.div
              initial={{ opacity:0, scale:0.93, y:16 }}
              animate={{ opacity:1, scale:1,    y:0  }}
              exit={{   opacity:0, scale:0.93, y:16 }}
              transition={{ duration:0.22, ease:"easeOut" }}
              className="relative bg-white rounded-2xl shadow-2xl shadow-blue-100 border border-blue-100 w-full max-w-sm p-6"
            >
              <button onClick={() => setShowLogout(false)} className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X size={16} />
              </button>
              <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
                <AlertTriangle size={22} className="text-red-500" />
              </div>
              <h2 className="text-lg font-black text-slate-900 mb-1 tracking-tight">Sign out of Slotify?</h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">You'll need to sign back in to access your workspace and bookings.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogout(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <motion.button onClick={handleLogout} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-colors shadow-md shadow-red-200">
                  <LogOut size={14} /> Sign out
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════ */
export default function Home() {
  const [openDemo, setOpenDemo] = useState(false);
  const [openFaq,  setOpenFaq]  = useState(null);

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:T.bg, color:T.text }}>

      {/* Header — home page only */}
      <Header onDemoClick={() => setOpenDemo(true)} />

      {/* spacer for fixed header */}
      <div style={{ height:64 }} />

      <main>

        {/* ════════════════════ HERO ════════════════════ */}
        <section style={{
          background:"linear-gradient(160deg, #dbeafe 0%, #eff6ff 40%, #e0f2fe 100%)",
          borderBottom:`1px solid ${T.border}`,
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:-120, right:-120, width:500, height:500,
            background:"radial-gradient(circle, rgba(37,99,235,0.1) 0%, transparent 70%)",
            borderRadius:"50%", pointerEvents:"none" }} />
          <div style={{ position:"absolute", bottom:-80, left:-80, width:360, height:360,
            background:"radial-gradient(circle, rgba(8,145,178,0.08) 0%, transparent 70%)",
            borderRadius:"50%", pointerEvents:"none" }} />

          <div style={{ maxWidth:1160, margin:"0 auto", padding:"96px 24px 104px", position:"relative" }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>

              {/* LEFT */}
              <motion.div initial={{opacity:0,y:48}} animate={{opacity:1,y:0}} transition={{duration:0.65}}>
                <motion.span whileHover={{scale:1.04}} style={{
                  display:"inline-flex", alignItems:"center", gap:8,
                  background:T.white, border:`1.5px solid ${T.borderHard}`,
                  color:T.brand, padding:"6px 16px", borderRadius:999,
                  fontSize:13, fontWeight:700, marginBottom:22,
                  boxShadow:"0 2px 8px rgba(37,99,235,0.1)",
                }}>
                  <span style={{width:7,height:7,borderRadius:"50%",background:T.brand,display:"inline-block"}}/>
                  Slotify — Workspace &amp; Booking Platform
                </motion.span>

                <h1 style={{ fontSize:50, fontWeight:900, lineHeight:1.12, color:T.text, marginBottom:22, letterSpacing:"-1.5px" }}>
                  The smarter way to<br />
                  <span style={{color:T.brand}}>manage bookings</span><br />
                  &amp; run your workspace
                </h1>

                <p style={{ color:T.textSub, fontSize:17, lineHeight:1.8, marginBottom:36, maxWidth:460 }}>
                  Slotify centralises scheduling, team management, and client workflows in one
                  clean platform — built for professionals who demand speed and scale.
                </p>

                <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                  <Link to="/Register">
                    <motion.button
                      whileHover={{scale:1.05,boxShadow:`0 6px 24px rgba(37,99,235,0.35)`}}
                      whileTap={{scale:0.97}}
                      style={{ background:T.brand, color:T.white, padding:"13px 28px", borderRadius:10, fontWeight:700, fontSize:15, border:"none", cursor:"pointer", boxShadow:`0 2px 12px rgba(37,99,235,0.2)` }}>
                      Start Free — No Card Needed
                    </motion.button>
                  </Link>
                  <motion.button
                    onClick={() => setOpenDemo(true)}
                    whileHover={{scale:1.05, background:T.brandLight}}
                    whileTap={{scale:0.97}}
                    style={{ background:T.white, color:T.brand, padding:"13px 28px", borderRadius:10, fontWeight:700, fontSize:15, border:`1.5px solid ${T.borderHard}`, cursor:"pointer" }}>
                    ▶ Watch Demo
                  </motion.button>
                </div>

                <div style={{ display:"flex", gap:24, marginTop:36, flexWrap:"wrap" }}>
                  {["Free plan available","No setup fees","Cancel anytime"].map(t=>(
                    <span key={t} style={{ display:"flex", alignItems:"center", gap:6, color:T.textMuted, fontSize:13 }}>
                      <span style={{color:T.success,fontWeight:700}}>✓</span> {t}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* RIGHT — DASHBOARD MOCKUP */}
              <motion.div initial={{opacity:0,x:56}} animate={{opacity:1,x:0}} transition={{duration:0.75}} style={{position:"relative"}}>
                <motion.div animate={{y:[0,-10,0]}} transition={{duration:3.5,repeat:Infinity}}
                  style={{ position:"absolute", top:-18, left:-18, zIndex:10, background:T.white, borderRadius:14, padding:"10px 16px", boxShadow:"0 8px 28px rgba(37,99,235,0.12)", display:"flex", alignItems:"center", gap:10, fontSize:13, fontWeight:600, border:`1.5px solid ${T.border}` }}>
                  <span style={{color:T.success,fontSize:18}}>●</span>
                  <div>
                    <div style={{color:T.text}}>New Booking</div>
                    <div style={{color:T.textMuted,fontWeight:400}}>Just now</div>
                  </div>
                </motion.div>

                <div style={{ background:T.white, borderRadius:20, boxShadow:"0 20px 60px rgba(37,99,235,0.12)", overflow:"hidden", border:`1.5px solid ${T.border}` }}>
                  <div style={{ background:T.surfaceAlt, padding:"13px 20px", display:"flex", alignItems:"center", gap:8, borderBottom:`1px solid ${T.border}` }}>
                    {["#ef4444","#f59e0b","#22c55e"].map(c=>(
                      <div key={c} style={{width:10,height:10,borderRadius:"50%",background:c}}/>
                    ))}
                    <div style={{ marginLeft:10, background:T.white, borderRadius:6, padding:"4px 14px", fontSize:12, color:T.textMuted, flex:1, maxWidth:200, border:`1px solid ${T.border}` }}>
                      app.slotify.in/dashboard
                    </div>
                  </div>
                  <div style={{padding:24}}>
                    <div style={{color:T.text,fontWeight:800,fontSize:15,marginBottom:18}}>Today's Overview</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
                      {[
                        {label:"Bookings",val:"24",delta:"+12%",col:T.brand},
                        {label:"Clients", val:"8", delta:"+3",  col:"#0891b2"},
                        {label:"Revenue", val:"₹18k",delta:"+22%",col:T.success},
                      ].map(s=>(
                        <div key={s.label} style={{ background:T.surfaceAlt, borderRadius:10, padding:"14px 12px", border:`1px solid ${T.border}` }}>
                          <div style={{color:T.textMuted,fontSize:11,marginBottom:4}}>{s.label}</div>
                          <div style={{color:s.col,fontWeight:900,fontSize:22}}>{s.val}</div>
                          <div style={{color:T.success,fontSize:11,fontWeight:600}}>{s.delta}</div>
                        </div>
                      ))}
                    </div>
                    {[
                      {name:"Client Booking — Priya M.",  status:"Confirmed",   sc:T.success, bg:"#f0fdf4"},
                      {name:"Workspace — Team Sprint",    status:"In Progress", sc:T.brand,   bg:"#eff6ff"},
                      {name:"Demo Call — Rohan S.",       status:"Upcoming",    sc:T.warning, bg:"#fffbeb"},
                    ].map((item,i)=>(
                      <motion.div key={i} whileHover={{x:4}} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:item.bg, borderRadius:8, padding:"10px 14px", marginBottom:8, cursor:"default", border:`1px solid ${item.sc}20` }}>
                        <span style={{color:T.text,fontSize:13}}>{item.name}</span>
                        <span style={{ color:item.sc, fontSize:11, fontWeight:700, background:item.sc+"18", padding:"3px 10px", borderRadius:999 }}>{item.status}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div animate={{y:[0,10,0]}} transition={{duration:4,repeat:Infinity}}
                  style={{ position:"absolute", bottom:-18, right:-18, zIndex:10, background:T.brand, borderRadius:12, padding:"12px 18px", boxShadow:`0 8px 24px rgba(37,99,235,0.3)`, color:T.white, fontSize:13, fontWeight:700 }}>
                  3 Active Workspaces 🚀
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ════════════════════ LOGO STRIP ════════════════════ */}
        <section style={{ background:T.white, borderBottom:`1px solid ${T.border}`, padding:"26px 24px" }}>
          <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center" }}>
            <p style={{ color:T.textMuted, fontSize:12, fontWeight:700, letterSpacing:2, textTransform:"uppercase", marginBottom:18 }}>
              Trusted by professionals in
            </p>
            <div style={{ display:"flex", justifyContent:"center", flexWrap:"wrap", gap:36 }}>
              {["Freelancers","Healthcare","Education","Agencies","Consulting","Startups"].map(t=>(
                <span key={t} style={{color:T.textSub,fontWeight:700,fontSize:14}}>{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ════════════════════ PROBLEM → SOLUTION ════════════════════ */}
        <section style={{ background:T.bg, padding:"96px 24px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <Reveal>
              <motion.div variants={fadeUp} style={{ textAlign:"center", marginBottom:56 }}>
                <span style={{ background:T.brandLight, color:T.brand, padding:"5px 16px", borderRadius:999, fontSize:13, fontWeight:700 }}>The Problem</span>
                <h2 style={{ fontSize:38, fontWeight:900, color:T.text, margin:"16px 0 14px", letterSpacing:"-0.5px" }}>
                  Scheduling is still broken for most teams
                </h2>
                <p style={{ color:T.textSub, fontSize:17, maxWidth:580, margin:"0 auto" }}>
                  Juggling spreadsheets, WhatsApp, and 3 different tools just to manage a meeting costs hours every week.
                </p>
              </motion.div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 52px 1fr", gap:24, alignItems:"center" }}>
                <motion.div variants={fadeUp} style={{ background:T.white, border:"1.5px solid #fecaca", borderRadius:16, padding:32, boxShadow:"0 4px 20px rgba(239,68,68,0.06)" }}>
                  <div style={{color:"#dc2626",fontWeight:800,marginBottom:18,fontSize:14}}>❌ Without Slotify</div>
                  {["Bookings scattered across WhatsApp & email","Double-bookings and missed appointments","Manual reminders eating up hours","Zero visibility into team workload","Copy-pasting data between 4 tools"].map(t=>(
                    <div key={t} style={{display:"flex",gap:10,marginBottom:10,fontSize:14}}>
                      <span style={{color:"#fca5a5"}}>✕</span>
                      <span style={{color:T.textSub}}>{t}</span>
                    </div>
                  ))}
                </motion.div>

                <motion.div variants={fadeUp} style={{ fontSize:22, color:T.brand, fontWeight:900, background:T.brandLight, borderRadius:"50%", width:52, height:52, display:"flex", alignItems:"center", justifyContent:"center", border:`1.5px solid ${T.borderHard}`, flexShrink:0 }}>→</motion.div>

                <motion.div variants={fadeUp} style={{ background:T.white, border:"1.5px solid #bbf7d0", borderRadius:16, padding:32, boxShadow:"0 4px 20px rgba(5,150,105,0.06)" }}>
                  <div style={{color:T.success,fontWeight:800,marginBottom:18,fontSize:14}}>✅ With Slotify</div>
                  {["All bookings in one unified dashboard","Automated conflict detection","Smart reminders — zero manual effort","Real-time workload analytics","One platform replaces them all"].map(t=>(
                    <div key={t} style={{display:"flex",gap:10,marginBottom:10,fontSize:14}}>
                      <span style={{color:"#6ee7b7"}}>✓</span>
                      <span style={{color:T.textSub}}>{t}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════ FEATURES ════════════════════ */}
        <section style={{ background:T.white, padding:"96px 24px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <Reveal>
              <motion.div variants={fadeUp} style={{textAlign:"center",marginBottom:60}}>
                <h2 style={{fontSize:38,fontWeight:900,color:T.text,marginBottom:14,letterSpacing:"-0.5px"}}>Everything you need to scale</h2>
                <p style={{color:T.textSub,fontSize:17}}>Slotify ships with every tool modern teams depend on — out of the box.</p>
              </motion.div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:22}}>
                {features.map(f=>(
                  <motion.div key={f.title} variants={fadeUp}
                    whileHover={{y:-6,boxShadow:`0 16px 40px rgba(37,99,235,0.1)`,borderColor:T.borderHard}}
                    style={{ background:T.bg, border:`1.5px solid ${T.border}`, borderRadius:16, padding:30, cursor:"default", transition:"box-shadow 0.2s, border-color 0.2s" }}>
                    <div style={{fontSize:34,marginBottom:14}}>{f.icon}</div>
                    <h3 style={{fontWeight:800,fontSize:17,color:T.text,marginBottom:8}}>{f.title}</h3>
                    <p style={{color:T.textSub,lineHeight:1.75,fontSize:14}}>{f.desc}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════ HOW IT WORKS ════════════════════ */}
        <section style={{ background:T.surfaceAlt, borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`, padding:"96px 24px" }}>
          <div style={{maxWidth:960,margin:"0 auto"}}>
            <Reveal>
              <motion.div variants={fadeUp} style={{textAlign:"center",marginBottom:60}}>
                <h2 style={{fontSize:38,fontWeight:900,color:T.text,marginBottom:14,letterSpacing:"-0.5px"}}>Up and running in 3 steps</h2>
                <p style={{color:T.textSub,fontSize:17}}>No engineers required. No lengthy onboarding.</p>
              </motion.div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:22}}>
                {steps.map(s=>(
                  <motion.div key={s.n} variants={fadeUp}
                    style={{ background:T.white, borderRadius:16, padding:32, border:`1.5px solid ${T.border}`, position:"relative", overflow:"hidden", boxShadow:"0 2px 12px rgba(37,99,235,0.05)" }}>
                    <div style={{ position:"absolute", top:-8, right:8, fontSize:72, fontWeight:900, color:s.col+"14", lineHeight:1, userSelect:"none" }}>{s.n}</div>
                    <div style={{ width:38, height:38, borderRadius:10, background:s.col+"18", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14, color:s.col, marginBottom:16, border:`1.5px solid ${s.col}30` }}>{s.n}</div>
                    <h4 style={{color:T.text,fontWeight:800,fontSize:16,marginBottom:10}}>{s.title}</h4>
                    <p style={{color:T.textSub,fontSize:14,lineHeight:1.75}}>{s.desc}</p>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════ FEATURE — BOOKING MGMT ════════════════════ */}
        <section style={{background:T.white,padding:"96px 24px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <Reveal>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
                <motion.div variants={fadeUp} style={{ background:"linear-gradient(135deg,#dbeafe,#e0f2fe)", borderRadius:20, padding:32, border:`1.5px solid ${T.borderHard}` }}>
                  <div style={{background:T.white,borderRadius:14,padding:24,boxShadow:"0 4px 20px rgba(37,99,235,0.08)"}}>
                    <div style={{fontWeight:800,color:T.text,marginBottom:16,fontSize:14}}>Booking Management</div>
                    {[
                      {label:"Morning Consultation — Dr. Priya",time:"9:00 AM", col:T.brand},
                      {label:"Product Demo — Rohan & Co.",       time:"11:30 AM",col:"#0891b2"},
                      {label:"Sprint Planning — Dev Team",       time:"2:00 PM", col:T.success},
                      {label:"Client Review — Zara Pvt Ltd",     time:"4:30 PM", col:T.warning},
                    ].map((item,i)=>(
                      <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", borderRadius:8, marginBottom:8, background:item.col+"0d", borderLeft:`3px solid ${item.col}`, border:`1px solid ${item.col}20`, borderLeftWidth:3 }}>
                        <span style={{color:T.textSub,fontSize:13}}>{item.label}</span>
                        <span style={{color:item.col,fontWeight:700,fontSize:12}}>{item.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <span style={{color:T.brand,fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:1.5}}>Booking Management</span>
                  <h2 style={{fontSize:34,fontWeight:900,color:T.text,margin:"12px 0 16px",letterSpacing:"-0.5px"}}>Manage all bookings in one place</h2>
                  <p style={{color:T.textSub,fontSize:15,lineHeight:1.8,marginBottom:28}}>View, create, and manage appointments across multiple workspaces. Complete visibility and control — no more missed slots.</p>
                  {["Real-time booking updates","Multi-workspace management","Full appointment history","Easy creation and editing"].map(f=>(
                    <div key={f} style={{display:"flex",gap:10,marginBottom:12,alignItems:"center"}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:T.brandLight,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:`1px solid ${T.borderHard}`}}>
                        <span style={{color:T.brand,fontSize:11,fontWeight:800}}>✓</span>
                      </div>
                      <span style={{color:T.textSub,fontSize:14}}>{f}</span>
                    </div>
                  ))}
                </motion.div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════ FEATURE — TEAM COLLAB ════════════════════ */}
        <section style={{background:T.bg,padding:"96px 24px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <Reveal>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:80,alignItems:"center"}}>
                <motion.div variants={fadeUp}>
                  <span style={{color:"#0891b2",fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:1.5}}>Team Collaboration</span>
                  <h2 style={{fontSize:34,fontWeight:900,color:T.text,margin:"12px 0 16px",letterSpacing:"-0.5px"}}>Collaborate with your team and clients</h2>
                  <p style={{color:T.textSub,fontSize:15,lineHeight:1.8,marginBottom:28}}>Assign bookings, set permissions, and keep everyone aligned — without endless back-and-forth in chat threads.</p>
                  {["Role-based access control","Assign bookings to teammates","Client portal visibility","Team workload analytics"].map(f=>(
                    <div key={f} style={{display:"flex",gap:10,marginBottom:12,alignItems:"center"}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:"#e0f2fe",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,border:"1px solid #7dd3fc"}}>
                        <span style={{color:"#0891b2",fontSize:11,fontWeight:800}}>✓</span>
                      </div>
                      <span style={{color:T.textSub,fontSize:14}}>{f}</span>
                    </div>
                  ))}
                </motion.div>
                <motion.div variants={fadeUp} style={{ background:"linear-gradient(135deg,#e0f2fe,#dbeafe)", borderRadius:20, padding:32, border:"1.5px solid #7dd3fc" }}>
                  <div style={{background:T.white,borderRadius:14,padding:24,boxShadow:"0 4px 20px rgba(8,145,178,0.08)"}}>
                    <div style={{fontWeight:800,color:T.text,marginBottom:16,fontSize:14}}>Team Overview</div>
                    {[
                      {name:"Priya M.", role:"Lead Consultant",bookings:12,col:T.brand},
                      {name:"Rohan S.", role:"Account Manager",bookings:8, col:"#0891b2"},
                      {name:"Ayesha K.",role:"Designer",       bookings:5, col:T.success},
                      {name:"Dev P.",   role:"Developer",      bookings:9, col:T.warning},
                    ].map((m,i)=>(
                      <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
                        <div style={{ width:36, height:36, borderRadius:"50%", background:m.col+"1a", color:m.col, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:12, flexShrink:0, border:`1.5px solid ${m.col}30` }}>
                          {m.name.split(" ").map(n=>n[0]).join("")}
                        </div>
                        <div style={{flex:1}}>
                          <div style={{color:T.text,fontWeight:700,fontSize:13}}>{m.name}</div>
                          <div style={{color:T.textMuted,fontSize:11}}>{m.role}</div>
                        </div>
                        <div style={{ background:m.col+"15", color:m.col, padding:"3px 10px", borderRadius:999, fontSize:11, fontWeight:800, border:`1px solid ${m.col}25` }}>
                          {m.bookings} bookings
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════ INTEGRATIONS ════════════════════ */}
        <section style={{background:T.white,borderTop:`1px solid ${T.border}`,borderBottom:`1px solid ${T.border}`,padding:"96px 24px"}}>
          <div style={{maxWidth:900,margin:"0 auto",textAlign:"center"}}>
            <Reveal>
              <motion.div variants={fadeUp}>
                <span style={{ background:T.brandLight, color:T.brand, padding:"5px 16px", borderRadius:999, fontSize:13, fontWeight:700, display:"inline-block", marginBottom:20 }}>Integrations</span>
                <h2 style={{fontSize:38,fontWeight:900,color:T.text,marginBottom:14,letterSpacing:"-0.5px"}}>Connects with tools you already use</h2>
                <p style={{color:T.textSub,fontSize:17,marginBottom:52}}>Native integrations with your existing stack — no code required.</p>
              </motion.div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
                {integrations.map(i=>(
                  <motion.div key={i.name} variants={fadeUp}
                    whileHover={{ y:-6, boxShadow:`0 16px 40px ${i.iconColor}25`, borderColor:i.iconColor+"55" }}
                    style={{ background:T.white, borderRadius:16, padding:"28px 16px 22px", border:`1.5px solid ${T.border}`, display:"flex", flexDirection:"column", alignItems:"center", gap:14, cursor:"default", position:"relative", overflow:"hidden" }}>
                    <div style={{ width:56, height:56, borderRadius:14, background:i.bubbleBg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <svg viewBox={i.viewBox} width="28" height="28" fill={i.iconColor} xmlns="http://www.w3.org/2000/svg">
                        <path d={i.path} />
                      </svg>
                    </div>
                    <span style={{color:T.text,fontSize:13,fontWeight:700,lineHeight:1.3}}>{i.name}</span>
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:`linear-gradient(90deg, transparent, ${i.iconColor}70, transparent)`, borderRadius:"0 0 14px 14px" }} />
                  </motion.div>
                ))}
              </div>
              <motion.div variants={fadeUp} style={{marginTop:44}}>
                <p style={{color:T.textMuted,fontSize:14}}>
                  And thousands more via <span style={{color:T.brand,fontWeight:700}}>Zapier</span> or the <span style={{color:T.brand,fontWeight:700}}>Slotify REST API</span>.
                </p>
              </motion.div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════ METRICS ════════════════════ */}
        <section style={{ background:"linear-gradient(135deg, #2563eb 0%, #1d4ed8 50%, #0891b2 100%)", padding:"72px 24px" }}>
          <div style={{maxWidth:900,margin:"0 auto"}}>
            <Reveal>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:32,textAlign:"center"}}>
                {[
                  {val:"500+", label:"Bookings managed"},
                  {val:"100+", label:"Teams onboarded"},
                  {val:"99.9%",label:"Uptime SLA"},
                  {val:"4.9★", label:"Average rating"},
                ].map(m=>(
                  <motion.div key={m.label} variants={fadeUp}>
                    <div style={{fontSize:42,fontWeight:900,color:T.white,lineHeight:1}}>{m.val}</div>
                    <div style={{color:"#bfdbfe",fontSize:14,marginTop:8}}>{m.label}</div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════ TESTIMONIALS ════════════════════ */}
        <section style={{background:T.bg,padding:"96px 24px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <Reveal>
              <motion.div variants={fadeUp} style={{textAlign:"center",marginBottom:56}}>
                <h2 style={{fontSize:38,fontWeight:900,color:T.text,marginBottom:14,letterSpacing:"-0.5px"}}>Loved by professionals</h2>
                <p style={{color:T.textSub,fontSize:17}}>Real results from real Slotify users.</p>
              </motion.div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:22}}>
                {testimonials.map(t=>(
                  <motion.div key={t.name} variants={fadeUp}
                    whileHover={{y:-4,boxShadow:`0 16px 40px rgba(37,99,235,0.1)`}}
                    style={{ background:T.white, borderRadius:16, padding:30, border:`1.5px solid ${T.border}`, boxShadow:"0 2px 10px rgba(37,99,235,0.04)" }}>
                    <div style={{color:T.warning,fontSize:16,marginBottom:14}}>★★★★★</div>
                    <p style={{color:T.textSub,lineHeight:1.8,fontSize:15,marginBottom:22,fontStyle:"italic"}}>"{t.quote}"</p>
                    <div style={{display:"flex",alignItems:"center",gap:12}}>
                      <div style={{ width:40,height:40,borderRadius:"50%",background:t.col+"18",color:t.col,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:13,border:`1.5px solid ${t.col}30` }}>{t.av}</div>
                      <div>
                        <div style={{fontWeight:800,color:T.text,fontSize:14}}>{t.name}</div>
                        <div style={{color:T.textMuted,fontSize:12}}>{t.role}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════ PRICING ════════════════════ */}
        <section id="pricing" style={{background:T.white,padding:"96px 24px"}}>
          <div style={{maxWidth:1060,margin:"0 auto"}}>
            <Reveal>
              <motion.div variants={fadeUp} style={{textAlign:"center",marginBottom:56}}>
                <h2 style={{fontSize:38,fontWeight:900,color:T.text,marginBottom:14,letterSpacing:"-0.5px"}}>Simple, transparent pricing</h2>
                <p style={{color:T.textSub,fontSize:17}}>Start free. Upgrade when you need more. No hidden fees.</p>
              </motion.div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:22}}>
                {pricing.map(p=>(
                  <motion.div key={p.plan} variants={fadeUp}
                    whileHover={{y:-6,boxShadow:`0 20px 50px rgba(37,99,235,0.14)`}}
                    style={{ background: p.highlight ? "linear-gradient(160deg,#1d4ed8 0%,#2563eb 100%)" : T.white, borderRadius:20, padding:34, border: p.highlight?"none":`1.5px solid ${T.border}`, boxShadow: p.highlight ? "0 20px 50px rgba(37,99,235,0.2)" : "0 2px 10px rgba(37,99,235,0.04)", position:"relative" }}>
                    {p.highlight && (
                      <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:T.white, color:T.brand, padding:"4px 16px", borderRadius:999, fontSize:12, fontWeight:800, whiteSpace:"nowrap", boxShadow:"0 2px 12px rgba(37,99,235,0.2)", border:`1.5px solid ${T.brandMid}` }}>Most Popular</div>
                    )}
                    <div style={{color:p.highlight?"#bfdbfe":T.textMuted,fontWeight:800,fontSize:12,marginBottom:12,textTransform:"uppercase",letterSpacing:1.5}}>{p.plan}</div>
                    <div style={{fontSize:42,fontWeight:900,color:p.highlight?T.white:T.text,lineHeight:1,marginBottom:4}}>{p.price}</div>
                    <div style={{color:p.highlight?"#93c5fd":T.textMuted,fontSize:13,marginBottom:28}}>{p.sub}</div>
                    <div style={{borderTop:`1px solid ${p.highlight?"rgba(255,255,255,0.15)":T.border}`,paddingTop:24,marginBottom:28}}>
                      {p.features.map(f=>(
                        <div key={f} style={{display:"flex",gap:10,marginBottom:12,alignItems:"center"}}>
                          <span style={{color:p.highlight?"#86efac":T.success,fontSize:13}}>✓</span>
                          <span style={{color:p.highlight?"#bfdbfe":T.textSub,fontSize:14}}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/Register">
                      <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}}
                        style={{ width:"100%", padding:"13px 0", borderRadius:10, fontWeight:800, fontSize:14, cursor:"pointer", border: p.highlight?"none":`1.5px solid ${T.border}`, background: p.highlight?T.white:T.surfaceAlt, color: p.highlight?T.brand:T.text, boxShadow: p.highlight?`0 4px 16px rgba(255,255,255,0.2)`:"none" }}>
                        {p.cta}
                      </motion.button>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════ FAQ ════════════════════ */}
        <section style={{background:T.bg,padding:"96px 24px"}}>
          <div style={{maxWidth:700,margin:"0 auto"}}>
            <Reveal>
              <motion.div variants={fadeUp} style={{textAlign:"center",marginBottom:52}}>
                <h2 style={{fontSize:38,fontWeight:900,color:T.text,marginBottom:14,letterSpacing:"-0.5px"}}>Frequently asked questions</h2>
              </motion.div>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {faqs.map((f,i)=>(
                  <motion.div key={i} variants={fadeUp}
                    style={{ background:T.white, borderRadius:12, border:`1.5px solid ${openFaq===i?T.borderHard:T.border}`, overflow:"hidden" }}>
                    <button onClick={()=>setOpenFaq(openFaq===i?null:i)}
                      style={{ width:"100%", textAlign:"left", padding:"18px 22px", background:"none", border:"none", cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{fontWeight:700,color:T.text,fontSize:15}}>{f.q}</span>
                      <motion.span animate={{rotate:openFaq===i?45:0}} style={{color:T.brand,fontSize:22,lineHeight:1,flexShrink:0}}>+</motion.span>
                    </button>
                    <motion.div initial={false} animate={{height:openFaq===i?"auto":0,opacity:openFaq===i?1:0}} style={{overflow:"hidden"}}>
                      <div style={{padding:"0 22px 18px",color:T.textSub,lineHeight:1.8,fontSize:14}}>{f.a}</div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ════════════════════ FINAL CTA ════════════════════ */}
        <section style={{ background:"linear-gradient(160deg,#dbeafe 0%,#e0efff 50%,#e0f2fe 100%)", borderTop:`1px solid ${T.border}`, padding:"110px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, background:"radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)", borderRadius:"50%", pointerEvents:"none" }}/>
          <div style={{position:"relative"}}>
            <Reveal>
              <motion.div variants={fadeUp}>
                <span style={{background:T.white,border:`1.5px solid ${T.borderHard}`,color:T.brand,padding:"5px 16px",borderRadius:999,fontSize:13,fontWeight:700,boxShadow:"0 2px 8px rgba(37,99,235,0.1)"}}>
                  Get Started Today
                </span>
                <h2 style={{fontSize:48,fontWeight:900,color:T.text,margin:"18px 0 18px",letterSpacing:"-1.5px",lineHeight:1.15}}>
                  Your workflow deserves<br /><span style={{color:T.brand}}>better tools.</span>
                </h2>
                <p style={{color:T.textSub,fontSize:17,marginBottom:40}}>
                  Join the next generation workspace platform. Free to start, built to scale.
                </p>
                <div style={{display:"flex",justifyContent:"center",gap:14,flexWrap:"wrap"}}>
                  <Link to="/Register">
                    <motion.button whileHover={{scale:1.05,boxShadow:`0 8px 28px rgba(37,99,235,0.35)`}} whileTap={{scale:0.97}}
                      style={{ background:T.brand, color:T.white, padding:"15px 34px", borderRadius:12, fontWeight:800, fontSize:16, border:"none", cursor:"pointer", boxShadow:`0 4px 16px rgba(37,99,235,0.25)` }}>
                      Create Free Account →
                    </motion.button>
                  </Link>
                  <motion.button onClick={()=>setOpenDemo(true)}
                    whileHover={{scale:1.05,background:T.white}}
                    whileTap={{scale:0.97}}
                    style={{ background:"rgba(255,255,255,0.8)", color:T.brand, padding:"15px 34px", borderRadius:12, fontWeight:700, fontSize:16, border:`1.5px solid ${T.borderHard}`, cursor:"pointer" }}>
                    Schedule a Demo
                  </motion.button>
                </div>
                <p style={{color:T.textMuted,fontSize:13,marginTop:22}}>
                  No credit card required · Setup in 5 minutes · Cancel anytime
                </p>
              </motion.div>
            </Reveal>
          </div>
        </section>

      </main>

      {/* ════════════════════ DEMO MODAL ════════════════════ */}
      <AnimatePresence>
        {openDemo && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(12,26,58,0.3)", backdropFilter:"blur(6px)" }}>
            <motion.div
              initial={{opacity:0,scale:0.93}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.93}}
              transition={{duration:0.22}}
              style={{ width:"100%", maxWidth:480, background:T.white, borderRadius:20, boxShadow:"0 30px 80px rgba(37,99,235,0.18)", overflow:"hidden", border:`1.5px solid ${T.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"20px 24px", borderBottom:`1px solid ${T.border}`, background:T.surfaceAlt }}>
                <div>
                  <h2 style={{fontWeight:900,fontSize:18,color:T.text,margin:0}}>Schedule a demo</h2>
                  <p style={{color:T.textMuted,fontSize:13,margin:"4px 0 0"}}>See how Slotify works for your business</p>
                </div>
                <button onClick={()=>setOpenDemo(false)}
                  style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:"50%",width:30,height:30,cursor:"pointer",fontSize:16,color:T.textSub}}>
                  ×
                </button>
              </div>
              <div style={{padding:24,display:"flex",flexDirection:"column",gap:16}}>
                {[
                  {label:"Full name",  type:"text",  placeholder:"John Doe"},
                  {label:"Work email", type:"email", placeholder:"john@company.com"},
                ].map(f=>(
                  <div key={f.label}>
                    <label style={{display:"block",fontSize:13,fontWeight:700,color:T.textSub,marginBottom:6}}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      style={{width:"100%",border:`1.5px solid ${T.border}`,borderRadius:8,padding:"10px 14px",fontSize:14,outline:"none",boxSizing:"border-box",color:T.text}}/>
                  </div>
                ))}
                <div>
                  <label style={{display:"block",fontSize:13,fontWeight:700,color:T.textSub,marginBottom:6}}>Industry</label>
                  <select style={{width:"100%",border:`1.5px solid ${T.border}`,borderRadius:8,padding:"10px 14px",fontSize:14,outline:"none",color:T.text}}>
                    <option value="">Select industry</option>
                    {["Freelancer","Healthcare","Education","Agency","Consulting","Software / IT","Finance","Other"].map(o=>(
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  {[{label:"Date",type:"date"},{label:"Time",type:"time"}].map(f=>(
                    <div key={f.label}>
                      <label style={{display:"block",fontSize:13,fontWeight:700,color:T.textSub,marginBottom:6}}>{f.label}</label>
                      <input type={f.type}
                        style={{width:"100%",border:`1.5px solid ${T.border}`,borderRadius:8,padding:"10px 14px",fontSize:14,outline:"none",boxSizing:"border-box",color:T.text}}/>
                    </div>
                  ))}
                </div>
                <div style={{display:"flex",justifyContent:"flex-end",gap:10,paddingTop:8,borderTop:`1px solid ${T.border}`}}>
                  <button onClick={()=>setOpenDemo(false)}
                    style={{padding:"10px 18px",background:"none",border:"none",color:T.textMuted,cursor:"pointer",fontWeight:600}}>
                    Cancel
                  </button>
                  <motion.button whileHover={{scale:1.03,background:T.brandHover}} whileTap={{scale:0.97}}
                    style={{padding:"10px 22px",background:T.brand,color:T.white,borderRadius:8,border:"none",fontWeight:800,cursor:"pointer"}}>
                    Book demo
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}