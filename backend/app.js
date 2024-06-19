const express = require("express");
const cors = require("cors");
const ip = require("ip");
const http = require("http");
const socketIo = require("socket.io");
const bodyParser = require("body-parser");
const orderRoutes = require("./routes/orderRoutes");
const auth = require("./middleware/auth");
const config = require("./config/config");

const app = express();
const ipAddress = ip.address();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
config.connectToDatabase();

// Routes
app.use("/api", orderRoutes);

// Example route to login and get a token
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await login(email, password);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/protected", auth, (req, res) => {
  res.json({ msg: "This is a protected route", user: req.user });
});

app.get("/", (req, res) => res.send("API ORDERS is running"));

// Listen on all network interfaces (0.0.0.0)
const PORT = config.port || 5002;
app.listen(PORT, () => {
  console.log(
    `Service Commande Server started on port ${PORT} at IP ${ipAddress}`
  );
});
