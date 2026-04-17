import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

export default function BookingsList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    API.get("/bookings/")
      .then(res => setBookings(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h2>Bookings</h2>

      {bookings.map((b, i) => (
        <div key={i}>
          <p>{b.service}</p>
          <p>{b.date}</p>
          <p>{b.time}</p>
        </div>
      ))}
    </div>
  );
}