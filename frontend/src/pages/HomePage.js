import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import './HomePage.css'; // Assurez-vous d'ajuster les styles ici si nécessaire

// Import du nouveau chemin pour votre logo

function HomePage() {
  const logo ="logo.png"
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userIdFromCookie = Cookies.get('deliveryId');
    console.log('UserID from cookie:', userIdFromCookie);
    if (userIdFromCookie) {
      fetchUserData(userIdFromCookie);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5003/api/delivery/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setUserData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async () => {
    if (!userData) return;

    const newStatus = userData.status === 'active' ? 'inactive' : 'active';

    try {
      await axios.patch(`http://localhost:5003/api/delivery/${userData._id}`, {
        status: newStatus,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      setUserData({ ...userData, status: newStatus });
      alert('Status updated successfully');
    } catch (err) {
      setError(err.message);
      alert('Error updating status');
    }
  };

  if (loading) {
    return (
      <Container className="home-page text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="home-page text-center">
        <p>Erreur lors du chargement des données utilisateur : {error}</p>
      </Container>
    );
  }

  return (
    <Container className="home-page">
      <Row className="justify-content-center mt-4">
        <Col xs={12} className="text-center">
          {/* Utilisation de la classe 'logo-large' pour agrandir le logo */}
          <img src={logo} alt="Logo" className="mb-4 logo-large" />
        </Col>
        <Col xs={6} className="text-center">
          <Card className="mb-3">
            <Card.Body>
              <Card.Text>Revenu</Card.Text>
              <Card.Text className="text-success">{userData.income}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} className="text-center">
          <Card className="mb-3">
            <Card.Body>
              <Card.Text>Score</Card.Text>
              <Card.Text>{userData.score}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12}>
          <Button variant="light" className="w-100 mb-3" onClick={() => navigate('/profile')}>Modifier Profil</Button>
          <Button variant="light" className="w-100 mb-3" onClick={() => navigate('/order')}>Historique des livraisons</Button>
          <Button variant="light" className="w-100 mb-3">Code Parrainage</Button>
        </Col>
        <Col xs={12} className="text-center">
          <Card className="mb-3">
            <Card.Body>
              <Card.Text>Vous êtes actuellement</Card.Text>
              <Card.Text>{userData.status === 'active' ? 'Actif' : 'Inactif'}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12}>
          <Button
            variant={userData.status === 'active' ? 'danger' : 'success'}
            className="w-100"
            onClick={handleStatusChange}
          >
            {userData.status === 'active' ? 'PASSER INACTIF' : 'PASSER EN LIGNE'}
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
