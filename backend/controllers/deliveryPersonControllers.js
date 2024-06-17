const DeliveryPerson = require("../models/deliveryPerson");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const createToken = (user) => {
  const payload = { user: { id: user.id } };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "20h" });
};

exports.createDelivery = async (req, res) => {
  const { name, email, password, phone, status } = req.body;

  try {
    let user = await DeliveryPerson.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "Delivery already exists" });
    }

    user = new DeliveryPerson({
      name,
      email,
      password,
      phone,
      status,
    });
    await user.save();

    const token = createToken(user);
    res.cookie("token", token, {
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
    let user = await DeliveryPerson.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = createToken(user);
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res.json({ msg: "Login successful", token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getAllDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await DeliveryPerson.find();
    res.status(200).json(deliveryPersons);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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

exports.updateDeliveryPersonStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (
      ![
        "active",
        "inactive",
        "in-progress",
        "completed",
        "refused",
        "completed",
      ].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const deliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      req.params.id,
      { status: status },
      { new: true, runValidators: true }
    );
    console.log("test");
    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery Person not found" });
    }

    res.status(200).json(deliveryPerson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

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

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  res.json({ msg: "Logout successful" });
};
