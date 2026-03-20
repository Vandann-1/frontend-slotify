import { useEffect, useState } from "react";
import professionalApi from "../../api/professionalApi";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard, User, LogOut, Menu, X,
  CalendarDays, Clock, CreditCard, Users,
  Settings, ChevronRight, Building2, CheckCircle2,
  AlertCircle, Loader2, Bell, Star, Briefcase,
  ArrowUpRight, Plus, Search, Filter, Edit2,
  Trash2, Save, Mail, Phone, MapPin, Globe,
  Lock, Eye, EyeOff, Check, Zap, Shield,
  TrendingUp, Download, MoreHorizontal, XCircle,
  BookOpen, ChevronDown, ChevronUp, RefreshCw,
  ToggleLeft, ToggleRight, Info,
} from "lucide-react";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */
function Avatar({ name = "", email = "", size = "md" }) {
  const src = name || email;
  const letters = (src || "PR").slice(0, 2).toUpperCase();
  const sz = { sm:"w-8 h-8 text-xs", md:"w-10 h-10 text-sm", lg:"w-14 h-14 text-base" }[size] || "w-10 h-10 text-sm";
  return (
    <div className={`${sz} rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold flex-shrink-0 select-none`}>
      {letters}
    </div>
  );
}

function Badge({ label, color = "gray" }) {
  const map = {
    green:  "bg-green-100 text-green-700 border-green-200",
    blue:   "bg-blue-100 text-blue-700 border-blue-200",
    amber:  "bg-amber-100 text-amber-700 border-amber-200",
    red:    "bg-red-100 text-red-700 border-red-200",
    violet: "bg-violet-100 text-violet-700 border-violet-200",
    gray:   "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${map[color] || map.gray}`}>
      {label}
    </span>
  );
}

function StatCard({ label, value, sub, icon, accent }) {
  const acc = {
    blue:   ["bg-blue-50",   "text-blue-600"],
    green:  ["bg-green-50",  "text-green-600"],
    amber:  ["bg-amber-50",  "text-amber-600"],
    violet: ["bg-violet-50", "text-violet-600"],
    rose:   ["bg-rose-50",   "text-rose-600"],
  }[accent] || ["bg-gray-50","text-gray-500"];
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:-translate-y-0.5 transition-transform">
      <div className={`w-9 h-9 rounded-xl ${acc[0]} flex items-center justify-center mb-3`}>
        <span className={acc[1]}>{icon}</span>
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-2xl font-black text-gray-900 mt-0.5">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-lg font-black text-gray-900">{title}</h2>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ icon, title, desc, action }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-14 flex flex-col items-center gap-4 text-center shadow-sm">
      <div className="w-16 h-16 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-center">
        <span className="text-gray-300">{icon}</span>
      </div>
      <div>
        <p className="text-sm font-bold text-gray-700">{title}</p>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">{desc}</p>
      </div>
      {action}
    </div>
  );
}

/* ─────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────── */
const MOCK_BOOKINGS = [
  { id:1, client:"Rahul Desai",    service:"Consultation", date:"2025-07-22", time:"10:00 AM", status:"confirmed",  amount:500  },
  { id:2, client:"Sneha Patil",    service:"Follow-up",    date:"2025-07-22", time:"11:30 AM", status:"pending",    amount:250  },
  { id:3, client:"Ankit Sharma",   service:"Consultation", date:"2025-07-23", time:"02:00 PM", status:"confirmed",  amount:500  },
  { id:4, client:"Priya Nair",     service:"Review",       date:"2025-07-24", time:"04:00 PM", status:"cancelled",  amount:300  },
  { id:5, client:"Vikram Mehta",   service:"Consultation", date:"2025-07-25", time:"09:00 AM", status:"confirmed",  amount:500  },
  { id:6, client:"Deepa Joshi",    service:"Follow-up",    date:"2025-07-26", time:"03:00 PM", status:"completed",  amount:250  },
];

const MOCK_CLIENTS = [
  { id:1, name:"Rahul Desai",  email:"rahul@example.com",  phone:"+91 98765 43210", sessions:4, last:"2025-07-22", status:"active"   },
  { id:2, name:"Sneha Patil",  email:"sneha@example.com",  phone:"+91 87654 32109", sessions:2, last:"2025-07-20", status:"active"   },
  { id:3, name:"Ankit Sharma", email:"ankit@example.com",  phone:"+91 76543 21098", sessions:7, last:"2025-07-18", status:"active"   },
  { id:4, name:"Priya Nair",   email:"priya@example.com",  phone:"+91 65432 10987", sessions:1, last:"2025-07-10", status:"inactive" },
];

const WEEK_DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
const TIME_SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

const PLANS = [
  {
    id:"starter", name:"Starter", price:0,    period:"forever",
    color:"gray", highlight:false,
    features:["1 Workspace","20 bookings/mo","Basic profile","Email support","Public booking page"],
    badge:null,
  },
  {
    id:"pro", name:"Pro", price:999, period:"per month",
    color:"blue", highlight:true,
    features:["5 Workspaces","Unlimited bookings","Priority listing","Calendar sync","SMS reminders","Analytics dashboard","Priority support"],
    badge:"Most Popular",
  },
  {
    id:"elite", name:"Elite", price:2499, period:"per month",
    color:"violet", highlight:false,
    features:["Unlimited Workspaces","Unlimited bookings","Featured profile","Custom branding","API access","Dedicated manager","White-label option"],
    badge:"Best Value",
  },
];

/* ─────────────────────────────────────────
   TAB CONTENT COMPONENTS
───────────────────────────────────────── */

/* ── OVERVIEW ── */
function OverviewTab({ user, memberships, setActiveTab }) {
  const recent = MOCK_BOOKINGS.slice(0,4);
  return (
    <div className="space-y-6">
      {/* stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Workspaces"    value={memberships.length} sub="active memberships"    icon={<Building2 size={16}/>}    accent="blue"   />
        <StatCard label="Bookings"      value="24"                 sub="this month"            icon={<CalendarDays size={16}/>} accent="green"  />
        <StatCard label="Clients"       value={MOCK_CLIENTS.length} sub="total clients"        icon={<Users size={16}/>}        accent="violet" />
        <StatCard label="Earnings"      value="₹12,400"            sub="this month"            icon={<TrendingUp size={16}/>}   accent="amber"  />
      </div>

      {/* profile nudge */}
      {(!user?.bio || !user?.specialization) && (
        <div className="flex items-start justify-between gap-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User size={14} className="text-blue-600"/>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-800">Complete your profile</p>
              <p className="text-xs text-blue-600/80 mt-0.5">Add bio, specialization and experience to get discovered.</p>
            </div>
          </div>
          <button onClick={()=>setActiveTab("profile")} className="flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-white border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0">
            Update <ArrowUpRight size={11}/>
          </button>
        </div>
      )}

      {/* recent bookings */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-900">Recent Bookings</p>
          <button onClick={()=>setActiveTab("bookings")} className="text-xs text-blue-600 font-semibold hover:underline">View all</button>
        </div>
        <div className="divide-y divide-gray-50">
          {recent.map(b => (
            <div key={b.id} className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3">
                <Avatar name={b.client} size="sm"/>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{b.client}</p>
                  <p className="text-[11px] text-gray-400">{b.service} · {b.date} {b.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-800">₹{b.amount}</span>
                <Badge label={b.status} color={b.status==="confirmed"?"green":b.status==="pending"?"amber":b.status==="cancelled"?"red":"blue"}/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* workspaces */}
      {memberships.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="text-sm font-bold text-gray-900">Your Workspaces</p>
          </div>
          <div className="divide-y divide-gray-50">
            {memberships.map((m,i) => (
              <div key={i} className="flex items-center justify-between px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {(m.workspace_name||"WS").slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{m.workspace_name||"Workspace"}</p>
                    <p className="text-[11px] text-gray-400">{m.role||"PROFESSIONAL"}</p>
                  </div>
                </div>
                <Badge label="Active" color="green"/>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── BOOKINGS ── */
function BookingsTab() {
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");

  const statusFilters = ["all","confirmed","pending","completed","cancelled"];
  const filtered = MOCK_BOOKINGS.filter(b =>
    (filter==="all" || b.status===filter) &&
    (b.client.toLowerCase().includes(search.toLowerCase()) || b.service.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Bookings"
        subtitle={`${MOCK_BOOKINGS.length} total bookings`}
        action={
          <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors">
            <Plus size={13}/> New Booking
          </button>
        }
      />

      {/* filters + search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input
            value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search client or service…"
            className="w-full pl-8 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 bg-white"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statusFilters.map(s=>(
            <button key={s} onClick={()=>setFilter(s)}
              className={`text-xs font-semibold px-3 py-2 rounded-xl capitalize transition-colors ${filter===s?"bg-blue-600 text-white":"bg-white border border-gray-200 text-gray-500 hover:border-blue-300"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-5 py-3">Client</th>
                <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-3">Service</th>
                <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-3">Date & Time</th>
                <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-3">Amount</th>
                <th className="text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 py-3">Status</th>
                <th className="px-4 py-3"/>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-sm text-gray-400 py-12">No bookings found</td></tr>
              ) : filtered.map(b=>(
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={b.client} size="sm"/>
                      <span className="font-semibold text-gray-800">{b.client}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{b.service}</td>
                  <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{b.date}<br/><span className="text-xs text-gray-400">{b.time}</span></td>
                  <td className="px-4 py-3.5 font-bold text-gray-800">₹{b.amount}</td>
                  <td className="px-4 py-3.5">
                    <Badge label={b.status} color={b.status==="confirmed"?"green":b.status==="pending"?"amber":b.status==="cancelled"?"red":"blue"}/>
                  </td>
                  <td className="px-4 py-3.5">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                      <MoreHorizontal size={14}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── AVAILABILITY ── */
function AvailabilityTab() {
  const [schedule, setSchedule] = useState(() =>
    WEEK_DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { enabled: !["Saturday","Sunday"].includes(day), from:"09:00", to:"17:00" }
    }), {})
  );
  const [saved, setSaved] = useState(false);

  const toggle  = (day) => setSchedule(s => ({ ...s, [day]: { ...s[day], enabled: !s[day].enabled } }));
  const setTime = (day, field, val) => setSchedule(s => ({ ...s, [day]: { ...s[day], [field]: val } }));
  const save    = () => { setSaved(true); setTimeout(()=>setSaved(false), 2500); };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Availability"
        subtitle="Set your weekly schedule and time slots"
        action={
          <button onClick={save} className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all ${saved?"bg-green-500 text-white":"bg-blue-600 hover:bg-blue-700 text-white"}`}>
            {saved ? <><Check size={13}/> Saved!</> : <><Save size={13}/> Save Schedule</>}
          </button>
        }
      />

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-[140px_80px_1fr_1fr] gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <span>Day</span><span>Active</span><span>From</span><span>To</span>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {WEEK_DAYS.map(day => (
            <div key={day} className={`px-5 py-4 grid grid-cols-[140px_80px_1fr_1fr] gap-4 items-center transition-colors ${!schedule[day].enabled?"opacity-40":""}`}>
              <span className="text-sm font-semibold text-gray-800">{day}</span>
              <button onClick={()=>toggle(day)} className="flex items-center">
                {schedule[day].enabled
                  ? <ToggleRight size={24} className="text-blue-600"/>
                  : <ToggleLeft  size={24} className="text-gray-300"/>
                }
              </button>
              <select disabled={!schedule[day].enabled} value={schedule[day].from} onChange={e=>setTime(day,"from",e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 disabled:bg-gray-50 bg-white">
                {TIME_SLOTS.map(t=><option key={t}>{t}</option>)}
              </select>
              <select disabled={!schedule[day].enabled} value={schedule[day].to} onChange={e=>setTime(day,"to",e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400 disabled:bg-gray-50 bg-white">
                {TIME_SLOTS.map(t=><option key={t}>{t}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <Info size={15} className="text-blue-500 flex-shrink-0 mt-0.5"/>
        <p className="text-xs text-blue-700">Your availability is shown to clients when they book. Changes take effect immediately after saving.</p>
      </div>
    </div>
  );
}

/* ── CLIENTS ── */
function ClientsTab() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = MOCK_CLIENTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Clients"
        subtitle={`${MOCK_CLIENTS.length} total clients`}
        action={
          <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors">
            <Plus size={13}/> Add Client
          </button>
        }
      />

      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
        <input value={search} onChange={e=>setSearch(e.target.value)}
          placeholder="Search clients…"
          className="w-full pl-8 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-400 bg-white"/>
      </div>

      <div className="grid gap-3">
        {filtered.length === 0
          ? <EmptyState icon={<Users size={26}/>} title="No clients found" desc="Try a different search term."/>
          : filtered.map(c=>(
            <div key={c.id} onClick={()=>setSelected(selected?.id===c.id?null:c)}
              className="bg-white border border-gray-200 hover:border-blue-300 rounded-2xl p-4 cursor-pointer transition-all shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} size="md"/>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-gray-700">{c.sessions} sessions</p>
                    <p className="text-[10px] text-gray-400">Last: {c.last}</p>
                  </div>
                  <Badge label={c.status} color={c.status==="active"?"green":"gray"}/>
                  {selected?.id===c.id ? <ChevronUp size={14} className="text-gray-400"/> : <ChevronDown size={14} className="text-gray-400"/>}
                </div>
              </div>

              {selected?.id===c.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Mail size={12} className="text-gray-400"/> {c.email}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone size={12} className="text-gray-400"/> {c.phone}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CalendarDays size={12} className="text-gray-400"/> {c.sessions} sessions total
                  </div>
                  <div className="sm:col-span-3 flex gap-2 mt-1">
                    <button className="text-xs font-semibold text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors">
                      View Bookings
                    </button>
                    <button className="text-xs font-semibold text-gray-500 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors">
                      Send Message
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
}

/* ── PLANS ── */
function PlansTab() {
  const [current, setCurrent] = useState("starter");
  const [billing, setBilling] = useState("monthly");

  return (
    <div className="space-y-6">
      <SectionHeader title="Plans & Billing" subtitle="Manage your subscription"/>

      {/* current plan banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Zap size={18} className="text-white"/>
          </div>
          <div>
            <p className="text-xs text-blue-200 font-semibold uppercase tracking-wide">Current Plan</p>
            <p className="text-lg font-black capitalize">{current}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-blue-200">Next billing</p>
          <p className="text-sm font-bold">Aug 1, 2025</p>
        </div>
      </div>

      {/* billing toggle */}
      <div className="flex items-center justify-center gap-3">
        <button onClick={()=>setBilling("monthly")}
          className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${billing==="monthly"?"bg-blue-600 text-white":"text-gray-500 hover:bg-gray-100"}`}>
          Monthly
        </button>
        <button onClick={()=>setBilling("yearly")}
          className={`text-sm font-semibold px-4 py-2 rounded-xl transition-colors flex items-center gap-2 ${billing==="yearly"?"bg-blue-600 text-white":"text-gray-500 hover:bg-gray-100"}`}>
          Yearly
          <span className="text-[10px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">–20%</span>
        </button>
      </div>

      {/* plan cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PLANS.map(p => {
          const isCurrent = current === p.id;
          const price = billing==="yearly" ? Math.round(p.price*0.8) : p.price;
          return (
            <div key={p.id}
              className={`relative rounded-2xl border-2 p-6 flex flex-col gap-4 transition-all
                ${p.highlight ? "border-blue-500 bg-gradient-to-b from-blue-600 to-blue-700 shadow-xl shadow-blue-200" : "border-gray-200 bg-white shadow-sm"}
              `}>
              {p.badge && (
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-black px-3 py-1 rounded-full border whitespace-nowrap
                  ${p.highlight ? "bg-white text-blue-600 border-blue-200" : "bg-gray-900 text-white border-gray-800"}`}>
                  {p.badge}
                </div>
              )}

              <div>
                <p className={`text-xs font-bold uppercase tracking-widest ${p.highlight?"text-blue-200":"text-gray-400"}`}>{p.name}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-3xl font-black ${p.highlight?"text-white":"text-gray-900"}`}>
                    {price === 0 ? "Free" : `₹${price}`}
                  </span>
                  {price > 0 && <span className={`text-xs ${p.highlight?"text-blue-200":"text-gray-400"}`}>/{billing==="yearly"?"yr":"mo"}</span>}
                </div>
              </div>

              <div className={`border-t ${p.highlight?"border-white/20":"border-gray-100"} pt-4 space-y-2.5 flex-1`}>
                {p.features.map(f=>(
                  <div key={f} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0
                      ${p.highlight?"bg-white/20":"bg-green-100"}`}>
                      <Check size={9} className={p.highlight?"text-white":"text-green-600"}/>
                    </div>
                    <span className={`text-xs ${p.highlight?"text-blue-100":"text-gray-600"}`}>{f}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={()=>setCurrent(p.id)}
                disabled={isCurrent}
                className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all
                  ${isCurrent
                    ? p.highlight
                      ? "bg-white/20 text-white/60 cursor-default"
                      : "bg-gray-100 text-gray-400 cursor-default"
                    : p.highlight
                      ? "bg-white text-blue-600 hover:shadow-md"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
              >
                {isCurrent ? "Current Plan" : `Upgrade to ${p.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* billing history */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-bold text-gray-900">Billing History</p>
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 font-medium">
            <Download size={12}/> Export
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { date:"Jul 1, 2025",  amount:"₹0",   plan:"Starter", status:"paid" },
            { date:"Jun 1, 2025",  amount:"₹0",   plan:"Starter", status:"paid" },
            { date:"May 1, 2025",  amount:"₹0",   plan:"Starter", status:"paid" },
          ].map((r,i)=>(
            <div key={i} className="flex items-center justify-between px-5 py-3.5">
              <div>
                <p className="text-sm font-semibold text-gray-800">{r.plan} Plan</p>
                <p className="text-xs text-gray-400">{r.date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-gray-800">{r.amount}</span>
                <Badge label={r.status} color="green"/>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── PROFILE ── */
function ProfileTab({ user }) {
  const [form, setForm]   = useState({
    first_name:        user?.first_name        || "",
    last_name:         user?.last_name         || "",
    email:             user?.email             || "",
    phone:             user?.phone             || "",
    bio:               user?.bio               || "",
    specialization:    user?.specialization    || "",
    experience_years:  user?.experience_years  || "",
    location:          user?.location          || "",
    website:           user?.website           || "",
  });
  const [saved,   setSaved]   = useState(false);
  const [loading, setLoading] = useState(false);

  const handle = e => setForm(p=>({...p,[e.target.name]:e.target.value}));
  const save   = async () => {
    setLoading(true);
    await new Promise(r=>setTimeout(r,800));
    setLoading(false);
    setSaved(true);
    setTimeout(()=>setSaved(false),2500);
  };

  const Field = ({ label, name, type="text", placeholder="", textarea=false, half=false }) => (
    <div className={half?"":"col-span-2 sm:col-span-1"}>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
      {textarea
        ? <textarea name={name} value={form[name]} onChange={handle} placeholder={placeholder} rows={4}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 resize-none bg-white"/>
        : <input type={type} name={name} value={form[name]} onChange={handle} placeholder={placeholder}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 bg-white"/>
      }
    </div>
  );

  return (
    <div className="space-y-5">
      <SectionHeader title="My Profile" subtitle="Manage your professional information"/>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {/* avatar header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100 px-6 py-6 flex items-center gap-5">
          <Avatar name={form.first_name || form.email} size="lg"/>
          <div>
            <p className="text-base font-black text-gray-900">{form.first_name} {form.last_name}</p>
            <p className="text-sm text-gray-500">{form.email}</p>
            <button className="mt-2 text-xs font-semibold text-blue-600 border border-blue-200 bg-white hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5">
              <Edit2 size={10}/> Change Photo
            </button>
          </div>
        </div>

        {/* form */}
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name"        name="first_name"       placeholder="John"/>
          <Field label="Last Name"         name="last_name"        placeholder="Doe"/>
          <Field label="Email"             name="email"            type="email" placeholder="you@example.com"/>
          <Field label="Phone"             name="phone"            placeholder="+91 98765 43210"/>
          <Field label="Specialization"    name="specialization"   placeholder="e.g. Cardiologist, Life Coach"/>
          <Field label="Experience (years)"name="experience_years" type="number" placeholder="5"/>
          <Field label="Location"          name="location"         placeholder="Mumbai, India"/>
          <Field label="Website"           name="website"          placeholder="https://yoursite.com"/>
          <div className="sm:col-span-2">
            <Field label="Bio" name="bio" placeholder="Tell clients about yourself…" textarea/>
          </div>
        </div>

        <div className="px-6 pb-5">
          <button onClick={save} disabled={loading}
            className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all
              ${saved ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}>
            {loading ? <Loader2 size={14} className="animate-spin"/> : saved ? <Check size={14}/> : <Save size={14}/>}
            {loading ? "Saving…" : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── SETTINGS ── */
function SettingsTab() {
  const [showPass,    setShowPass]    = useState(false);
  const [notifs,      setNotifs]      = useState({ email:true, sms:false, push:true, reminders:true });
  const [passForm,    setPassForm]    = useState({ current:"", next:"", confirm:"" });
  const [passSaved,   setPassSaved]   = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passError,   setPassError]   = useState("");

  const toggleNotif = key => setNotifs(n=>({...n,[key]:!n[key]}));

  const savePassword = async () => {
    setPassError("");
    if (passForm.next !== passForm.confirm) { setPassError("Passwords do not match."); return; }
    if (passForm.next.length < 6) { setPassError("Password must be at least 6 characters."); return; }
    setPassLoading(true);
    await new Promise(r=>setTimeout(r,800));
    setPassLoading(false);
    setPassSaved(true);
    setPassForm({ current:"", next:"", confirm:"" });
    setTimeout(()=>setPassSaved(false),2500);
  };

  const Toggle = ({ enabled, onToggle }) => (
    <button onClick={onToggle} className="flex-shrink-0">
      {enabled
        ? <ToggleRight size={26} className="text-blue-600"/>
        : <ToggleLeft  size={26} className="text-gray-300"/>
      }
    </button>
  );

  return (
    <div className="space-y-5">
      <SectionHeader title="Settings" subtitle="Manage notifications and account security"/>

      {/* notifications */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-900">Notifications</p>
          <p className="text-xs text-gray-400 mt-0.5">Choose how you want to be notified</p>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { key:"email",     label:"Email Notifications",    desc:"Booking confirmations and updates via email"   },
            { key:"sms",       label:"SMS Notifications",      desc:"Receive SMS alerts for new bookings"           },
            { key:"push",      label:"Push Notifications",     desc:"Browser push notifications for real-time alerts"},
            { key:"reminders", label:"Booking Reminders",      desc:"Get reminded 1 hour before appointments"       },
          ].map(n=>(
            <div key={n.key} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">{n.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
              </div>
              <Toggle enabled={notifs[n.key]} onToggle={()=>toggleNotif(n.key)}/>
            </div>
          ))}
        </div>
      </div>

      {/* change password */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <p className="text-sm font-bold text-gray-900">Change Password</p>
          <p className="text-xs text-gray-400 mt-0.5">Update your account password</p>
        </div>
        <div className="p-5 space-y-3">
          {passError && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-2.5 rounded-xl">
              <AlertCircle size={13}/> {passError}
            </div>
          )}
          {[
            { label:"Current Password", key:"current" },
            { label:"New Password",     key:"next"    },
            { label:"Confirm Password", key:"confirm" },
          ].map(f=>(
            <div key={f.key}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">{f.label}</label>
              <div className="relative">
                <input
                  type={showPass?"text":"password"}
                  value={passForm[f.key]}
                  onChange={e=>setPassForm(p=>({...p,[f.key]:e.target.value}))}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm pr-10 outline-none focus:border-blue-400 bg-white"
                />
                {f.key === "current" && (
                  <button type="button" onClick={()=>setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff size={14}/> : <Eye size={14}/>}
                  </button>
                )}
              </div>
            </div>
          ))}
          <button onClick={savePassword} disabled={passLoading}
            className={`flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl mt-1 transition-all
              ${passSaved?"bg-green-500 text-white":"bg-blue-600 hover:bg-blue-700 text-white"}`}>
            {passLoading ? <Loader2 size={14} className="animate-spin"/> : passSaved ? <Check size={14}/> : <Lock size={14}/>}
            {passLoading ? "Updating…" : passSaved ? "Updated!" : "Update Password"}
          </button>
        </div>
      </div>

      {/* danger zone */}
      <div className="bg-white border border-red-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-red-100">
          <p className="text-sm font-bold text-red-600">Danger Zone</p>
        </div>
        <div className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">Delete Account</p>
            <p className="text-xs text-gray-400 mt-0.5">Permanently delete your account and all data. This cannot be undone.</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-bold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 px-3.5 py-2 rounded-xl transition-colors flex-shrink-0">
            <Trash2 size={12}/> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════ */
const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const user = (() => { try { return JSON.parse(localStorage.getItem("user")||"{}"); } catch { return {}; } })();

  const [loading,     setLoading]     = useState(true);
  const [memberships, setMemberships] = useState([]);
  const [collapsed,   setCollapsed]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [activeTab,   setActiveTab]   = useState("overview");
  const [error,       setError]       = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res  = await professionalApi.getMyMemberships();
        const data = res?.data;
        if (mounted) setMemberships(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError("Failed to load workspaces.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  const handleLogout = () => { localStorage.clear(); navigate("/login"); };

  const firstName = user?.first_name || user?.email?.split("@")[0] || "there";

  const NAV = [
    { id:"overview",      icon:<LayoutDashboard size={17}/>, label:"Overview"     },
    { id:"bookings",      icon:<CalendarDays    size={17}/>, label:"Bookings"     },
    { id:"availability",  icon:<Clock           size={17}/>, label:"Availability" },
    { id:"clients",       icon:<Users           size={17}/>, label:"Clients"      },
    { id:"plans",         icon:<CreditCard      size={17}/>, label:"Plans"        },
    { id:"profile",       icon:<User            size={17}/>, label:"Profile"      },
    { id:"settings",      icon:<Settings        size={17}/>, label:"Settings"     },
  ];

  const TAB_LABELS = { overview:"Overview", bookings:"Bookings", availability:"Availability", clients:"Clients", plans:"Plans & Billing", profile:"My Profile", settings:"Settings" };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-blue-600/30 shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
              <Zap size={13} className="text-white fill-white"/>
            </div>
            <span className="text-white font-black text-base tracking-tight">Slot<span className="text-blue-200">ify</span></span>
          </div>
        )}
        <button onClick={()=>{setCollapsed(!collapsed);setMobileOpen(false);}}
          className="text-blue-200 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors">
          {collapsed ? <Menu size={18}/> : <X size={18}/>}
        </button>
      </div>

      {/* nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
        {!collapsed && (
          <p className="text-[10px] font-bold text-blue-400/60 uppercase tracking-widest px-3 mb-2">Menu</p>
        )}
        {NAV.map(n => (
          <button key={n.id} onClick={()=>{setActiveTab(n.id);setMobileOpen(false);}}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
              ${activeTab===n.id
                ? "bg-white text-blue-700 shadow-sm font-semibold"
                : "text-blue-100 hover:bg-white/10 hover:text-white"
              }
              ${collapsed?"justify-center":""}`}>
            <span className={activeTab===n.id?"text-blue-600":"text-blue-200"}>{n.icon}</span>
            {!collapsed && n.label}
          </button>
        ))}
      </nav>

      {/* user + logout */}
      <div className="px-3 pb-4 pt-3 border-t border-blue-600/30 shrink-0 space-y-1">
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3 py-2">
            <Avatar name={user?.first_name||user?.email} size="sm"/>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.first_name||user?.email||"Professional"}</p>
              <p className="text-[10px] text-blue-200/70">Professional</p>
            </div>
          </div>
        )}
        <button onClick={handleLogout}
          className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-100 hover:bg-red-500 hover:text-white transition-all text-sm font-medium ${collapsed?"justify-center":""}`}>
          <LogOut size={17} className="group-hover:-translate-x-0.5 transition-transform"/>
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 size={22} className="animate-spin text-blue-600"/>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* desktop sidebar */}
      <aside className={`hidden md:flex flex-col flex-shrink-0 h-full bg-gradient-to-b from-blue-700 to-blue-800 transition-all duration-300 ${collapsed?"w-16":"w-56"}`}>
        <SidebarContent/>
      </aside>

      {/* mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={()=>setMobileOpen(false)}>
          <aside className="w-56 h-full bg-gradient-to-b from-blue-700 to-blue-800 flex flex-col" onClick={e=>e.stopPropagation()}>
            <SidebarContent/>
          </aside>
        </div>
      )}

      {/* main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* topbar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors" onClick={()=>setMobileOpen(true)}>
              <Menu size={18}/>
            </button>
            <div>
              <p className="text-sm font-black text-gray-900 leading-tight">
                {TAB_LABELS[activeTab]}
              </p>
              <p className="text-[11px] text-gray-400">
                {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"long"})}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <Bell size={15}/>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-white"/>
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-gray-100">
              <Avatar name={user?.first_name||user?.email} size="sm"/>
              {!collapsed && (
                <div className="hidden sm:block">
                  <p className="text-xs font-bold text-gray-800 leading-tight">{user?.first_name || "Professional"}</p>
                  <p className="text-[10px] text-gray-400">Professional</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* page body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-5xl mx-auto">

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs font-medium px-4 py-3 rounded-xl mb-5">
                <AlertCircle size={14} className="flex-shrink-0"/> {error}
              </div>
            )}

            {activeTab === "overview"     && <OverviewTab     user={user} memberships={memberships} setActiveTab={setActiveTab}/>}
            {activeTab === "bookings"     && <BookingsTab/>}
            {activeTab === "availability" && <AvailabilityTab/>}
            {activeTab === "clients"      && <ClientsTab/>}
            {activeTab === "plans"        && <PlansTab/>}
            {activeTab === "profile"      && <ProfileTab user={user}/>}
            {activeTab === "settings"     && <SettingsTab/>}

          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;