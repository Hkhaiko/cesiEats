import React from 'react';
import { Container, Row, Col, Button, Navbar } from 'react-bootstrap';

const Footer = () => {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="mt-5">
      <Container>
        <Row className="w-100 text-center text-md-left">
          <Col md={6} className="mb-3 mb-md-0">
            <h5 className="text-white">Contact</h5>
            <p className="text-white mb-1">Pour toute question, veuillez nous contacter à l'adresse suivante :</p>
            <p className="text-white"><strong>support@cesieats.com</strong></p>
          </Col>
          <Col md={6} className="d-flex justify-content-center justify-content-md-end align-items-center">
            <Button variant="outline-light" href="https://facebook.com" target="_blank" className="m-1">Facebook</Button>
            <Button variant="outline-light" href="https://twitter.com" target="_blank" className="m-1">Twitter</Button>
            <Button variant="outline-light" href="https://instagram.com" target="_blank" className="m-1">Instagram</Button>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default Footer;
