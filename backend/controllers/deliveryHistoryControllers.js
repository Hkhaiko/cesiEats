const DeliveryHistory = require("../models/deliveryHistoryModel");

exports.getDeliveryHistory = async (req, res) => {
  try {
    const history = await DeliveryHistory.find({
      deliveryPersonId: req.params.deliveryPersonId,
    });
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.addDeliveryHistory = async (req, res) => {
  try {
    const newHistory = new DeliveryHistory(req.body);
    const savedHistory = await newHistory.save();
    res.status(201).json(savedHistory);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.updateDeliveryHistory = async (req, res) => {
  try {
    const updatedHistory = await DeliveryHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedHistory);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.deleteDeliveryHistory = async (req, res) => {
  try {
    await DeliveryHistory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Delivery history deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
