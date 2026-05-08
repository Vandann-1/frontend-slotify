import { useState } from "react";
import API from "../../api/axiosInstance";
import { useParams } from "react-router-dom";

const CATEGORIES = [
  "Consulting",
  "Coaching",
  "Workshop",
  "Design",
  "Development",
  "Other",
];

export default function CreateService() {

  const { slug } = useParams();

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({

      name: "",
      description: "",
      category: "",
      duration: 30,
      price: "",

    });

  // =========================
  // HANDLE CHANGE
  // =========================

  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
        e.target.value,

    });

  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const payload = {

          name:
            form.name,

          description:
            form.description,

          category:
            form.category,

          duration:
            Number(
              form.duration
            ),

          price:
            Number(
              form.price
            ),

        };

        console.log(
          "PAYLOAD:",
          payload
        );

        await API.post(

          `/tenant/${slug}/services/create/`,

          payload

        );

        alert(
          "Service Created"
        );

        setForm({

          name: "",
          description: "",
          category: "",
          duration: 30,
          price: "",

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
          Create Service
        </h1>

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <input
            type="text"
            name="name"
            placeholder="Service Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {/* DESCRIPTION */}

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            style={styles.textarea}
          />

          {/* CATEGORY */}

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={styles.input}
            required
          >

            <option value="">
              Select Category
            </option>

            {CATEGORIES.map(
              (cat) => (

                <option
                  key={cat}
                  value={cat}
                >

                  {cat}

                </option>

              )
            )}

          </select>

          {/* DURATION */}

          <select
            name="duration"
            value={form.duration}
            onChange={handleChange}
            style={styles.input}
          >

            <option value="15">
              15 mins
            </option>

            <option value="30">
              30 mins
            </option>

            <option value="45">
              45 mins
            </option>

            <option value="60">
              1 hour
            </option>

            <option value="90">
              1.5 hour
            </option>

          </select>

          {/* PRICE */}

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            style={styles.input}
            required
          />

          {/* BUTTON */}

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >

            {loading
              ? "Creating..."
              : "Create Service"}

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

  textarea: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #ddd",
    marginBottom: "18px",
    fontSize: "15px",
    minHeight: "100px",
    resize: "none",
    outline: "none",
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