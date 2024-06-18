// src/pages/ProfilePage.js
import React, { useState } from 'react';
import { Container, Row, Col, Button, Form, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png'; // Chemin vers votre propre fichier de logo
import profileIcon from '../img/logo.svg'; // Chemin vers votre propre fichier d'icône de profil
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [isEditable, setIsEditable] = useState(false);

  const handleEdit = () => {
    setIsEditable(true);
  };

  const navigateToProfile = () => {
    navigate('/profile');
  };

  return (
    <Container className="profile-page">
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
              <Form>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Nom</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrez votre nom"
                    disabled={!isEditable}
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Entrez votre email"
                    disabled={!isEditable}
                  />
                </Form.Group>

                <Form.Group controlId="formPhone" className="mb-3">
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Entrez votre numéro de téléphone"
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
