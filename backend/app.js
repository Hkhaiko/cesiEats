const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./configs/config");
const cookieParser = require("cookie-parser");
const paymentRoutes = require("./routes/paymentRoutes");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
config.connectToDatabase();

app.use("/api/payments", paymentRoutes);

app.get("/", (req, res) => res.send("API Payement is running"));

const PORT = config.port;
app.listen(PORT, () => console.log(`Server Payement started on port ${PORT}`));
