const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const restaurantRoutes = require("./routes/restaurantRoutes");
const itemRoutes = require("./routes/itemRoutes");
const menuRoutes = require("./routes/menuRoutes");
const auth = require("./middleware/auth");

const config = require("./config/config");

const fs = require('fs');
const path = require('path');

// Vérifier et créer le dossier 'uploads' s'il n'existe pas
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const corsOptions = {
  origin: true, // Le frontend tourne sur localhost:3000
  credentials: true, // Permet d'inclure les cookies
};

const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit:'50mb' }));
app.use(cors(corsOptions));

// Connect to MongoDB
config.connectToDatabase();

// Routes
app.use("/api", restaurantRoutes);
app.use("/api", itemRoutes);
app.use("/api", menuRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/api/protected", auth, (req, res) => {
  res.json({ msg: "This is a protected route", user: req.user });
});

app.get("/", (req, res) => res.send("API RESTAURANT is running"));

const PORT = config.port;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
