import React from "react";

const PlansPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      
      <h1 className="text-4xl font-bold text-center mb-12">
        Upgrade Your Plan
      </h1>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {/* FREE */}
        <div className="bg-white rounded-2xl shadow p-8 border">
          <h2 className="text-xl font-bold mb-2">Free</h2>
          <p className="text-gray-500 mb-6">Perfect to start</p>

          <p className="text-3xl font-bold mb-6">
            ₹0
          </p>

          <ul className="space-y-2 text-gray-600 mb-8">
            <li>3 Members</li>
            <li>Basic workspace</li>
            <li>Email support</li>
          </ul>

          <button className="w-full bg-gray-200 py-2 rounded-lg">
            Current Plan
          </button>
        </div>

        {/* PRO */}
        <div className="bg-white rounded-2xl shadow p-8 border border-indigo-500">
          <h2 className="text-xl font-bold mb-2">Pro</h2>
          <p className="text-gray-500 mb-6">Growing teams</p>

          <p className="text-3xl font-bold mb-6">
            ₹999/mo
          </p>

          <ul className="space-y-2 text-gray-600 mb-8">
            <li>10 Members</li>
            <li>Advanced analytics</li>
            <li>Priority support</li>
          </ul>

          <button className="w-full bg-indigo-600 text-white py-2 rounded-lg">
            Upgrade
          </button>
        </div>

        {/* ENTERPRISE */}
        <div className="bg-white rounded-2xl shadow p-8 border">
          <h2 className="text-xl font-bold mb-2">
            Enterprise
          </h2>

          <p className="text-gray-500 mb-6">
            Large organizations
          </p>

          <p className="text-3xl font-bold mb-6">
            Custom
          </p>

          <ul className="space-y-2 text-gray-600 mb-8">
            <li>Unlimited Members</li>
            <li>Dedicated support</li>
            <li>Custom integrations</li>
          </ul>

          <button className="w-full bg-black text-white py-2 rounded-lg">
            Contact Sales
          </button>
        </div>

      </div>

    </div>
  );
};

export default PlansPage;