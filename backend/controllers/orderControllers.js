const Order = require("../models/orderModel");
const socket = require("../config/soket");

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

const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const orders = await Order.findById(orderId);

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
    const newOrder = new Order({
      restaurantId,
      customerId,
      items,
      totalPrice,
      status: status || "pending",
      createdAt: new Date(),
    });
    const savedOrder = await newOrder.save();

    // Émettre un événement pour notifier les clients (livreurs)
    const io = socket.getIo();
    io.emit("newOrder", savedOrder);

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { deliveryId, status } = req.body;
    const orderId = req.params.id;

    // Validation du statut
    if (!["in progress", "completed", "pending"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Trouver et mettre à jour la commande
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { deliveryId, status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Exporter les fonctions pour les utiliser dans les routes
module.exports = {
  getOrdersByRestaurant,
  createOrder,
  getOrderById,
  updateOrder,
};
