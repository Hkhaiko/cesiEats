const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const deliveryPersonSchema = new mongoose.Schema({
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
      "accepted",
      "refused",
      "in-progress",
      "completed",
    ],
    default: "inactive",
  },
  income: {
    type: String,
    required: true,
    default: "0€",
  },
  score: {
    type: String,
    required: true,
    default: "0",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

deliveryPersonSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

deliveryPersonSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }
  next();
});

deliveryPersonSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("DeliveryPerson", deliveryPersonSchema);
