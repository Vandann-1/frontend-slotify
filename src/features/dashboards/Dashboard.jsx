import { useEffect, useState } from "react";

export default function Dashboard() {

  const [user, setUser] = useState(null);


  // ========================================
  // Load logged-in user from localStorage
  // ========================================

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {

      setUser(JSON.parse(storedUser));

    }

  }, []);



  return (

    <div className="min-h-screen bg-gray-100">


      {/* ========================================
          NAVBAR
      ======================================== */}

      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">

        <h1 className="text-xl font-bold text-blue-600">
          Slotify Dashboard
        </h1>

        <div className="flex items-center gap-4">

          <span className="text-gray-600">
            Welcome, {user?.username}
          </span>

          <button
            onClick={() => {

              localStorage.clear();
              window.location.href = "/login";

            }}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Logout
          </button>

        </div>

      </div>



      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <div className="p-6">


        {/* ========================================
            STATS CARDS
        ======================================== */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">


          {/* Total Bookings */}
          <div className="bg-white p-4 rounded shadow">

            <h3 className="text-gray-500 text-sm">
              Total Bookings
            </h3>

            <p className="text-2xl font-bold mt-2">
              0
            </p>

          </div>



          {/* Total Clients */}
          <div className="bg-white p-4 rounded shadow">

            <h3 className="text-gray-500 text-sm">
              Total Clients
            </h3>

            <p className="text-2xl font-bold mt-2">
              0
            </p>

          </div>



          {/* Today's Meetings */}
          <div className="bg-white p-4 rounded shadow">

            <h3 className="text-gray-500 text-sm">
              Today's Meetings
            </h3>

            <p className="text-2xl font-bold mt-2">
              0
            </p>

          </div>



          {/* Revenue */}
          <div className="bg-white p-4 rounded shadow">

            <h3 className="text-gray-500 text-sm">
              Revenue
            </h3>

            <p className="text-2xl font-bold mt-2">
              ₹0
            </p>

          </div>


        </div>



        {/* ========================================
            RECENT BOOKINGS TABLE
        ======================================== */}

        <div className="bg-white rounded shadow p-4">

          <h2 className="text-lg font-semibold mb-4">
            Recent Bookings
          </h2>


          <table className="w-full">

            <thead>

              <tr className="text-left border-b">

                <th className="py-2">Client</th>

                <th className="py-2">Service</th>

                <th className="py-2">Date</th>

                <th className="py-2">Status</th>

              </tr>

            </thead>


            <tbody>

              <tr>

                <td className="py-2 text-gray-500">
                  No bookings yet
                </td>

              </tr>

            </tbody>

          </table>

        </div>



      </div>

    </div>

  );

}
