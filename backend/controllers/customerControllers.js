const Customer = require("../models/customerModel");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

// Créer un nouveau client
const createToken = (user) => {
  const payload = { user: { id: user.id } };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "20h" });
};

const createCustomer = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    // Vérifier si le client existe déjà
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already exists" });
    }

    // Créer une nouvelle instance de client
    const newCustomer = new Customer({
      name,
      email,
      password,
      address,
      phone,
    });

    // Enregistrer le nouveau client dans la base de données
    const savedCustomer = await newCustomer.save();

    const token = createToken(newCustomer);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer: savedCustomer,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Récupérer tous les clients
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Récupérer un client par ID
const getCustomerById = async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Mettre à jour un client
const updateCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const { name, email, address, phone } = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customerId,
      { name, email, address, phone },
      { new: true }
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Supprimer un client
const deleteCustomer = async (req, res) => {
  try {
    const customerId = req.params.id;
    const deletedCustomer = await Customer.findByIdAndDelete(customerId);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.status(200).json({ message: "Customer deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.json({ msg: "Logout successful" });
};

module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  logout,
};
