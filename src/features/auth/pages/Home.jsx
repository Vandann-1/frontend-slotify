import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, LogOut, Zap, ChevronDown,
  Users, BarChart2, Settings, X, Menu, AlertTriangle,
  ArrowRight, Check, Star, Clock, Shield, Globe, Bell,
  Calendar, TrendingUp, Layers, Lock, Repeat, MessageSquare,
  ChevronRight, Play, Phone, Mail, MapPin, ExternalLink,
  Award, Cpu, Database, FileText, Hash, Inbox, Key,
  LifeBuoy, Link2, Monitor, Package, Percent, PieChart,
  RefreshCw, Send, Sliders, Tag, Target, UserCheck, Wifi,
  ChevronUp, Minus, Plus
} from "lucide-react";

/* ─────────────────────────────────────────
   THEME — Pure White + Slotify Blue
───────────────────────────────────────── */
const B = "#1a56db"; // Slotify blue
const BH = "#1447c0";
const BL = "#e8f0fe";
const BM = "#c2d4fc";
const W = "#ffffff";
const BK = "#0a0f1e"; // near-black
const G1 = "#f8faff"; // ghost white
const G2 = "#f2f6ff";
const TX = "#0d1b3e";
const TS = "#3d5278";
const TM = "#7990b5";
const BR = "#dde6f8"; // border
const GN = "#10b981";
const OR = "#f59e0b";
const RD = "#ef4444";

/* ─────────────────────────────────────────
   FONT INJECTION — Syne + DM Sans
───────────────────────────────────────── */
const FontStyle = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'DM Sans', sans-serif; }
    h1,h2,h3,h4,h5,h6 { font-family: 'Syne', sans-serif; }
    ::selection { background: ${BL}; color: ${B}; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: ${W}; }
    ::-webkit-scrollbar-thumb { background: ${BM}; border-radius: 99px; }
    .ticker-wrap { overflow: hidden; border-top: 1px solid ${BR}; border-bottom: 1px solid ${BR}; background: ${W}; }
    .ticker { display: flex; width: max-content; animation: ticker 30s linear infinite; }
    .ticker:hover { animation-play-state: paused; }
    @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    .grid-bg {
      background-image: linear-gradient(${BR} 1px, transparent 1px), linear-gradient(90deg, ${BR} 1px, transparent 1px);
      background-size: 48px 48px;
    }
    .dot-bg {
      background-image: radial-gradient(${BM} 1px, transparent 1px);
      background-size: 24px 24px;
    }
    input:focus, select:focus, textarea:focus { border-color: ${B} !important; box-shadow: 0 0 0 3px ${BL}; outline: none; }
    .hover-lift { transition: transform 0.2s, box-shadow 0.2s; }
    .hover-lift:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(26,86,219,0.12) !important; }
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 0.6; }
      100% { transform: scale(1.4); opacity: 0; }
    }
    .pulse-ring::before {
      content: ''; position: absolute; inset: -6px; border-radius: 50%;
      background: ${B}; animation: pulse-ring 1.8s ease-out infinite;
    }
  `}</style>
);

/* ─────────────────────────────────────────
   ANIMATION HELPERS
───────────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] } } };
const fadeIn  = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.45 } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };

function Reveal({ children, style = {}, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} style={style} transition={{ delayChildren: delay }}>
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <motion.span variants={fadeUp} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: BL, color: B, padding: "5px 14px", borderRadius: 4,
      fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase",
      fontFamily: "'DM Sans', sans-serif", marginBottom: 18,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: B, display: "inline-block" }} />
      {children}
    </motion.span>
  );
}

/* ─────────────────────────────────────────
   DIVIDER
───────────────────────────────────────── */
const Divider = () => <div style={{ height: 1, background: BR, margin: 0 }} />;

/* ─────────────────────────────────────────
   NAV DATA
───────────────────────────────────────── */
const NAV_LINKS = [
  {
    label: "Product",
    dropdown: [
      { icon: <LayoutDashboard size={14} />, label: "Dashboard", desc: "Manage all your bookings" },
      { icon: <Users size={14} />, label: "Team", desc: "Invite & manage members" },
      { icon: <BarChart2 size={14} />, label: "Analytics", desc: "Track performance metrics" },
      { icon: <Settings size={14} />, label: "Integrations", desc: "Connect your stack" },
    ],
  },
  {
    label: "Solutions",
    dropdown: [
      { icon: <UserCheck size={14} />, label: "Freelancers", desc: "Manage your solo business" },
      { icon: <Monitor size={14} />, label: "Agencies", desc: "Multi-client workspaces" },
      { icon: <Cpu size={14} />, label: "SaaS Teams", desc: "Engineering & product orgs" },
      { icon: <FileText size={14} />, label: "Healthcare", desc: "Patient appointment flows" },
    ],
  },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#blog" },
  { label: "Docs", href: "/docs" },
];

/* ─────────────────────────────────────────
   PAGE DATA
───────────────────────────────────────── */
const features = [
  { icon: <Zap size={20} />, title: "Instant Workspace Setup", desc: "Go from signup to live in under 5 minutes. Configure slots, branding, and team in one smooth flow." },
  { icon: <Lock size={20} />, title: "Enterprise-grade Security", desc: "JWT auth, role-based access, and AES-256 encryption — your data stays private and protected at all times." },
  { icon: <BarChart2 size={20} />, title: "Real-time Analytics", desc: "Live dashboards reveal booking trends, utilisation rates, and team performance at a glance." },
  { icon: <Bell size={20} />, title: "Smart Notifications", desc: "Automated email reminders cut no-shows and keep clients informed without any manual effort." },
  { icon: <Calendar size={20} />, title: "Calendar Sync", desc: "Two-way sync with Google Calendar and Outlook so scheduling conflicts become a thing of the past." },
  { icon: <Globe size={20} />, title: "Public Booking Pages", desc: "Share a branded link — clients can book directly, no account required on their end." },
  { icon: <Repeat size={20} />, title: "Recurring Appointments", desc: "Set up weekly, biweekly, or monthly bookings in seconds. Perfect for retainer clients and ongoing sessions." },
  { icon: <Layers size={20} />, title: "Multi-workspace Support", desc: "Run multiple independent workspaces from one account — each with its own team, slots, and analytics." },
  { icon: <Shield size={20} />, title: "Conflict Detection", desc: "Slotify automatically prevents double-bookings across your entire schedule with intelligent conflict checking." },
];

const steps = [
  { n: "01", title: "Create your workspace", desc: "Sign up free, name your workspace, upload your logo, and set your availability in under 5 minutes. No credit card needed.", icon: <Package size={18} /> },
  { n: "02", title: "Invite your team & clients", desc: "Share your unique booking link publicly, or invite team members with fine-grained role-based permissions.", icon: <Users size={18} /> },
  { n: "03", title: "Automate everything", desc: "Enable smart reminders, calendar sync, and webhook notifications. Slotify handles the routine so you can focus.", icon: <Zap size={18} /> },
  { n: "04", title: "Scale with confidence", desc: "As you grow, spin up new workspaces, add integrations, and unlock advanced analytics — all from the same dashboard.", icon: <TrendingUp size={18} /> },
];

const testimonials = [
  { name: "Priya Mehta", role: "Independent Consultant", company: "Self-employed", av: "PM", quote: "Slotify replaced 3 different tools I was juggling. Client onboarding is now fully automated and I save at least 6 hours a week.", rating: 5 },
  { name: "Rohan Sharma", role: "Clinic Manager", company: "MedCare Pvt Ltd", av: "RS", quote: "Patient scheduling used to take half our admin day. With Slotify it's down to 20 minutes and no-shows are down 60%.", rating: 5 },
  { name: "Ayesha Khan", role: "Founder", company: "DesignLab Agency", av: "AK", quote: "The multi-workspace feature is a game changer. Each client gets their own clean environment and the white-labelling is flawless.", rating: 5 },
  { name: "Dev Patel", role: "Engineering Lead", company: "Xcelerate Technologies", av: "DP", quote: "We integrated Slotify's REST API into our internal tools in under a day. The documentation is genuinely excellent.", rating: 5 },
  { name: "Sara Joshi", role: "Yoga Studio Owner", company: "Serenity Studios", av: "SJ", quote: "My clients love the simple booking flow. It looks completely professional and I didn't need to hire a developer.", rating: 5 },
  { name: "Karan Gupta", role: "Head of Operations", company: "Finpulse Advisory", av: "KG", quote: "Compliance, audit logs, and SSO were all boxes we needed to check. Slotify's enterprise plan had them all at launch.", rating: 5 },
];

const pricing = [
  {
    plan: "Starter", price: "Free", sub: "Forever free", highlight: false,
    badge: null,
    features: ["1 Workspace", "50 bookings / month", "Public booking page", "Email notifications", "Basic analytics", "Community support"],
    missing: ["Calendar sync", "Custom branding", "API access"],
    cta: "Get Started Free",
  },
  {
    plan: "Pro", price: "₹999", sub: "per month, billed monthly", highlight: true,
    badge: "Most Popular",
    features: ["5 Workspaces", "Unlimited bookings", "Two-way calendar sync", "Custom branding & domain", "Priority support (4h SLA)", "Advanced analytics", "Webhook integrations", "Zapier & REST API"],
    missing: [],
    cta: "Start 14-day Free Trial",
  },
  {
    plan: "Enterprise", price: "Custom", sub: "tailored to your org", highlight: false,
    badge: "For teams 50+",
    features: ["Unlimited workspaces", "SSO / SAML 2.0", "Dedicated account manager", "SLA guarantee (99.99%)", "Custom integrations", "On-premises deployment", "Audit logs & compliance", "White-label option"],
    missing: [],
    cta: "Contact Sales",
  },
];

const faqs = [
  { q: "Is Slotify really free to start?", a: "Yes — the Starter plan is completely free, no credit card required. You get one workspace and up to 50 bookings per month. You only need to upgrade when you need more capacity or advanced features." },
  { q: "How does workspace isolation work?", a: "Each workspace is fully independent — its own team members, booking pages, availability rules, notification settings, and analytics. Switching between workspaces is instant from your account dashboard." },
  { q: "Can I embed the booking widget on my website?", a: "Absolutely. Every workspace generates a copy-paste iframe embed snippet and a public shareable booking link. The embed respects your site's theme and scales to any container width." },
  { q: "Is my data secure and GDPR compliant?", a: "All data is encrypted at rest with AES-256 and in transit with TLS 1.3. We are SOC 2 Type II audit-in-progress and are fully GDPR compliant with data processing agreements available on request." },
  { q: "What integrations do you support?", a: "Google Calendar, Outlook, Slack, Zapier, Stripe (for paid bookings), Zoom (auto meeting links), and Google Meet. The full REST API plus webhooks are available on the Pro plan and above." },
  { q: "Can clients pay when they book?", a: "Yes — with the Stripe integration enabled on Pro+, you can require payment at the time of booking. Set your price per slot, accept card payments, and Slotify handles the receipt and confirmation automatically." },
  { q: "How do recurring bookings work?", a: "When creating a booking, you can set it as recurring on a daily, weekly, biweekly, or monthly cadence. All recurrences appear on the calendar and can be edited or cancelled individually or in bulk." },
  { q: "What happens if I hit my booking limit on the free plan?", a: "You'll receive a notification at 80% usage and again when you reach the limit. Existing bookings remain unaffected — you simply won't be able to create new ones until the next billing month or until you upgrade." },
];

const integrations = [
  { name: "Google Calendar", iconColor: "#4285F4", bubbleBg: "#EAF0FB", viewBox: "0 0 24 24", path: "M18.316 5.684H24v12.632h-5.684v-2.21h3.79v-8.21h-3.79V5.684zM0 18.316V5.684h5.684v2.21H1.895v8.21h3.789v2.211H0zm6.316-14.58h11.368v2.264H6.316V3.737zm0 16.526v-2.263h11.368v2.263H6.316zM6.316 9.79h11.368v4.42H6.316V9.79zm2.21 2.21v.001h6.948V12H8.526z" },
  { name: "Outlook", iconColor: "#0078D4", bubbleBg: "#E5F2FB", viewBox: "0 0 24 24", path: "M24 7.387v10.478c0 .23-.09.44-.255.6a.844.844 0 0 1-.606.247h-9.954v-5.523l1.701 1.29a.848.848 0 0 0 1.03-.004L24 7.387zM13.185 12.45V18.71H.86a.844.844 0 0 1-.606-.247A.848.848 0 0 1 0 17.865V7.387l7.08 6.072a.85.85 0 0 0 1.031.004l5.074-3.854v3.841zM23.17 6.288H.83L12 15.24 23.17 6.288z" },
  { name: "Slack", iconColor: "#4A154B", bubbleBg: "#F4EEF4", viewBox: "0 0 24 24", path: "M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312z" },
  { name: "Zapier", iconColor: "#FF4A00", bubbleBg: "#FFF0EB", viewBox: "0 0 24 24", path: "M13.559 11.998L13.56 12l-.001.002h.001v-.004zm.001.002l6.074 6.072-1.413 1.414-6.072-6.074-.149.588-1.371 5.425H8.37l1.37-5.426.149-.587-6.072 6.075L2.403 18.07l6.075-6.073-.587-.149-5.426-1.37V8.63l5.426 1.37.588.149L2.403 4.077 3.818 2.663l6.072 6.075.149-.588L11.408.725h2.258l-1.37 5.426-.15.587 6.072-6.075 1.415 1.414-6.073 6.072.587.149 5.426 1.37v2.257l-5.426-1.37-.587-.15z" },
  { name: "Stripe", iconColor: "#635BFF", bubbleBg: "#EEEEFF", viewBox: "0 0 24 24", path: "M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" },
  { name: "Zoom", iconColor: "#2D8CFF", bubbleBg: "#E8F3FF", viewBox: "0 0 24 24", path: "M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-5.5-4.5h-8A2.5 2.5 0 0 0 8 10v5.5h8a2.5 2.5 0 0 0 2.5-2.5V7.5zM5.5 9v6l3-1.8V10.8L5.5 9z" },
  { name: "Notion", iconColor: "#000000", bubbleBg: "#F5F5F5", viewBox: "0 0 24 24", path: "M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933z" },
  { name: "Google Meet", iconColor: "#00BFA5", bubbleBg: "#E0F7F4", viewBox: "0 0 24 24", path: "M22.58 11.99C22.58 11.07 22.5 10.18 22.36 9.32H12V14.03H17.96C17.7 15.38 16.95 16.52 15.82 17.29V20.3H19.36C21.4 18.42 22.58 15.46 22.58 11.99ZM12 23.22C15.01 23.22 17.54 22.23 19.37 20.3L15.83 17.29C14.84 17.95 13.56 18.34 12 18.34C9.12 18.34 6.68 16.45 5.81 13.84H2.15V16.94C3.97 20.57 7.72 23.22 12 23.22ZM5.81 13.84C5.59 13.18 5.46 12.47 5.46 11.74C5.46 11.01 5.59 10.3 5.81 9.64V6.54H2.15C1.41 8.01 1 9.63 1 11.74C1 13.85 1.41 15.47 2.15 16.94L5.81 13.84ZM12 5.14C13.73 5.14 15.28 5.74 16.5 6.9L19.43 3.97C17.54 2.2 15.01 1.14 12 1.14C7.72 1.14 3.97 3.79 2.15 7.42L5.81 10.52C6.68 7.91 9.12 5.14 12 5.14Z" },
];

const blogPosts = [
  { tag: "Product", date: "Apr 18, 2025", title: "How Slotify Handles 10,000 Concurrent Bookings Without Breaking a Sweat", read: "5 min read", desc: "A deep dive into our distributed queue architecture, how we do load-testing, and what changed in v2.4 to make peak hours painless." },
  { tag: "Guide", date: "Apr 12, 2025", title: "The Ultimate Guide to Reducing No-Shows by 60% with Smart Reminders", read: "8 min read", desc: "Real data from 500+ Slotify workspaces. Which reminder cadence works best, which channel wins, and how to write the message." },
  { tag: "Case Study", date: "Apr 5, 2025", title: "How MedCare Clinic Cut Admin Hours in Half After Switching to Slotify", read: "6 min read", desc: "From 3 hours of manual scheduling per day to 20 minutes — a granular walkthrough of MedCare's setup and automations." },
];

const useCases = [
  { icon: "🩺", title: "Healthcare & Clinics", desc: "Patient appointment flows, doctor availability, SMS reminders, and HIPAA-ready data handling all built in.", tag: "Popular" },
  { icon: "⚖️", title: "Legal & Consulting", desc: "Billable hour tracking, client portals, NDA-gated booking links, and invoicing integration with Stripe.", tag: null },
  { icon: "🎨", title: "Creative Agencies", desc: "One workspace per client, custom-branded booking pages, and project kickoff flows — all managed from one account.", tag: null },
  { icon: "📚", title: "Education & Tutoring", desc: "Student scheduling, recurring lesson blocks, parent notifications, and Zoom link automation on every booking.", tag: null },
  { icon: "🏋️", title: "Fitness & Wellness", desc: "Class slots, capacity limits, waitlists, membership checks, and automatic Zoom or in-person location instructions.", tag: "New" },
  { icon: "💻", title: "SaaS & Tech Teams", desc: "Demo scheduling, onboarding calls, customer success touchpoints, and full CRM integration via REST API.", tag: null },
];

const metrics = [
  { val: "50K+", label: "Bookings managed" },
  { val: "2,400+", label: "Workspaces created" },
  { val: "99.97%", label: "Uptime last 12 months" },
  { val: "4.9 / 5", label: "Average review score" },
];

const comparisonRows = [
  { feature: "Free plan", slotify: true,  calendly: true,  acuity: false },
  { feature: "Multi-workspace", slotify: true, calendly: false, acuity: false },
  { feature: "Team roles & permissions", slotify: true, calendly: true, acuity: true },
  { feature: "Built-in analytics dashboard", slotify: true, calendly: false, acuity: true },
  { feature: "Two-way calendar sync", slotify: true, calendly: true, acuity: true },
  { feature: "Recurring bookings", slotify: true, calendly: true, acuity: true },
  { feature: "REST API + webhooks", slotify: true, calendly: true, acuity: false },
  { feature: "White-label / custom domain", slotify: true, calendly: false, acuity: true },
  { feature: "On-premise deployment", slotify: true, calendly: false, acuity: false },
  { feature: "Conflict auto-detection", slotify: true, calendly: false, acuity: false },
];

/* ══════════════════════════════════════════
   HEADER
══════════════════════════════════════════ */
function Header({ onDemoClick }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("access");
  const slug = localStorage.getItem("workspace_slug");
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 40,
          background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${BR}` : "1px solid transparent",
          boxShadow: scrolled ? "0 1px 20px rgba(26,86,219,0.06)" : "none",
          transition: "all 0.3s",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>

          {/* LOGO */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: B, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px rgba(26,86,219,0.3)` }}>
              <Zap size={16} color={W} fill={W} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 800, color: BK, letterSpacing: "-0.5px", fontFamily: "'Syne', sans-serif" }}>
              Slot<span style={{ color: B }}>ify</span>
            </span>
          </Link>

          {/* NAV */}
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {NAV_LINKS.map((item) =>
              item.dropdown ? (
                <div key={item.label} style={{ position: "relative" }}
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 12px", borderRadius: 6, fontSize: 14, fontWeight: 500, color: TX, background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.color = B}
                    onMouseLeave={e => e.currentTarget.style.color = TX}
                  >
                    {item.label}
                    <motion.span animate={{ rotate: openDropdown === item.label ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={12} />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.16 }}
                        style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, width: 240, background: W, borderRadius: 12, boxShadow: "0 16px 48px rgba(26,86,219,0.12)", border: `1px solid ${BR}`, padding: 8, zIndex: 50 }}
                      >
                        {item.dropdown.map((d) => (
                          <button key={d.label} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 8, border: "none", background: "none", cursor: "pointer", textAlign: "left", transition: "background 0.15s" }}
                            onMouseEnter={e => e.currentTarget.style.background = G1}
                            onMouseLeave={e => e.currentTarget.style.background = "none"}
                          >
                            <div style={{ width: 30, height: 30, borderRadius: 7, background: BL, display: "flex", alignItems: "center", justifyContent: "center", color: B, flexShrink: 0 }}>{d.icon}</div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: TX }}>{d.label}</div>
                              <div style={{ fontSize: 11, color: TM, marginTop: 1 }}>{d.desc}</div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link key={item.label} to={item.href || "#"}
                  style={{ padding: "7px 12px", borderRadius: 6, fontSize: 14, fontWeight: 500, color: TX, textDecoration: "none", transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = B}
                  onMouseLeave={e => e.currentTarget.style.color = TX}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          {/* ACTIONS */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            {!token ? (
              <>
                <Link to="/login" style={{ padding: "7px 14px", fontSize: 14, fontWeight: 500, color: TX, textDecoration: "none", borderRadius: 6, transition: "color 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.color = B}
                  onMouseLeave={e => e.currentTarget.style.color = TX}
                >
                  Sign in
                </Link>
                <motion.button onClick={onDemoClick} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{ padding: "7px 14px", fontSize: 14, fontWeight: 600, color: B, background: "none", border: `1.5px solid ${BR}`, borderRadius: 8, cursor: "pointer" }}
                >
                  ▶ Demo
                </motion.button>
                <Link to="/register">
                  <motion.button whileHover={{ scale: 1.04, boxShadow: `0 6px 20px rgba(26,86,219,0.35)` }} whileTap={{ scale: 0.97 }}
                    style={{ display: "flex", alignItems: "center", gap: 6, background: B, color: W, padding: "8px 18px", borderRadius: 8, fontWeight: 700, fontSize: 14, border: "none", cursor: "pointer", boxShadow: `0 2px 10px rgba(26,86,219,0.2)` }}
                  >
                    <Zap size={13} fill={W} /> Get Started
                  </motion.button>
                </Link>
              </>
            ) : (
              <>
                {slug && (
                  <Link to={`/workspace/${slug}`} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", fontSize: 14, fontWeight: 500, color: TX, textDecoration: "none" }}>
                    <LayoutDashboard size={14} /> Dashboard
                  </Link>
                )}
                <motion.button onClick={() => setShowLogout(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{ display: "flex", alignItems: "center", gap: 6, background: "#fff0f0", color: RD, padding: "8px 16px", borderRadius: 8, border: `1px solid #fecaca`, fontWeight: 600, fontSize: 14, cursor: "pointer" }}
                >
                  <LogOut size={13} /> Logout
                </motion.button>
              </>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: "none", padding: 8, borderRadius: 6, background: "none", border: "none", cursor: "pointer", color: TX }}>
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* LOGOUT MODAL */}
      <AnimatePresence>
        {showLogout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(10,15,30,0.35)", backdropFilter: "blur(6px)" }}
          >
            <motion.div onClick={() => setShowLogout(false)} style={{ position: "absolute", inset: 0 }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.2 }}
              style={{ position: "relative", background: W, borderRadius: 16, border: `1px solid ${BR}`, padding: 28, width: "100%", maxWidth: 380, boxShadow: "0 24px 64px rgba(26,86,219,0.14)" }}
            >
              <button onClick={() => setShowLogout(false)} style={{ position: "absolute", top: 14, right: 14, background: "none", border: "none", cursor: "pointer", color: TM, padding: 4 }}><X size={15} /></button>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff0f0", border: "1px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <AlertTriangle size={20} color={RD} />
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: TX, marginBottom: 6 }}>Sign out of Slotify?</h2>
              <p style={{ fontSize: 14, color: TS, lineHeight: 1.6, marginBottom: 22 }}>You'll need to sign back in to access your workspace and bookings.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowLogout(false)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: `1.5px solid ${BR}`, background: W, fontSize: 14, fontWeight: 600, color: TS, cursor: "pointer" }}>Cancel</button>
                <motion.button onClick={handleLogout} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 0", borderRadius: 8, background: RD, color: W, fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>
                  <LogOut size={13} /> Sign out
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════
   TICKER STRIP
══════════════════════════════════════════ */
function TickerStrip() {
  const items = ["✓ Free to start", "✓ No credit card needed", "✓ 5-minute setup", "✓ 99.97% uptime", "✓ SOC 2 in progress", "✓ GDPR compliant", "✓ REST API included", "✓ Cancel anytime", "✓ 2,400+ workspaces created", "✓ Stripe payments built-in"];
  const doubled = [...items, ...items];
  return (
    <div className="ticker-wrap" style={{ padding: "10px 0" }}>
      <div className="ticker">
        {doubled.map((item, i) => (
          <span key={i} style={{ padding: "0 32px", fontSize: 13, fontWeight: 500, color: TS, whiteSpace: "nowrap" }}>{item}</span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════ */
export default function Home() {
  const [openDemo, setOpenDemo] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeUseCase, setActiveUseCase] = useState(0);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: W, color: TX }}>
      <FontStyle />
      <Header onDemoClick={() => setOpenDemo(true)} />
      <div style={{ height: 64 }} />

      <main>

        {/* ══ HERO ══ */}
        <section className="grid-bg" style={{ position: "relative", overflow: "hidden", borderBottom: `1px solid ${BR}` }}>
          {/* radial wash */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(26,86,219,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px 110px", position: "relative" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>

              {/* LEFT */}
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                {/* Pill */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, background: W, border: `1.5px solid ${BM}`, color: B, padding: "6px 14px 6px 8px", borderRadius: 99, fontSize: 12, fontWeight: 700, marginBottom: 28, boxShadow: "0 2px 12px rgba(26,86,219,0.1)", letterSpacing: 0.2 }}
                >
                  <span style={{ background: B, color: W, padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 800 }}>NEW</span>
                  Recurring bookings & Stripe payments now live
                  <ChevronRight size={13} />
                </motion.div>

                  <h1 style={{ 
                    fontSize: 56, 
                    fontWeight: 600, // Claude uses a slightly lighter weight for serifs to keep it elegant
                    lineHeight: 1.1, 
                    color: "#1d4ed8", // A clean, professional Claude-style blue
                    marginBottom: 24, 
                    letterSpacing: "-0.02em", 
                    fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
                  }}>
                    The smarter<br />
                    way to run your<br />
                    <span style={{ color: "#2563eb", fontStyle: "italic" }}>booking business</span>
                    </h1>



                <p style={{ color: TS, fontSize: 17, lineHeight: 1.8, marginBottom: 36, maxWidth: 470, fontWeight: 400 }}>
                  Slotify centralises scheduling, team management, client workflows, and payments in one clean platform — built for professionals who demand speed and scale.
                </p>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
                  <Link to="/register">
                    <motion.button whileHover={{ scale: 1.04, boxShadow: `0 8px 28px rgba(26,86,219,0.35)` }} whileTap={{ scale: 0.97 }}
                      style={{ display: "flex", alignItems: "center", gap: 8, background: B, color: W, padding: "14px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, border: "none", cursor: "pointer", boxShadow: `0 4px 16px rgba(26,86,219,0.22)` }}>
                      Start free — no card needed <ArrowRight size={15} />
                    </motion.button>
                  </Link>
                  <motion.button onClick={() => setOpenDemo(true)} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: W, color: TX, padding: "14px 24px", borderRadius: 10, fontWeight: 600, fontSize: 15, border: `1.5px solid ${BR}`, cursor: "pointer" }}>
                    <Play size={14} fill={B} color={B} /> Watch 2-min demo
                  </motion.button>
                </div>

                {/* Social proof row */}
                <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"].map((c, i) => (
                      <div key={i} style={{ width: 30, height: 30, borderRadius: "50%", background: c + "22", border: `2px solid ${W}`, marginLeft: i === 0 ? 0 : -8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: c }}>
                        {["PM", "RS", "AK", "DP", "SJ"][i]}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ display: "flex", gap: 1, marginBottom: 2 }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={OR} color={OR} />)}
                    </div>
                    <span style={{ fontSize: 12, color: TS, fontWeight: 500 }}>Loved by <b style={{ color: TX }}>2,400+</b> workspaces</span>
                  </div>
                  <div style={{ width: 1, height: 28, background: BR }} />
                  {["Free plan", "Cancel anytime", "5-min setup"].map(t => (
                    <span key={t} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: TS, fontWeight: 500 }}>
                      <Check size={13} color={GN} strokeWidth={3} /> {t}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* RIGHT — DASHBOARD MOCKUP */}
              <motion.div initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, delay: 0.1 }} style={{ position: "relative" }}>

                {/* Floating notification top-left */}
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3.5, repeat: Infinity }}
                  style={{ position: "absolute", top: -20, left: -24, zIndex: 10, background: W, borderRadius: 12, padding: "10px 16px", boxShadow: "0 8px 28px rgba(26,86,219,0.14)", display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600, border: `1px solid ${BR}` }}>
                  <div style={{ position: "relative" }} className="pulse-ring">
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: GN }} />
                  </div>
                  <div>
                    <div style={{ color: TX, fontSize: 12 }}>New booking · Priya M.</div>
                    <div style={{ color: TM, fontWeight: 400, fontSize: 11 }}>Just now</div>
                  </div>
                </motion.div>

                {/* Main card */}
                <div style={{ background: W, borderRadius: 20, boxShadow: "0 24px 64px rgba(26,86,219,0.1)", border: `1.5px solid ${BR}`, overflow: "hidden" }}>
                  {/* Browser bar */}
                  <div style={{ background: G1, padding: "12px 18px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${BR}` }}>
                    {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
                    <div style={{ marginLeft: 8, background: W, borderRadius: 5, padding: "4px 12px", fontSize: 11, color: TM, flex: 1, maxWidth: 200, border: `1px solid ${BR}` }}>
                      app.slotify.in/dashboard
                    </div>
                  </div>

                  <div style={{ padding: "20px 22px" }}>
                    {/* Tabs */}
                    <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>
                      {["Overview", "Bookings", "Team", "Analytics"].map((tab, i) => (
                        <div key={tab} style={{ padding: "5px 12px", borderRadius: 6, fontSize: 12, fontWeight: i === 0 ? 700 : 500, background: i === 0 ? BL : "none", color: i === 0 ? B : TM, cursor: "pointer" }}>{tab}</div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
                      {[
                        { label: "Bookings today", val: "24", delta: "+12%", col: B },
                        { label: "Active clients", val: "8", delta: "+3", col: "#0891b2" },
                        { label: "Revenue (MTD)", val: "₹18k", delta: "+22%", col: GN },
                      ].map(s => (
                        <div key={s.label} style={{ background: G1, borderRadius: 10, padding: "12px 12px", border: `1px solid ${BR}` }}>
                          <div style={{ color: TM, fontSize: 10, marginBottom: 4, fontWeight: 500 }}>{s.label}</div>
                          <div style={{ color: s.col, fontWeight: 800, fontSize: 20, fontFamily: "'Syne', sans-serif" }}>{s.val}</div>
                          <div style={{ color: GN, fontSize: 10, fontWeight: 700, marginTop: 2 }}>↑ {s.delta}</div>
                        </div>
                      ))}
                    </div>

                    {/* Booking list */}
                    <div style={{ fontSize: 11, fontWeight: 700, color: TM, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Today's Schedule</div>
                    {[
                      { name: "Client Booking — Priya M.", status: "Confirmed", col: GN, bg: "#f0fdf4" },
                      { name: "Workspace Sprint — Dev Team", status: "In Progress", col: B, bg: BL },
                      { name: "Demo Call — Rohan S.", status: "Upcoming", col: OR, bg: "#fffbeb" },
                      { name: "Review — Zara Pvt Ltd", status: "Pending", col: "#8b5cf6", bg: "#f5f3ff" },
                    ].map((item, i) => (
                      <motion.div key={i} whileHover={{ x: 3 }}
                        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: item.bg, borderRadius: 7, padding: "9px 12px", marginBottom: 6, border: `1px solid ${item.col}18`, cursor: "default" }}>
                        <span style={{ color: TX, fontSize: 12, fontWeight: 500 }}>{item.name}</span>
                        <span style={{ color: item.col, fontSize: 10, fontWeight: 700, background: item.col + "18", padding: "2px 8px", borderRadius: 99 }}>{item.status}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating badge bottom-right */}
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity }}
                  style={{ position: "absolute", bottom: -16, right: -20, zIndex: 10, background: B, borderRadius: 10, padding: "10px 16px", boxShadow: `0 8px 24px rgba(26,86,219,0.32)`, color: W, fontSize: 12, fontWeight: 700 }}>
                  3 Active Workspaces 🚀
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══ TICKER ══ */}
        <TickerStrip />

        {/* ══ LOGOS / TRUSTED BY ══ */}
        <section style={{ background: W, borderBottom: `1px solid ${BR}`, padding: "36px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <p style={{ color: TM, fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 24 }}>Trusted by professionals in</p>
            <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 40, alignItems: "center" }}>
              {["Freelancers", "Healthcare", "Education", "Agencies", "Consulting", "Legal", "Fitness", "Startups"].map(t => (
                <span key={t} style={{ color: TM, fontWeight: 600, fontSize: 14, letterSpacing: 0.2 }}>{t}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ══ METRICS BAR ══ */}
        <section style={{ background: B, padding: "56px 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <Reveal>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 24, textAlign: "center" }}>
                {metrics.map(m => (
                  <motion.div key={m.label} variants={fadeUp}>
                    <div style={{ 
                      fontSize: 44, 
                      fontWeight: 600, // Reduced from 800 to 600 for a more "intellectual" tech look
                      color: "#FFFFFF", 
                      lineHeight: 1, 
                      letterSpacing: "-0.03em", // Tighter tracking for large numbers
                      fontFamily: "'Instrument Sans', 'Inter', sans-serif" 
                    }}>
                      {m.val}
                    </div>
                    <div style={{ 
                      color: "#94a3b8", // Using a muted slate blue for the label (very Claude-esque)
                      fontSize: 12, 
                      textTransform: "uppercase", // Anthropic often uses small caps/uppercase for labels
                      letterSpacing: "0.05em",
                      marginTop: 12, 
                      fontWeight: 500 
                    }}>
                      {m.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ══ PROBLEM / SOLUTION ══ */}
<section style={{ background: "#FBF9F7", padding: "100px 24px", borderBottom: `1px solid ${BR}` }}>
  <div style={{ maxWidth: 1100, margin: "0 auto" }}>
    <Reveal>
      <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 60 }}>
        {/* Updated Label Style */}
        <SectionLabel style={{ letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase", fontSize: 12 }}>
          The Problem
        </SectionLabel>
        
        {/* Claude-Style Serif Header */}
        <h2 style={{ 
          fontSize: 42, 
          fontWeight: 600, 
          color: "#1a1a1a", 
          marginBottom: 20, 
          letterSpacing: "-0.01em", 
          lineHeight: 1.2,
          fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
        }}>
          Scheduling is still broken<br />for most teams
        </h2>
        
        <p style={{ color: "#4b5563", fontSize: 18, maxWidth: 600, margin: "0 auto", lineHeight: 1.6, fontFamily: "system-ui, sans-serif" }}>
          Juggling spreadsheets, WhatsApp, and 3 different tools just to confirm a meeting costs hours every single week.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 48px 1fr", gap: 24, alignItems: "center" }}>
        {/* Without Card */}
        <motion.div variants={fadeUp} style={{ background: "#FFFFFF", border: "1px solid #e5e7eb", borderRadius: 12, padding: 32, boxShadow: "0 4px 12px rgba(0,0,0,0.03)" }}>
          <div style={{ fontWeight: 600, color: "#991b1b", marginBottom: 24, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontFamily: "system-ui" }}>
            ❌ Without Slotify
          </div>
          {[
            "Bookings scattered across WhatsApp & email",
            "Double-bookings and missed appointments",
            "Manual reminders eating up 3+ hours a week",
            "Zero visibility into team workload",
            "Copy-pasting data between 4 tools daily",
            "No idea which time slots are actually performing",
            "Clients confused about where to book",
          ].map(t => (
            <div key={t} style={{ display: "flex", gap: 12, marginBottom: 14, fontSize: 14, alignItems: "flex-start" }}>
              <X size={14} color="#ef4444" style={{ marginTop: 3, flexShrink: 0 }} />
              <span style={{ color: "#374151", lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </motion.div>

        {/* Transition Arrow */}
        <motion.div variants={fadeUp} style={{ width: 48, height: 48, borderRadius: "50%", background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#1d4ed8", fontWeight: 600 }}>
          →
        </motion.div>

        {/* With Card */}
        <motion.div variants={fadeUp} style={{ background: "#FFFFFF", border: "2px solid #2563eb", borderRadius: 12, padding: 32, boxShadow: "0 10px 30px rgba(37,99,235,0.08)" }}>
          <div style={{ fontWeight: 600, color: "#2563eb", marginBottom: 24, fontSize: 12, textTransform: "uppercase", letterSpacing: 1, fontFamily: "system-ui" }}>
            ✅ With Slotify
          </div>
          {[
            "All bookings in one unified dashboard",
            "Automatic conflict detection",
            "Smart reminders — zero manual effort",
            "Real-time workload analytics",
            "One platform replaces the entire stack",
            "Slot performance heatmaps",
            "Branded public booking pages",
          ].map(t => (
            <div key={t} style={{ display: "flex", gap: 12, marginBottom: 14, fontSize: 14, alignItems: "flex-start" }}>
              <Check size={14} color="#2563eb" strokeWidth={3} style={{ marginTop: 3, flexShrink: 0 }} />
              <span style={{ color: "#111827", fontWeight: 500, lineHeight: 1.5 }}>{t}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </Reveal>
  </div>
</section>

        {/* ══ FEATURES ══ */}
<section style={{ background: "#FBF9F7", padding: "100px 24px", borderBottom: `1px solid ${BR}` }}>
  <div style={{ maxWidth: 1100, margin: "0 auto" }}>
    <Reveal>
      <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 64 }}>
        <SectionLabel style={{ letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase", fontSize: 12 }}>
          Features
        </SectionLabel>
        <h2 style={{ 
          fontSize: 42, 
          fontWeight: 600, 
          color: "#1a1a1a", 
          marginBottom: 16, 
          letterSpacing: "-0.01em", 
          fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
        }}>
          Everything you need to scale
        </h2>
        <p style={{ color: "#4b5563", fontSize: 18, maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
          Slotify ships with every tool modern teams depend on — out of the box, from day one.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {features.map((f, i) => (
          <motion.div key={f.title} variants={fadeUp} className="hover-lift"
            style={{ 
              background: "#FFFFFF", 
              border: "1px solid #e5e7eb", 
              borderRadius: 12, 
              padding: 32, 
              cursor: "default",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)" // Subtle Claude-style shadow
            }}>
            {/* Softer icon treatment */}
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 10, 
              background: "#eff6ff", // Very light blue tint
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              color: "#2563eb", 
              marginBottom: 20 
            }}>
              {f.icon}
            </div>
            
            <h3 style={{ 
              fontWeight: 600, 
              fontSize: 18, // Slightly larger for better hierarchy
              color: "#111827", 
              marginBottom: 10, 
              fontFamily: "system-ui, -apple-system, sans-serif" 
            }}>
              {f.title}
            </h3>
            
            <p style={{ 
              color: "#4b5563", 
              lineHeight: 1.6, 
              fontSize: 15, // Increased slightly for readability
              fontFamily: "system-ui, sans-serif" 
            }}>
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </Reveal>
  </div>
</section>

        {/* ══ HOW IT WORKS ══ */}
 <section style={{ background: "#FFFFFF", padding: "100px 24px", borderBottom: `1px solid #f3f4f6` }}>
  <div style={{ maxWidth: 1000, margin: "0 auto" }}>
    <Reveal>
      <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 64 }}>
        <SectionLabel style={{ letterSpacing: "0.1em", fontWeight: 600, textTransform: "uppercase", fontSize: 12 }}>
          How it works
        </SectionLabel>
        <h2 style={{ 
          fontSize: 42, 
          fontWeight: 600, 
          color: "#1a1a1a", 
          marginBottom: 16, 
          letterSpacing: "-0.01em", 
          fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
        }}>
          Up and running in 4 steps
        </h2>
        <p style={{ color: "#4b5563", fontSize: 18, fontFamily: "system-ui, sans-serif" }}>
          No engineers required. No lengthy onboarding calls.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 20 }}>
        {steps.map((s, i) => (
          <motion.div key={s.n} variants={fadeUp}
            style={{ 
              background: "#FBF9F7", // Claude's signature off-white/parchment
              borderRadius: 16, 
              padding: "32px 24px", 
              border: "1px solid #e5e7eb", 
              position: "relative", 
              transition: "transform 0.2s ease"
            }}>
            
            {/* Elegant, thin numbering */}
            <div style={{ 
              fontSize: 40, 
              fontWeight: 300, 
              color: "#2563eb", 
              opacity: 0.4, 
              lineHeight: 1, 
              marginBottom: 20, 
              fontFamily: "Charter, serif", 
              userSelect: "none" 
            }}>
              0{s.n}
            </div>

            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 8, 
              background: "#FFFFFF", 
              border: "1px solid #e5e7eb",
              color: "#2563eb", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              marginBottom: 16,
              boxShadow: "0 2px 4px rgba(0,0,0,0.03)"
            }}>
              {s.icon}
            </div>

            <h4 style={{ 
              fontWeight: 600, 
              fontSize: 16, 
              color: "#111827", 
              marginBottom: 8, 
              fontFamily: "system-ui, sans-serif" 
            }}>
              {s.title}
            </h4>
            
            <p style={{ 
              color: "#4b5563", 
              fontSize: 14, 
              lineHeight: 1.6,
              fontFamily: "system-ui, sans-serif" 
            }}>
              {s.desc}
            </p>

            {/* Subtle connector for the "Steps" feel */}
            {i < 3 && (
              <div style={{ 
                position: "absolute", 
                right: -10, 
                top: "50%", 
                transform: "translateY(-50%)", 
                color: "#d1d5db", 
                fontSize: 20, 
                zIndex: 10 
              }}>
                →
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </Reveal>
  </div>
</section>

        {/* ══ DEEP FEATURE 1 — Booking Management ══ */}
<section style={{ background: "#FBF9F7", padding: "100px 24px", borderBottom: "1px solid #e5e7eb" }}>
  <div style={{ maxWidth: 1100, margin: "0 auto" }}>
    <Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        
        {/* Animated Mockup Dashboard */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          whileHover={{ y: -5 }} // Subtle float on hover
          style={{ 
            background: "#FFFFFF", 
            borderRadius: 16, 
            border: "1px solid #e5e7eb", 
            padding: 32, 
            boxShadow: "0 20px 40px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)" 
          }}
        >
          <div style={{ 
            fontWeight: 600, 
            color: "#111827", 
            marginBottom: 24, 
            fontSize: 15, 
            fontFamily: "system-ui, sans-serif", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between" 
          }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb" }} />
              Booking Management
            </span>
            <span style={{ 
              fontSize: 11, 
              color: "#6b7280", 
              background: "#f9fafb", 
              padding: "4px 12px", 
              borderRadius: 6, 
              border: "1px solid #e5e7eb",
              fontWeight: 500
            }}>
              April 22, 2026
            </span>
          </div>

          {[
            { label: "Morning Consultation — Dr. Priya", time: "9:00 AM", col: "#2563eb", dur: "45 min" },
            { label: "Product Demo — Rohan & Co.", time: "11:30 AM", col: "#0891b2", dur: "30 min" },
            { label: "Sprint Planning — Dev Team", time: "2:00 PM", col: "#10b981", dur: "60 min" },
            { label: "Client Review — Zara Pvt Ltd", time: "4:30 PM", col: "#f59e0b", dur: "45 min" },
          ].map((item, i) => (
            <motion.div 
              key={i} 
              initial={{ x: -10, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.5 }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 12, 
                padding: "12px 16px", 
                borderRadius: 10, 
                marginBottom: 10, 
                background: "#FFFFFF", 
                border: "1px solid #f3f4f6",
                boxShadow: "0 2px 4px rgba(0,0,0,0.01)"
              }}
            >
              <div style={{ width: 3, height: 16, borderRadius: 4, background: item.col }} />
              <span style={{ color: "#374151", fontSize: 13, flex: 1, fontWeight: 500 }}>{item.label}</span>
              <span style={{ color: "#9ca3af", fontSize: 11 }}>{item.dur}</span>
              <span style={{ color: item.col, fontWeight: 600, fontSize: 12, width: 60, textAlign: "right" }}>{item.time}</span>
            </motion.div>
          ))}

          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              marginTop: 20, 
              padding: "12px", 
              background: "#2563eb", 
              borderRadius: 10, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 8, 
              color: "#FFFFFF", 
              fontSize: 14, 
              fontWeight: 600, 
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(37,99,235,0.2)"
            }}
          >
            <Plus size={16} /> New booking
          </motion.div>
        </motion.div>

        {/* Copy Content */}
        <motion.div variants={fadeUp}>
          <SectionLabel style={{ letterSpacing: "0.1em", fontWeight: 600 }}>Management</SectionLabel>
          <h2 style={{ 
            fontSize: 40, 
            fontWeight: 600, 
            color: "#111827", 
            margin: "16px 0 24px", 
            letterSpacing: "-0.02em", 
            lineHeight: 1.2,
            fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
          }}>
            Every booking,<br />in one place
          </h2>
          <p style={{ color: "#4b5563", fontSize: 17, lineHeight: 1.7, marginBottom: 32, fontFamily: "system-ui, sans-serif" }}>
            View, create, and manage appointments across multiple workspaces. Complete visibility and control — no more missed slots.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "Real-time updates & conflict alerts", 
              "Multi-workspace management", 
              "Full appointment history & notes", 
              "Drag-and-drop rescheduling"
            ].map((f, i) => (
              <motion.div 
                key={f} 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ display: "flex", gap: 12, alignItems: "center" }}
              >
                <div style={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: "50%", 
                  background: "#eff6ff", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  flexShrink: 0 
                }}>
                  <Check size={14} color="#2563eb" strokeWidth={3} />
                </div>
                <span style={{ color: "#374151", fontSize: 15, fontWeight: 500 }}>{f}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
      </div>
    </Reveal>
  </div>
</section>

        {/* ══ DEEP FEATURE 2 — Analytics ══ */}
<section style={{ background: "#FFFFFF", padding: "100px 24px", borderBottom: "1px solid #f3f4f6" }}>
  <div style={{ maxWidth: 1100, margin: "0 auto" }}>
    <Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        
        {/* Text Side */}
        <motion.div variants={fadeUp}>
          <SectionLabel style={{ letterSpacing: "0.1em", fontWeight: 600 }}>Analytics & Insights</SectionLabel>
          <h2 style={{ 
            fontSize: 40, 
            fontWeight: 600, 
            color: "#111827", 
            margin: "16px 0 24px", 
            letterSpacing: "-0.02em", 
            lineHeight: 1.2,
            fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
          }}>
            Data that drives<br />better decisions
          </h2>
          <p style={{ color: "#4b5563", fontSize: 17, lineHeight: 1.7, marginBottom: 32, fontFamily: "system-ui, sans-serif" }}>
            Real-time dashboards reveal booking trends, utilisation rates, and team performance. Know exactly which slots fill fastest.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              "Booking volume trends & forecasts", 
              "Revenue per workspace & team member", 
              "Slot utilisation heatmap analysis", 
              "No-show and cancellation tracking", 
              "Exportable reports (CSV / PDF)"
            ].map((f, i) => (
              <motion.div 
                key={f} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ display: "flex", gap: 12, alignItems: "center" }}
              >
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2563eb" }} />
                <span style={{ color: "#374151", fontSize: 15, fontWeight: 500 }}>{f}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mockup Side */}
        <motion.div 
          variants={fadeUp} 
          whileHover={{ scale: 1.01 }}
          style={{ 
            background: "#FBF9F7", 
            borderRadius: 20, 
            border: "1px solid #e5e7eb", 
            padding: 32, 
            boxShadow: "0 10px 30px rgba(0,0,0,0.02)" 
          }}
        >
          <div style={{ 
            fontWeight: 600, 
            color: "#111827", 
            marginBottom: 24, 
            fontSize: 14, 
            fontFamily: "system-ui",
            display: "flex",
            justifyContent: "space-between"
          }}>
            Weekly Overview
            <span style={{ color: "#2563eb", fontSize: 12 }}>Live Updates</span>
          </div>

          {/* Claude-style Bar Chart */}
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 120, marginBottom: 24, paddingBottom: 8, borderBottom: "1px solid #e5e7eb" }}>
            {[60, 80, 45, 90, 70, 95, 55].map((h, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <motion.div 
                  initial={{ height: 0 }} 
                  whileInView={{ height: `${h}%` }} 
                  transition={{ delay: i * 0.05, duration: 0.8, ease: "circOut" }}
                  style={{ 
                    width: "100%", 
                    background: i === 5 ? "#2563eb" : "#d1d5db", 
                    borderRadius: "4px 4px 0 0",
                    opacity: i === 5 ? 1 : 0.6
                  }} 
                />
                <span style={{ fontSize: 10, color: "#9ca3af", fontWeight: 600 }}>{"MTWTFSS"[i]}</span>
              </div>
            ))}
          </div>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { label: "This week", val: "47 bookings", delta: "+18%", col: "#2563eb" },
              { label: "Revenue", val: "₹34,200", delta: "+24%", col: "#10b981" },
              { label: "Avg. rating", val: "4.9 ★", delta: "Excellent", col: "#f59e0b" },
              { label: "No-shows", val: "2.1%", delta: "−0.8%", col: "#6b7280" },
            ].map(k => (
              <div key={k.label} style={{ background: "#FFFFFF", borderRadius: 12, padding: "16px", border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em" }}>{k.label}</div>
                <div style={{ 
                  fontSize: 20, 
                  fontWeight: 600, 
                  color: "#111827", 
                  fontFamily: "system-ui, sans-serif" 
                }}>
                  {k.val}
                </div>
                <div style={{ fontSize: 11, color: "#10b981", fontWeight: 600, marginTop: 4 }}>
                   {k.delta}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </Reveal>
  </div>
</section>

        {/* ══ DEEP FEATURE 3 — Team Collaboration ══ */}
<section style={{ background: "#FBF9F7", padding: "100px 24px", borderBottom: "1px solid #e5e7eb" }}>
  <div style={{ maxWidth: 1100, margin: "0 auto" }}>
    <Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        
        {/* Mockup Side */}
        <motion.div 
          variants={fadeUp} 
          style={{ 
            background: "#FFFFFF", 
            borderRadius: 20, 
            border: "1px solid #e5e7eb", 
            padding: 32, 
            boxShadow: "0 12px 40px rgba(0,0,0,0.03)" 
          }}
        >
          <div style={{ 
            fontWeight: 600, 
            color: "#111827", 
            marginBottom: 24, 
            fontSize: 15, 
            fontFamily: "system-ui, sans-serif",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            Team Overview
            <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 400 }}>5 members active</span>
          </div>

          {[
            { name: "Priya M.", role: "Lead Consultant", bookings: 12, col: "#2563eb", status: "active" },
            { name: "Rohan S.", role: "Account Manager", bookings: 8, col: "#0891b2", status: "active" },
            { name: "Ayesha K.", role: "Designer", bookings: 5, col: "#10b981", status: "away" },
            { name: "Dev P.", role: "Developer", bookings: 9, col: "#f59e0b", status: "active" },
            { name: "Sara J.", role: "Support", bookings: 6, col: "#8b5cf6", status: "offline" },
          ].map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 + 0.3 }}
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: 12, 
                marginBottom: 0, 
                padding: "12px 0", 
                borderBottom: i === 4 ? "none" : "1px solid #f3f4f6" 
              }}
            >
              <div style={{ position: "relative", width: 40, height: 40, flexShrink: 0 }}>
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: "50%", 
                  background: "#f9fafb", 
                  border: "1px solid #e5e7eb",
                  color: m.col, 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  fontWeight: 600, 
                  fontSize: 13 
                }}>
                  {m.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div style={{ 
                  position: "absolute", 
                  bottom: 2, 
                  right: 2, 
                  width: 10, 
                  height: 10, 
                  borderRadius: "50%", 
                  background: m.status === "active" ? "#10b981" : m.status === "away" ? "#f59e0b" : "#9ca3af", 
                  border: "2px solid #FFFFFF" 
                }} />
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ color: "#111827", fontWeight: 500, fontSize: 14 }}>{m.name}</div>
                <div style={{ color: "#6b7280", fontSize: 12 }}>{m.role}</div>
              </div>

              <div style={{ 
                background: "#f3f4f6", 
                color: "#374151", 
                padding: "4px 12px", 
                borderRadius: 6, 
                fontSize: 12, 
                fontWeight: 500 
              }}>
                {m.bookings} slots
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Text Side */}
        <motion.div variants={fadeUp}>
          <SectionLabel style={{ letterSpacing: "0.1em", fontWeight: 600 }}>Team Collaboration</SectionLabel>
          <h2 style={{ 
            fontSize: 40, 
            fontWeight: 600, 
            color: "#111827", 
            margin: "16px 0 24px", 
            letterSpacing: "-0.02em", 
            lineHeight: 1.2,
            fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
          }}>
            Your team,<br />fully aligned
          </h2>
          <p style={{ color: "#4b5563", fontSize: 17, lineHeight: 1.7, marginBottom: 32, fontFamily: "system-ui, sans-serif" }}>
            Assign bookings, set permissions, and keep everyone aligned — without endless back-and-forth.
          </p>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
            {[
              "Role-based access & permissions", 
              "Per-member availability & hours", 
              "Team workload balancing", 
              "Audit log of all team actions"
            ].map((f, i) => (
              <motion.div 
                key={f} 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                style={{ display: "flex", gap: 12, alignItems: "center" }}
              >
                <Check size={16} color="#2563eb" strokeWidth={3} />
                <span style={{ color: "#374151", fontSize: 15, fontWeight: 500 }}>{f}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </Reveal>
  </div>
</section>

        {/* ══ USE CASES ══ */}
<section style={{ background: "#FFFFFF", padding: "120px 24px", borderBottom: `1px solid ${BR}` }}>
  <div style={{ maxWidth: 1100, margin: "0 auto" }}>
    <Reveal>
      <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 70 }}>
        {/* Updated "Claude" Label Style */}
        <SectionLabel style={{ letterSpacing: "0.15em", fontWeight: 600, textTransform: "uppercase", fontSize: 11 }}>
          Use Cases
        </SectionLabel>
        
        {/* Serif Header */}
        <h2 style={{ 
          fontSize: 42, 
          fontWeight: 600, 
          color: "#1a1a1a", 
          marginBottom: 20, 
          letterSpacing: "-0.01em", 
          lineHeight: 1.2,
          fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
        }}>
          Built for your industry
        </h2>
        
        <p style={{ color: "#4b5563", fontSize: 18, maxWidth: 540, margin: "0 auto", lineHeight: 1.6 }}>
          From solo freelancers to enterprise clinics — Slotify adapts to your workflow, not the other way around.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {useCases.map((uc, i) => (
          <motion.div key={uc.title} variants={fadeUp} className="hover-lift"
            style={{ 
              background: "#FBF9F7", // Warm parchment background
              border: "1px solid #e5e7eb", 
              borderRadius: 12, 
              padding: 32, 
              cursor: "default", 
              position: "relative",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)" // Ultra-subtle Claude shadow
            }}>
            
            {/* Minimalist Tag */}
            {uc.tag && (
              <div style={{ 
                position: "absolute", 
                top: 16, 
                right: 16, 
                background: uc.tag === "New" ? "#eff6ff" : "#f1f5f9", 
                color: uc.tag === "New" ? "#2563eb" : "#4b5563", 
                fontSize: 10, 
                fontWeight: 600, 
                padding: "3px 10px", 
                borderRadius: 99,
                letterSpacing: "0.05em",
                textTransform: "uppercase"
              }}>{uc.tag}</div>
            )}
            
            {/* Elegant, Industry-Specific Icon (assuming uc.icon is an SVG or component) */}
            <div style={{ 
              fontSize: 32, 
              color: "#2563eb", // Signature Claude Blue for icons
              marginBottom: 16, 
              display: "flex", 
              alignItems: "center"
            }}>
              {/* You will replace this placeholder with an actual SVG icon component */}
              <div style={{ padding: "0 0 16px 0", borderBottom: `2px solid #e5e7eb` }}>
                {uc.iconComponent || uc.icon}
              </div>
            </div>
            
            <h3 style={{ 
              fontWeight: 600, 
              fontSize: 19, // Slightly larger for better hierarchy
              color: "#111827", 
              marginBottom: 10, 
              fontFamily: "system-ui, -apple-system, sans-serif" 
            }}>
              {uc.title}
            </h3>
            
            <p style={{ 
              color: "#4b5563", 
              lineHeight: 1.7, 
              fontSize: 15, // Increased for professional legibility
              fontFamily: "system-ui, sans-serif"
            }}>
              {uc.desc}
            </p>
            
            <div style={{ 
              marginTop: 20, 
              display: "flex", 
              alignItems: "center", 
              gap: 6, 
              color: "#2563eb", 
              fontSize: 14, 
              fontWeight: 600, 
              cursor: "pointer",
              fontFamily: "system-ui, sans-serif"
            }}>
              Explore workflow <ChevronRight size={14} style={{ marginTop: 1 }} />
            </div>
          </motion.div>
        ))}
      </div>
    </Reveal>
  </div>
</section>

        {/* ══ INTEGRATIONS ══ */}
<section style={{ background: "#FBF9F7", padding: "120px 24px", borderBottom: `1px solid ${BR}` }}>
  <div style={{ maxWidth: 1000, margin: "0 auto", textAlign: "center" }}>
    <Reveal>
      <motion.div variants={fadeUp}>
        <SectionLabel style={{ letterSpacing: "0.15em", fontWeight: 600 }}>Integrations</SectionLabel>
        <h2 style={{ 
          fontSize: 42, 
          fontWeight: 600, 
          color: "#1a1a1a", 
          marginBottom: 16, 
          letterSpacing: "-0.01em", 
          fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
        }}>
          Connects with tools you already use
        </h2>
        <p style={{ color: "#4b5563", fontSize: 18, marginBottom: 60, fontFamily: "system-ui, sans-serif" }}>
          Native integrations with your existing stack — no code required.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
        {integrations.map((i, index) => (
          <motion.div 
            key={i.name} 
            variants={fadeUp} 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, borderColor: "#2563eb" }}
            style={{ 
              background: "#FFFFFF", 
              borderRadius: 12, 
              padding: "32px 20px", 
              border: "1px solid #e5e7eb", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              gap: 16, 
              cursor: "pointer",
              transition: "border-color 0.2s ease, box-shadow 0.2s ease",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
            }}
          >
            {/* Minimalist Integration Icon */}
            <div style={{ 
              width: 56, 
              height: 56, 
              borderRadius: "50%", 
              background: "#f9fafb", 
              border: "1px solid #f3f4f6",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              transition: "transform 0.3s ease"
            }}>
              <svg 
                viewBox={i.viewBox} 
                width="28" 
                height="28" 
                fill={i.iconColor} 
                style={{ filter: "grayscale(0.2)" }} // Subtle Claude-style desaturation
              >
                <path d={i.path} />
              </svg>
            </div>
            
            <span style={{ 
              color: "#111827", 
              fontSize: 14, 
              fontWeight: 500, 
              fontFamily: "system-ui, sans-serif" 
            }}>
              {i.name}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeUp} style={{ marginTop: 52 }}>
        <p style={{ color: "#6b7280", fontSize: 15, fontFamily: "system-ui, sans-serif" }}>
          Plus thousands more via{" "}
          <span style={{ color: "#2563eb", fontWeight: 600, borderBottom: "1px solid rgba(37,99,235,0.2)", cursor: "pointer" }}>Zapier</span>{" "}
          or the{" "}
          <span style={{ color: "#2563eb", fontWeight: 600, borderBottom: "1px solid rgba(37,99,235,0.2)", cursor: "pointer" }}>Slotify REST API</span>.
        </p>
      </motion.div>
    </Reveal>
  </div>
</section>



        {/* ══ COMPARISON TABLE ══ */}
<section style={{ background: "#FFFFFF", padding: "120px 24px", borderBottom: "1px solid #f3f4f6" }}>
  <div style={{ maxWidth: 860, margin: "0 auto" }}>
    <Reveal>
      <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionLabel style={{ letterSpacing: "0.15em", fontWeight: 600, textTransform: "uppercase", fontSize: 11 }}>
          Comparison
        </SectionLabel>
        <h2 style={{ 
          fontSize: 42, 
          fontWeight: 600, 
          color: "#1a1a1a", 
          marginBottom: 16, 
          letterSpacing: "-0.01em", 
          fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
        }}>
          How we stack up
        </h2>
        <p style={{ color: "#4b5563", fontSize: 18, fontFamily: "system-ui, sans-serif" }}>
          See why teams switch to Slotify from legacy scheduling tools.
        </p>
      </motion.div>

      <motion.div variants={fadeUp} style={{ 
        border: "1px solid #e5e7eb", 
        borderRadius: 12, 
        overflow: "hidden", 
        background: "#FFFFFF",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)" 
      }}>
        {/* Header */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "2fr 1fr 1fr 1fr", 
          background: "#FBF9F7", 
          borderBottom: "1px solid #e5e7eb", 
          padding: "20px 24px" 
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Feature
          </div>
          {[
            { name: "Slotify", highlight: true },
            { name: "Calendly", highlight: false },
            { name: "Acuity", highlight: false },
          ].map(c => (
            <div key={c.name} style={{ 
              textAlign: "center", 
              fontSize: 14, 
              fontWeight: 600, 
              color: c.highlight ? "#2563eb" : "#111827", 
              fontFamily: "system-ui, sans-serif" 
            }}>
              {c.highlight && (
                <span style={{ 
                  display: "inline-block", 
                  background: "#eff6ff", 
                  color: "#2563eb", 
                  fontSize: 9, 
                  fontWeight: 700, 
                  padding: "2px 8px", 
                  borderRadius: 4, 
                  marginRight: 6, 
                  verticalAlign: "middle" 
                }}>
                  BEST
                </span>
              )}
              {c.name}
            </div>
          ))}
        </div>

        {/* Comparison Rows */}
        {comparisonRows.map((row, i) => (
          <div key={row.feature} style={{ 
            display: "grid", 
            gridTemplateColumns: "2fr 1fr 1fr 1fr", 
            padding: "18px 24px", 
            borderBottom: i < comparisonRows.length - 1 ? "1px solid #f3f4f6" : "none", 
            background: i % 2 === 0 ? "#FFFFFF" : "#FBF9F7",
            alignItems: "center"
          }}>
            <div style={{ fontSize: 14, color: "#374151", fontWeight: 500, fontFamily: "system-ui, sans-serif" }}>
              {row.feature}
            </div>
            {[row.slotify, row.calendly, row.acuity].map((val, j) => (
              <div key={j} style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                {val ? (
                  <div style={{ 
                    width: 22, 
                    height: 22, 
                    borderRadius: "50%", 
                    background: j === 0 ? "#2563eb" : "#ecfdf5", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center" 
                  }}>
                    <Check size={12} color={j === 0 ? "#FFFFFF" : "#10b981"} strokeWidth={3} />
                  </div>
                ) : (
                  <Minus size={14} color="#d1d5db" />
                )}
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </Reveal>
  </div>
</section>




        {/* ══ TESTIMONIALS ══ */}



        {/* ══ PRICING ══ */}
<section id="pricing" style={{ background: "#FBF9F7", padding: "120px 24px", borderBottom: "1px solid #e5e7eb" }}>
  <div style={{ maxWidth: 1060, margin: "0 auto" }}>
    <Reveal>
      <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 60 }}>
        <SectionLabel style={{ letterSpacing: "0.15em", fontWeight: 600 }}>Pricing</SectionLabel>
        <h2 style={{ 
          fontSize: 42, 
          fontWeight: 600, 
          color: "#1a1a1a", 
          marginBottom: 16, 
          letterSpacing: "-0.01em", 
          fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
        }}>
          Simple, transparent pricing
        </h2>
        <p style={{ color: "#4b5563", fontSize: 18, fontFamily: "system-ui, sans-serif" }}>
          Start free. Upgrade when you scale. No hidden fees.
        </p>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
        {pricing.map((p, i) => (
          <motion.div 
            key={p.plan} 
            variants={fadeUp}
            animate={p.highlight ? { 
              y: [0, -10, 0], // Floating "Pay-as-you-go" animation
            } : {}}
            transition={p.highlight ? { 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            } : {}}
            style={{ 
              background: p.highlight ? "#2563eb" : "#FFFFFF", 
              borderRadius: 16, 
              padding: 40, 
              border: "1px solid #e5e7eb", 
              boxShadow: p.highlight ? "0 20px 40px rgba(37,99,235,0.15)" : "0 4px 12px rgba(0,0,0,0.02)", 
              position: "relative",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {p.badge && (
              <div style={{ 
                position: "absolute", 
                top: -12, 
                left: "50%", 
                transform: "translateX(-50%)", 
                background: p.highlight ? "#1e40af" : "#2563eb", 
                color: "#FFFFFF", 
                padding: "4px 14px", 
                borderRadius: 99, 
                fontSize: 10, 
                fontWeight: 700, 
                letterSpacing: "0.05em",
                textTransform: "uppercase" 
              }}>
                {p.badge}
              </div>
            )}

            <div style={{ color: p.highlight ? "#bfdbfe" : "#6b7280", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>
              {p.plan}
            </div>
            
            <div style={{ fontSize: 48, fontWeight: 600, color: p.highlight ? "#FFFFFF" : "#111827", lineHeight: 1, marginBottom: 8, fontFamily: "system-ui, sans-serif" }}>
              {p.price}
              <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.8 }}>/mo</span>
            </div>
            
            <div style={{ color: p.highlight ? "#bfdbfe" : "#6b7280", fontSize: 14, marginBottom: 32 }}>
              {p.sub}
            </div>

            <div style={{ borderTop: `1px solid ${p.highlight ? "rgba(255,255,255,0.1)" : "#f3f4f6"}`, paddingTop: 32, marginBottom: 32, flexGrow: 1 }}>
              {p.features.map((f, index) => (
                <motion.div 
                  key={f} 
                  initial={{ opacity: 0, x: -5 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                  style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}
                >
                  <Check size={14} color={p.highlight ? "#FFFFFF" : "#2563eb"} strokeWidth={3} style={{ marginTop: 3 }} />
                  <span style={{ color: p.highlight ? "#FFFFFF" : "#374151", fontSize: 15, fontWeight: 500 }}>{f}</span>
                </motion.div>
              ))}
              {p.missing.map(f => (
                <div key={f} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start", opacity: 0.4 }}>
                  <Minus size={14} color={p.highlight ? "#FFFFFF" : "#9ca3af"} style={{ marginTop: 3 }} />
                  <span style={{ color: p.highlight ? "#FFFFFF" : "#6b7280", fontSize: 15, textDecoration: "line-through" }}>{f}</span>
                </div>
              ))}
            </div>

            <Link to="/register">
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                style={{ 
                  width: "100%", 
                  padding: "14px 0", 
                  borderRadius: 10, 
                  fontWeight: 600, 
                  fontSize: 15, 
                  cursor: "pointer", 
                  border: "none", 
                  background: p.highlight ? "#FFFFFF" : "#111827", 
                  color: p.highlight ? "#2563eb" : "#FFFFFF",
                  boxShadow: p.highlight ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
                  transition: "all 0.2s ease"
                }}
              >
                {p.cta}
              </motion.button>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeUp} style={{ textAlign: "center", marginTop: 48 }}>
        <p style={{ color: "#6b7280", fontSize: 14, fontFamily: "system-ui" }}>
          All plans include a 14-day free trial. No credit card required.
        </p>
      </motion.div>
    </Reveal>
  </div>
</section>

        {/* ══ BLOG ══ */}
<section id="blog" style={{ background: "#FBF9F7", padding: "120px 24px", borderBottom: `1px solid #e5e7eb` }}>
  <div style={{ maxWidth: 1060, margin: "0 auto" }}>
    <Reveal>
      <motion.div variants={fadeUp} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
        <div>
          <SectionLabel style={{ letterSpacing: "0.15em", fontWeight: 600 }}>From the blog</SectionLabel>
          <h2 style={{ 
            fontSize: 40, 
            fontWeight: 600, 
            color: "#1a1a1a", 
            marginTop: 12, 
            letterSpacing: "-0.01em", 
            fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
          }}>
            Latest from Slotify
          </h2>
        </div>
        <span style={{ 
          fontSize: 14, 
          color: "#2563eb", 
          fontWeight: 600, 
          cursor: "pointer", 
          display: "flex", 
          alignItems: "center", 
          gap: 6,
          borderBottom: "1px solid rgba(37,99,235,0.2)",
          paddingBottom: 2
        }}>
          View all posts <ArrowRight size={14} />
        </span>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
        {blogPosts.map((post, i) => (
          <motion.div 
            key={i} 
            variants={fadeUp} 
            whileHover={{ y: -8 }}
            style={{ 
              background: "#FFFFFF", 
              borderRadius: 12, 
              border: "1px solid #e5e7eb", 
              overflow: "hidden", 
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
            }}
          >
            {/* Elegant Gradient Background instead of solid color + emoji */}
            <div style={{ 
              background: `linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)`, 
              height: 160, 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              position: "relative"
            }}>
               <div style={{ opacity: 0.5 }}>
                 {/* This would ideally be a Lucide Icon matching the category */}
                 {["📊", "🔔", "🏥"][i]}
               </div>
            </div>

            <div style={{ padding: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ 
                  color: "#2563eb", 
                  fontSize: 11, 
                  fontWeight: 700, 
                  textTransform: "uppercase", 
                  letterSpacing: "0.05em" 
                }}>
                  {post.tag}
                </span>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#d1d5db" }} />
                <span style={{ color: "#6b7280", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                  <Clock size={12} /> {post.read}
                </span>
              </div>

              <h3 style={{ 
                fontWeight: 600, 
                fontSize: 20, 
                color: "#111827", 
                marginBottom: 12, 
                lineHeight: 1.4, 
                fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
              }}>
                {post.title}
              </h3>

              <p style={{ color: "#4b5563", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                {post.desc}
              </p>

              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                paddingTop: 20,
                borderTop: "1px solid #f3f4f6"
              }}>
                <span style={{ color: "#9ca3af", fontSize: 12 }}>April 22, 2026</span>
                <span style={{ 
                  color: "#2563eb", 
                  fontSize: 13, 
                  fontWeight: 600, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 4 
                }}>
                  Read article <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Reveal>
  </div>
</section>



        {/* ══ SECURITY / TRUST ══ */}
<section style={{ background: "#FFFFFF", padding: "100px 24px", borderBottom: "1px solid #f3f4f6" }}>
  <div style={{ maxWidth: 960, margin: "0 auto" }}>
    <Reveal>
      <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 56 }}>
        <SectionLabel style={{ letterSpacing: "0.15em", fontWeight: 600 }}>Security & Trust</SectionLabel>
        <h2 style={{ 
          fontSize: 36, 
          fontWeight: 600, 
          color: "#1a1a1a", 
          marginTop: 12, 
          letterSpacing: "-0.01em", 
          fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
        }}>
          Built with enterprise-grade security
        </h2>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}>
        {[
          { icon: <Shield size={20} />, title: "AES-256 Encryption", desc: "Data encrypted at rest and TLS 1.3 in transit." },
          { icon: <Lock size={20} />, title: "SOC 2 Type II", desc: "Full compliance report available on request." },
          { icon: <Globe size={20} />, title: "GDPR Compliant", desc: "EU data residency options for Enterprise." },
          { icon: <Key size={20} />, title: "SSO / SAML 2.0", desc: "Enterprise sign-on with Okta and Google." },
        ].map((item, i) => (
          <motion.div 
            key={item.title} 
            variants={fadeUp}
            whileHover={{ y: -4 }}
            style={{ 
              background: "#FBF9F7", // Claude's signature warm parchment
              borderRadius: 12, 
              padding: "32px 20px", 
              border: "1px solid #e5e7eb", 
              textAlign: "center",
              transition: "all 0.3s ease"
            }}
          >
            <div style={{ 
              width: 44, 
              height: 44, 
              borderRadius: "50%", 
              background: "#FFFFFF", 
              border: "1px solid #e5e7eb",
              color: "#2563eb", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              margin: "0 auto 18px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
            }}>
              {item.icon}
            </div>
            
            <h4 style={{ 
              fontWeight: 600, 
              fontSize: 15, 
              color: "#111827", 
              marginBottom: 8, 
              fontFamily: "system-ui, sans-serif" 
            }}>
              {item.title}
            </h4>
            
            <p style={{ 
              color: "#6b7280", 
              fontSize: 13, 
              lineHeight: 1.6,
              fontFamily: "system-ui, sans-serif" 
            }}>
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </Reveal>
  </div>
</section>



        {/* ══ FAQ ══ */}
<section id="faq" style={{ background: "#FBF9F7", padding: "120px 24px", borderBottom: `1px solid #e5e7eb` }}>
  <div style={{ maxWidth: 720, margin: "0 auto" }}>
    <Reveal>
      <motion.div variants={fadeUp} style={{ textAlign: "center", marginBottom: 64 }}>
        <SectionLabel style={{ letterSpacing: "0.15em", fontWeight: 600 }}>FAQ</SectionLabel>
        <h2 style={{ 
          fontSize: 42, 
          fontWeight: 600, 
          color: "#1a1a1a", 
          marginTop: 12, 
          letterSpacing: "-0.01em", 
          fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
        }}>
          Frequently asked questions
        </h2>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {faqs.map((f, i) => (
          <motion.div 
            key={i} 
            variants={fadeUp}
            style={{ 
              borderBottom: "1px solid #e5e7eb", 
              overflow: "hidden" 
            }}
          >
            <button 
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              style={{ 
                width: "100%", 
                textAlign: "left", 
                padding: "24px 8px", 
                background: "none", 
                border: "none", 
                cursor: "pointer", 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                gap: 16,
                transition: "all 0.2s"
              }}
            >
              <span style={{ 
                fontWeight: 600, 
                color: openFaq === i ? "#2563eb" : "#111827", 
                fontSize: 16,
                fontFamily: "system-ui, sans-serif"
              }}>
                {f.q}
              </span>
              <motion.span 
                animate={{ rotate: openFaq === i ? 180 : 0 }} 
                transition={{ duration: 0.3, ease: "easeInOut" }} 
                style={{ flexShrink: 0, color: openFaq === i ? "#2563eb" : "#9ca3af" }}
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>
            
            <AnimatePresence>
              {openFaq === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: "auto", opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }} 
                  transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }} 
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ 
                    padding: "0 8px 24px", 
                    color: "#4b5563", 
                    lineHeight: 1.7, 
                    fontSize: 15,
                    fontFamily: "system-ui, sans-serif",
                    maxWidth: "90%" 
                  }}>
                    {f.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </Reveal>
  </div>
</section>



        {/* ══ FINAL CTA ══ */}
<section style={{ 
  background: "radial-gradient(circle at top right, rgba(37, 99, 235, 0.03), #F8FAFC)", 
  padding: "100px 24px", 
  borderBottom: "1px solid #E2E8F0" 
}}>
  <div style={{ maxWidth: 1100, margin: "0 auto" }}>
    <Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        
        {/* Text Side */}
        <motion.div variants={fadeUp}>
          <div style={{ 
            color: "#2563EB", 
            fontSize: 12, 
            fontWeight: 700, 
            letterSpacing: "0.1em", 
            textTransform: "uppercase", 
            marginBottom: 16 
          }}>
            Advanced Scheduling
          </div>
          <h2 style={{ 
            fontSize: 42, 
            fontWeight: 600, 
            color: "#0F172A", 
            marginBottom: 20, 
            lineHeight: 1.2, 
            fontFamily: "Charter, 'Source Serif 4', Georgia, serif" 
          }}>
            Effortless booking,<br />
            <span style={{ color: "#2563EB" }}>powered by light.</span>
          </h2>
          <p style={{ color: "#475569", fontSize: 18, lineHeight: 1.7, marginBottom: 32 }}>
            Slotify uses a lightweight architecture to ensure your clients have a frictionless booking experience, even on slower connections.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {["Automated time-zone detection", "One-click rescheduling", "Seamless calendar sync"].map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ 
                  width: 24, height: 24, borderRadius: "50%", 
                  background: "rgba(37, 99, 235, 0.08)", 
                  display: "flex", alignItems: "center", justifyContent: "center" 
                }}>
                  <Check size={14} color="#2563EB" strokeWidth={3} />
                </div>
                <span style={{ color: "#334155", fontWeight: 500 }}>{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mockup Side with Blue Glow */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ 
            background: "#FFFFFF", 
            borderRadius: 20, 
            border: "1px solid #E2E8F0", 
            padding: 32, 
            boxShadow: "0 20px 50px rgba(37, 99, 235, 0.05)",
            position: "relative"
          }}
        >
          {/* Internal Blue Light Accent */}
          <div style={{ 
            position: "absolute", top: 0, right: 0, 
            width: 150, height: 150, 
            background: "radial-gradient(circle, rgba(37, 99, 235, 0.04) 0%, transparent 70%)",
            pointerEvents: "none" 
          }} />
          
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1E293B", marginBottom: 24 }}>
            Upcoming Slots
          </div>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ 
              padding: "16px", borderRadius: 12, marginBottom: 12, 
              background: i === 1 ? "rgba(37, 99, 235, 0.04)" : "#F8FAFC",
              border: i === 1 ? "1px solid rgba(37, 99, 235, 0.1)" : "1px solid transparent",
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
              <div style={{ color: "#475569", fontSize: 13, fontWeight: 500 }}>Morning Consultation</div>
              <div style={{ color: "#2563EB", fontWeight: 700, fontSize: 13 }}>09:00 AM</div>
            </div>
          ))}
        </motion.div>

      </div>
    </Reveal>
  </div>
</section>

      </main>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: BK, padding: "64px 24px 32px", borderTop: `1px solid rgba(255,255,255,0.06)` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", gap: 48, marginBottom: 56 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, background: B, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Zap size={14} color={W} fill={W} />
                </div>
                <span style={{ fontSize: 16, fontWeight: 800, color: W, fontFamily: "'Syne', sans-serif" }}>Slot<span style={{ color: BM }}>ify</span></span>
              </div>
              <p style={{ color: "#6b7a99", fontSize: 14, lineHeight: 1.7, marginBottom: 20, maxWidth: 240 }}>The smarter way to manage bookings and run your workspace.</p>
              <div style={{ display: "flex", gap: 10 }}>
                {[Mail, Globe, MessageSquare].map((Icon, i) => (
                  <div key={i} style={{ width: 34, height: 34, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7a99", cursor: "pointer", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <Icon size={15} />
                  </div>
                ))}
              </div>
            </div>

            {/* Links */}
            {[
              { title: "Product", links: ["Dashboard", "Analytics", "Integrations", "API & Webhooks", "Changelog"] },
              { title: "Solutions", links: ["Freelancers", "Healthcare", "Agencies", "SaaS Teams", "Education"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press Kit", "Contact"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "GDPR", "Security"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ fontWeight: 700, color: W, fontSize: 13, marginBottom: 16, fontFamily: "'Syne', sans-serif" }}>{col.title}</div>
                {col.links.map(link => (
                  <div key={link} style={{ marginBottom: 10 }}>
                    <span style={{ color: "#6b7a99", fontSize: 13, cursor: "pointer", transition: "color 0.15s" }}
                      onMouseEnter={e => e.target.style.color = W}
                      onMouseLeave={e => e.target.style.color = "#6b7a99"}
                    >{link}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <span style={{ color: "#4a5568", fontSize: 13 }}>© 2025 Slotify. All rights reserved.</span>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: GN }} />
              <span style={{ color: "#4a5568", fontSize: 12 }}>All systems operational</span>
              <span style={{ color: "#4a5568", fontSize: 12, margin: "0 8px" }}>·</span>
              <span style={{ color: "#4a5568", fontSize: 12 }}>Made in India 🇮🇳</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ══ DEMO MODAL ══ */}
      <AnimatePresence>
        {openDemo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(10,15,30,0.4)", backdropFilter: "blur(8px)" }}>
            <motion.div onClick={() => setOpenDemo(false)} style={{ position: "absolute", inset: 0 }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.22 }}
              style={{ position: "relative", background: W, borderRadius: 20, border: `1.5px solid ${BR}`, width: "100%", maxWidth: 480, boxShadow: "0 32px 80px rgba(26,86,219,0.16)", overflow: "hidden" }}
            >
              {/* Header */}
              <div style={{ background: G1, padding: "20px 24px", borderBottom: `1px solid ${BR}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontWeight: 800, fontSize: 18, color: TX, margin: 0, fontFamily: "'Syne', sans-serif" }}>Schedule a demo</h2>
                  <p style={{ color: TM, fontSize: 13, margin: "4px 0 0" }}>See how Slotify works for your business</p>
                </div>
                <button onClick={() => setOpenDemo(false)} style={{ background: W, border: `1px solid ${BR}`, borderRadius: "50%", width: 28, height: 28, cursor: "pointer", color: TM, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <X size={14} />
                </button>
              </div>

              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { label: "Full name", type: "text", placeholder: "Priya Mehta" },
                  { label: "Work email", type: "email", placeholder: "priya@company.com" },
                ].map(f => (
                  <div key={f.label}>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: TS, marginBottom: 6 }}>{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder}
                      style={{ width: "100%", border: `1.5px solid ${BR}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, color: TX, background: W, transition: "border-color 0.2s", boxSizing: "border-box" }} />
                  </div>
                ))}

                <div>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: TS, marginBottom: 6 }}>Industry</label>
                  <select style={{ width: "100%", border: `1.5px solid ${BR}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, color: TX, background: W }}>
                    <option value="">Select industry</option>
                    {["Freelancer", "Healthcare", "Education", "Agency", "Consulting", "Software / IT", "Finance", "Legal", "Fitness", "Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[{ label: "Date", type: "date" }, { label: "Time", type: "time" }].map(f => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: TS, marginBottom: 6 }}>{f.label}</label>
                      <input type={f.type} style={{ width: "100%", border: `1.5px solid ${BR}`, borderRadius: 8, padding: "10px 14px", fontSize: 14, color: TX, background: W, boxSizing: "border-box" }} />
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingTop: 6, borderTop: `1px solid ${BR}`, marginTop: 4 }}>
                  <button onClick={() => setOpenDemo(false)} style={{ padding: "10px 18px", background: "none", border: "none", color: TM, cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Cancel</button>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    style={{ padding: "10px 24px", background: B, color: W, borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", fontSize: 14, boxShadow: `0 4px 14px rgba(26,86,219,0.25)` }}>
                    Book demo →
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