// models/restaurantModel.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const openingHoursSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  openHour: {
    type: Number,
    required: true,
  },
  openMinute: {
    type: Number,
    required: true,
  },
  closeHour: {
    type: Number,
    required: true,
  },
  closeMinute: {
    type: Number,
    required: true,
  },
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  siret: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
  }],
  menus: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
  }],
  openingHours: [openingHoursSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving
restaurantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Restaurant =
  mongoose.models.Restaurant || mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;
