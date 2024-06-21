import React, { useEffect, useState } from 'react';
import { Modal, Button, Alert, Card, Container, Row, Col, Spinner } from 'react-bootstrap';
import Cookies from 'js-cookie';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import io from 'socket.io-client';
import { BASE_URL } from '../config';
const socketEndpoint = BASE_URL.orders;


const DeliveryDashboard = ({ delivererId }) => {
    const [socket, setSocket] = useState(null);
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false); 
    const [showThirdModal, setShowThirdModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [userId, setUserId] = useState(null);
    const [restaurantAddress, setRestaurantAddress] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const tenthOfTotalPrice = selectedOrder ? parseFloat((selectedOrder.totalPrice / 10).toFixed(2)) : null;
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (socket) {
            socket.on('connect', () => {
              console.log('Connected to server');
            });
      
            socket.on('disconnect', () => {
              console.log('Disconnected from server');
            });
      
            socket.on('newOrder', (order) => {
              if (order.status === 'pending') {
                setOrders((prevOrders) => [...prevOrders, order]);
                setSelectedOrder(order);
                setShowModal(true);
                setDeliveryAddress(order.address);
                fetchRestaurantAddress(order.restaurantId);
                // Vous pouvez appeler fetchCoordinates ici si besoin
              }
            });
      
            return () => {
              socket.disconnect();
              socket.off('newOrder');
              socket.off('connect');
              socket.off('disconnect');
            };
          }
        }, [socket]);
      
        const connectSocket = () => {
          const newSocket = io(socketEndpoint);
          setSocket(newSocket);
      
          const userIdFromCookie = Cookies.get('deliveryId');
          if (userIdFromCookie) {
            setUserId(userIdFromCookie);
            fetchUserData(userIdFromCookie);
          } else {
            setLoading(false);
          }
        };
      
        const disconnectSocket = () => {
          if (socket) {
            socket.disconnect();
            setSocket(null);
            setOrders([]);
            setSelectedOrder(null);
            setShowModal(false);
            setDeliveryAddress('');
            setRestaurantAddress('');
            setUserData(null);
          }
        };

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
        try {
            const response = await axios.get(`${BASE_URL.restaurant}/api/restaurant/profile/${restaurantId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            setRestaurantAddress(response.data.address);
            console.log(restaurantAddress)
            console.log(deliveryAddress)
        } catch (error) {
            console.log('Error fetching restaurant address:', error);
        }
    };

    const handleStatusChange = async () => {
        if (!userData) return;
    
        const newStatus = userData.status === 'active' ? 'inactive' : 'active';
    
        try {
          await axios.patch(
            `${BASE_URL.delivery}/api/delivery/${userData._id}`,
            { status: newStatus },
            {
              headers: {
                'Content-Type': 'application/json',
              },
              withCredentials: true,
            }
          );
    
          // Mettre à jour localement le statut utilisateur
          setUserData({ ...userData, status: newStatus });
    
          alert('Statut mis à jour avec succès');
        } catch (err) {
          console.error('Error updating status:', err);
          alert('Erreur lors de la mise à jour du statut');
        }
      };

    const fetchCoordinates = async (restaurantAddress, deliveryAddress) => {
        try {
            const response1 = await axios.get(`https://nominatim.openstreetmap.org/search?q=${restaurantAddress}&format=json&limit=1`);
            const response2 = await axios.get(`https://nominatim.openstreetmap.org/search?q=${deliveryAddress}&format=json&limit=1`);
            const data1 = response1.data[0];
            const data2 = response2.data[0];
            if (data1 && data2) {
                const pos1 = [parseFloat(data1.lat), parseFloat(data1.lon)];
                const pos2 = [parseFloat(data2.lat), parseFloat(data2.lon)];
                setPositions([pos1, pos2]);
            }
        } catch (error) {
            console.error('Error fetching coordinates:', error);
        }
    };

    const handleAccept = () => {
        if (selectedOrder) {
            axios.put(`${BASE_URL.orders}/api/orders/${selectedOrder._id}`, {
                status: 'in progress',
                deliveryId: userId,
            })
                .then(response => {
                    const updatedOrder = response.data.order;
                    setOrders(orders.map(order => order._id === selectedOrder._id ? updatedOrder : order));
                    setShowModal(false);
                    setShowSecondModal(true);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    };

    const handleReject = () => {
        setSelectedOrder(null);
        setShowModal(false);
    };
    
    const handleOrderPickedUp = () => {
      if (selectedOrder) {
          axios.put(`${BASE_URL.orders}/api/orders/${selectedOrder._id}`, {
              status: 'on way',
              deliveryId: userId,
          })
              .then(response => {
                  const updatedOrder = response.data.order;
                  setOrders(orders.map(order => order._id === selectedOrder._id ? updatedOrder : order));
                  setShowSecondModal(false);
                  setShowThirdModal(true);
              })
              .catch(error => {
                  console.error('Error:', error);
              });
      }
    };

    const handleOrderDeliver = () => {
      if (selectedOrder) {
          axios.put(`${BASE_URL.orders}/api/orders/${selectedOrder._id}`, {
              status: 'completed',
              deliveryId: userId,
          })
              .then(response => {
                  const updatedOrder = response.data.order;
                  setOrders(orders.map(order => order._id === selectedOrder._id ? updatedOrder : order));
                  setShowThirdModal(false);
                  pay()
                  addDeliverytohistory()
              })
              .catch(error => {
                  console.error('Error:', error);
              });
      }
    };


    const addDeliverytohistory = async () => {
        const response = await axios.post(`${BASE_URL.delivery}/api/delivery/history`, {
            deliveryPersonId:userId,
            price:selectedOrder.totalPrice,
            status:"completed",
        },{
            headers: {
            'Content-Type': 'application/json',
            },
            withCredentials: true,
        });
    }
          
    const pay = async () => {
      if (selectedOrder) {
        try {
          const response = await axios.get(`${BASE_URL.delivery}/api/delivery/${userId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });
    
          const currentIncome = response.data.income;
          const currentScore = response.data.score;
    
          const newIncome = currentIncome + tenthOfTotalPrice;
          const newScore = currentScore + 1;
    
          await axios.put(`${BASE_URL.delivery}/api/delivery/${userId}`, {
            income: newIncome,
            score: newScore,
          }, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });
        } catch (error) {
          console.error('Erreur lors de la mise à jour des valeurs :', error);
        }
      }
    };
    
    const mapContainerStyle = {
        height: '300px',  
        width: '100%'
    };

    return (
        
        <div>
 <Container>
      <Row className="mt-4">
        <Col xs={12} className="text-center">
          <Button
            variant="primary"
            className="w-50"
            onClick={() => {
              if (socket) {
                disconnectSocket();
              } else {
                connectSocket();
              }
              handleStatusChange();
            }}
          >
            {userData && userData.status === 'active' ? 'Passer Inactif' : 'Passer Actif'}
          </Button>
        </Col>
      </Row>
    </Container>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Nouvelle Commande</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Adresse du restaurant: {restaurantAddress}</p>
                    <p>Adresse de livraison {deliveryAddress}</p>
                    <p>Revenu {tenthOfTotalPrice} €</p>

                    <Alert variant="info">Accepter ou refuser cette commande ?</Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleAccept}>Accepter</Button>
                    <Button variant="danger" onClick={handleReject}>Refuser</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showSecondModal} centered size="lg">
                <Modal.Header>
                    <Modal.Title>Récuperation de la commande</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Adresse du restaurant: {restaurantAddress}</p>
                    <p>Adresse de livraison {deliveryAddress}</p>
                    <div style={mapContainerStyle}>
                        <MapContainer center={positions.length > 0 ? positions[0] : [0, 0]} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            {positions.map((position, index) => (
                                <Marker key={index} position={position}>
                                    <Popup>
                                        {index === 0 ? 'Restaurant Location' : 'Delivery Location'}
                                    </Popup>
                                </Marker>
                            ))}
                            {positions.length === 2 && (
                                <Polyline positions={positions} />
                            )}
                        </MapContainer>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleOrderPickedUp}>Commande récupérée</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showThirdModal} centered size="lg">
                <Modal.Header>
                  <Modal.Title>Livraison de la commande</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Adresse du restaurant: {restaurantAddress}</p>
                    <p>Adresse de livraison {deliveryAddress}</p>
                    <div style={mapContainerStyle}>
                        <MapContainer center={positions.length > 0 ? positions[0] : [0, 0]} zoom={13} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            {positions.map((position, index) => (
                                <Marker key={index} position={position}>
                                    <Popup>
                                        {index === 0 ? 'Restaurant Location' : 'Delivery Location'}
                                    </Popup>
                                </Marker>
                            ))}
                            {positions.length === 2 && (
                                <Polyline positions={positions} />
                            )}
                        </MapContainer>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleOrderDeliver}>Commande Livrée</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DeliveryDashboard;
