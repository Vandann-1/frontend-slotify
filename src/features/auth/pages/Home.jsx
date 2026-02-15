import { Link } from "react-router-dom";

function Home() {

  return (

    <div className="h-screen flex flex-col justify-center items-center bg-gray-100">

      <h1 className="text-4xl font-bold mb-6">
        Welcome to Slotify
      </h1>

      <div className="space-x-4">

        <Link
          to="/login"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Register
        </Link>

      </div>

    </div>

  );
}

export default Home;
