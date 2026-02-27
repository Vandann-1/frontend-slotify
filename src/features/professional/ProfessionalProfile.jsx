import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const redirectTimer = useRef(null);

  const [form, setForm] = useState({
    qualifications: "",
    specialization: "",
    experience_years: "",
    bio: "",
    linkdin_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ================= LOAD PROFILE =================
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await axiosInstance.get(
          "/auth/professional/me/"
        );

        if (!res?.data) {
          setError("Invalid response from server.");
          return;
        }

        setForm({
          qualifications: res.data.qualifications || "",
          specialization: res.data.specialization || "",
          experience_years: res.data.experience_years ?? "",
          bio: res.data.bio || "",
          linkdin_url: res.data.linkdin_url || "",
        });
      } catch (err) {
        console.error("Profile load failed:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    // cleanup timer on unmount
    return () => {
      if (redirectTimer.current) {
        clearTimeout(redirectTimer.current);
      }
    };
  }, []);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    // LinkedIn basic validation
    if (form.linkdin_url && !form.linkdin_url.startsWith("http")) {
      return "Please enter a valid LinkedIn URL.";
    }

    // experience guard
    if (
      form.experience_years !== "" &&
      Number(form.experience_years) < 0
    ) {
      return "Experience cannot be negative.";
    }

    return "";
  };

  // ================= SAVE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (saving) return;

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setSuccess("");
    setError("");

    try {
      await axiosInstance.put("/auth/professional/me/", {
        ...form,
        experience_years:
          form.experience_years === ""
            ? 0
            : Number(form.experience_years),
      });

      setSuccess("Profile updated successfully.");

      // smooth redirect
      redirectTimer.current = setTimeout(() => {
        navigate("/professional/dashboard", { replace: true });
      }, 900);
    } catch (err) {
      console.error("Profile update failed:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================= LOADING UI =================
  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="text-gray-500 animate-pulse">
          Loading profile…
        </div>
      </div>
    );
  }

  // ================= ERROR UI =================
  if (error && !saving) {
    // show non-blocking error (form still usable)
    console.warn("Form error:", error);
  }

  // ================= MAIN UI =================
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Professional Profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Keep your professional information up to date.
        </p>
      </div>

      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-2xl shadow-sm p-6 space-y-5"
      >
        {/* Qualification */}
        <Input
          label="Qualification"
          name="qualifications"
          value={form.qualifications}
          onChange={handleChange}
          placeholder="e.g. BSc IT"
        />

        {/* Specialization */}
        <Input
          label="Specialization"
          name="specialization"
          value={form.specialization}
          onChange={handleChange}
          placeholder="e.g. Web Development"
        />

        {/* Experience */}
        <Input
          label="Years of Experience"
          type="number"
          name="experience_years"
          min="0"
          max="60"
          value={form.experience_years}
          onChange={handleChange}
          placeholder="e.g. 3"
        />

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900/10 outline-none"
            placeholder="Tell about your experience..."
          />
        </div>

        {/* LinkedIn */}
        <Input
          label="LinkedIn URL"
          name="linkdin_url"
          value={form.linkdin_url}
          onChange={handleChange}
          placeholder="https://linkedin.com/in/..."
        />

        {/* Messages */}
        {error && (
          <div className="text-red-600 text-sm">{error}</div>
        )}

        {success && (
          <div className="text-green-600 text-sm">
            {success}
          </div>
        )}

        {/* Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-medium transition disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

// ================= REUSABLE INPUT =================

const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  min,
  max,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-900/10 outline-none"
      placeholder={placeholder}
    />
  </div>
);

export default ProfessionalProfile;