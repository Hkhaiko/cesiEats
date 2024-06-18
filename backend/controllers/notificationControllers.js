const Notification = require("../models/notificationModels");

// Create a new notification
exports.createNotification = async (req, res) => {
  try {
    const { entityId, entityType, message } = req.body;
    const newNotification = new Notification({ entityId, entityType, message });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get notifications for an entity
exports.getNotifications = async (req, res) => {
  try {
    const { entityId, entityType } = req.params;
    const notifications = await Notification.find({ entityId, entityType });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark a notification as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a notification
exports.deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
