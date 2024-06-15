const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const deliverySchema = new mongoose.Schema({
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
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: [
      "active",
      "inactive",
      "pending",
      "accepted",
      "refused",
      "in_progress",
      "completed",
    ],
    default: "inactive",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

deliverySchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

deliverySchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("Delivery", deliverySchema);
