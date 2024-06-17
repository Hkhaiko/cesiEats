const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const orderRoutes = require("./routes/orderRoutes");
const auth = require("./middleware/auth");

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

const PORT = config.port;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
