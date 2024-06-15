const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerControllers");

/**
 * @swagger
 * /api/auth/customer/register:
 *   post:
 *     summary: Create a new customer
 *     tags: [customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 */
router.post("/register", customerController.register);
/**
 * @swagger
 * /api/auth/customer/login:
 *   post:
 *     summary: Customer login
 *     tags: [customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 */
router.post("/login", customerController.login);

module.exports = router;
