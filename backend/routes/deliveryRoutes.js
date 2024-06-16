const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryControllers");

/**
 * @swagger
 * /api/auth/delivery/register:
 *   post:
 *     summary: Delivery register
 *     tags: [customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 */
router.post("/register", deliveryController.register);

/**
 * @swagger
 * /api/auth/delivery/login:
 *   post:
 *     summary: Delivery login
 *     tags: [customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 */
router.post("/login", deliveryController.login);

router.get("/delivery-persons", deliveryController.getAllDeliveryPersons);
router.get("/delivery-persons/:id", deliveryController.getDeliveryPersonById);
router.patch(
  "/delivery-persons/:id",
  deliveryController.updateDeliveryPersonStatus
);
router.delete("/delivery-persons/:id", deliveryController.deleteDeliveryPerson);
router.put("/delivery-persons/:id", deliveryController.updateDeliveryPerson);

module.exports = router;
