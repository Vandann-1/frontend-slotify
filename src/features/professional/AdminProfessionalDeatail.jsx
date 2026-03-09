import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const AdminProfessionalDetail = () => {

  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    const load = async () => {
      try {

        const res = await axiosInstance.get(
          `/auth/admin/professionals/${id}/`
        );

        setData(res.data);

      } catch (err) {

        setError(
          err?.response?.data?.detail ||
          "Professional not found"
        );

      } finally {
        setLoading(false);
      }
    };

    load();

  }, [id]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading professional…
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    )
  }

  if (!data) return null;


  return (

    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">


      {/* COVER */}

      <div className="h-64 bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 rounded-b-3xl relative">

        <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2">

          <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-2xl font-bold shadow-xl ring-4 ring-blue-200">
            {data.email?.[0]?.toUpperCase()}
          </div>

        </div>

      </div>


      {/* PROFILE HEADER */}

      <div className="max-w-6xl mx-auto pt-16 text-center">

        <h1 className="text-2xl font-bold text-gray-900">
          {data.email}
        </h1>

        <div className="mt-2">

          {data.verified ? (
            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
              Verified Professional
            </span>
          ) : (
            <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
              Verification Pending
            </span>
          )}

        </div>

      </div>


      {/* STATS */}

      <div className="max-w-5xl mx-auto mt-10 grid grid-cols-3 gap-6 px-6">

        <StatCard
          title="Experience"
          value={`${data.experience_years || 0} yrs`}
        />

        <StatCard
          title="Specialization"
          value={data.specialization || "—"}
        />

        <StatCard
          title="Qualification"
          value={data.qualifications || "—"}
        />

      </div>


      {/* MAIN GRID */}

      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-3 gap-8 px-6">


        {/* SIDEBAR */}

        <div className="bg-white border rounded-xl p-6 shadow-sm">

          <h3 className="font-semibold mb-4">
            About Professional
          </h3>

          <p className="text-sm text-gray-600 mb-6">
            {data.bio || "No biography available."}
          </p>

          <InfoRow label="Email" value={data.email} />

          <InfoRow
            label="Experience"
            value={
              data.experience_years
                ? `${data.experience_years} years`
                : null
            }
          />

          <InfoRow
            label="Specialization"
            value={data.specialization}
          />

          <InfoRow
            label="Qualification"
            value={data.qualifications}
          />

          <InfoRow
            label="LinkedIn"
            value={data.linkdin_url}
            link
          />

        </div>


        {/* RIGHT CONTENT */}

        <div className="col-span-2 space-y-6">


          {/* DETAILS */}

          <div className="bg-white border rounded-xl p-6 shadow-sm">

            <h3 className="font-semibold mb-4">
              Professional Details
            </h3>

            <div className="grid grid-cols-2 gap-6">

              <InfoRow
                label="Email"
                value={data.email}
              />

              <InfoRow
                label="Verified"
                value={data.verified ? "Yes" : "No"}
              />

            </div>

          </div>


          {/* ADMIN ACTIONS */}

          <div className="bg-white border rounded-xl p-6 shadow-sm flex gap-4">

            <button className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
              Verify Professional
            </button>

            <button className="px-5 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition">
              Suspend Account
            </button>

          </div>

        </div>

      </div>

    </div>

  );

};


const StatCard = ({ title, value }) => (
  <div className="bg-white border rounded-xl p-5 shadow-sm text-center">
    <div className="text-lg font-semibold text-gray-900">{value}</div>
    <div className="text-xs text-gray-500 mt-1">{title}</div>
  </div>
);


const InfoRow = ({ label, value, link = false }) => (

  <div className="flex justify-between text-sm py-2 border-b last:border-none">

    <span className="text-gray-500">
      {label}
    </span>

    {value ? (

      link ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          View
        </a>
      ) : (
        <span className="font-medium text-gray-900">
          {value}
        </span>
      )

    ) : (
      <span className="text-gray-400">—</span>
    )}

  </div>

);

export default AdminProfessionalDetail;