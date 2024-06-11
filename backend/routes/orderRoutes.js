const express = require("express");
const router = express.Router();
const orderControllers = require("../controllers/orderControllers"); // Assurez-vous que le chemin est correct

// Route pour récupérer les commandes d'un restaurant
router.get("/order/:id/orders", orderControllers.getOrdersByRestaurant);
router.post("/order/orders", orderControllers.createOrder);

module.exports = router;
