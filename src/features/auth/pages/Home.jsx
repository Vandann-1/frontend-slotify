import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";




function Home() {

  
  const [openDemo, setOpenDemo] = useState(false);

  return (

    <main className="bg-gray-50">

      {/* Hero Section */}

    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white">

      {/* Animated glow background */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-0 left-0 w-96 h-96 bg-purple-500 opacity-30 blur-3xl"
      />

      <motion.div
        animate={{ x: [0, -80, 0], y: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400 opacity-30 blur-3xl"
      />


      <div className="relative max-w-7xl mx-auto px-6 py-28 grid md:grid-cols-2 gap-12 items-center">


        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >

          <motion.p
            whileHover={{ scale: 1.05 }}
            className="bg-white/20 inline-block px-4 py-1 rounded-full text-sm mb-4 backdrop-blur"
          >
            Slotify Workspace Platform
          </motion.p>


          <h1 className="text-5xl font-bold leading-tight mb-6">

            Manage bookings, teams, and workflows in one powerful platform

          </h1>


          <p className="text-lg text-blue-100 mb-8">

            Built for professionals who need control, speed, and scalability.

          </p>


          <div className="flex gap-4">
             <Link to="/Register">
            <motion.button
              
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow-lg"
            >
              Start Free Trial
            </motion.button>
              </Link>

<motion.button
  onClick={() => setOpenDemo(true)}
  whileHover={{
    scale: 1.08,
    backgroundColor: "#ffffff",
    color: "#2563eb"
  }}
  whileTap={{ scale: 0.95 }}
  className="border border-white px-6 py-3 rounded-lg"
>
  Live Demo
</motion.button>


          </div>

        </motion.div>



        {/* RIGHT SIDE LIVE DASHBOARD */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >

          {/* floating card 1 */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-6 -left-6 bg-white text-black p-4 rounded-xl shadow-xl"
          >
            New Booking
          </motion.div>


          {/* main dashboard */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white text-gray-900 rounded-2xl shadow-2xl p-6 relative z-10"
          >

            <h3 className="font-semibold mb-4">
              Slotify Dashboard
            </h3>


            <div className="space-y-4">

              <motion.div
                whileHover={{ x: 6 }}
                className="bg-blue-50 p-3 rounded-lg flex justify-between"
              >
                <span>Client Booking</span>
                <span className="text-green-500">Active</span>
              </motion.div>


              <motion.div
                whileHover={{ x: 6 }}
                className="bg-purple-50 p-3 rounded-lg flex justify-between"
              >
                <span>Workspace</span>
                <span className="text-blue-500">Running</span>
              </motion.div>


              <motion.div
                whileHover={{ x: 6 }}
                className="bg-green-50 p-3 rounded-lg flex justify-between"
              >
                <span>Team Meeting</span>
                <span className="text-purple-500">Scheduled</span>
              </motion.div>

            </div>

          </motion.div>


          {/* floating card 2 */}
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute -bottom-6 -right-6 bg-white text-black p-4 rounded-xl shadow-xl"
          >
            3 Active Workspaces
          </motion.div>

        </motion.div>

      </div>

    </section>





      {/* Trust Section */}
      <section className="py-16 text-center">

        <p className="text-gray-500 mb-6 font-medium">
          Designed for professionals and teams
        </p>

        <div className="flex justify-center gap-10 text-gray-400 font-semibold">

          <span>Freelancers</span>
          <span>Doctors</span>
          <span>Mentors</span>
          <span>Teams</span>
          <span>Agencies</span>

        </div>

      </section>


      {/* Features Section */}
<section className="py-28 bg-gray-50">

  <div className="max-w-7xl mx-auto px-6">

    <h2 className="text-4xl font-bold text-center mb-16">
      Everything you need to scale
    </h2>

    <div className="grid md:grid-cols-3 gap-8">

      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition">

        <div className="text-blue-600 text-3xl mb-4">⚡</div>

        <h3 className="font-semibold text-xl mb-3">
          Fast Workspace Setup
        </h3>

        <p className="text-gray-600">
          Create and manage workspaces instantly with secure access.
        </p>

      </div>


      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition">

        <div className="text-purple-600 text-3xl mb-4">🔒</div>

        <h3 className="font-semibold text-xl mb-3">
          Secure Authentication
        </h3>

        <p className="text-gray-600">
          Built with JWT authentication and enterprise security.
        </p>

      </div>


      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition">

        <div className="text-green-600 text-3xl mb-4">📊</div>

        <h3 className="font-semibold text-xl mb-3">
          Smart Analytics
        </h3>

        <p className="text-gray-600">
          Monitor bookings and workspace performance easily.
        </p>

      </div>

    </div>

  </div>

</section>



      {/* Workflow Section */}
      <section className="py-20 px-6">

        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-3xl font-bold mb-12">
            How Slotify Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <div>

              <div className="text-3xl font-bold text-blue-600 mb-3">
                1
              </div>

              <h4 className="font-semibold mb-2">
                Create Workspace
              </h4>

              <p className="text-gray-600">
                Setup your professional workspace.
              </p>

            </div>


            <div>

              <div className="text-3xl font-bold text-blue-600 mb-3">
                2
              </div>

              <h4 className="font-semibold mb-2">
                Invite or Manage Clients
              </h4>

              <p className="text-gray-600">
                Add members and manage access.
              </p>

            </div>


            <div>

              <div className="text-3xl font-bold text-blue-600 mb-3">
                3
              </div>

              <h4 className="font-semibold mb-2">
                Start Booking & Managing
              </h4>

              <p className="text-gray-600">
                Run your workflow efficiently.
              </p>

            </div>

          </div>

        </div>

      </section>

<section className="py-28 bg-white">

  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* visual */}
    <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-10 shadow-inner">

      <div className="bg-white p-6 rounded-xl shadow-lg">
        Workspace Overview UI
      </div>

    </div>


    {/* content */}
    <div>

      <h2 className="text-4xl font-bold mb-6">
        Built for modern teams
      </h2>

      <p className="text-gray-600 mb-6">
        Slotify provides powerful tools to manage workflows,
        clients, and teams in one unified system.
      </p>

      <ul className="space-y-3">

        <li>✔ Multi-workspace architecture</li>
        <li>✔ Role-based access</li>
        <li>✔ Scalable SaaS backend</li>
        <li>✔ Secure API system</li>

      </ul>

    </div>

  </div>

</section>






      {/* CTA Section */}
<section className="py-28 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center">

  <h2 className="text-4xl font-bold mb-6">
    Start building with Slotify today
  </h2>

  <p className="mb-8 text-lg text-blue-100">
    Join the next generation workspace platform.
  </p>

 <a href="/Register" className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition">
    Create Free Account
  </a>

</section>

<section className="py-28 bg-white text-center">

  <h2 className="text-4xl font-bold mb-6">
    Replace spreadsheets with Slotify
  </h2>

  <p className="text-gray-600 max-w-2xl mx-auto">
    Stop managing bookings manually. Slotify centralizes everything
    in one modern platform designed for scalability.
  </p>

</section>





<section className="py-24 bg-white text-center">

  <h2 className="text-3xl font-bold mb-4">
    Join a growing community
  </h2>

  <p className="text-gray-600 mb-6">
    Thousands of professionals trust Slotify to manage their workflow.
  </p>

  <div className="flex justify-center gap-8 text-2xl font-bold text-blue-600">

    <div>
      100+
      <div className="text-sm text-gray-500">Users</div>
    </div>

    <div>
      50+
      <div className="text-sm text-gray-500">Workspaces</div>
    </div>

    <div>
      500+
      <div className="text-sm text-gray-500">Bookings</div>
    </div>

  </div>

</section>
<section className="py-28 bg-white">

  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* Image */}
    <div className="border-4 border-blue-600 rounded-xl shadow-xl p-2 bg-white">
      <img
        src="/images/dashboard.jpeg"
        alt="Slotify Booking Dashboard"
        className="rounded-lg"
      />
    </div>

    {/* Content */}
    <div>

      <h2 className="text-3xl font-bold mb-4">
        Manage all bookings in one place
      </h2>

      <p className="text-gray-600 mb-6">
        View, create, and manage appointments across multiple workspaces.
        Slotify gives you complete control over scheduling and availability.
      </p>

      <ul className="space-y-3 text-gray-600">

        <li>✔ Real-time booking updates</li>
        <li>✔ Multi-workspace booking management</li>
        <li>✔ Full appointment visibility</li>
        <li>✔ Easy creation and editing</li>

      </ul>

    </div>

  </div>

</section>




<section className="py-28 bg-gray-50">

  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* Content */}
    <div>

      <h2 className="text-3xl font-bold mb-4">
        Collaborate with your team and clients
      </h2>

      <p className="text-gray-600 mb-6">
        Assign bookings to team members and manage client appointments
        with complete transparency.
      </p>

      <ul className="space-y-3 text-gray-600">

        <li>✔ Assign bookings to team members</li>
        <li>✔ Client booking management</li>
        <li>✔ Team coordination</li>
        <li>✔ Full workflow visibility</li>

      </ul>

    </div>

    {/* Image */}
    <div className="border-4 border-orange-500 rounded-xl shadow-xl p-2 bg-white">
      <img
        src="/images/ab.jpeg"
        alt="Team Booking"
        className="rounded-lg"
      />
    </div>

  </div>

</section>


<section className="py-28 bg-white">

  <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

    {/* Image */}
    <div className="border-4 border-purple-500 rounded-xl shadow-xl p-2 bg-white">
      <img
        src="/images/cd.jpeg"
        alt="Booking Tracking"
        className="rounded-lg"
      />
    </div>

    {/* Content */}
    <div>

      <h2 className="text-3xl font-bold mb-4">
        Track bookings in real-time
      </h2>

      <p className="text-gray-600 mb-6">
        Monitor appointment status, updates, and changes instantly.
        Never miss an important booking.
      </p>

      <ul className="space-y-3 text-gray-600">

        <li>✔ Live booking updates</li>
        <li>✔ Status tracking</li>
        <li>✔ Instant changes visibility</li>
        <li>✔ Improved productivity</li>

      </ul>

    </div>

  </div>

</section>


<section className="py-24 bg-gray-50">

  <div className="max-w-4xl mx-auto px-6">

    <h2 className="text-3xl font-bold text-center mb-12">
      Frequently Asked Questions
    </h2>

    <div className="space-y-6">

      <div>

        <h3 className="font-semibold">
          Is Slotify free?
        </h3>

        <p className="text-gray-600">
          Yes, Slotify offers a free plan.
        </p>

      </div>


      <div>

        <h3 className="font-semibold">
          Is my data secure?
        </h3>

        <p className="text-gray-600">
          Yes, we use secure authentication and protected APIs.
        </p>

      </div>


      <div>

        <h3 className="font-semibold">
          Can I create multiple workspaces?
        </h3>

        <p className="text-gray-600">
          Yes, Slotify supports multiple workspace management.
        </p>

      </div>

    </div>

  </div>

</section>


<section className="py-24 bg-blue-600 text-white text-center">

  <h2 className="text-4xl font-bold mb-4">
    Your workflow deserves better tools
  </h2>

  <p className="mb-6">
    Start your journey with Slotify today.
  </p>

  <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">
    Get Started Now
  </button>

</section>



{/* DEMO POPUP */}
{/* SAAS DEMO BOOKING MODAL */}
{openDemo && (

<section className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

  {/* container */}
  <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200">


    {/* header */}
    <div className="flex justify-between items-center px-6 py-4 border-b">

      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Schedule a demo
        </h2>

        <p className="text-sm text-gray-500">
          See how Slotify works for your business
        </p>
      </div>

      <button
        onClick={() => setOpenDemo(false)}
        className="text-gray-400 hover:text-gray-700 text-xl"
      >
        ×
      </button>

    </div>



    {/* form */}
    <form className="px-6 py-6 space-y-5">


      {/* name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full name
        </label>

        <input
          type="text"
          name="name"
          placeholder="John Doe"
          className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>



      {/* email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Work email
        </label>

        <input
          type="email"
          name="email"
          placeholder="john@company.com"
          className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>



      {/* industry */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Industry
        </label>

        <select
          name="industry"
          className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >

          <option value="">Select industry</option>

          <option>Freelancer</option>
          <option>Healthcare</option>
          <option>Education</option>
          <option>Agency</option>
          <option>Consulting</option>
          <option>Software / IT</option>
          <option>Finance</option>
          <option>Other</option>

        </select>

      </div>



      {/* date + time */}
      <div className="grid grid-cols-2 gap-4">


        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>

          <input
            type="date"
            name="date"
            className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>



        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>

          <input
            type="time"
            name="time"
            className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>


      </div>



      {/* footer */}
      <div className="flex justify-end gap-3 pt-4 border-t">


        <button
          type="button"
          onClick={() => setOpenDemo(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-900"
        >
          Cancel
        </button>


        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
        >
          Book demo
        </button>


      </div>


    </form>

  </div>

</section>

)}














    </main>

  );

}

export default Home;
