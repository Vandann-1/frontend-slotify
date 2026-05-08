import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, upsertMyProfile } from "../../api/professionalApi";
import { Loader2, Briefcase, GraduationCap, Link2, User, AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * SaaS UI Constants
 */
const INPUT_CLASSES = "w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 transition-all duration-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400";
const LABEL_CLASSES = "block text-sm font-medium text-slate-700 mb-1.5";

export default function ProfessionalProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    qualifications: "",
    specialization: "",
    experience_years: "",
    bio: "",
    linkedin_url: "", // Aligned with React state
  });

  const [status, setStatus] = useState({
    loading: true,
    saving: false,
    error: "",
    isCompleted: false,
    isVerified: false
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProfile();
        const d = res?.data;
        if (d) {
          setForm({
            qualifications: d.qualifications || "",
            specialization: d.specialization || "",
            experience_years: d.experience_years || "",
            bio: d.bio || "",
            linkedin_url: d.linkedin_url || "",
          });
          setStatus(prev => ({ 
            ...prev, 
            isCompleted: d.profile_completed, 
            isVerified: d.verified 
          }));
        }
      } catch (err) {
        setStatus(prev => ({ ...prev, error: "Unable to sync profile data." }));
      } finally {
        setStatus(prev => ({ ...prev, loading: false }));
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (status.error) setStatus(prev => ({ ...prev, error: "" }));
  };

  const isFormValid = 
    form.qualifications.trim() && 
    form.specialization.trim() && 
    form.experience_years !== "";

  const handleSave = async () => {
    if (!isFormValid) return;

    setStatus(prev => ({ ...prev, saving: true, error: "" }));

    try {
      // Ensure numerical conversion as per Serializer validation
      const payload = {
        ...form,
        experience_years: parseInt(form.experience_years, 10)
      };

      await upsertMyProfile(payload);
      navigate("/professional/dashboard");
    } catch (err) {
      const serverMsg = err.response?.data?.experience_years?.[0] || "Failed to update profile";
      setStatus(prev => ({ ...prev, error: serverMsg }));
    } finally {
      setStatus(prev => ({ ...prev, saving: false }));
    }
  };

  if (status.loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium italic">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-2xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Professional Profile</h1>
            <p className="text-slate-500 mt-1">Manage your expertise and public presence.</p>
          </div>
          {status.isVerified && (
            <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-8 space-y-6">
            
            {status.error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-100 p-4 rounded-lg text-red-700 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                {status.error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Qualifications */}
              <div>
                <label className={LABEL_CLASSES}>
                  <GraduationCap className="inline w-4 h-4 mr-2 mb-0.5" />
                  Highest Qualification
                </label>
                <input
                  name="qualifications"
                  value={form.qualifications}
                  onChange={handleChange}
                  placeholder="e.g. Master of Computer Science"
                  className={INPUT_CLASSES}
                />
              </div>

              {/* Specialization */}
              <div>
                <label className={LABEL_CLASSES}>
                  <Briefcase className="inline w-4 h-4 mr-2 mb-0.5" />
                  Specialization
                </label>
                <input
                  name="specialization"
                  value={form.specialization}
                  onChange={handleChange}
                  placeholder="e.g. Cloud Infrastructure"
                  className={INPUT_CLASSES}
                />
              </div>
            </div>

            {/* Years of Experience */}
            <div>
              <label className={LABEL_CLASSES}>Years of Professional Experience</label>
              <input
                type="number"
                name="experience_years"
                value={form.experience_years}
                onChange={handleChange}
                placeholder="0"
                className={`${INPUT_CLASSES} max-w-[120px]`}
              />
              <p className="text-slate-400 text-xs mt-2 italic">Must be between 0 and 60 years.</p>
            </div>

            {/* Bio */}
            <div>
              <label className={LABEL_CLASSES}>
                <User className="inline w-4 h-4 mr-2 mb-0.5" />
                Professional Bio
              </label>
              <textarea
                rows={4}
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us about your career journey..."
                className={`${INPUT_CLASSES} resize-none`}
              />
            </div>

            {/* LinkedIn URL */}
            <div>
              <label className={LABEL_CLASSES}>
                <Link2 className="inline w-4 h-4 mr-2 mb-0.5" />
                LinkedIn Profile
              </label>
              <input
                name="linkedin_url"
                value={form.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className={INPUT_CLASSES}
              />
            </div>
          </div>

          {/* Footer Action */}
          <div className="bg-slate-50 border-t border-slate-200 p-8 flex items-center justify-between">
            <div className="text-sm text-slate-500">
              {status.isCompleted ? (
                <span className="text-emerald-600 font-medium">● Profile Complete</span>
              ) : (
                "Complete required fields to finish setup."
              )}
            </div>
            <button
              onClick={handleSave}
              disabled={!isFormValid || status.saving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-8 py-2.5 rounded-lg font-semibold transition-all shadow-md shadow-indigo-200 flex items-center gap-2"
            >
              {status.saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}