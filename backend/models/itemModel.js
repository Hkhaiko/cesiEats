const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["entrée", "plat", "dessert", "boisson"],
    required: true,
  },
  options: [
    {
      name: String,
      price: String,
    },
  ],
  image: {
    type: String, // URL de l'image
    required: false,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurant",
    required: true,
  },
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
