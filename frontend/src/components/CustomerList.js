import React from "react";
import { Button } from "react-bootstrap";

function CustomerList({ customers, onSelectCustomer, onDeleteCustomer }) {
  return (
    <div className="container mt-4">
      <h2>Customer List</h2>
      <ul className="list-group">
        {customers.map((customer) => (
          <li
            key={customer._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {customer.firstName} {customer.lastName}
            <div>
              <Button
                variant="primary"
                className="me-2"
                onClick={() => onSelectCustomer(customer)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={() => onDeleteCustomer(customer._id)}
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomerList;
