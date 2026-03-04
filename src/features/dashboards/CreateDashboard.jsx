import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

export default function CreateWorkspace() {
  const navigate = useNavigate();

  const [workspaceMode, setWorkspaceMode] = useState("SOLO");

  const [form, setForm] = useState({
    name: "",
    industry: "",
    email: "",
    phone: "",
    team_size: "",
    description: ""
  });

  const [loading, setLoading] = useState(false);

  const industries = [
    "Healthcare",
    "Education",
    "Consulting",
    "Freelancing",
    "Technology",
    "Agency",
    "Finance",
    "Other"
  ];

  const teamSizes = [
    "Just me",
    "2–5 members",
    "5–10 members",
    "10–25 members",
    "25–50 members",
    "50+ members"
  ];

  // 🔹 industry → TenantType mapping (backend safe)
  const industryToTenantType = {
    Healthcare: "DOCTOR",
    Education: "TEACHER",
    Freelancing: "FREELANCER",
    Consulting: "MENTOR",
    Technology: "COMPANY",
    Agency: "COMPANY",
    Finance: "COMPANY",
    Other: "COMPANY"
  };

  // 🔹 team size mapper (UPDATED for your enums)
  const convertTeamSize = (size) => {
    const map = {
      "Just me": "JUST_ME",
      "2–5 members": "SMALL",
      "5–10 members": "SMALL",
      "10–25 members": "MEDIUM",
      "25–50 members": "LARGE",
      "50+ members": "ENTERPRISE"
    };
    return map[size] || "JUST_ME";
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        tenant_type:
          industryToTenantType[form.industry] || "COMPANY",
        workspace_type: workspaceMode,
        email: form.email,
        phone: form.phone,
        team_size:
          workspaceMode === "SOLO"
            ? "JUST_ME"
            : convertTeamSize(form.team_size)
      };

      const response = await axiosInstance.post(
        "/workspaces/",
        payload
      );

      console.log("Workspace created:", response.data);

      alert("Workspace created successfully");
      navigate("/workspaces");
    } catch (error) {
      console.error(error.response?.data);
      alert("Failed to create workspace");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 text-xl font-bold text-blue-600">
          Slotify
        </div>

        <nav className="p-4 space-y-2 text-gray-600">
          <SidebarItem active>Workspace Setup</SidebarItem>
          <SidebarItem>Members</SidebarItem>
          <SidebarItem>Plans</SidebarItem>
          <SidebarItem>Settings</SidebarItem>
        </nav>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-10">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold mb-2">
            Create your workspace
          </h1>

          <p className="text-gray-500 mb-8">
            This workspace will contain your team, bookings, and services.
          </p>

          <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-xl p-8 space-y-6"
          >
            {/* Workspace Name */}
            <FormField label="Workspace Name">
              <input
                name="name"
                onChange={handleChange}
                placeholder="e.g. Slotify Clinic"
                className="input"
                required
              />
            </FormField>

            {/* ⭐ Workspace Mode */}
            <FormField label="How will you use Slotify?">
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="SOLO"
                    checked={workspaceMode === "SOLO"}
                    onChange={(e) =>
                      setWorkspaceMode(e.target.value)
                    }
                  />
                  Just me
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="TEAM"
                    checked={workspaceMode === "TEAM"}
                    onChange={(e) =>
                      setWorkspaceMode(e.target.value)
                    }
                  />
                  I have a team
                </label>
              </div>
            </FormField>

            {/* Industry */}
            <FormField label="Industry">
              <select
                name="industry"
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Industry</option>
                {industries.map((industry) => (
                  <option key={industry}>{industry}</option>
                ))}
              </select>
            </FormField>

            {/* Contact */}
            <div className="grid grid-cols-2 gap-6">
              <FormField label="Contact Email">
                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  className="input"
                  required
                />
              </FormField>

              <FormField label="Phone Number">
                <input
                  name="phone"
                  onChange={handleChange}
                  className="input"
                  required
                />
              </FormField>
            </div>

            {/* ⭐ Team Size (ONLY for TEAM) */}
            {workspaceMode === "TEAM" && (
              <FormField label="Team Size">
                <select
                  name="team_size"
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select Team Size</option>
                  {teamSizes.map((size) => (
                    <option key={size}>{size}</option>
                  ))}
                </select>
              </FormField>
            )}

            {/* Description */}
            <FormField label="Description">
              <textarea
                name="description"
                onChange={handleChange}
                className="input"
                rows="4"
              />
            </FormField>

            {/* Submit */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow font-medium"
              >
                {loading ? "Creating..." : "Create Workspace"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* Sidebar Item */
function SidebarItem({ children, active }) {
  return (
    <div
      className={`p-2 rounded cursor-pointer ${
        active ? "bg-blue-50 text-blue-600" : ""
      }`}
    >
      {children}
    </div>
  );
}

/* Form Field */
function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}