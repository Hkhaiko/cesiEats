const Restaurant = require("../models/restaurantModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const path = require('path');
const fs = require('fs');

const createAccessToken = (user) => {
  const payload = { user: { id: user._id } };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "1h" });
};

const createRefreshToken = (user) => {
  const payload = { user: { id: user._id } };
  return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: "1w" });
};

exports.register = async (req, res) => {
  const { name, email, password, siret, address, phone, description } = req.body;
  try {
    let user = await Restaurant.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "Restaurant already exists" });
    }

    let restaurant = new Restaurant({
      name,
      email,
      password,
      siret,
      address,
      phone,
      description,
    });

    await restaurant.save();
    const accessToken = createAccessToken(restaurant);
    const refreshToken = createRefreshToken(restaurant);

    res.json({ msg: "Registration successful", accessToken, refreshToken, userId: restaurant._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const restaurant = await Restaurant.findOne({ email });
    if (!restaurant) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, restaurant.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const accessToken = createAccessToken(restaurant);
    const refreshToken = createRefreshToken(restaurant);

    res.json({ msg: "Login successful", accessToken, refreshToken, userId: restaurant._id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token not provided" });
  }
  try {
    const user = jwt.verify(refreshToken, config.jwtRefreshSecret);
    const accessToken = createAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};

exports.getProfileById = async (req, res) => {
  try {
    const id = req.params.id;
    const restaurant = await Restaurant.findById(id).select("-password");

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, address, phone, description, openingHours, email, password } = req.body;
    const id = req.params.id;

    const updateData = { name, address, phone, description, openingHours, email };

    if (req.files && req.files.banner) {
      const banner = req.files.banner;
      const uploadPath = path.join(__dirname, '..', 'uploads', banner.name);
      banner.mv(uploadPath, function(err) {
        if (err) {
          return res.status(500).send(err);
        }
      });
      updateData.banner = `/uploads/${banner.name}`;
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const id = req.params.id;
    await Restaurant.findByIdAndRemove(id);
    res.json({ message: "Compte restaurant supprimé" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.searchRestaurants = async (req, res) => {
  try {
    const { query } = req.query;
    const searchRegex = new RegExp(query, 'i'); // 'i' flag for case-insensitive search
    const restaurants = await Restaurant.find({
      $or: [
        { tags: { $in: [searchRegex] } },
        { name: searchRegex }
      ]
    });
    res.status(200).json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
