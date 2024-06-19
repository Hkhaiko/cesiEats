import React, { useState, useContext } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { List } from 'react-bootstrap-icons';
import { AuthContext } from '../context/AuthContext'; // Assurez-vous que ce chemin est correct

const Header = () => {
  const [show, setShow] = useState(false);
  const { profile } = useContext(AuthContext);  // Utiliser le contexte Auth pour obtenir le profil

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const offcanvasStyle = {
    backgroundColor: '#212529',
    color: 'white'
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img
              src="favicon.ico"
              width="50"
              height="50"
              className="d-inline-block align-center"
              alt="Brand logo"
            />
            {' '}{profile ? 'Cesi Eats | ' + profile.name : 'Cesi Eats | Livreur'}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/profile">Profil</Nav.Link>
              <Nav.Link as={Link} to="/order">Historique des commandes</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleShow} aria-label="Open Menu">
              <List size={24} />
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} placement="end" style={offcanvasStyle}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{profile ? profile.name : 'Cesi Eats | Restaurant'}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" onClick={handleClose}>Accueil</Nav.Link>
            <Nav.Link as={Link} to="/profile" onClick={handleClose}>Profil</Nav.Link>
            <Nav.Link as={Link} to="/order" onClick={handleClose}>Historique des commandes</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
