import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5002');

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('newOrder', (order) => {
      if (order.status === 'pending') {
        alert(`New pending order received: ${order._id}`);
        // Ajouter la commande à l'état ou mettre à jour l'interface utilisateur
        setOrders((prevOrders) => [...prevOrders, order]);
      }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    // Cleanup function to disconnect socket on component unmount
    return () => {
      socket.off('newOrder');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  return (
    <div>
      <h1>Pending Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>{order._id} - {order.items.map(item => item.name).join(', ')}</li>
        ))}
      </ul>
    </div>
  );
};

export default DeliveryDashboard;