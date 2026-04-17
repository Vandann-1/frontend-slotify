import { useState } from "react";
import API from "../../api/axiosInstance";

export default function CreateService() {
  const [form, setForm] = useState({
    name: "",
    duration: "",
    price: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.duration || !form.price) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/services/", {
        name: form.name,
        duration: Number(form.duration),
        price: Number(form.price)
      });

      alert("Service Created ✅");

      // reset form
      setForm({
        name: "",
        duration: "",
        price: ""
      });

    } catch (err) {
      console.log(err.response?.data);
      alert("Error creating service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Service</h2>

      {/* NAME */}
      <div>
        <label>Service Name</label>
        <input
          type="text"
          name="name"
          placeholder="Haircut"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      {/* DURATION */}
      <div>
        <label>Duration (minutes)</label>
        <input
          type="number"
          name="duration"
          placeholder="30"
          value={form.duration}
          onChange={handleChange}
        />
      </div>

      {/* PRICE */}
      <div>
        <label>Price</label>
        <input
          type="number"
          name="price"
          placeholder="200"
          value={form.price}
          onChange={handleChange}
        />
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ marginTop: "20px" }}
      >
        {loading ? "Creating..." : "Create Service"}
      </button>
    </div>
  );
}