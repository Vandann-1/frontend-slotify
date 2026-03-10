import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Check, Users, Zap, Building2, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { useParams } from "react-router-dom";

const PLAN_META = [
  {
    badge: "Starter",
    description: "Perfect for small teams getting started",
    cta: "Get Started",
    icon: <Zap size={13} />,
    forcedPrice: null,
  },
  {
    badge: "Professional",
    description: "Everything you need to scale fast",
    cta: "Get Started",
    icon: <Sparkles size={13} />,
    forcedPrice: "99.9",
    popular: true,
  },
  {
    badge: "Enterprise",
    description: "Custom solutions for large organizations",
    cta: "Contact Us",
    icon: <Building2 size={13} />,
    forcedPrice: "custom",
  },
];

export default function PlansPage() {
  const { slug } = useParams();
  const [plans, setPlans]               = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  useEffect(() => {
    if (!slug) { setError("Workspace slug missing."); setLoading(false); return; }
    (async () => {
      try {
        const plansRes = await axiosInstance.get("/plans/");
        setPlans(plansRes?.data || []);
        const subRes = await axiosInstance.get(`/workspaces/${slug}/subscription/`);
        setSubscription(subRes?.data || null);
      } catch (err) {
        setError("Failed to load plans.");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <div key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-bounce"
            style={{ animationDelay: `${i*0.15}s` }} />
        ))}
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center py-32 text-red-400 text-sm">{error}</div>
  );

  const merged = PLAN_META.map((meta, i) => ({ ...(plans[i] || {}), ...meta }));

  // Robust match: compare by id, name, or plan_name (handles nested objects too)
  const activePlanId   = subscription?.plan?.id   ?? subscription?.plan_id   ?? null;
  const activePlanName = subscription?.plan?.name ?? subscription?.plan_name ?? subscription?.plan ?? "";

  const isActive = (plan) => {
    if (!subscription) return false;
    if (activePlanId   && plan.id)   return String(plan.id)   === String(activePlanId);
    if (activePlanName && plan.name) return plan.name.toLowerCase() === String(activePlanName).toLowerCase();
    if (activePlanName && plan.badge) return plan.badge.toLowerCase() === String(activePlanName).toLowerCase();
    return false;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="text-center mb-14">
        <span className="inline-block text-[10px] font-semibold tracking-[0.3em] uppercase text-blue-500 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full mb-5">
          Pricing Plans
        </span>
        <h1 className="text-[38px] font-semibold text-slate-900 leading-tight tracking-tight"
          style={{ fontFamily:"'Georgia', serif" }}>
          Simple, transparent pricing
        </h1>
        <p className="text-slate-400 mt-3 text-[14px] max-w-xs mx-auto leading-relaxed">
          No hidden fees. Pick the plan that fits your team.
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-5">
        {merged.map((plan, index) => {
          const active    = isActive(plan);
          const fp        = plan.forcedPrice;
          const rawPrice  = fp ?? plan.price;

          // Price node
          let priceNode;
          if (fp === "custom" || rawPrice === null || rawPrice === undefined) {
            priceNode = (
              <div>
                <span className="text-[40px] font-semibold text-slate-900 leading-none tracking-tight"
                  style={{ letterSpacing:"-0.03em" }}>
                  Custom
                </span>
                <p className="text-slate-400 text-xs mt-1.5">tailored to your scale</p>
              </div>
            );
          } else {
            const str    = String(rawPrice);
            const [w, d] = str.includes(".") ? str.split(".") : [str, null];
            const isZero = w === "0";
            priceNode = (
              <div className="flex items-end gap-0.5 leading-none">
                <span className="text-slate-400 text-sm font-medium mb-2">₹</span>
                <span className="text-[52px] font-semibold text-slate-900 leading-none"
                  style={{ letterSpacing:"-0.04em" }}>
                  {isZero ? "0" : w}
                </span>
                {d && !isZero && (
                  <span className="text-2xl font-semibold text-slate-700 mb-1.5">.{d}</span>
                )}
                <span className="text-slate-400 text-sm font-normal mb-2 ml-1">/mo</span>
              </div>
            );
          }

          return (
            <div
              key={plan.id || plan.badge || index}
              className="relative flex flex-col rounded-[20px] overflow-hidden bg-white"
              style={{
                border: active
                  ? "1.5px solid #22c55e"
                  : plan.popular
                    ? "1.5px solid #bfdbfe"
                    : "1.5px solid #e8edf3",
                boxShadow: active
                  ? "0 8px 32px rgba(34,197,94,0.12), 0 1px 4px rgba(0,0,0,0.04)"
                  : plan.popular
                    ? "0 8px 32px rgba(37,99,235,0.10), 0 1px 4px rgba(0,0,0,0.04)"
                    : "0 2px 12px rgba(0,0,0,0.05)",
                transition: "transform 0.22s ease, box-shadow 0.22s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-5px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {/* Top bar */}
              <div className="h-[3px] w-full" style={{
                background: active
                  ? "linear-gradient(90deg, #16a34a, #4ade80)"
                  : plan.popular
                    ? "linear-gradient(90deg, #2563eb, #60a5fa)"
                    : "transparent",
              }} />

              <div className="px-7 pt-6 pb-7 flex flex-col flex-1">

                {/* Badge row */}
                <div className="flex items-center justify-between mb-5">
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.18em] uppercase px-3 py-1 rounded-full"
                    style={{
                      background: active
                        ? "#f0fdf4"
                        : plan.popular ? "#eff6ff" : "#f8fafc",
                      color: active
                        ? "#16a34a"
                        : plan.popular ? "#2563eb" : "#64748b",
                      border: active
                        ? "1px solid #bbf7d0"
                        : plan.popular ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                    }}
                  >
                    {plan.icon}
                    {plan.badge}
                  </span>

                  {/* Right pill: Active OR Popular */}
                  {active ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  ) : plan.popular ? (
                    <span className="text-[10px] font-semibold text-blue-500 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                      Most Popular
                    </span>
                  ) : null}
                </div>

                {/* Price */}
                <div className="mb-1">{priceNode}</div>

                {/* Description */}
                <p className="text-slate-400 text-[13px] leading-relaxed mt-2">
                  {plan.description}
                </p>

                {/* Member count */}
                {plan.member_limit && (
                  <p className="flex items-center gap-1.5 text-slate-400 text-[12px] mt-1.5">
                    <Users size={11} className="text-slate-300" />
                    {plan.member_limit} members included
                  </p>
                )}

                <div className="flex-1" />

                {/* Divider */}
                <div className="border-t border-slate-100 my-5" />

                {/* Features */}
                <ul className="space-y-2.5 mb-6">
                  {(plan.features || []).map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-slate-600">
                      <span
                        className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{
                          background: active
                            ? "#f0fdf4"
                            : plan.popular ? "#eff6ff" : "#f1f5f9",
                        }}
                      >
                        <Check size={9} style={{
                          color: active ? "#16a34a" : plan.popular ? "#2563eb" : "#94a3b8"
                        }} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                {active ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 cursor-default"
                    style={{
                      background: "#f0fdf4",
                      color: "#16a34a",
                      border: "1.5px solid #bbf7d0",
                    }}
                  >
                    <CheckCircle2 size={15} />
                    Currently Active
                  </button>
                ) : (
                  <button
                    className="w-full py-3 rounded-xl text-[13.5px] font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] group"
                    style={{ background:"#0f172a", color:"#ffffff" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#1e293b"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#0f172a"; }}
                  >
                    {plan.cta}
                    <ArrowRight size={13}
                      className="group-hover:translate-x-0.5 transition-transform duration-200" />
                  </button>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}