import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Modal, Button, Alert } from 'react-bootstrap';

const socket = io('http://localhost:5002');

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('newOrder', (order) => {
      if (order.status === 'pending') {
        setOrders((prevOrders) => [...prevOrders, order]);
        setSelectedOrder(order);
        setShowModal(true);
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

  const handleAccept = () => {
    // Envoyer une action au serveur pour accepter la commande
    // Mettre à jour l'état de la commande localement
    setSelectedOrder(null);
    setShowModal(false);
  };

  const handleReject = () => {
    // Envoyer une action au serveur pour rejeter la commande
    // Mettre à jour l'état de la commande localement
    setSelectedOrder(null);
    setShowModal(false);
  };

  return (
    <div>
      <h1>Pending Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>{order._id} - {order.items.map(item => item.name).join(', ')}</li>
        ))}
      </ul>

      {/* Modal pour afficher les détails de la commande */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>New Pending Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Order ID: {selectedOrder ? selectedOrder._id : ''}</p>
          <p>Items: {selectedOrder ? selectedOrder.items.map(item => item.name).join(', ') : ''}</p>
          <Alert variant="info">Accepter ou refuser cette commande ?</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleAccept}>Accepter</Button>
          <Button variant="danger" onClick={handleReject}>Refuser</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeliveryDashboard;
