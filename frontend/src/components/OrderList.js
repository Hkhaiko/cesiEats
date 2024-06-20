import React from "react";

function OrderList({ orders }) {
  return (
    <div className="container mt-4">
      <h2>Order List</h2>
      <ul className="list-group">
        {orders.map((order) => (
          <li key={order._id} className="list-group-item">
            <div>
              <strong>Order ID:</strong> {order._id}
            </div>
            <div>
              <strong>Customer ID:</strong> {order.customerId}
            </div>
            <div>
              <strong>Restaurant ID:</strong> {order.restaurantId}
            </div>
            <div>
              <strong>Delivery ID:</strong> {order.deliveryId}
            </div>
            <div>
              <strong>Address:</strong> {order.address}
            </div>
            <div>
              <strong>Total Price:</strong> ${order.totalPrice}
            </div>
            <div>
              <strong>Status:</strong> {order.status}
            </div>
            <div>
              <strong>Created At:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </div>
            <ul>
              {order.items.map((item) => (
                <li key={item._id}>
                  {item.quantity} x {item.name} (${item.price} each)
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrderList;
