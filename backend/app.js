const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const restaurantRoutes = require("./routes/restaurantRoutes");
const itemRoutes = require("./routes/itemRoutes");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");

const config = require("./config/config");

const corsOptions = {
  origin: "http://localhost:3001", // Le frontend tourne sur localhost:3001
  credentials: true, // Permet d'inclure les cookies
};

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Connect to MongoDB
config.connectToDatabase();

//Routes
app.use("/api", restaurantRoutes);
app.use("/api", itemRoutes);

app.get("/protected", auth, (req, res) => {
  res.json({ msg: "This is a protected route", user: req.user });
});

app.get("/", (req, res) => res.send("API RESTAURANT is running"));

const PORT = config.port;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
