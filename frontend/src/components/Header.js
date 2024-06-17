import React, { useState, useContext } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { List } from 'react-bootstrap-icons';


const Header = () => {
  const [show, setShow] = useState(false);
  const { profile } = useContext(AuthProvider);  // Utiliser le contexte Auth pour obtenir le profil

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const offcanvasStyle = {
    backgroundColor: '#212529',
    color: 'white'
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">
            <img
              src="favicon.ico"
              width="50"
              height="50"
              className="d-inline-block align-center"
              alt="Brand logo"
            />
            {' '}{profile ? 'Cesi Eats | ' + profile.name : 'Cesi Eats | Restaurant'}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="m-auto">
              <Nav.Link as={Link} to="/">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/dashboard">Commandes</Nav.Link>
              <Nav.Link as={Link} to="/products">Produits</Nav.Link>
              <Nav.Link as={Link} to="/account">Profil</Nav.Link>
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
            <Nav.Link as={Link} to="/dashboard" onClick={handleClose}>Commandes</Nav.Link>
            <Nav.Link as={Link} to="/products" onClick={handleClose}>Produits</Nav.Link>
            <Nav.Link as={Link} to="/account" onClick={handleClose}>Profil</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
