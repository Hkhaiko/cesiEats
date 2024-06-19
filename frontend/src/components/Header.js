import React, { useState, useContext } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { List } from 'react-bootstrap-icons';
import { AuthContext } from '../context/AuthContext'; // Assurez-vous que ce chemin est correct

const Header = () => {
  const [show, setShow] = useState(false);
  const { profil } = useContext(AuthContext);  // Utiliser le contexte Auth pour obtenir le profil

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const offcanvasStyle = {
    backgroundColor: '#212529',
    color: 'white'
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="d-none d-lg-block">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img
              src="favicon.ico"
              width="50"
              height="50"
              className="d-inline-block align-center"
              alt="Brand logo"
            />
            {' '}{profil ? 'Cesi Eats | ' + profil.name : 'Cesi Eats | Livreur'}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" eventKey="1">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/profil" eventKey="2">Profil</Nav.Link>
              <Nav.Link as={Link} to="/order" eventKey="3">Commandes</Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleShow} aria-label="Open Menu">
              <List size={24} />
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Navbar bg="dark" variant="dark" expand="lg" fixed="bottom" className="d-block d-lg-none">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img
              src="favicon.ico"
              width="50"
              height="50"
              className="d-inline-block align-center"
              alt="Brand logo"
            />
            {' '}{profil ? 'Cesi Eats | ' + profil.name : 'Cesi Eats | Livreur'}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/" eventKey="5" onClick={handleClose}>Accueil</Nav.Link>
              <Nav.Link as={Link} to="/profil" eventKey="6" onClick={handleClose}>Profil</Nav.Link>
              <Nav.Link as={Link} to="/order" eventKey="7" onClick={handleClose}>Commandes</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Offcanvas show={show} onHide={handleClose} placement="end" style={offcanvasStyle}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{profil ? profil.name : 'Cesi Eats | Restaurant'}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/" onClick={handleClose} eventKey="9">Accueil</Nav.Link>
            <Nav.Link as={Link} to="/profil" onClick={handleClose} eventKey="10">Profil</Nav.Link>
            <Nav.Link as={Link} to="/order" onClick={handleClose} eventKey="11">Commandes</Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
