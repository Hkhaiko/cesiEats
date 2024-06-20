import React, { useEffect, useState } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';
import Cookies from 'js-cookie';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Assurez-vous d'importer le CSS de Leaflet
import io from 'socket.io-client';
import { BASE_URL } from '../config'; // Assurez-vous d'importer correctement BASE_URL depuis votre fichier de configuration

const socket = io(BASE_URL.orders);

const DeliveryDashboard = ({ delivererId }) => {
    const [orders, setOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false); // State pour la deuxième popup
    const [showThirdModal, setShowThirdModal] = useState(false); // State pour la deuxième popup
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [userId, setUserId] = useState(null);
    const [restaurantAddress, setRestaurantAddress] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [positions, setPositions] = useState([]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        const userIdFromCookie = Cookies.get('deliveryId');
        if (userIdFromCookie) {
            setUserId(userIdFromCookie);
        } else {
            setLoading(false);
        }

        socket.on('newOrder', (order) => {
            if (order.status === 'pending') {
                setOrders((prevOrders) => [...prevOrders, order]);
                setSelectedOrder(order);
                setShowModal(true);
                setDeliveryAddress(order.address); // Mettre à jour l'adresse de livraison
                fetchRestaurantAddress(order.restaurantId); // Appeler la fonction pour récupérer l'adresse du restaurant
                console.log(restaurantAddress, deliveryAddress)
                fetchCoordinates(restaurantAddress, deliveryAddress); // Appeler la fonction pour récupérer les coordonnées et tracer l'itinéraire
            }
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        // Nettoyage du socket lors du démontage du composant
        return () => {
            socket.off('newOrder');
            socket.off('connect');
            socket.off('disconnect');
        };
    }, []);

    const fetchRestaurantAddress = async (restaurantId) => {
        try {
            const response = await axios.get(`${BASE_URL.restaurant}/api/restaurant/profile/${restaurantId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true, // Assurez-vous que cela est correctement configuré selon votre API
            });
            setRestaurantAddress(response.data.address); // Mettre à jour l'adresse du restaurant dans l'état
            console.log(restaurantAddress)
            console.log(deliveryAddress)
        } catch (error) {
            console.log('Error fetching restaurant address:', error);
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
                    setShowSecondModal(true); // Afficher la deuxième popup après avoir accepté
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
                  setShowSecondModal(false); // Afficher la deuxième popup après avoir accepté
                  setShowThirdModal(true); // Afficher la deuxième popup après avoir accepté
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
                  setShowThirdModal(false); // Afficher la deuxième popup après avoir accepté
                  pay()
              })
              .catch(error => {
                  console.error('Error:', error);
              });
      }
    };
          
    const pay = async () => {
      if (selectedOrder) {
        try {
          // Faire une requête GET pour récupérer les valeurs actuelles de score et income
          const response = await axios.get(`${BASE_URL.delivery}/api/delivery/${userId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          });
    
          const currentIncome = response.data.income;
          const currentScore = response.data.score;
    
          // Incrémenter les valeurs de 10
          const newIncome = currentIncome + 10;
          const newScore = currentScore + 10;
    
          // Envoyer les nouvelles valeurs via une requête PUT
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
    




    // Style pour la carte Leaflet
    const mapContainerStyle = {
        height: '300px',  // Ajustez la hauteur selon vos besoins
        width: '100%'     // Ajustez la largeur selon vos besoins
    };

    return (
        <div>
            <h1>Pending Orders</h1>
            <ul>
                {orders.map((order) => (
                    <li key={order._id}>{order._id} - {order.items.map(item => item.name).join(', ')}</li>
                ))}
            </ul>

            {/* Modal pour afficher les détails de la commande */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>New Pending Order</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Order ID: {selectedOrder ? selectedOrder._id : ''}</p>
                    <p>Items: {selectedOrder ? selectedOrder.items.map(item => item.name).join(', ') : ''}</p>
                    <Alert variant="info">Accepter ou refuser cette commande ?</Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleAccept}>Accepter</Button>
                    <Button variant="danger" onClick={handleReject}>Refuser</Button>
                </Modal.Footer>
            </Modal>

            {/* Deuxième Modal pour afficher l'adresse du restaurant et la carte */}
            <Modal show={showSecondModal} centered size="lg">
                <Modal.Header>
                    <Modal.Title>Récuperation de la commande</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Adresse du restaurant: {restaurantAddress}</p>
                    <p>Adresse de livraison {deliveryAddress}</p>
                    {/* Carte Leaflet avec itinéraire */}
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
                    {/* Carte Leaflet avec itinéraire */}
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
