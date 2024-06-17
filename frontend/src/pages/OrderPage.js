// src/pages/OrdersPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/api/delivery/id')  // Remplacez par votre URL d'API
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the orders!', error);
      });
  }, []);

  return (
    <Container className="orders-page">
      <Row className="justify-content-center mt-4">
        <Col xs={12} className="text-center">
          <img src="logo.svg" alt="Logo" className="mb-4 logo" />
        </Col>
        <Col xs={12} className="text-center">
          <Button variant="dark" className="mb-4" onClick={() => navigate('/')}>Retour</Button>
        </Col>
        {orders.map(order => (
          <Col xs={12} key={order.id} className="mb-3">
            <Card className="order-card">
              <Card.Body>
                <Card.Title>Commande N°{order.id}</Card.Title>
                <Card.Text>
                  <strong>Durée estimée:</strong> {order.estimated_time} <br />
                  <strong>Distance:</strong> {order.distance} km <br />
                  <strong>Revenu:</strong> <span className="text-success">+{order.revenue} €</span>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default OrdersPage;
