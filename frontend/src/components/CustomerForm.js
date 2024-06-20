import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button } from "react-bootstrap";

function CustomerForm({ customer, onUpdateCustomer }) {
  const [formData, setFormData] = useState(customer);

  useEffect(() => {
    setFormData(customer);
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `http://localhost:5001/api/client/customers/${customer._id}`,
        formData
      )
      .then((response) => onUpdateCustomer(response.data))
      .catch((error) => console.error(error));
  };

  return (
    <div className="container mt-4">
      <h2>Edit Customer</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formFirstName" className="mb-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formLastName" className="mb-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="formPhone" className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Save
        </Button>
      </Form>
    </div>
  );
}

export default CustomerForm;
