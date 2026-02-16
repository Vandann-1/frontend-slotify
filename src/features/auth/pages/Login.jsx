import { loginUser } from "../../../api/authApi";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // handle input change
  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value
    }));

  };


  // handle login submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    setError("");

    try {

      const data = await loginUser(form);


      // ========================================
      // SAVE AUTH DATA
      // ========================================

      localStorage.setItem(
        "access",
        data.access
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );


      // save tenant if admin
      if (data.tenant) {

        localStorage.setItem(
          "tenant",
          JSON.stringify(data.tenant)
        );

      } else {

        localStorage.removeItem("tenant");

      }


      // ========================================
      // ROLE BASED REDIRECT
      // ========================================

      if (data.user.role === "admin") {

        navigate("/createdashboard");

      }
      else if (data.user.role === "client") {

        navigate(`/u/${data.user.username}`);

      }
      else {

        navigate("/");

      }

    }
    catch (err) {

      console.error("Login error:", err.response?.data);

      if (err.response?.data) {

        const message =
          err.response.data.detail ||
          err.response.data.non_field_errors?.[0] ||
          "Invalid username or password";

        setError(message);

      } else {

        setError("Login failed. Try again.");

      }

    }
    finally {

      setLoading(false);

    }

  };


  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Login to Slotify
        </h2>


        {/* Error */}
        {error && (

          <div className="bg-red-100 text-red-600 text-sm p-2 mb-4 rounded">
            {error}
          </div>

        )}


        {/* Username */}
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />


        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />


        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >

          {loading ? "Logging in..." : "Login"}

        </button>


        {/* Register link */}
        <div className="text-center mt-4 text-sm">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-600 font-semibold ml-1 hover:underline"
          >
            Register
          </Link>

        </div>

      </form>

    </div>

  );

}
