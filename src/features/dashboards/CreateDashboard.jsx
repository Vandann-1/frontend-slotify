import React, { useState } from "react";
import {
  Briefcase,
  Users,
  CreditCard,
  Settings
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateWorkspace() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    industry: "",
    email: "",
    phone: "",
    team_size: "",
    description: ""
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    localStorage.setItem(
      "workspace",
      JSON.stringify(form)
    );

    navigate("/workspace/dashboard");

  };


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


  return (

    <div className="min-h-screen flex bg-slate-100">


      {/* SIDEBAR */}
      <div className="w-64 bg-white border-r flex flex-col">

        <div className="p-6 text-xl font-bold text-blue-600">
          Slotify
        </div>

        <nav className="p-4 space-y-2 text-gray-600">

          <SidebarItem active>
            Workspace Setup
          </SidebarItem>

          <SidebarItem>
            Members
          </SidebarItem>

          <SidebarItem>
            Plans
          </SidebarItem>

          <SidebarItem>
            Settings
          </SidebarItem>

        </nav>

      </div>



      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">


        <div className="max-w-4xl">


          {/* HEADER */}
          <h1 className="text-3xl font-bold mb-2">
            Create your workspace
          </h1>

          <p className="text-gray-500 mb-8">
            This workspace will contain your team, bookings, and services.
          </p>



          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow rounded-xl p-8 space-y-6"
          >



            {/* WORKSPACE NAME */}
            <FormField label="Workspace Name">

              <input
                name="name"
                onChange={handleChange}
                placeholder="e.g. Slotify Clinic"
                className="input"
                required
              />

            </FormField>



            {/* INDUSTRY */}
            <FormField label="Industry">

              <select
                name="industry"
                onChange={handleChange}
                className="input"
                required
              >

                <option value="">
                  Select Industry
                </option>

                {industries.map((industry) => (

                  <option key={industry}>
                    {industry}
                  </option>

                ))}

              </select>

            </FormField>



            {/* EMAIL + PHONE */}
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



            {/* TEAM SIZE */}
            <FormField label="Team Size">

              <select
                name="team_size"
                onChange={handleChange}
                className="input"
                required
              >

                <option>
                  Select Team Size
                </option>

                {teamSizes.map((size) => (

                  <option key={size}>
                    {size}
                  </option>

                ))}

              </select>

            </FormField>



            {/* DESCRIPTION */}
            <FormField label="Description">

              <textarea
                name="description"
                onChange={handleChange}
                className="input"
                rows="4"
              />

            </FormField>



            {/* BUTTON */}
            <div className="pt-4">

              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg shadow font-medium"
              >
                Create Workspace
              </button>

            </div>


          </form>

        </div>

      </div>

    </div>

  );

}



/* COMPONENTS */

function SidebarItem({ children, active }) {

  return (

    <div className={`
      p-2 rounded cursor-pointer
      ${active ? "bg-blue-50 text-blue-600" : ""}
    `}>

      {children}

    </div>

  );

}


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
