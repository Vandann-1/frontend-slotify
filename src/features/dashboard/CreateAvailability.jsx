import { useState, useEffect } from "react";
import API from "../../api/axiosInstance";

export default function CreateAvailability() {
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    service: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    slot_duration: ""
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
  ];

  // 🔥 fetch services
  useEffect(() => {
    API.get("/services/")
      .then(res => setServices(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await API.post("/availability/", {
        ...form,
        day_of_week: Number(form.day_of_week),
        slot_duration: Number(form.slot_duration)
      });

      alert("Availability Created ✅");

    } catch (err) {
      console.log(err.response?.data);
      alert("Error creating availability");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Availability</h2>

      {/* SERVICE */}
      <div>
        <label>Service</label>
        <select name="service" onChange={handleChange}>
          <option value="">Select Service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* DAY */}
      <div>
        <label>Day</label>
        <select name="day_of_week" onChange={handleChange}>
          <option value="">Select Day</option>
          {days.map((d, i) => (
            <option key={i} value={i}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* TIME RANGE */}
      <div>
        <label>Start Time</label>
        <input type="time" name="start_time" onChange={handleChange} />
      </div>

      <div>
        <label>End Time</label>
        <input type="time" name="end_time" onChange={handleChange} />
      </div>

      {/* SLOT */}
      <div>
        <label>Slot Duration (minutes)</label>
        <input
          type="number"
          name="slot_duration"
          placeholder="30"
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Create Availability
      </button>
    </div>
  );
}