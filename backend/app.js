const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const orderRoutes = require("./routes/orderRoutes");

const config = require("./config/config");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
config.connectToDatabase();

//Routes
app.use("/api", orderRoutes);

app.get("/", (req, res) => res.send("API ORDERS is running"));

const PORT = config.port;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
