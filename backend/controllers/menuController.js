const Item = require("../models/itemModel");
const Menu = require("../models/menuModel");
const Restaurant = require("../models/restaurantModels");

exports.createMenu = async (req, res) => {
  try {
    const { name, description, price, image, items } = req.body;
    const restaurantId = req.user.id;

    const newMenu = new Menu({
      name,
      description,
      price,
      image,
      items,
      restaurantId,
    });

    await newMenu.save();

    const restaurant = await Restaurant.findById(restaurantId);
    restaurant.menus.push(newMenu._id);
    await restaurant.save();

    res.status(201).json(newMenu);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.getMenus = async (req, res) => {
  try {
    const restaurantId = req.user.id;
    const menus = await Menu.find({ restaurantId }).populate('items.item');
    res.status(200).json(menus);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, image, items } = req.body;
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      { name, description, price, image, items },
      { new: true }
    );
    res.status(200).json(updatedMenu);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    await Menu.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get all menus for a restaurant (public access)
exports.getPublicMenus = async (req, res) => {
  try {
    const restaurantId = req.params.id;
    const menus = await Menu.find({ restaurantId }).populate('items.item');
    res.status(200).json(menus);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error", error });
  }
};
