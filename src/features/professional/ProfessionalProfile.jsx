import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, upsertMyProfile } from "../../api/professionalApi";
import { Loader2 } from "lucide-react";

const BASE_INPUT =
  "w-full px-3 py-2 border rounded bg-white outline-none focus:border-indigo-500";

export default function ProfessionalProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    qualifications: "",
    specialization: "",
    experience_years: "",
    bio: "",
    linkedin_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Load Data
  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProfile();
        const d = res?.data;

        setForm({
          qualifications: d.qualifications || "",
          specialization: d.specialization || "",
          experience_years: d.experience_years || "",
          bio: d.bio || "",
          linkedin_url: d.linkedin_url || "",
        });
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔹 Handle Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // 🔹 Validate
  const isValid =
    form.qualifications.trim() !== "" &&
    form.specialization.trim() !== "" &&
    form.experience_years !== "";

  // 🔹 Save
  const handleSave = async () => {
    if (!isValid) {
      setError("Fill all required fields");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await upsertMyProfile({
        ...form,
        experience_years: Number(form.experience_years),
      });

      navigate("/professional/dashboard");
    } catch {
      setError("Save failed");
    } finally {
      setSaving(false);
    }
  };

  // 🔹 Loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">Professional Profile</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Qualification */}
      <input
        name="qualifications"
        placeholder="Qualification (Required)"
        value={form.qualifications}
        onChange={handleChange}
        className={BASE_INPUT}
      />

      {/* Specialization */}
      <input
        name="specialization"
        placeholder="Specialization (Required)"
        value={form.specialization}
        onChange={handleChange}
        className={BASE_INPUT}
      />

      {/* Experience */}
      {/* <input
        type="number"
        name="experience_years"
        placeholder="Experience in years (Required)"
        value={form.experience_years}
        onChange={handleChange}
        className={BASE_INPUT}
      /> */}

      {/* Bio */}
      <textarea
        name="bio"
        placeholder="Write about yourself"
        value={form.bio}
        onChange={handleChange}
        className={BASE_INPUT}
      />

      {/* LinkedIn */}
      <input
        name="linkedin_url"
        placeholder="LinkedIn URL (optional)"
        value={form.linkedin_url}
        onChange={handleChange}
        className={BASE_INPUT}
      />

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!isValid || saving}
        className="w-full bg-indigo-600 text-white py-2 rounded disabled:bg-gray-300"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}