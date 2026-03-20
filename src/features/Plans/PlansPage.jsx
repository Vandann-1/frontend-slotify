import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import {
  Check, Zap, Building2, Sparkles, ArrowRight, CheckCircle2,
  X, CreditCard, ShieldCheck, ChevronRight, Calendar, Users,
  Mic, Brain, Headphones, Video, Clock, BarChart3, Lock,
  Globe, Infinity, MessageCircle, Bot, Flame, Star,
} from "lucide-react";
import { useParams } from "react-router-dom";

/* ─────────────────────────────────────────
   SLOTIFY DESIGN TOKENS
───────────────────────────────────────── */
const S = {
  bg:          "#f0f7ff",
  white:       "#ffffff",
  border:      "#c7dff7",
  borderHard:  "#93c5fd",
  brand:       "#2563eb",
  brandDark:   "#1d4ed8",
  brandLight:  "#dbeafe",
  brandMid:    "#bfdbfe",
  text:        "#0c1a3a",
  textSub:     "#3b5e8c",
  textMuted:   "#6b8ab0",
  success:     "#059669",
  successLight:"#d1fae5",
  successBorder:"#6ee7b7",
  cyan:        "#0891b2",
  cyanLight:   "#e0f2fe",
  cyanBorder:  "#7dd3fc",
  violet:      "#7c3aed",
  violetLight: "#ede9fe",
  violetBorder:"#c4b5fd",
};

/* ─────────────────────────────────────────
   PLAN DEFINITIONS  —  Slotify flavour
───────────────────────────────────────── */
const PLANS = [
  {
    key:         "free",
    badge:       "Starter",
    tagline:     "Everything you need to get started with Slotify",
    price:       "0",
    cta:         "Get Started Free",
    Icon:        Zap,
    color:       S.textSub,
    colorLight:  S.bg,
    colorBorder: S.border,
    highlight:   null,
    slots:       "Up to 50 bookings/mo",
    SlotIcon:    Calendar,
    features: [
      { Icon: Calendar,      text: "50 bookable slots / month"      },
      { Icon: Users,         text: "Up to 10 clients / workspace"   },
      { Icon: Clock,         text: "Basic scheduling calendar"      },
      { Icon: BarChart3,     text: "Simple booking analytics"       },
    ],
    missing: ["AI meeting assistant","Session recording","Priority support","Custom branding","Calendar sync"],
  },
  {
    key:         "pro",
    badge:       "Pro",
    tagline:     "For growing professionals with serious booking needs",
    price:       "999",
    cta:         "Upgrade to Pro",
    Icon:        Sparkles,
    color:       S.brand,
    colorLight:  S.brandLight,
    colorBorder: S.brandMid,
    highlight:   "Most Popular",
    slots:       "5,000+ bookings/mo",
    SlotIcon:    Calendar,
    features: [
      { Icon: Calendar,      text: "5,000+ bookable slots / month"  },
      { Icon: Users,         text: "Up to 100 clients / workspace"  },
      { Icon: Brain,         text: "AI scheduling assistant"        },
      { Icon: Video,         text: "Session recording & playback"   },
      { Icon: BarChart3,     text: "Advanced booking analytics"     },
      { Icon: Globe,         text: "Custom booking page & branding" },
      { Icon: MessageCircle, text: "Priority email support"         },
      { Icon: Lock,          text: "Google & Outlook calendar sync" },
    ],
    missing: ["AI transcription","24/7 live support","Dedicated account manager"],
  },
  {
    key:         "enterprise",
    badge:       "Enterprise",
    tagline:     "Unlimited scale, AI-powered workflows, white-glove support",
    price:       null,
    cta:         "Contact Sales",
    Icon:        Building2,
    color:       S.cyan,
    colorLight:  S.cyanLight,
    colorBorder: S.cyanBorder,
    highlight:   "All‑Inclusive",
    slots:       "10,000+ bookings/mo",
    SlotIcon:    Infinity,
    features: [
      { Icon: Infinity,      text: "10,000+ bookable slots / month" },
      { Icon: Users,         text: "Unlimited clients"              },
      { Icon: Bot,           text: "AI assistant + smart notes"     },
      { Icon: Mic,           text: "AI recording & transcription"   },
      { Icon: Brain,         text: "AI-generated summaries"         },
      { Icon: Headphones,    text: "24 / 7 live support"            },
      { Icon: Video,         text: "HD recording & cloud storage"   },
      { Icon: Lock,          text: "SSO, SAML & enterprise security"},
      { Icon: BarChart3,     text: "Full analytics & custom reports"},
      { Icon: Globe,         text: "White-label & custom domain"    },
      { Icon: Users,         text: "Dedicated account manager"      },
      { Icon: Calendar,      text: "SLA & uptime guarantee"         },
    ],
    missing: [],
  },
];

const COMPARE = [
  { label:"Bookings / month",       free:"50",    pro:"5,000+",   ent:"10,000+"   },
  { label:"Clients per workspace",  free:"10",    pro:"100",      ent:"Unlimited" },
  { label:"Session recording",      free:false,   pro:true,       ent:true        },
  { label:"AI scheduling assistant",free:false,   pro:true,       ent:true        },
  { label:"AI transcription",       free:false,   pro:false,      ent:true        },
  { label:"AI meeting summaries",   free:false,   pro:false,      ent:true        },
  { label:"24/7 live support",      free:false,   pro:false,      ent:true        },
  { label:"Custom branding",        free:false,   pro:true,       ent:true        },
  { label:"Calendar integrations",  free:false,   pro:true,       ent:true        },
  { label:"White-label",            free:false,   pro:false,      ent:true        },
  { label:"Dedicated manager",      free:false,   pro:false,      ent:true        },
  { label:"SLA guarantee",          free:false,   pro:false,      ent:true        },
];

/* ─────────────────────────────────────────
   UPGRADE MODAL
───────────────────────────────────────── */
function UpgradeModal({ plan, onClose, onConfirm }) {
  const [step,    setStep]    = useState(1);
  const [billing, setBilling] = useState("monthly");
  const [agreed,  setAgreed]  = useState(false);
  const { Icon } = plan;

  const monthly = parseFloat(plan.price);
  const yearlyM = (monthly * 0.8).toFixed(0);
  const price   = billing === "yearly" ? yearlyM : monthly;
  const total   = billing === "yearly" ? (yearlyM * 12).toFixed(0) : monthly;
  const saving  = billing === "yearly" ? (monthly * 0.2 * 12).toFixed(0) : 0;

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position:"fixed", inset:0, zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(12,26,58,0.45)", backdropFilter:"blur(8px)" }}
    >
      <div style={{ width:"100%", maxWidth:440, margin:"0 16px", borderRadius:20, background:S.white, overflow:"hidden", border:`1.5px solid ${S.border}`, boxShadow:"0 32px 80px rgba(37,99,235,0.18)" }}>

        {/* top accent bar */}
        <div style={{ height:3, background:`linear-gradient(90deg,${plan.color},${plan.colorBorder})` }}/>

        {/* header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 24px", borderBottom:`1px solid ${S.border}`, background:S.bg }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:38, height:38, borderRadius:12, background:plan.colorLight, border:`1.5px solid ${plan.colorBorder}`, display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Icon size={16} style={{ color:plan.color }}/>
            </div>
            <div>
              <p style={{ fontSize:10, fontWeight:800, letterSpacing:"0.16em", textTransform:"uppercase", color:S.textMuted, margin:0 }}>
                {step===1 ? "Choose Billing" : "Complete Payment"}
              </p>
              <p style={{ fontSize:14, fontWeight:900, color:S.text, margin:0 }}>{plan.badge} Plan</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:8, background:S.white, border:`1px solid ${S.border}`, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", color:S.textMuted }}>
            <X size={13}/>
          </button>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={{ padding:"24px" }}>
            {/* billing toggle */}
            <div style={{ display:"flex", background:S.bg, borderRadius:12, border:`1.5px solid ${S.border}`, padding:4, marginBottom:20 }}>
              {["monthly","yearly"].map(b=>(
                <button key={b} onClick={()=>setBilling(b)}
                  style={{ flex:1, padding:"10px 0", borderRadius:9, fontSize:12, fontWeight:800, cursor:"pointer", border: billing===b?`1.5px solid ${plan.colorBorder}`:"1.5px solid transparent", background:billing===b?S.white:"transparent", color:billing===b?plan.color:S.textMuted, display:"flex", alignItems:"center", justifyContent:"center", gap:6, boxShadow:billing===b?"0 1px 8px rgba(37,99,235,0.1)":"none", transition:"all 0.15s" }}>
                  {b==="yearly" && <Flame size={10} style={{ color:"#f97316" }}/>}
                  {b.charAt(0).toUpperCase()+b.slice(1)}
                  {b==="yearly" && <span style={{ fontSize:9, fontWeight:900, color:S.success }}>-20%</span>}
                </button>
              ))}
            </div>

            {/* price display */}
            <div style={{ textAlign:"center", marginBottom:20 }}>
              <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"center", gap:4, lineHeight:1 }}>
                <span style={{ color:S.textMuted, fontSize:15, fontWeight:600, marginBottom:12 }}>₹</span>
                <span style={{ fontSize:60, fontWeight:900, color:S.text, lineHeight:1, letterSpacing:"-0.05em" }}>{price}</span>
                <span style={{ color:S.textMuted, fontSize:13, marginBottom:12 }}>/mo</span>
              </div>
              {billing==="yearly" && (
                <div style={{ display:"inline-flex", alignItems:"center", gap:6, marginTop:8, padding:"4px 12px", borderRadius:999, fontSize:11, fontWeight:800, color:S.success, background:S.successLight, border:`1px solid ${S.successBorder}` }}>
                  <Flame size={10}/> You save ₹{saving}/year
                </div>
              )}
            </div>

            {/* highlights */}
            <div style={{ background:S.bg, borderRadius:12, border:`1.5px solid ${S.border}`, padding:16, marginBottom:20 }}>
              <p style={{ fontSize:10, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color:S.textMuted, marginBottom:12 }}>Highlights</p>
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {plan.features.slice(0,4).map((f,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:18, height:18, borderRadius:6, background:plan.colorLight, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <Check size={9} style={{ color:plan.color }} strokeWidth={3}/>
                    </div>
                    <span style={{ fontSize:12.5, color:S.textSub }}>{f.text}</span>
                  </div>
                ))}
                {plan.features.length > 4 && (
                  <p style={{ fontSize:11, color:S.textMuted, marginLeft:28 }}>+{plan.features.length-4} more features</p>
                )}
              </div>
            </div>

            <button onClick={()=>setStep(2)}
              style={{ width:"100%", padding:"13px 0", borderRadius:12, fontSize:13, fontWeight:800, background:plan.color, color:"#fff", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              Continue to Payment <ArrowRight size={13}/>
            </button>
            <p style={{ textAlign:"center", fontSize:11, color:S.textMuted, marginTop:10, display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
              <ShieldCheck size={11}/> Cancel anytime · No hidden fees
            </p>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={{ padding:"24px" }}>
            {/* order summary */}
            <div style={{ background:S.bg, borderRadius:12, border:`1.5px solid ${S.border}`, padding:16, marginBottom:20 }}>
              <p style={{ fontSize:10, fontWeight:800, letterSpacing:"0.14em", textTransform:"uppercase", color:S.textMuted, marginBottom:12 }}>Order Summary</p>
              <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:4 }}>
                <span style={{ color:S.textSub }}>{plan.badge} · {billing}</span>
                <span style={{ fontWeight:800, color:S.text }}>₹{price}/mo</span>
              </div>
              {billing==="yearly" && (
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:12 }}>
                  <span style={{ color:S.success }}>Annual discount (20%)</span>
                  <span style={{ color:S.success, fontWeight:800 }}>-₹{(monthly*0.2).toFixed(0)}/mo</span>
                </div>
              )}
              <div style={{ borderTop:`1px solid ${S.border}`, marginTop:12, paddingTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:13, fontWeight:800, color:S.text }}>Due today</span>
                <span style={{ fontSize:18, fontWeight:900, color:plan.color }}>₹{total}</span>
              </div>
            </div>

            {/* card fields */}
            <div style={{ display:"flex", flexDirection:"column", gap:12, marginBottom:16 }}>
              <div>
                <label style={{ display:"block", fontSize:10, fontWeight:800, color:S.textMuted, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:6 }}>Card Number</label>
                <div style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10, background:S.white, border:`1.5px solid ${S.border}` }}>
                  <CreditCard size={13} style={{ color:S.textMuted }}/>
                  <input placeholder="1234 5678 9012 3456" style={{ flex:1, fontSize:13, color:S.text, outline:"none", background:"transparent", border:"none" }}/>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {[{label:"Expiry",placeholder:"MM / YY"},{label:"CVV",placeholder:"•••"}].map(f=>(
                  <div key={f.label}>
                    <label style={{ display:"block", fontSize:10, fontWeight:800, color:S.textMuted, textTransform:"uppercase", letterSpacing:"0.12em", marginBottom:6 }}>{f.label}</label>
                    <input placeholder={f.placeholder} style={{ width:"100%", padding:"10px 14px", borderRadius:10, background:S.white, border:`1.5px solid ${S.border}`, fontSize:13, outline:"none", color:S.text, boxSizing:"border-box" }}/>
                  </div>
                ))}
              </div>
            </div>

            {/* agree */}
            <label onClick={()=>setAgreed(!agreed)} style={{ display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer", marginBottom:20 }}>
              <div style={{ marginTop:2, width:16, height:16, borderRadius:5, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, background:agreed?plan.color:S.white, border:`1.5px solid ${agreed?plan.color:S.border}`, transition:"all 0.15s" }}>
                {agreed && <Check size={9} color="#fff" strokeWidth={3}/>}
              </div>
              <span style={{ fontSize:12, color:S.textSub, lineHeight:1.6, userSelect:"none" }}>
                I agree to the <span style={{ textDecoration:"underline" }}>Terms of Service</span> and <span style={{ textDecoration:"underline" }}>Privacy Policy</span>
              </span>
            </label>

            <button disabled={!agreed} onClick={onConfirm}
              style={{ width:"100%", padding:"13px 0", borderRadius:12, fontSize:13, fontWeight:800, background:agreed?plan.color:"#e5e7eb", color:agreed?"#fff":"#9ca3af", border:"none", cursor:agreed?"pointer":"not-allowed", display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
              <ShieldCheck size={13}/> Activate {plan.badge} Plan
            </button>
            <button onClick={()=>setStep(1)} style={{ width:"100%", marginTop:8, padding:"8px 0", fontSize:11, color:S.textMuted, background:"none", border:"none", cursor:"pointer" }}>
              ← Back to billing
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   COMPARE TABLE
───────────────────────────────────────── */
function CompareTable({ activePlanKey }) {
  const cols = [
    { key:"free", label:"Starter",    color:S.textSub, light:S.bg         },
    { key:"pro",  label:"Pro",        color:S.brand,   light:S.brandLight  },
    { key:"ent",  label:"Enterprise", color:S.cyan,    light:S.cyanLight   },
  ];
  return (
    <div style={{ marginTop:64 }}>
      <p style={{ textAlign:"center", fontSize:10, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase", color:S.textMuted, marginBottom:8 }}>Full Comparison</p>
      <h2 style={{ textAlign:"center", fontSize:24, fontWeight:900, color:S.text, marginBottom:32, letterSpacing:"-0.025em" }}>
        Everything side by side
      </h2>
      <div style={{ borderRadius:20, overflow:"hidden", border:`1.5px solid ${S.border}`, boxShadow:"0 2px 20px rgba(37,99,235,0.06)" }}>
        {/* header row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", background:S.surfaceAlt||S.bg, borderBottom:`1px solid ${S.border}` }}>
          <div style={{ padding:"14px 20px" }}/>
          {cols.map(c=>(
            <div key={c.key} style={{ padding:"14px 16px", textAlign:"center", borderLeft:`1px solid ${S.border}` }}>
              <p style={{ fontSize:10, fontWeight:900, letterSpacing:"0.16em", textTransform:"uppercase", color:c.color }}>{c.label}</p>
              {activePlanKey===c.key && (
                <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:9, fontWeight:800, color:S.success, background:S.successLight, border:`1px solid ${S.successBorder}`, padding:"2px 8px", borderRadius:999, marginTop:6 }}>
                  <span style={{ width:6, height:6, borderRadius:"50%", background:S.success, display:"inline-block" }}/>
                  Active
                </span>
              )}
            </div>
          ))}
        </div>

        {/* data rows */}
        {COMPARE.map((row,i)=>(
          <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", borderBottom: i<COMPARE.length-1?`1px solid ${S.border}`:"none", background: i%2===0?S.white:S.bg }}>
            <div style={{ padding:"12px 20px", fontSize:12.5, color:S.textSub, fontWeight:500, display:"flex", alignItems:"center" }}>{row.label}</div>
            {["free","pro","ent"].map((k,ci)=>(
              <div key={k} style={{ padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"center", borderLeft:`1px solid ${S.border}` }}>
                {typeof row[k]==="boolean"
                  ? row[k]
                    ? <div style={{ width:20, height:20, borderRadius:6, background:cols[ci].light, display:"flex", alignItems:"center", justifyContent:"center" }}>
                        <Check size={9} style={{ color:cols[ci].color }} strokeWidth={2.5}/>
                      </div>
                    : <div style={{ width:6, height:6, borderRadius:"50%", background:"#e2e8f0" }}/>
                  : <span style={{ fontSize:12, fontWeight:800, color:S.text }}>{row[k]}</span>
                }
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   PLAN CARD
───────────────────────────────────────── */
function PlanCard({ plan, isActive, onUpgrade }) {
  const [hovered, setHovered] = useState(false);
  const { Icon, badge, tagline, price, features, missing, color, colorLight, colorBorder, highlight, slots, SlotIcon } = plan;

  let priceNode;
  if (!price) {
    priceNode = (
      <div>
        <span style={{ fontSize:40, fontWeight:900, color:S.text, letterSpacing:"-0.04em", lineHeight:1 }}>Custom</span>
        <p style={{ fontSize:11, color:S.textMuted, marginTop:4 }}>tailored pricing</p>
      </div>
    );
  } else {
    priceNode = (
      <div style={{ display:"flex", alignItems:"flex-end", gap:2, lineHeight:1 }}>
        <span style={{ color:S.textMuted, fontSize:15, fontWeight:600, marginBottom:12 }}>₹</span>
        <span style={{ fontSize:50, fontWeight:900, color:S.text, lineHeight:1, letterSpacing:"-0.045em" }}>{price}</span>
        <span style={{ color:S.textMuted, fontSize:12, marginBottom:10, marginLeft:2 }}>/mo</span>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      style={{
        position:"relative", display:"flex", flexDirection:"column",
        borderRadius:20, background:S.white, overflow:"hidden",
        border: isActive ? `2px solid ${S.success}` : highlight ? `2px solid ${colorBorder}` : `1.5px solid ${S.border}`,
        boxShadow: hovered
          ? `0 20px 48px ${color}28`
          : isActive
            ? `0 8px 32px rgba(5,150,105,0.1)`
            : highlight
              ? `0 8px 32px ${color}18`
              : "0 2px 12px rgba(37,99,235,0.05)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.25s ease",
      }}
    >
      {/* top bar */}
      <div style={{ height:3, background: isActive ? `linear-gradient(90deg,${S.success},#4ade80)` : `linear-gradient(90deg,${color},${colorBorder})` }}/>

      <div style={{ padding:"22px 22px 24px", display:"flex", flexDirection:"column", flex:1 }}>

        {/* badge row */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"6px 12px", borderRadius:10, fontSize:10, fontWeight:900, letterSpacing:"0.16em", textTransform:"uppercase", background:colorLight, color, border:`1.5px solid ${colorBorder}` }}>
            <Icon size={10}/> {badge}
          </div>
          {isActive ? (
            <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:10, fontWeight:800, color:S.success, background:S.successLight, border:`1px solid ${S.successBorder}`, padding:"4px 10px", borderRadius:999 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:S.success, display:"inline-block", animation:"pulse 1.5s infinite" }}/>
              Live
            </span>
          ) : highlight ? (
            <span style={{ fontSize:9.5, fontWeight:900, padding:"4px 10px", borderRadius:999, background:colorLight, color, border:`1px solid ${colorBorder}` }}>
              {highlight}
            </span>
          ) : null}
        </div>

        {/* slots pill */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:6, alignSelf:"flex-start", marginBottom:16, padding:"6px 12px", borderRadius:10, background:colorLight, border:`1.5px solid ${colorBorder}` }}>
          <SlotIcon size={11} style={{ color }}/>
          <span style={{ fontSize:11.5, fontWeight:900, color }}>{slots}</span>
        </div>

        {/* price */}
        <div style={{ marginBottom:4 }}>{priceNode}</div>
        <p style={{ color:S.textMuted, fontSize:12.5, lineHeight:1.7, marginTop:6, marginBottom:20 }}>{tagline}</p>

        {/* features */}
        <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
          {features.map((f,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:20, height:20, borderRadius:7, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background: isActive?"#d1fae5":colorLight }}>
                <f.Icon size={10} style={{ color: isActive?S.success:color }}/>
              </div>
              <span style={{ fontSize:12.5, color:S.textSub }}>{f.text}</span>
            </div>
          ))}
        </div>

        {/* missing */}
        {missing.length > 0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:6, paddingTop:12, marginBottom:16, borderTop:`1px solid ${S.border}` }}>
            {missing.map((f,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, opacity:0.35 }}>
                <div style={{ width:20, height:20, borderRadius:7, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:"#f1f5f9" }}>
                  <X size={8} style={{ color:"#94a3b8" }}/>
                </div>
                <span style={{ fontSize:12, color:S.textMuted, textDecoration:"line-through" }}>{f}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ flex:1 }}/>

        {/* CTA */}
        {isActive ? (
          <div style={{ width:"100%", padding:"12px 0", borderRadius:12, fontSize:12.5, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:S.successLight, color:S.success, border:`1.5px solid ${S.successBorder}` }}>
            <CheckCircle2 size={13}/> Current Plan
          </div>
        ) : !price ? (
          <button style={{ width:"100%", padding:"12px 0", borderRadius:12, fontSize:12.5, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:colorLight, color, border:`1.5px solid ${colorBorder}`, cursor:"pointer" }}>
            Contact Sales <ArrowRight size={12}/>
          </button>
        ) : plan.key==="free" && !isActive ? (
          <div style={{ width:"100%", padding:"12px 0", borderRadius:12, fontSize:12.5, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:"#f1f5f9", color:"#94a3b8", border:`1.5px solid ${S.border}`, opacity:0.5, cursor:"not-allowed" }}>
            Downgrade
          </div>
        ) : (
          <button onClick={()=>onUpgrade(plan)}
            style={{ width:"100%", padding:"12px 0", borderRadius:12, fontSize:12.5, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center", gap:8, background:color, color:"#fff", border:"none", cursor:"pointer", boxShadow:`0 4px 16px ${color}30` }}>
            {plan.cta} <ArrowRight size={12}/>
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function PlansPage() {
  const { slug } = useParams();
  const [subscription,   setSubscription]   = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState(null);
  const [upgradeTarget,  setUpgradeTarget]  = useState(null);
  const [successPlan,    setSuccessPlan]    = useState(null);

  useEffect(() => {
    if (!slug) { setError("Workspace slug missing."); setLoading(false); return; }
    (async () => {
      try {
        const subRes = await axiosInstance.get(`/workspaces/${slug}/subscription/`);
        setSubscription(subRes?.data || null);
      } catch {
        setError("Failed to load subscription.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const activePlanName = (
    subscription?.plan?.name ?? subscription?.plan_name ?? subscription?.plan ?? "free"
  ).toLowerCase();

  const activePlanKey = activePlanName.includes("enterprise") || activePlanName.includes("ent")
    ? "enterprise"
    : activePlanName.includes("pro")
      ? "pro"
      : "free";

  const activePlan = PLANS.find(p => p.key === activePlanKey);
  const compareKey = activePlanKey === "enterprise" ? "ent" : activePlanKey;

  const handleConfirm = () => { setSuccessPlan(upgradeTarget); setUpgradeTarget(null); };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh" }}>
      <div style={{ display:"flex", gap:8 }}>
        {[0,1,2].map(i=>(
          <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:S.brand, animation:`bounce 1s infinite`, animationDelay:`${i*0.15}s` }}/>
        ))}
      </div>
      <style>{`@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}`}</style>
    </div>
  );

  if (error) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"60vh", color:"#ef4444", fontSize:14 }}>{error}</div>
  );

  return (
    <div style={{ minHeight:"100vh", background:S.bg, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ maxWidth:1060, margin:"0 auto", padding:"48px 24px 80px" }}>

        {/* success banner */}
        {successPlan && (
          <div style={{ marginBottom:32, display:"flex", alignItems:"center", gap:12, padding:"14px 20px", borderRadius:16, background:S.successLight, border:`1.5px solid ${S.successBorder}` }}>
            <CheckCircle2 size={17} style={{ color:S.success, flexShrink:0 }}/>
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:"#065f46" }}>You're now on {successPlan.badge} 🎉</p>
              <p style={{ fontSize:12, color:"#059669" }}>Plan activated. Enjoy {successPlan.slots} and all new features!</p>
            </div>
            <button onClick={()=>setSuccessPlan(null)} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:S.success }}>
              <X size={13}/>
            </button>
          </div>
        )}

        {/* page header */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:10, fontWeight:900, letterSpacing:"0.28em", textTransform:"uppercase", padding:"6px 16px", borderRadius:999, background:S.brandLight, color:S.brand, border:`1.5px solid ${S.brandMid}`, marginBottom:20 }}>
            <Calendar size={9}/> Slotify Plans
          </span>
          <h1 style={{ fontSize:36, fontWeight:900, color:S.text, lineHeight:1.15, marginBottom:12, letterSpacing:"-0.035em" }}>
            Book more. Do more.<br/>
            <span style={{ color:S.brand }}>Scale without limits.</span>
          </h1>
          <p style={{ color:S.textMuted, fontSize:14, maxWidth:460, margin:"0 auto", lineHeight:1.7 }}>
            From 50 free slots to 10,000+ enterprise bookings — with AI scheduling, recording, and live 24/7 support.
          </p>
        </div>

        {/* active plan indicator */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:40 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:12, padding:"10px 20px", borderRadius:12, background:S.white, border:`1.5px solid ${S.border}`, boxShadow:"0 2px 12px rgba(37,99,235,0.07)" }}>
            <div style={{ position:"relative", width:10, height:10, flexShrink:0 }}>
              <div style={{ width:10, height:10, borderRadius:"50%", background:S.success }}/>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"#4ade80", opacity:0.5, animation:"ping 1.5s infinite" }}/>
            </div>
            <span style={{ fontSize:12.5, color:S.textSub }}>
              Active plan:{" "}
              <span style={{ fontWeight:900, color:S.text }}>{activePlan?.badge}</span>
              <span style={{ margin:"0 8px", color:S.border }}>·</span>
              <span style={{ fontWeight:800, color:activePlan?.color }}>{activePlan?.slots}</span>
            </span>
            <ChevronRight size={12} style={{ color:S.border }}/>
          </div>
        </div>

        {/* plan cards */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20 }}>
          {PLANS.map(plan=>(
            <PlanCard
              key={plan.key}
              plan={plan}
              isActive={plan.key===activePlanKey}
              onUpgrade={setUpgradeTarget}
            />
          ))}
        </div>

        {/* trust strip */}
        <div style={{ display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", gap:28, marginTop:36 }}>
          {[
            { Icon:ShieldCheck,  text:"Secure payments"             },
            { Icon:CheckCircle2, text:"Cancel anytime"              },
            { Icon:Bot,          text:"AI on all paid plans"        },
            { Icon:Headphones,   text:"24/7 support on Enterprise"  },
          ].map(({ Icon:Ic, text })=>(
            <div key={text} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11.5, color:S.textMuted }}>
              <Ic size={12} style={{ color:S.borderHard }}/>{text}
            </div>
          ))}
        </div>

        {/* compare table */}
        <CompareTable activePlanKey={compareKey}/>

        {/* enterprise AI callout */}
        <div style={{ marginTop:40, borderRadius:20, border:`1.5px solid ${S.cyanBorder}`, overflow:"hidden", background:`linear-gradient(135deg,${S.cyanLight} 0%,${S.brandLight} 100%)` }}>
          <div style={{ padding:"28px 32px", display:"flex", flexDirection:"row", alignItems:"center", gap:24, flexWrap:"wrap" }}>
            <div style={{ width:48, height:48, borderRadius:16, background:S.cyan, boxShadow:`0 8px 24px ${S.cyan}40`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Brain size={22} style={{ color:"#fff" }}/>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:16, fontWeight:900, color:S.text, marginBottom:4, letterSpacing:"-0.02em" }}>
                Enterprise gets full AI power
              </p>
              <p style={{ fontSize:12.5, color:S.textSub, lineHeight:1.7 }}>
                AI scheduling assistant · AI recording & transcription · Smart summaries · 24/7 live support — all included.
              </p>
            </div>
            <button
              style={{ flexShrink:0, padding:"10px 20px", borderRadius:12, fontSize:12.5, fontWeight:800, background:S.cyan, color:"#fff", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:`0 4px 16px ${S.cyan}30` }}>
              Talk to Sales <ArrowRight size={12}/>
            </button>
          </div>
        </div>

        {/* footer */}
        <div style={{ marginTop:40, textAlign:"center" }}>
          <p style={{ fontSize:12.5, color:S.textMuted }}>
            Questions about plans?{" "}
            <span style={{ color:S.brand, fontWeight:800, cursor:"pointer" }}>Chat with our team →</span>
          </p>
        </div>

      </div>

      {upgradeTarget && (
        <UpgradeModal
          plan={upgradeTarget}
          onClose={()=>setUpgradeTarget(null)}
          onConfirm={handleConfirm}
        />
      )}

      <style>{`
        @keyframes ping { 75%,100% { transform:scale(1.8); opacity:0; } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.5; } }
        @keyframes bounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-8px); } }
      `}</style>
    </div>
  );
}