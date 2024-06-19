// src/pages/ProfilePage.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import './ProfilePage.css';

function ProfilePage() {
  const logo ="logo.png"
  const profileLogo="profile.png"
  const navigate = useNavigate();
  const [isEditable, setIsEditable] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '', // Added password field
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userIdFromCookie = Cookies.get('deliveryId');
    if (userIdFromCookie) {
      setUserId(userIdFromCookie);
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

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5003/api/delivery/${userId}`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setIsEditable(false);
      alert('Profile updated successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="profile-page text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="profile-page text-center">
        <p>Erreur lors du chargement des données utilisateur : {error}</p>
      </Container>
    );
  }

  return (
    <Container className="profile-page">
      <Row className="align-items-center mb-4">
        <Col xs={8}>
          <img src={logo} alt="Logo" className="logo" />
        </Col>
        <Col xs={4} className="text-end">
          <Button variant="link" className="profile-button" onClick={() => navigate('/profile')}>
            <img src={profileLogo} alt="Profile" className="profile-icon" />
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col xs={12} className="text-center">
          <Button
            variant="dark"
            className="return-button mb-3"
            onClick={() => navigate('/')}
            style={{ fontWeight: 'bold', color: 'white' }}
          >
            Retour
          </Button>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Card>
            <Card.Body>
              <Card.Title>Profile</Card.Title>
              <Form onSubmit={handleUpdate}>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={userData.name}
                    placeholder="Entrez votre nom"
                    onChange={handleInputChange}
                    disabled={!isEditable}
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userData.email}
                    placeholder="Entrez votre email"
                    onChange={handleInputChange}
                    disabled={!isEditable}
                  />
                </Form.Group>

                <Form.Group controlId="formPhone" className="mb-3">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={userData.phone}
                    placeholder="Entrez votre numéro de téléphone"
                    onChange={handleInputChange}
                    disabled={!isEditable}
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={userData.password}
                    placeholder="Entrez votre mot de passe"
                    onChange={handleInputChange}
                    disabled={!isEditable}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-2"
                  disabled={!isEditable}
                >
                  Mettre à jour
                </Button>
                <Button
                  variant="secondary"
                  className="w-100"
                  onClick={handleEdit}
                  disabled={isEditable}
                >
                  Modifier
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;
