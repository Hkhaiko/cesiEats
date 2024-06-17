// src/pages/HomePage.js
import React from 'react';
import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function HomePage() {
  const navigate = useNavigate();
  let CookieId = Cookies.get('deliveryId');

  return (
    <Container className="home-page">
      <Row className="justify-content-center mt-4">
        <Col xs={12} className="text-center">
          <img src="logo.svg" alt="Logo" className="mb-4 logo" />
        </Col>
        <Col xs={6} className="text-center">
          <Card className="mb-3">
            <Card.Body>
              <Card.Text>Revenu</Card.Text>
              <Card.Text className="text-success">{CookieId}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} className="text-center">
          <Card className="mb-3">
            <Card.Body>
              <Card.Text>Score</Card.Text>
              <Card.Text>1260</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12}>
          <Button variant="light" className="w-100 mb-3" onClick={() => navigate('/profile')}>Modifier Profil</Button>
          <Button variant="light" className="w-100 mb-3" onClick={() => navigate('/orders')}>Historique des livraisons</Button>
          <Button variant="light" className="w-100 mb-3">Code Parrainage</Button>
        </Col>
        <Col xs={12} className="text-center">
          <Card className="mb-3">
            <Card.Body>
              <Card.Text>Vous êtes actuellement</Card.Text>
              <Card.Text>Actif</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12}>
          <Button variant="danger" className="w-100">PASSER HORS-LIGNE</Button>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
