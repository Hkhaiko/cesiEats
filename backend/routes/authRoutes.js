const express = require("express");
const router = express.Router();
const authController = require("../controllers/authControllers");

/**
 * @swagger
 * /api/auth/verify-token:
 *   post:
 *     summary: Verify if token is valid
 *     tags: [customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 */
router.post("/verify-token", authController.verifyToken);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout
 *     tags: [customer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 */
router.post("/logout", authController.logout);

module.exports = router;
