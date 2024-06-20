const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const auth = require("../middleware/auth");

// Routes for menus (public access)
router.get("/restaurant/:id/menus", menuController.getPublicMenus);

// Authenticated routes
router.post("/restaurant/menus", auth, menuController.createMenu);
router.get("/restaurant/menus", auth, menuController.getMenus);
router.put("/restaurant/menus/:id", auth, menuController.updateMenu);
router.delete("/restaurant/menus/:id", auth, menuController.deleteMenu);

module.exports = router;
