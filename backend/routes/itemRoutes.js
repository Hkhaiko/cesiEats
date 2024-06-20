const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemControllers");
const auth = require("../middleware/auth");

// Routes for items (public access)
router.get("/restaurant/:id/items", itemController.getPublicItems);

// Authenticated routes
router.post("/restaurant/items", auth, itemController.createItem);
router.get("/restaurant/items", auth, itemController.getItems);
router.put("/restaurant/items/:id", auth, itemController.updateItem);
router.delete("/restaurant/items/:id", auth, itemController.deleteItem);

module.exports = router;
