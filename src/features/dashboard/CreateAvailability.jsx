import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

export default function CreateAvailability() {

  // =========================
  // STATES
  // =========================

  const [services, setServices] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      service: "",

      mode: "weekly",

      day_of_week: "",

      date_specific: "",

      start_time: "",

      end_time: "",

    });

  // =========================
  // TENANT
  // =========================

  const tenantSlug =
    localStorage.getItem(
      "tenant_slug"
    );

  // =========================
  // FETCH SERVICES
  // =========================

  useEffect(() => {

    if (
      tenantSlug
    ) {

      fetchServices();

    }

  }, [tenantSlug]);

  const fetchServices =
    async () => {

      try {

        const res =
          await API.get(

            `/tenant/${tenantSlug}/services/`

          );

        console.log(
          "SERVICES:",
          res.data
        );

        setServices(
          res.data || []
        );

      } catch (err) {

        console.log(
          err.response?.data || err
        );

      }

    };

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (
    e
  ) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  // =========================
  // SELECTED SERVICE
  // =========================

  const selectedService =
    services.find(

      (s) =>

        String(s.id) ===
        String(form.service)

    );

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const payload = {

          service:
            form.service,

          start_time:
            form.start_time,

          end_time:
            form.end_time,

          // AUTO DURATION
          slot_duration:
            selectedService?.duration,

        };

        // WEEKLY
        if (
          form.mode === "weekly"
        ) {

          payload.day_of_week =
            form.day_of_week;

        }

        // SPECIFIC DATE
        else {

          payload.date_specific =
            form.date_specific;

        }

        console.log(
          "PAYLOAD:",
          payload
        );

        await API.post(

          `/tenant/${tenantSlug}/availability/create/`,

          payload

        );

        alert(
          "Availability Created"
        );

        // RESET
        setForm({

          service: "",

          mode: "weekly",

          day_of_week: "",

          date_specific: "",

          start_time: "",

          end_time: "",

        });

      } catch (err) {

        console.log(
          err.response?.data || err
        );

        alert(
          "Failed"
        );

      } finally {

        setLoading(false);

      }

    };

  return (

    <div style={styles.container}>

      <div style={styles.card}>

        <h1 style={styles.heading}>
          Create Availability
        </h1>

        <form
          onSubmit={handleSubmit}
        >

          {/* SERVICES */}

          <select
            name="service"
            value={form.service}
            onChange={handleChange}
            style={styles.input}
            required
          >

            <option value="">
              Select Service
            </option>

            {services.map(
              (service) => (

                <option
                  key={service.id}
                  value={service.id}
                >

                  {service.name}
                  {" "}
                  (
                  {service.duration}
                  mins
                  )

                </option>

              )
            )}

          </select>

          {/* MODE */}

          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
            style={styles.input}
          >

            <option value="weekly">
              Weekly
            </option>

            <option value="specific">
              Specific Date
            </option>

          </select>

          {/* WEEKLY */}

          {form.mode ===
            "weekly" && (

            <select
              name="day_of_week"
              value={
                form.day_of_week
              }
              onChange={
                handleChange
              }
              style={styles.input}
              required
            >

              <option value="">
                Select Day
              </option>

              {/* PYTHON WEEKDAY */}

              <option value="0">
                Monday
              </option>

              <option value="1">
                Tuesday
              </option>

              <option value="2">
                Wednesday
              </option>

              <option value="3">
                Thursday
              </option>

              <option value="4">
                Friday
              </option>

              <option value="5">
                Saturday
              </option>

              <option value="6">
                Sunday
              </option>

            </select>

          )}

          {/* SPECIFIC DATE */}

          {form.mode ===
            "specific" && (

            <input
              type="date"
              name="date_specific"
              value={
                form.date_specific
              }
              onChange={
                handleChange
              }
              style={styles.input}
              required
            />

          )}

          {/* START */}

          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {/* END */}

          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {/* DURATION */}

          {selectedService && (

            <div
              style={
                styles.durationBox
              }
            >

              Duration:
              {" "}

              {
                selectedService.duration
              }

              {" "}
              mins

            </div>

          )}

          {/* BUTTON */}

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >

            {loading

              ? "Creating..."

              : "Create Availability"}

          </button>

        </form>

      </div>

    </div>

  );

}

const styles = {

  container: {

    minHeight: "100vh",

    background: "#f4f7fb",

    padding: "30px",

  },

  card: {

    maxWidth: "500px",

    margin: "auto",

    background: "#fff",

    padding: "30px",

    borderRadius: "20px",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",

  },

  heading: {

    textAlign: "center",

    marginBottom: "25px",

    fontSize: "30px",

  },

  input: {

    width: "100%",

    padding: "14px",

    borderRadius: "12px",

    border: "1px solid #ddd",

    marginBottom: "18px",

    fontSize: "15px",

    outline: "none",

  },

  durationBox: {

    background: "#f3e8ff",

    color: "#7e22ce",

    padding: "14px",

    borderRadius: "12px",

    marginBottom: "18px",

    fontWeight: "600",

  },

  button: {

    width: "100%",

    padding: "15px",

    border: "none",

    borderRadius: "12px",

    background: "#9929EA",

    color: "#fff",

    fontSize: "15px",

    fontWeight: "600",

    cursor: "pointer",

  },

};