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

module.exports = router;
