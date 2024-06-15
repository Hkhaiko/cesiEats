const mongoose = require("mongoose");

const deliveryPersonSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "refused", "in_progress", "completed"],
    default: "inactive",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DeliveryPerson = mongoose.model("DeliveryPerson", deliveryPersonSchema);
module.exports = DeliveryPerson;
