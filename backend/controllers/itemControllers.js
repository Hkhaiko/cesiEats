const item = require("../models/itemModel");

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const { name, description, price, category, options, image, restaurantId } = req.body;
    const newItem = new item({
      name,
      description,
      price,
      category,
      options,
      image,
      restaurantId,
    });
    await newItem.save();
    res.status(201).json({
      message: `You created new item !`,
      item: newItem,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating item", error });
  }
};

// Get all items for a restaurant
exports.getItems = async (req, res) => {
  try {
    const items = await item.find({
      restaurantId: req.params.restaurantId,
    });
    res.status(201).json({
      message: `Here are all items of restaurant with ID: ${req.params.restaurantId}`,
      item: items,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

// Update an item
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, options, image } = req.body;
    const updatedItem = await item.findByIdAndUpdate(
      id,
      { name, description, price, category, options, image },
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
};

// Delete an item
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await item.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};
