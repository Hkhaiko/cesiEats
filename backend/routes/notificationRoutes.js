const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationControllers");

router.post("/", notificationController.createNotification);
router.get("/:entityType/:entityId", notificationController.getNotifications);
router.patch("/:id/read", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);

module.exports = router;
