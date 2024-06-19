const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const orderRoutes = require("./routes/orderRoutes");
const auth = require("./middleware/auth");
const config = require("./config/config");
const http = require("http");
const socket = require("./config/soket");

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
config.connectToDatabase();

const server = http.createServer(app);
const io = socket.init(server); // Initialiser io

// Configuration de Socket.io
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
});

app.use("/api", orderRoutes);

app.get("/", (req, res) => res.send("API ORDERS is running"));

const PORT = config.port;

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
