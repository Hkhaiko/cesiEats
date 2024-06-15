const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurantControllers");

/**
 * @swagger
 * /api/auth/restaurant/register:
 *   post:
 *     summary: Restaurant Register
 *     tags: [customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 */
router.post("/register", restaurantController.register);
/**
 * @swagger
 * /api/auth/restaurant/login:
 *   post:
 *     summary: Restaurant login
 *     tags: [customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 */
router.post("/login", restaurantController.login);

module.exports = router;
