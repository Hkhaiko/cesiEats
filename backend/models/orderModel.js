const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  restaurantId: {
    type: String,
    required: true,
  },
  customerId: {
    type: String,
    required: true,
  },
  items: [
    {
      itemId: Schema.Types.ObjectId,
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
