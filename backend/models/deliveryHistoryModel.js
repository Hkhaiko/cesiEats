const mongoose = require("mongoose");

const deliveryHistorySchema = new mongoose.Schema(
  {
    deliveryPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPerson",
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    distance: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    deliveryDate: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const DeliveryHistory = mongoose.model(
  "DeliveryHistory",
  deliveryHistorySchema
);

module.exports = DeliveryHistory;
