import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import OrderList from "../components/OrderList";
import { Spinner } from "react-bootstrap";

const socket = io("http://172.16.44.34:5002");

function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://172.16.44.34:5002/api/order/orders")
      .then((response) => {
        setOrders(
          response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

    socket.on("newOrder", (order) => {
      setOrders((prevOrders) => [order, ...prevOrders]);
    });

    return () => {
      socket.off("newOrder");
    };
  }, []);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <OrderList orders={orders} />
    </div>
  );
}

export default OrderManagement;
