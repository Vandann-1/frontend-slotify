import React, { useState, useEffect } from "react";
import API from "../../api/axiosInstance";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const IconZap = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IconClock = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconCalendar = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IconInfo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconLayers = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" />
  </svg>
);
const IconSun = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const IconAlertCircle = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const IconRefresh = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);

// ─── Shared Styles ────────────────────────────────────────────────────────────
const fieldBase =
  "w-full bg-blue-50 border border-blue-100 text-slate-800 text-sm font-semibold rounded-2xl px-4 py-3.5 outline-none focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all duration-200";

const chevronBg = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2393C5FD' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`;

// ─── Sub-components ───────────────────────────────────────────────────────────
const FieldLabel = ({ children }) => (
  <label className="block text-[11px] font-bold uppercase tracking-widest text-blue-400 mb-2">
    {children}
  </label>
);

const SelectField = ({ name, value, onChange, children, required }) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    required={required}
    className={`${fieldBase} appearance-none cursor-pointer`}
    style={{ backgroundImage: chevronBg, backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center" }}
  >
    {children}
  </select>
);

const Spinner = ({ size = 16, className = "" }) => (
  <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
);

const PreviewRow = ({ icon, value, label, highlight }) => (
  <div className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 ${highlight ? "bg-blue-50 border border-blue-100" : "bg-slate-50"}`}>
    <div className="w-9 h-9 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-400 flex-shrink-0 shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[13px] font-bold text-slate-800 leading-tight">{value || "—"}</p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-300 mt-0.5">{label}</p>
    </div>
  </div>
);

// ─── Slot calculator ──────────────────────────────────────────────────────────
function calcSlots(start, end, duration) {
  if (!start || !end || !duration || duration <= 0) return null;
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const diff = toMin(end) - toMin(start);
  if (diff <= 0) return null;
  return Math.floor(diff / duration);
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CreateAvailability() {
  // ── Services state (fetched from DB) ──
  const [services, setServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(false);

  // ── Form state ──
  const [form, setForm] = useState({
    service: "",
    day_of_week: "",
    start_time: "09:00",
    end_time: "17:00",
    slot_duration: "30",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // ── Fetch services from /services/ endpoint ───────────────────────────────
  const fetchServices = () => {
    setServicesLoading(true);
    setServicesError(false);
    API.get("/services/")
      .then((res) => {
        setServices(res.data);          // expects: [{ id, name }, ...]
        setServicesLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load services:", err);
        setServicesError(true);
        setServicesLoading(false);
      });
  };

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    fetchServices();
    return () => clearTimeout(t);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/availability/", {
        service: form.service,                    // UUID string
        day_of_week: Number(form.day_of_week),
        start_time: form.start_time,
        end_time: form.end_time,
        slot_duration: Number(form.slot_duration),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(JSON.stringify(err?.response?.data || "Something went wrong", null, 2));
    } finally {
      setLoading(false);
    }
  };

  const slots = calcSlots(form.start_time, form.end_time, Number(form.slot_duration));
  const selectedDay = form.day_of_week !== "" ? days[Number(form.day_of_week)] : null;
  const selectedService = services.find((s) => String(s.id) === String(form.service));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 font-sans p-4 md:p-8 lg:p-12">

      {/* ── Topbar ── */}
      <div className={`max-w-5xl mx-auto flex items-center justify-between mb-8 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
        <button className="group flex items-center gap-2 text-[13px] font-semibold text-slate-400 hover:text-blue-600 transition-colors duration-200">
          <span className="group-hover:-translate-x-0.5 transition-transform duration-200">
            <IconArrowLeft />
          </span>
          Back to Schedule
        </button>
        <div className="flex items-center gap-2 bg-white border border-blue-100 rounded-full px-4 py-2 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">System Active</span>
        </div>
      </div>

      {/* ── Page Header ── */}
      <div
        className={`max-w-5xl mx-auto mb-8 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
        style={{ transitionDelay: "60ms" }}
      >
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
            <IconZap />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-blue-400">Slotify · Availability</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Configure Availability</h1>
        <p className="text-slate-400 text-sm font-medium mt-1">Define your working shift and auto-generate appointment slots.</p>
      </div>

      {/* ── Main Grid ── */}
      <div className="max-w-5xl mx-auto grid grid-cols-12 gap-5">

        {/* ─────────────── LEFT: Form ─────────────── */}
        <div
          className={`col-span-12 lg:col-span-8 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "120ms" }}
        >
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-blue-100/80 shadow-xl shadow-blue-100/40 p-6 md:p-10">

            {/* Step 1 */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white">
                  <IconLayers />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">Step 1 — Service Details</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* ── Service Dropdown (DB-driven) ── */}
                <div>
                  <FieldLabel>Service Category</FieldLabel>

                  {/* Skeleton loading */}
                  {servicesLoading && (
                    <div className="w-full bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3.5 flex items-center gap-3">
                      <Spinner size={15} className="text-blue-300" />
                      <span className="text-sm font-semibold text-blue-300">Loading services…</span>
                    </div>
                  )}

                  {/* Error with retry */}
                  {servicesError && !servicesLoading && (
                    <div className="w-full bg-red-50 border border-red-100 rounded-2xl px-4 py-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                        <IconAlertCircle />
                        Failed to load services
                      </div>
                      <button
                        type="button"
                        onClick={fetchServices}
                        className="flex items-center gap-1.5 text-[11px] font-bold text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <IconRefresh /> Retry
                      </button>
                    </div>
                  )}

                  {/* Empty — no services in DB yet */}
                  {!servicesLoading && !servicesError && services.length === 0 && (
                    <div className="w-full bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3.5 flex items-center gap-2 text-amber-500 text-sm font-semibold">
                      <IconAlertCircle />
                      No services found. Create a service first.
                    </div>
                  )}

                  {/* Populated dropdown from DB */}
                  {!servicesLoading && !servicesError && services.length > 0 && (
                    <SelectField name="service" value={form.service} onChange={handleChange} required>
                      <option value="">Select a service</option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </SelectField>
                  )}
                </div>

                {/* Day of week */}
                <div>
                  <FieldLabel>Day of Week</FieldLabel>
                  <SelectField name="day_of_week" value={form.day_of_week} onChange={handleChange} required>
                    <option value="">Select a day</option>
                    {days.map((d, i) => (
                      <option key={i} value={i}>{d}</option>
                    ))}
                  </SelectField>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-blue-100 mb-8" />

            {/* Step 2 */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white">
                  <IconClock size={11} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">Step 2 — Shift Timing</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel>Shift Starts</FieldLabel>
                  <input type="time" name="start_time" value={form.start_time} onChange={handleChange} required className={fieldBase} />
                </div>
                <div>
                  <FieldLabel>Shift Ends</FieldLabel>
                  <input type="time" name="end_time" value={form.end_time} onChange={handleChange} required className={fieldBase} />
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-blue-100 mb-8" />

            {/* Step 3 */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-5 h-5 rounded-md bg-blue-600 flex items-center justify-center text-white">
                  <IconSun />
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-blue-600">Step 3 — Slot Frequency</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                <div>
                  <FieldLabel>Slot Duration (Minutes)</FieldLabel>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none">
                      <IconClock size={15} />
                    </div>
                    <input
                      type="number"
                      name="slot_duration"
                      value={form.slot_duration}
                      onChange={handleChange}
                      placeholder="e.g. 30"
                      min="5"
                      max="180"
                      required
                      className={`${fieldBase} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <FieldLabel>Quick Select</FieldLabel>
                  <div className="flex gap-2 flex-wrap">
                    {[15, 30, 45, 60].map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => { setForm((p) => ({ ...p, slot_duration: String(v) })); if (success) setSuccess(false); }}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 ${
                          form.slot_duration === String(v)
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200"
                            : "bg-blue-50 text-blue-400 border-blue-100 hover:border-blue-300 hover:text-blue-600"
                        }`}
                      >
                        {v} min
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Slot count banner */}
            {slots !== null && (
              <div className="mb-8 p-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                    <IconCalendar size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Auto-generated</p>
                    <p className="text-sm font-bold">
                      This shift will create <span className="font-black">{slots} appointment slots</span>
                    </p>
                  </div>
                </div>
                <div className="text-3xl font-black text-white/20 tabular-nums">{slots}</div>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || servicesLoading || services.length === 0}
              className={`w-full py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-3 transition-all duration-300 active:scale-[0.98] shadow-lg disabled:opacity-60 disabled:cursor-not-allowed ${
                success
                  ? "bg-emerald-500 text-white shadow-emerald-200"
                  : loading
                  ? "bg-blue-400 text-white shadow-blue-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200 hover:shadow-blue-300 hover:shadow-xl"
              }`}
            >
              {loading ? <><Spinner size={18} /> Processing…</> : success ? <><IconCheck /> Configuration Saved!</> : <><IconArrowRight /> Create Slot Schedule</>}
            </button>
          </form>
        </div>

        {/* ─────────────── RIGHT: Cards ─────────────── */}
        <div
          className={`col-span-12 lg:col-span-4 flex flex-col gap-5 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "200ms" }}
        >
          {/* Dark tip card */}
          <div className="relative bg-gradient-to-br from-[#0A1628] to-[#0d2248] rounded-3xl p-7 text-white overflow-hidden shadow-2xl shadow-blue-900/30">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-300 mb-5 border border-blue-500/20">
                <IconInfo />
              </div>
              <h3 className="text-[15px] font-bold mb-2 leading-snug">Optimal slot intervals</h3>
              <p className="text-[12px] text-blue-200/60 leading-relaxed">
                Professionals using 30–45 min slots report a <span className="text-blue-300 font-semibold">20% productivity gain</span> compared to hourly blocks.
              </p>
              <div className="mt-5 pt-5 border-t border-white/5 grid grid-cols-2 gap-3">
                {[{ v: "30 min", l: "Recommended" }, { v: "45 min", l: "Extended" }].map(({ v, l }) => (
                  <div key={v} className="bg-white/5 rounded-xl p-3 border border-white/5">
                    <p className="text-sm font-black text-blue-300">{v}</p>
                    <p className="text-[10px] text-blue-400/60 font-semibold mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="bg-white rounded-3xl border border-blue-100/80 shadow-xl shadow-blue-100/30 p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Live Preview</p>
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            </div>
            <div className="flex flex-col gap-2.5">
              <PreviewRow icon={<IconLayers />} value={selectedService?.name || "No service"} label="Service" highlight={!!selectedService} />
              <PreviewRow icon={<IconCalendar size={15} />} value={selectedDay || "No day selected"} label="Scheduled Day" highlight={!!selectedDay} />
              <PreviewRow icon={<IconClock size={15} />} value={`${form.start_time || "--:--"} → ${form.end_time || "--:--"}`} label="Active Window" highlight={!!(form.start_time && form.end_time)} />
              <PreviewRow icon={<IconZap />} value={form.slot_duration ? `${form.slot_duration} min intervals` : "No duration"} label="Slot Duration" highlight={!!form.slot_duration} />
            </div>
            <div className={`mt-4 rounded-2xl p-4 text-center transition-all duration-300 ${slots !== null ? "bg-blue-600" : "bg-slate-50 border border-dashed border-blue-100"}`}>
              {slots !== null ? (
                <>
                  <p className="text-[32px] font-black text-white leading-none">{slots}</p>
                  <p className="text-[11px] font-bold text-blue-200 mt-1 uppercase tracking-wider">Slots Generated</p>
                </>
              ) : (
                <p className="text-[12px] text-slate-300 font-medium py-1">Fill in fields to preview slots</p>
              )}
            </div>
            <p className="mt-4 text-[10px] text-center text-blue-300/70 font-medium italic">
              Changes sync instantly across all patient platforms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}