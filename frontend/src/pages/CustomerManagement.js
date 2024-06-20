import React, { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import CustomerList from "../components/CustomerList";
import EditCustomerModal from "../components/EditCustomerModal";
import { Spinner } from "react-bootstrap";

const socket = io("http://172.16.44.34:5001");

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://172.16.44.34:5001/api/client/customers")
      .then((response) => {
        setCustomers(
          response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )
        );
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });

    socket.on("newCustomer", (customer) => {
      setCustomers((prevCustomers) => [customer, ...prevCustomers]);
    });

    return () => {
      socket.off("newCustomer");
    };
  }, []);

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleUpdateCustomer = (updatedCustomer) => {
    setCustomers(
      customers.map((c) =>
        c._id === updatedCustomer._id ? updatedCustomer : c
      )
    );
    setShowModal(false);
  };

  const handleDeleteCustomer = (customerId) => {
    axios
      .delete(`http://172.16.44.34:5001/api/client/customers/${customerId}`)
      .then(() => {
        setCustomers(customers.filter((c) => c._id !== customerId));
      })
      .catch((error) => console.error(error));
  };

  const handleCloseModal = () => setShowModal(false);

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <CustomerList
        customers={customers}
        onSelectCustomer={handleSelectCustomer}
        onDeleteCustomer={handleDeleteCustomer}
      />
      {selectedCustomer && (
        <EditCustomerModal
          show={showModal}
          handleClose={handleCloseModal}
          customer={selectedCustomer}
          onUpdateCustomer={handleUpdateCustomer}
        />
      )}
    </div>
  );
}

export default CustomerManagement;
