import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

const AdminProfessionalDetail = () => {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= LOAD =================
  useEffect(() => {
    if (!id) {
      setError("Invalid professional ID.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        console.log("Loading professional id:", id);

        const res = await axiosInstance.get(
          `/auth/admin/professionals/${id}/`
        );

        if (!res?.data) {
          setError("Invalid response from server.");
          return;
        }

        setData(res.data);
      } catch (err) {
        console.error("Failed to load professional:", err);

        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "Professional not found"
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // ================= UI STATES =================

  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Loading professional…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-600 font-medium">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-gray-500">
        No data available.
      </div>
    );
  }

  // ================= MAIN UI =================
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Professional Details
      </h1>

      <div className="bg-white border rounded-2xl p-6 space-y-4 shadow-sm">
        <Row label="Email" value={data.email} />

        <Row
          label="Qualification"
          value={data.qualifications}
        />

        <Row
          label="Specialization"
          value={data.specialization}
        />

        <Row
          label="Experience"
          value={
            data.experience_years != null
              ? `${data.experience_years} years`
              : null
          }
        />

        <Row label="Bio" value={data.bio} />

        <Row
          label="LinkedIn"
          value={data.linkdin_url}
          isLink
        />

        <Row
          label="Verified"
          value={data.verified ? "Yes" : "No"}
        />
      </div>
    </div>
  );
};

// ================= ROW COMPONENT =================

const Row = ({ label, value, isLink = false }) => (
  <div className="flex justify-between border-b pb-2 gap-4">
    <span className="text-gray-500 text-sm">{label}</span>

    <span className="font-medium text-gray-900 text-sm text-right">
      {value ? (
        isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View Profile
          </a>
        ) : (
          value
        )
      ) : (
        "—"
      )}
    </span>
  </div>
);

export default AdminProfessionalDetail;