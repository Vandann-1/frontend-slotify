import React, { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { useParams } from "react-router-dom";

export default function BookingList() {
  const { slug } = useParams();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    API.get(`/tenant/${slug}/booking/list/`)
      .then((res) => {
        setBookings(res.data);
      })
      .catch(() => {
        alert("Failed to load bookings");
      })
      .finally(() => setLoading(false));

  }, [slug]);

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: 600, margin: "30px auto" }}>
      <h2>Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <p><b>Service:</b> {b.service}</p>
            <p><b>Date:</b> {b.date}</p>
            <p><b>Time:</b> {b.start_time}</p>
            <p><b>Status:</b> {b.status}</p>
          </div>
        ))
      )}
    </div>
  );
}