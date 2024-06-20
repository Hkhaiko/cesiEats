import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Notification from "../components/Notification";
import OrderSummary from "../components/OrderSummary";

const socket = io("http://localhost:5001");

function Dashboard() {
  const [data, setData] = useState({
    processing: 0,
    accepted: 0,
    delivered: 0,
    revenue: 0,
  });
  const [notification, setNotification] = useState("");

  useEffect(() => {
    socket.on("orderUpdate", (update) => {
      setData(update);
      setNotification("Order status updated!");
      setTimeout(() => setNotification(""), 3000);
    });
    return () => socket.off("orderUpdate");
  }, []);

  return (
    <div>
      <h1>Real-Time Order Dashboard</h1>
      {notification && <Notification message={notification} />}
      <OrderSummary data={data} />
    </div>
  );
}

export default Dashboard;
