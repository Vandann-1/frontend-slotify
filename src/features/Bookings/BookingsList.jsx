import React, { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

export default function BookingList() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Set this based on your user auth state
  const [isAdmin, setIsAdmin] = useState(false); 

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/tenant/${slug}/booking/list/`);
      setBookings(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) fetchBookings();
  }, [slug]);

  /**
   * 12-Hour Logic
   */
  const canUserCancel = (bookingDate, startTime) => {
    if (isAdmin) return true; // Admin can always cancel
    
    try {
      const bookingDateTime = new Date(`${bookingDate}T${startTime}`);
      const now = new Date();
      
      // Calculate difference in hours
      const diffInMs = bookingDateTime.getTime() - now.getTime();
      const diffInHours = diffInMs / (1000 * 60 * 60);

      return diffInHours >= 12;
    } catch (e) {
      return false;
    }
  };

  const handleCancel = async (bookingId) => {
    const reason = window.prompt("Reason for cancellation (required):");
    if (reason === null) return; // User clicked cancel on prompt

    try {
      // Matches your Django UUID path exactly
      await API.post(`/tenant/${slug}/booking/${bookingId}/cancel/`, {
        reason: reason || "User requested cancellation",
      });
      alert("Booking successfully cancelled.");
      fetchBookings(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.error || "Unable to cancel booking.");
    }
  };

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h > 0 ? h + " hr " : ""}${m > 0 ? m + " min" : ""}`.trim();
  };

  if (loading) return <div className="flex justify-center p-20 text-indigo-600 font-semibold italic">Synchronizing...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 font-sans antialiased">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Appointments</h2>
        <p className="text-gray-500 mt-1">Manage your schedule and cancellations</p>
      </div>

      <div className="space-y-6">
        {bookings.length === 0 ? (
          <div className="text-center p-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400">
            No bookings found.
          </div>
        ) : (
          bookings.map((b) => {
            const status = b.status?.toLowerCase();
            const isCancelableStatus = status === "pending" || status === "confirmed";
            const timeAllowed = canUserCancel(b.date, b.start_time);

            return (
              <div key={b.id} className="relative flex bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                {/* Status Indicator */}
                <div className={`w-1.5 ${
                  status === 'confirmed' ? 'bg-emerald-500' : 
                  status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                }`} />

                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 tracking-tight uppercase">{b.service_name}</h3>
                      <span className="text-xs text-gray-400 font-mono tracking-tighter uppercase">{b.id.slice(0,8)}...</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 
                      status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50/50 p-4 rounded-xl">
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Customer</label>
                      <span className="text-sm font-semibold text-gray-700">{b.customer?.full_name}</span>
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-gray-400 uppercase mb-1">Date & Time</label>
                      <span className="text-sm font-semibold text-gray-700">{b.date} @ {b.start_time?.slice(0, 5)}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigate(`/chat/${b.id}`)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all"
                    >
                      Message Provider
                    </button>

                    {/* Logic: Button only shows if status is active. 
                        Button is DISABLED if user is not admin AND time < 12h */}
                    {isCancelableStatus && (
                      <button 
                        onClick={() => handleCancel(b.id)}
                        disabled={!timeAllowed}
                        title={timeAllowed ? "Cancel Booking" : "Cannot cancel within 12 hours of start time"}
                        className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all border 
                          ${timeAllowed 
                            ? "border-red-100 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white" 
                            : "bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed"
                          }`}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  {!timeAllowed && isCancelableStatus && !isAdmin && (
                    <p className="text-[10px] text-red-400 mt-2 font-medium italic">
                      * Cancellation window closed (12h limit).
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}