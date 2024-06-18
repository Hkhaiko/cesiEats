const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentControllers");

// Créer une session de paiement
router.post("/create-session", paymentController.createPaymentSession);

// Webhook Stripe
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleWebhook
);

module.exports = router;
