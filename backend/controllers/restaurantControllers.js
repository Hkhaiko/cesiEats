const Restaurant = require("../models/restaurantModel");
const jwt = require("jsonwebtoken");
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

    user = new Restaurant({
      name,
      email,
      password,
      siret,
      address,
      phone,
      description,
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
    let user = await Restaurant.findOne({ email });

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
