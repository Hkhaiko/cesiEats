const Item = require("../models/itemModel");

// Create a new item
exports.createItem = async (req, res) => {
  try {
    const { name, description, price, category, options, image } = req.body;
    const restaurantId = req.user.id;
    const newItem = new Item({
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
      message: `You created a new item!`,
      item: newItem,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating item", error });
  }
};

// Get all items for a restaurant
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find({
      restaurantId: req.user.id,
    });
    res.status(200).json({
      message: `Here are all items of restaurant with ID: ${req.user.id}`,
      items: items,
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
    const updatedItem = await Item.findByIdAndUpdate(
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
    await Item.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};

// Get all items for a restaurant (public access)
exports.getPublicItems = async (req, res) => {
  try {
    const items = await Item.find({
      restaurantId: req.params.id,
    });
    res.status(200).json({
      message: `Here are all items of restaurant with ID: ${req.params.id}`,
      items: items,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

