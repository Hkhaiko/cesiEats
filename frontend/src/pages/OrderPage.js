import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import './OrderPage.css';

function OrderPage() {
  const logo ="logo.png"
  const profileLogo="profile.png"
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromCookie = Cookies.get('deliveryId');
    if (userIdFromCookie) {
      fetchOrders(userIdFromCookie);
    } else {
      setLoading(false);
      setError("User ID not found in cookies");
    }
  }, []);

  const fetchOrders = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5003/api/delivery/history/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setOrders(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      {orders.length === 0 ? (
        <Row className="justify-content-center">
          <Col xs={12} className="text-center">
            <p>Aucune commande trouvée.</p>
          </Col>
        </Row>
      ) : (
        orders.map((order) => (
          <Row className="justify-content-center mb-3" key={order._id}>
            <Col xs={12} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title className="order-id">Commande #{order._id}</Card.Title>
                  <Card.Text className="order-details">
                    <div className="order-detail-item">Distance : {order.distance}</div>
                    <div className="order-detail-item">Status : {order.status}</div>
                    <div className="order-detail-item">Date de livraison : {new Date(order.deliveryDate).toLocaleDateString()}</div>
                    <div className="order-detail-item revenue">Revenus : {parseFloat(order.price).toFixed(2).replace('.', ',')} €</div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        ))
      )}
    </Container>
  );
}

export default OrderPage;
