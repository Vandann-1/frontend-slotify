import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../../api/authApi";

function Register() {

  const navigate = useNavigate(); // ← add this

  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const response = await registerUser(form);

      console.log(response);

      alert("User registered successfully");

      // redirect to login page
      navigate("/login");

    } catch (error) {

      console.error(error.response?.data || error);

      alert(
        error.response?.data?.email?.[0] ||
        error.response?.data?.username?.[0] ||
        "Registration failed"
      );

    }

  };


  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow rounded w-96"
      >

        <h2 className="text-2xl font-bold mb-4">
          Register
        </h2>

        <input
          type="text"
          name="full_name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Register
        </button>

      </form>

    </div>

  );

}

export default Register;
