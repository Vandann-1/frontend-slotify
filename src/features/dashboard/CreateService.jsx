import React, { useState } from "react";
import API from "../../api/axiosInstance";
import {
  FiPlus, FiArrowLeft, FiGrid, FiClock,
  FiTag, FiZap, FiCheck, FiInfo, FiDollarSign,
  FiAlignLeft, FiToggleRight, FiGlobe
} from "react-icons/fi";

// ─── SlotifyInput wrapper ──────────────────────────────────────────────────────
const SlotifyInput = ({ label, hint, children }) => (
  <div className="flex flex-col gap-2">
    {label && (
      <label className="text-[10px] font-black text-[#718096] uppercase tracking-[0.15em] ml-1">
        {label}
      </label>
    )}
    {children}
    {hint && <p className="text-[11px] text-[#A0AEC0] ml-1 font-medium">{hint}</p>}
  </div>
);

// ─── Input field ──────────────────────────────────────────────────────────────
const Field = ({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && (
      <Icon
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0AEC0] pointer-events-none"
        size={15}
      />
    )}
    <input
      {...props}
      className={`w-full bg-[#F7FAFC] border-2 border-[#EDF2F7] rounded-[16px]
        py-[13px] pr-4 font-bold text-sm text-[#1A365D] outline-none
        transition-all duration-200 placeholder-[#CBD5E0]
        focus:border-[#3182CE] focus:bg-white focus:shadow-[0_8px_24px_rgba(49,130,206,0.07)]
        ${Icon ? "pl-11" : "pl-4"}`}
    />
  </div>
);

// ─── Textarea field ───────────────────────────────────────────────────────────
const TextArea = ({ icon: Icon, ...props }) => (
  <div className="relative">
    {Icon && (
      <Icon
        className="absolute left-4 top-4 text-[#A0AEC0] pointer-events-none"
        size={15}
      />
    )}
    <textarea
      rows={3}
      {...props}
      className={`w-full bg-[#F7FAFC] border-2 border-[#EDF2F7] rounded-[16px]
        py-3 pr-4 font-medium text-sm text-[#1A365D] outline-none resize-none
        transition-all duration-200 placeholder-[#CBD5E0]
        focus:border-[#3182CE] focus:bg-white focus:shadow-[0_8px_24px_rgba(49,130,206,0.07)]
        ${Icon ? "pl-11" : "pl-4"}`}
    />
  </div>
);

// ─── Toggle ───────────────────────────────────────────────────────────────────
const Toggle = ({ label, checked, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className="flex items-center justify-between w-full bg-[#F7FAFC] border-2 border-[#EDF2F7]
      rounded-[16px] px-4 py-3 transition-all duration-200 hover:border-[#BEE3F8] group"
  >
    <span className="text-sm font-bold text-[#4A5568] group-hover:text-[#2B6CB0] transition-colors">
      {label}
    </span>
    <div
      className={`relative w-10 h-5 rounded-full transition-all duration-300 ${
        checked ? "bg-[#3182CE]" : "bg-[#CBD5E0]"
      }`}
    >
      <div
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm
          transition-all duration-300 ${checked ? "left-5" : "left-0.5"}`}
      />
    </div>
  </button>
);

// ─── Category pill ─────────────────────────────────────────────────────────────
const CATEGORIES = ["Consultation", "Coaching", "Workshop", "Session", "Review", "Other"];

const CategoryPill = ({ label, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wide
      transition-all duration-200 border-2 ${
        selected
          ? "bg-[#3182CE] text-white border-[#3182CE] shadow-[0_4px_12px_rgba(49,130,206,0.25)]"
          : "bg-white text-[#718096] border-[#EDF2F7] hover:border-[#BEE3F8] hover:text-[#3182CE]"
      }`}
  >
    {label}
  </button>
);

// ─── Stat badge ───────────────────────────────────────────────────────────────
const StatBadge = ({ label, value, color }) => (
  <div className={`flex-1 rounded-2xl p-3 text-center ${color}`}>
    <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-0.5">{label}</p>
    <p className="text-base font-black">{value}</p>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function CreateService() {
  const [form, setForm] = useState({
    name: "",
    duration: "",
    price: "",
    description: "",
    category: "",
    isPublic: true,
    allowOnline: false,
  });
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    if (isSuccess) setIsSuccess(false);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Service name is required";
    if (!form.duration) e.duration = "Duration is required";
    if (!form.price) e.price = "Price is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    try {
      setLoading(true);
      await API.post("/services/create/", {
        name: form.name,
        duration: Number(form.duration),
        price: Number(form.price),
        description: form.description,
        category: form.category,
        is_public: form.isPublic,
        allow_online: form.allowOnline,
      });
      setIsSuccess(true);
      setForm({ name: "", duration: "", price: "", description: "", category: "", isPublic: true, allowOnline: false });
      setErrors({});
    } catch {
      setErrors({ api: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const previewDuration = form.duration
    ? Number(form.duration) >= 60
      ? `${Math.floor(form.duration / 60)}h ${form.duration % 60 ? form.duration % 60 + "m" : ""}`.trim()
      : `${form.duration}m`
    : "—";

  return (
    <div
      className="min-h-screen bg-[#F0F7FF] p-6 lg:p-12"
      style={{ fontFamily: "'Lexend', sans-serif" }}
    >
      {/* Google font */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700;800;900&display=swap');`}</style>

      {/* ── Header ── */}
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-10">
        <button className="flex items-center gap-2 text-sm font-bold text-[#718096] hover:text-[#3182CE] transition-all group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" size={16} />
          Dashboard
        </button>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl shadow-sm border border-blue-50">
          <div className="w-2 h-2 rounded-full bg-[#3182CE] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#3182CE]">
            Slotify Studio
          </span>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-5xl mx-auto grid grid-cols-12 gap-8">

        {/* ── LEFT: Main form ── */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-[0_20px_60px_rgba(49,130,206,0.06)] border border-white">

            {/* Card header */}
            <div className="mb-10">
              <div className="w-14 h-14 bg-[#EBF8FF] rounded-2xl flex items-center justify-center text-[#3182CE] mb-6 shadow-inner">
                <FiGrid size={24} />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-[#1A365D] mb-1">
                Create Service
              </h1>
              <p className="text-[#A0AEC0] font-medium text-sm">
                Add a new offering to your scheduling page.
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">

              {/* Service name */}
              <SlotifyInput label="Service Identity" hint={errors.name}>
                <Field
                  icon={FiTag}
                  type="text"
                  name="name"
                  placeholder="e.g. Initial Consultation"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-400 font-semibold ml-1 -mt-1">{errors.name}</p>
                )}
              </SlotifyInput>

              {/* Description */}
              <SlotifyInput label="Description (optional)">
                <TextArea
                  icon={FiAlignLeft}
                  name="description"
                  placeholder="Briefly describe what clients can expect..."
                  value={form.description}
                  onChange={handleChange}
                />
              </SlotifyInput>

              {/* Duration + Price */}
              <div className="grid grid-cols-2 gap-5">
                <SlotifyInput label="Time Block (min)">
                  <Field
                    icon={FiClock}
                    type="number"
                    name="duration"
                    placeholder="45"
                    min="5"
                    value={form.duration}
                    onChange={handleChange}
                  />
                  {errors.duration && (
                    <p className="text-[11px] text-red-400 font-semibold ml-1">{errors.duration}</p>
                  )}
                </SlotifyInput>

                <SlotifyInput label="Pricing (USD)">
                  <Field
                    icon={FiDollarSign}
                    type="number"
                    name="price"
                    placeholder="99"
                    min="0"
                    value={form.price}
                    onChange={handleChange}
                  />
                  {errors.price && (
                    <p className="text-[11px] text-red-400 font-semibold ml-1">{errors.price}</p>
                  )}
                </SlotifyInput>
              </div>

              {/* Category */}
              <SlotifyInput label="Category">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((c) => (
                    <CategoryPill
                      key={c}
                      label={c}
                      selected={form.category === c}
                      onClick={() => {
                        setForm({ ...form, category: form.category === c ? "" : c });
                        if (isSuccess) setIsSuccess(false);
                      }}
                    />
                  ))}
                </div>
              </SlotifyInput>

              {/* Toggles */}
              <div className="space-y-3">
                <Toggle
                  label="Visible on public booking page"
                  checked={form.isPublic}
                  onChange={(v) => setForm({ ...form, isPublic: v })}
                />
                <Toggle
                  label="Allow online / virtual sessions"
                  checked={form.allowOnline}
                  onChange={(v) => setForm({ ...form, allowOnline: v })}
                />
              </div>

              {/* API error */}
              {errors.api && (
                <p className="text-sm text-red-500 font-semibold text-center">{errors.api}</p>
              )}

              {/* Submit */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-black text-white text-sm
                    transition-all duration-300 shadow-lg flex items-center justify-center gap-3
                    active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
                    ${isSuccess
                      ? "bg-[#38A169] shadow-[0_8px_24px_rgba(56,161,105,0.25)]"
                      : "bg-[#3182CE] hover:bg-[#2B6CB0] shadow-[0_8px_24px_rgba(49,130,206,0.25)]"
                    }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Publishing...
                    </span>
                  ) : isSuccess ? (
                    <><FiCheck size={16} /> Published Successfully</>
                  ) : (
                    <><FiPlus size={16} /> Save Service</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Preview + info ── */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">

          {/* Live preview card */}
          <div className="bg-white rounded-[40px] p-8 shadow-sm border border-white flex flex-col items-center text-center">
            <span className="text-[10px] font-black text-[#A0AEC0] uppercase tracking-[0.2em] mb-8">
              Client View Preview
            </span>

            {/* Icon */}
            <div className="w-20 h-20 bg-[#F0F7FF] rounded-[28px] flex items-center justify-center text-[#3182CE] mb-5 border border-blue-50">
              <FiZap size={30} />
            </div>

            {/* Name */}
            <h2 className="text-xl font-black text-[#1A365D] mb-1 min-h-[28px] leading-tight">
              {form.name || "Service Title"}
            </h2>

            {/* Description preview */}
            {form.description && (
              <p className="text-[12px] text-[#718096] font-medium mt-1 max-w-[200px] leading-relaxed">
                {form.description.slice(0, 80)}{form.description.length > 80 ? "…" : ""}
              </p>
            )}

            {/* Pills */}
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <span className="bg-[#EBF8FF] text-[#3182CE] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide">
                {previewDuration}
              </span>
              <span className="bg-[#F0FFF4] text-[#38A169] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide">
                ${form.price || "0.00"}
              </span>
              {form.category && (
                <span className="bg-[#FAF5FF] text-[#6B46C1] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wide">
                  {form.category}
                </span>
              )}
            </div>

            {/* Stats row */}
            <div className="flex gap-2 w-full mt-6">
              <StatBadge
                label="Visibility"
                value={form.isPublic ? "Public" : "Hidden"}
                color={form.isPublic ? "bg-[#F0FFF4] text-[#38A169]" : "bg-[#FFF5F5] text-[#E53E3E]"}
              />
              <StatBadge
                label="Format"
                value={form.allowOnline ? "Online" : "In-person"}
                color="bg-[#EBF8FF] text-[#3182CE]"
              />
            </div>

            <div className="w-full h-px bg-[#EDF2F7] my-6" />

            <p className="text-[10px] text-[#A0AEC0] font-medium leading-relaxed italic">
              "This is how your clients will see the service on your booking page."
            </p>
          </div>

          {/* Sync info card */}
          <div className="bg-[#EBF8FF] rounded-[30px] p-5 flex gap-4 border border-blue-100">
            <div className="shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#3182CE] shadow-sm">
              <FiInfo size={16} />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#2C5282] uppercase tracking-tighter mb-1">
                Slotify Sync
              </p>
              <p className="text-[11px] font-medium text-[#4A5568] leading-relaxed">
                All services are instantly synced to your public booking URL. Changes go live immediately.
              </p>
            </div>
          </div>

          {/* Public URL card */}
          <div className="bg-white rounded-[30px] p-5 flex gap-4 border border-[#EDF2F7]">
            <div className="shrink-0 w-10 h-10 bg-[#F0FFF4] rounded-xl flex items-center justify-center text-[#38A169] shadow-sm">
              <FiGlobe size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-[#276749] uppercase tracking-tighter mb-1">
                Your booking URL
              </p>
              <p className="text-[11px] font-bold text-[#3182CE] truncate">
                slotify.app/book/<span className="text-[#1A365D]">your-username</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}