const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemControllers");

// Routes for items
router.post("/restaurant/items", itemController.createItem);
router.get("/restaurant/items/:id", itemController.getItems);
router.put("/restaurant/items/:id", itemController.updateItem);
router.delete("/restaurant/items/:id", itemController.deleteItem);

module.exports = router;
