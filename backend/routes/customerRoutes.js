const express = require("express");
const router = express.Router();
const customerControllers = require("../controllers/customerControllers");
const auth = require("../middleware/auth");

router.post("/client/customers", customerControllers.createCustomer);
router.post("/client/logout", customerControllers.logout);
router.get("/client/customers", auth, customerControllers.getAllCustomers);
router.get("/client/customers/:id", auth, customerControllers.getCustomerById);
router.put("/client/customers/:id", auth, customerControllers.updateCustomer);
router.delete(
  "/client/customers/:id",
  auth,
  customerControllers.deleteCustomer
);

module.exports = router;
