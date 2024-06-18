const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const config = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  port: process.env.PORT,
  mongooseOptions: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  connectToDatabase: () => {
    mongoose.connect(config.mongoURI, config.mongooseOptions);

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
      process.exit(1);
    });

    mongoose.connection.once("open", () => {
      console.log("Connected to MongoDB!");
    });
  },
};

module.exports = config;
