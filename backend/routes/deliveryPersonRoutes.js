const express = require("express");
const router = express.Router();
const deliveryPersonControllers = require("../controllers/deliveryPersonControllers"); // Assurez-vous que le chemin est correct

// Route pour récupérer les commandes d'un restaurant
/**
 * @swagger
 * components:
 *   schemas:
 *     DeliveryPerson:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the delivery person
 *         name:
 *           type: string
 *           description: Name of the delivery person
 *         email:
 *           type: string
 *           description: Email of the delivery person
 *         phone:
 *           type: string
 *           description: Phone number of the delivery person
 *         status:
 *           type: string
 *           description: Status of the delivery person
 *           enum: [active, inactive]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the record was created
 */

/**
 * @swagger
 * tags:
 *   name: DeliveryPerson
 *   description: The delivery person managing API
 */

/**
 * @swagger
 * /api/delivery:
 *   post:
 *     summary: Create a new delivery person
 *     tags: [DeliveryPerson]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryPerson'
 *     responses:
 *       201:
 *         description: The delivery person was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryPerson'
 *       400:
 *         description: Bad request
 */

router.post("/delivery/", deliveryPersonControllers.createDeliveryPerson);

/**
 * @swagger
 * /api/delivery:
 *   get:
 *     summary: Returns the list of all the delivery persons
 *     tags: [DeliveryPerson]
 *     responses:
 *       200:
 *         description: The list of the delivery persons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeliveryPerson'
 */

router.get("/delivery/", deliveryPersonControllers.getAllDeliveryPersons);

/**
 * @swagger
 * /api/delivery/{id}:
 *   put:
 *     summary: Update the delivery person by the id
 *     tags: [DeliveryPerson]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The delivery person id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryPerson'
 *     responses:
 *       200:
 *         description: The delivery person was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryPerson'
 *       404:
 *         description: The delivery person was not found
 *       400:
 *         description: Bad request
 */

router.get("/delivery/:id", deliveryPersonControllers.getDeliveryPersonById);

/**
 * @swagger
 * /api/delivery/{id}/status:
 *   patch:
 *     summary: Update the status of a delivery person
 *     tags: [DeliveryPerson]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The delivery person id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: The status of the delivery person
 *     responses:
 *       200:
 *         description: The status of the delivery person was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryPerson'
 *       404:
 *         description: The delivery person was not found
 *       400:
 *         description: Invalid status value
 */
router.patch(
  "/delivery/:id/status",
  deliveryPersonControllers.updateDeliveryPersonStatus
);

/**
 * @swagger
 * /api/delivery/{id}:
 *   put:
 *     summary: Update the delivery person by id
 *     tags: [DeliveryPerson]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The delivery person id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryPerson'
 *     responses:
 *       200:
 *         description: The delivery person was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeliveryPerson'
 *       404:
 *         description: The delivery person was not found
 *       400:
 *         description: Bad request
 */
router.put("/delivery/:id", deliveryPersonControllers.updateDeliveryPerson);

/**
 * @swagger
 * /api/delivery-person/{id}:
 *   delete:
 *     summary: Remove the delivery person by id
 *     tags: [DeliveryPerson]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The delivery person id
 *     responses:
 *       200:
 *         description: The delivery person was deleted
 *       404:
 *         description: The delivery person was not found
 */
router.delete("/delivery/:id", deliveryPersonControllers.deleteDeliveryPerson);

/**
 * @swagger
 * /api/delivery/{id}/accept-delivery:
 *   patch:
 *     summary: Accept or refuse a delivery
 *     tags: [DeliveryPerson]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The delivery person id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryId:
 *                 type: string
 *                 description: The ID of the delivery
 *               accept:
 *                 type: boolean
 *                 description: True to accept the delivery, false to refuse
 *     responses:
 *       200:
 *         description: Delivery acceptance status updated
 *       404:
 *         description: Delivery person or delivery not found
 *       400:
 *         description: Invalid request
 */
router.patch(
  "/delivery/:id/accept-delivery",
  deliveryPersonControllers.acceptDelivery
);

module.exports = router;
