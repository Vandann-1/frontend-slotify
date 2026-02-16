import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../../../api/authApi";

export default function Register() {

  const navigate = useNavigate();

  // ========================================
  // STATE
  // ========================================

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    role: "admin" // default role
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));

  };


  // ========================================
  // HANDLE REGISTER
  // ========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {

      const data = await registerUser(form);


      // ========================================
      // CURRENT FLOW (CORRECT)
      // REGISTER → LOGIN
      // ========================================

      setSuccess("Account created successfully. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);


      // ========================================
      // FUTURE FLOW (AUTO LOGIN)
      // UNCOMMENT WHEN NEEDED
      // ========================================

      /*
      localStorage.setItem("access", data.access);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      if (data.tenant) {

        localStorage.setItem(
          "tenant",
          JSON.stringify(data.tenant)
        );

      }

      if (data.user.role === "admin") {

        navigate("/dashboard");

      } else {

        navigate(`/u/${data.user.username}`);

      }
      */

    }
    catch (err) {

      console.log("REGISTER ERROR:", err);

      if (err.response && err.response.data) {

        const messages = Object.values(err.response.data)
          .flat()
          .join(" ");

        setError(messages);

      }
      else if (err.request) {

        setError("Server not running. Start Django server.");

      }
      else {

        setError("Registration failed.");

      }

    }
    finally {

      setLoading(false);

    }

  };


  // ========================================
  // UI
  // ========================================

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">

      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">


        {/* HEADER */}
        <div className="text-center mb-6">

          <h1 className="text-3xl font-bold text-blue-600">
            Slotify
          </h1>

          <p className="text-gray-500">
            Create your account
          </p>

        </div>


        {/* SUCCESS */}
        {success && (
          <div className="bg-green-100 text-green-700 text-sm p-2 mb-4 rounded">
            {success}
          </div>
        )}


        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 mb-4 rounded">
            {error}
          </div>
        )}


        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">


          {/* ROLE */}
          <div>

            <label className="text-sm font-medium text-gray-700">
              Register as:
            </label>

            <div className="flex gap-6 mt-1">

              <label className="flex items-center gap-2">

                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={form.role === "admin"}
                  onChange={handleChange}
                />

                Admin

              </label>


              <label className="flex items-center gap-2">

                <input
                  type="radio"
                  name="role"
                  value="client"
                  checked={form.role === "client"}
                  onChange={handleChange}
                />

                Client

              </label>

            </div>

          </div>


          {/* FULL NAME */}
          <input
            type="text"
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full p-2 border rounded-lg"
          />


          {/* USERNAME */}
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full p-2 border rounded-lg"
          />


          {/* EMAIL */}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-2 border rounded-lg"
          />


          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-2 border rounded-lg"
          />


          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >

            {loading ? "Creating account..." : "Create Account"}

          </button>

        </form>


        {/* LOGIN LINK */}
        <div className="text-center mt-6 text-sm">

          Already have an account?

          <Link
            to="/login"
            className="text-blue-600 font-semibold ml-1"
          >
            Login
          </Link>

        </div>


      </div>

    </div>

  );

}
