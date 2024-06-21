import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { BASE_URL } from '../config';
import './ProfilPage.css';

function ProfilPage() {
  const navigate = useNavigate();
  const [isEditable, setIsEditable] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
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
      await axios.put(`${BASE_URL.delivery}/api/delivery/${userId}`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setIsEditable(false);
      alert('Profil mis à jour avec succès');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="profil-page text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="profil-page text-center">
        <p>Erreur lors du chargement des données utilisateur : {error}</p>
      </Container>
    );
  }

  return (
    <Container className="profil-page">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={10}>
          <Card>
            <Card.Body>
              <Card.Title>Profil</Card.Title>
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

export default ProfilPage;
