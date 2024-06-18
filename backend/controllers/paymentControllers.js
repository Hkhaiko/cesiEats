const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require("../models/paymentModels");

exports.handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    ); // Utilisez votre secret de signature de webhook
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Sauvegarder les informations de paiement dans la base de données
    const payment = new Payment({
      customerId: session.metadata.customerId,
      amount: session.amount_total,
      currency: session.currency,
      stripePaymentId: session.payment_intent,
      status: session.payment_status,
    });

    try {
      await payment.save();
    } catch (error) {
      return res.status(500).send(`Database Error: ${error.message}`);
    }
  }

  res.status(200).json({ received: true });
};

exports.createPaymentSession = async (req, res) => {
  const { customerId, currency, items, deliveryFee } = req.body;

  const origin = "http://localhost:3000";
  try {
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
          description: item.description,
        },
        unit_amount: item.amount,
      },
      quantity: item.quantity,
    }));

    if (deliveryFee) {
      line_items.push({
        price_data: {
          currency: currency,
          product_data: {
            name: deliveryFee.name,
            description: deliveryFee.description,
          },
          unit_amount: deliveryFee.amount,
        },
        quantity: deliveryFee.quantity,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: line_items,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
      metadata: {
        customerId: customerId,
      },
    });

    const payment = new Payment({
      customerId: session.metadata.customerId,
      amount: session.amount_total,
      currency: session.currency,
      status: session.payment_status,
    });

    await payment.save();

    res.status(200).json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
