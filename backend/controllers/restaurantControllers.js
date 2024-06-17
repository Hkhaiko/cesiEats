const Restaurant = require("../models/restaurantModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const dotenv = require("dotenv");

dotenv.config();

const createToken = (user) => {
  const payload = { user: { id: user.id } };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "20h" });
};

exports.register = async (req, res) => {
  const { name, email, password, siret, address, phone, description } =
    req.body;
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
    const token = createToken(restaurant);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    // Stocker l'ID de l'utilisateur dans un cookie distinct
    res.cookie("userId", restaurant._id.toString(), {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.json({ msg: "Registration successful", token });
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
    const token = jwt.sign({ id: restaurant._id }, config.jwtSecret, {
      expiresIn: "20h",
    });
    res.json(`Vous êtes connecté ! ${token}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getAllProfiles = async (req, res) => {
  try {
    const restaurants = await Restaurant.find().select("-password");
    res.json(restaurants);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
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
    res.status(500).send("Erreur serveur");
  }
};

exports.updateProfile = async (req, res) => {
  const { name, address, phone } = req.body;
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    res.json(restaurant);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    await Restaurant.findByIdAndRemove(req.user.id);
    res.json({ message: "Compte restaurant supprimé" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur serveur");
  }
};
