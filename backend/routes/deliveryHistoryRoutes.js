const express = require("express");
const router = express.Router();
const deliveryHistoryController = require("../controllers/deliveryHistoryControllers");

router.get(
  "/delivery/history/:deliveryPersonId",
  deliveryHistoryController.getDeliveryHistory
);
router.post("/delivery/history", deliveryHistoryController.addDeliveryHistory);
router.put(
  "/delivery/history/:id",
  deliveryHistoryController.updateDeliveryHistory
);
router.delete(
  "/delivery/history/:id",
  deliveryHistoryController.deleteDeliveryHistory
);

module.exports = router;
