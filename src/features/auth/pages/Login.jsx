import { useState } from "react";
import { loginUser } from "../../../api/authApi";
import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
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

    const res = await loginUser(form);

    console.log("SUCCESS:", res);

  } catch (error) {

    console.log("FULL ERROR:", error);

    if (error.response) {
      console.log("BACKEND ERROR:", error.response.data);
    }

  }

};

  return (

    <div className="flex justify-center items-center h-screen">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow w-96"
      >

        <h2 className="text-2xl mb-4">Login</h2>

        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          className="w-full mb-3 p-2 border"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full mb-3 p-2 border"
        />

        <button className="bg-blue-600 text-white w-full p-2">
          Login
        </button>

      </form>

    </div>

  );
}

export default Login;
