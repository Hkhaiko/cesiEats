import React, { useEffect, useState } from 'react';
import { Button, Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../config'; // Importation de BASE_URL depuis le fichier de configuration
import './HomePage.css'; // Assurez-vous d'ajuster les styles ici si nécessaire
import io from 'socket.io-client';

const socket = io(BASE_URL.delivery);

// Import du nouveau chemin pour votre logo
const logo = "logo.png";

function HomePage() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // Example state for selected order
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');

  useEffect(() => {
    const userIdFromCookie = Cookies.get('deliveryId');
    console.log('UserID from cookie:', userIdFromCookie);
    if (userIdFromCookie) {
      fetchUserData(userIdFromCookie);
    } else {
      setLoading(false);
    }

    // Set up socket listener
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    socket.on('updateDelivery', (updatedDeliveryPerson) => {
      console.log('Received update from socket:', updatedDeliveryPerson);
      if (updatedDeliveryPerson._id === userIdFromCookie) {
        setUserData(updatedDeliveryPerson);
      }
    });

    socket.on('newOrder', (order) => {
      if (order.status === 'pending' && userData && userData.status !== "accepted") {
        setOrders((prevOrders) => [...prevOrders, order]);
        setSelectedOrder(order);
        setShowModal(true);
        setDeliveryAddress(order.address); // Mettre à jour l'adresse de livraison
        fetchRestaurantAddress(order.restaurantId); // Appeler la fonction pour récupérer l'adresse du restaurant
        console.log(restaurantAddress, deliveryAddress);
        fetchCoordinates(restaurantAddress, deliveryAddress); // Appeler la fonction pour récupérer les coordonnées et tracer l'itinéraire
      }
    });

    // Cleanup socket listener on component unmount
    return () => {
      socket.off('updateDelivery');
      socket.off('newOrder');
    };
  }, [userData]);

  const fetchUserData = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL.delivery}/api/delivery/${id}`, {
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

  const fetchRestaurantAddress = async (restaurantId) => {
    // Logic to fetch restaurant address by restaurantId
    // For demonstration purposes, we're setting a static address
    setRestaurantAddress('123 Restaurant St, Food City');
  };

  const fetchCoordinates = (restaurantAddress, deliveryAddress) => {
    // Logic to fetch coordinates and trace the route
    console.log('Fetching coordinates for', restaurantAddress, deliveryAddress);
  };

  const handleStatusChange = async () => {
    if (!userData) return;

    const newStatus = userData.status === 'active' ? 'inactive' : 'active';

    try {
      await axios.patch(`${BASE_URL.delivery}/api/delivery/${userData._id}`, {
        status: newStatus,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      // No need to manually update userData here, it will be updated by the socket event
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
      <Row className="mt-4">
        <Col xs={6} className="text-center">
          <Card className="mb-3">
            <Card.Body>
              <Card.Text>Revenu</Card.Text>
              <Card.Text className="text-success">{userData ? userData.income.toFixed(2) : ''}€</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} className="text-center">
          <Card className="mb-3">
            <Card.Body>
              <Card.Text>Score</Card.Text>
              <Card.Text>{userData.score} points</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={4}>
          <Button variant="secondary" className="w-100 mb-3" onClick={() => navigate('/profil')}>Modifier Profil</Button>
        </Col>
        <Col xs={4}>
          <Button variant="secondary" className="w-100 mb-3" onClick={() => navigate('/order')}>Historique des livraisons</Button>
        </Col>
        <Col xs={4}>
          <Button variant="secondary" className="w-100 mb-3">Code Parrainage</Button>
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
