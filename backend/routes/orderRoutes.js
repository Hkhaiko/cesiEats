const express = require("express");
const router = express.Router();
const orderControllers = require("../controllers/orderControllers");

// Route pour récupérer les commandes d'un restaurant
router.get("/order/:id/orders", orderControllers.getOrdersByRestaurant);
router.post("/orders/order", orderControllers.createOrder);
router.get("/orders/:id", orderControllers.getOrderById);
router.put("/orders/:id", orderControllers.updateOrder);

module.exports = router;
