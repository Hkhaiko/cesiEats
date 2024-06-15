const DeliveryPerson = require("../models/deliveryPerson");
const axios = require("axios");

// Créer un livreur
exports.createDeliveryPerson = async (req, res) => {
  try {
    const newDeliveryPerson = new DeliveryPerson(req.body);
    await newDeliveryPerson.save();
    res.status(201).json({
      message: "DeliveryPerson created successfully",
      delivery: newDeliveryPerson,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir tous les livreurs
exports.getAllDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await DeliveryPerson.find();
    res.status(200).json(deliveryPersons);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir un livreur par ID
exports.getDeliveryPersonById = async (req, res) => {
  try {
    const deliveryPerson = await DeliveryPerson.findById(req.params.id);
    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery Person not found" });
    }
    res.status(200).json(deliveryPerson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour le statut d'un livreur
exports.updateDeliveryPersonStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const deliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true, runValidators: true }
    );

    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery Person not found" });
    }

    res.status(200).json(deliveryPerson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Mettre à jour le statut d'un livreur
exports.updateDeliveryPerson = async (req, res) => {
  try {
    const updatedDeliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedDeliveryPerson) {
      return res.status(404).json({ message: "Delivery Person not found" });
    }
    res.status(200).json(updatedDeliveryPerson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.acceptDelivery = async (req, res) => {
  try {
    //deliveryId is the Id of order microservice
    const { deliveryId, accept } = req.body;
    const deliveryPerson = await DeliveryPerson.findById(req.params.id);
    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery Person not found" });
    }
    const orderServiceUrl = `http://localhost:5002/api/orders/${deliveryId}`; // URL de l'API du microservice de commande
    const response = await axios.get(orderServiceUrl);
    console.log(response);

    const delivery = await DeliveryPerson.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    if (accept) {
      delivery.status = "accepted";
      delivery.deliveryPerson = deliveryPerson._id;
    } else {
      delivery.status = "refused";
    }
    await delivery.save();

    res.status(200).json(delivery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un livreur
exports.deleteDeliveryPerson = async (req, res) => {
  try {
    const deletedDeliveryPerson = await DeliveryPerson.findByIdAndDelete(
      req.params.id
    );
    if (!deletedDeliveryPerson) {
      return res.status(404).json({ message: "Delivery Person not found" });
    }
    res.status(200).json({ message: "Delivery Person deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
