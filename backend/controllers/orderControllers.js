const axios = require("axios");
const Order = require("../models/orderModel");

// Récupérer toutes les commandes d'un restaurant spécifique
const getOrdersByRestaurant = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const orders = await Order.find({ restaurantId: restaurantId }).populate(
      "restaurantId"
    );

    if (!orders) {
      return res
        .status(404)
        .json({ message: "No orders found for this restaurant" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createOrder = async (req, res) => {
  try {
    const { restaurantId, customerId, items, totalPrice, status } = req.body;

    const restaurantResponse = await axios.get(
      `http://localhost:5001/api/client/customers`
    );
    const restaurant = restaurantResponse.data;
    console.log(restaurant);

    const newOrder = new Order({
      restaurantId,
      customerId,
      items,
      totalPrice,
      status: status || "pending",
      createdAt: new Date(),
    });
    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Exporter les fonctions pour les utiliser dans les routes
module.exports = {
  getOrdersByRestaurant,
  createOrder,
};
