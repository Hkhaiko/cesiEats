import React from "react";

function OrderSummary({ data }) {
  return (
    <div className="order-summary">
      <h2>Orders Summary</h2>
      <div className="summary-item">
        <span>Processing Orders: </span>
        <span>{data.processing}</span>
      </div>
      <div className="summary-item">
        <span>Accepted Orders: </span>
        <span>{data.accepted}</span>
      </div>
      <div className="summary-item">
        <span>Delivered Orders: </span>
        <span>{data.delivered}</span>
      </div>
      <div className="summary-item">
        <span>Total Revenue: </span>
        <span>{data.revenue} USD</span>
      </div>
    </div>
  );
}

export default OrderSummary;
