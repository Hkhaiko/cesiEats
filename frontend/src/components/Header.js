import React, { useState, useContext } from 'react';
import { Navbar, Nav, Container, Button, Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { HouseDoorFill, PersonCircle, CartFill } from 'react-bootstrap-icons'; // Importation des icônes
import { AuthContext } from '../context/AuthContext'; 

const Header = () => {
  const [show, setShow] = useState(false);
  const { profil } = useContext(AuthContext);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const offcanvasStyle = {
    backgroundColor: '#212529',
    color: 'white'
  };

  return (
    <>
      {/* Navbar en haut pour les écrans de bureau */}
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
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" eventKey="1">Accueil</Nav.Link>
              <Nav.Link as={Link} to="/profil" eventKey="2">Profil</Nav.Link>
              <Nav.Link as={Link} to="/order" eventKey="3">Commandes</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Navbar en bas pour les écrans mobiles */}
      <Navbar bg="dark" variant="dark" expand="sm" fixed="bottom" className="d-block d-lg-none">
        <Container fluid>
          <Navbar.Brand as={Link} to="/">
            <img
              src="favicon.ico"
              width="50"
              height="50"
              className="d-inline-block align-center"
              alt="Brand logo"
            />

          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="w-100 justify-content-around">
              <Nav.Link as={Link} to="/" eventKey="5" onClick={handleClose}>Accueil <HouseDoorFill size={24} /></Nav.Link>
              <Nav.Link as={Link} to="/profil" eventKey="6" onClick={handleClose}>Profil <PersonCircle size={24} /></Nav.Link>
              <Nav.Link as={Link} to="/order" eventKey="7" onClick={handleClose}>Commande <CartFill size={24} /></Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

    </>
  );
};

export default Header;
