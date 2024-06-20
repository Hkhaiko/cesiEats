const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  items: [{
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    }
  }],
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
