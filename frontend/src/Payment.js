import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51PT1kQRpVBenRE71ro97gkibweLRFkPcwYmtYVJY6QvdKWAPhPwM3dkHHHeNIUKPTbSjfhFpg6VuxglWtP8CwQtP000bgad3qS"
);

const Payment = () => {
  const handleCheckout = async () => {
    const response = await fetch(
      "http://localhost:5006/api/payments/create-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId: "66660dc5226d7fcf42ccbdba",
          amount: 5000,
          currency: "eur",
          orderName: "Le MAZZ",
          orderDescription: "Du bon Poulet de la randon",
          items: [
            {
              name: "Pizza mazz",
              description: "Pizza masterclass fourré au fromage",
              amount: 599,
              quantity: 1,
            },
            {
              name: "Pizza BMW V8",
              description: "Ethanol masterclasse",
              amount: 1099,
              quantity: 1,
            },
            {
              name: "Pizza rando",
              description: "Au feux de foret",
              amount: 1099,
              quantity: 1,
            },
          ],
          deliveryFee: {
            name: "Livraison",
            description: "Frais de livraison",
            amount: 100,
            quantity: 1,
          },
        }),
      }
    );

    const session = await response.json();
    const stripe = await stripePromise;

    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (error) {
      console.error("Error redirecting to checkout:", error);
    }
  };

  return (
    <div>
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

export default Payment;
