// src/pages/OrderPage.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import './OrderPage.css';
import logo from '../img/logo.png'; // Chemin vers votre propre fichier de logo
import profileIcon from '../img/logo.svg'; // Chemin vers votre propre fichier d'icône de profil

function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Remplacer par votre propre URL de l'API
    // const fetchOrders = async () => {
    //   try {
    //     const response = await axios.get('https://api.example.com/orders');
    //     setOrders(response.data);
    //   } catch (err) {
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    // fetchOrders();

    // Données fictives pour les commandes
    const mockOrders = [
      { id: 1, duration: '30 min', distance: '5 km', revenue: 50.5 },
      { id: 2, duration: '45 min', distance: '10 km', revenue: 75.0 },
      { id: 3, duration: '20 min', distance: '3 km', revenue: 20.25 },
      { id: 4, duration: '60 min', distance: '15 km', revenue: 100.0 },
    ];

    setOrders(mockOrders);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Container className="order-page text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="order-page text-center">
        <p>Erreur lors du chargement des commandes : {error}</p>
      </Container>
    );
  }

  const navigateToProfile = () => {
    // Naviguer vers la page de profil
    navigate('/profile');
  };

  return (
    <Container className="order-page">
      <Row className="align-items-center mb-4">
        <Col xs={8}>
          <img src={logo} alt="Logo" className="logo" />
        </Col>
        <Col xs={4} className="text-end">
          <Button variant="link" className="profile-button" onClick={navigateToProfile}>
            <img src={profileIcon} alt="Profile" className="profile-icon" />
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col xs={12} className="text-center">
          <Button variant="dark" className="w-100 mb-3" onClick={() => navigate('/')} style={{ fontWeight: 'bold', color: 'white' }}>
            Retour
          </Button>
        </Col>
      </Row>
      {orders.map((order) => (
        <Row className="justify-content-center mb-3" key={order.id}>
          <Col xs={12} className="mb-3">
            <Card>
              <Card.Body>
                <Card.Title className="order-id">Commande #{order.id}</Card.Title>
                <Card.Text className="order-details">
                  <div className="order-detail-item">Durée : {order.duration}</div>
                  <div className="order-detail-item">Distance : {order.distance}</div>
                  <div className="order-detail-item revenue">Revenus : {order.revenue.toFixed(2).replace('.', ',')} €</div>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      ))}
    </Container>
  );
}

export default OrderPage;
