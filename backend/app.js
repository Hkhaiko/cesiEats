const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./configs/config");
const cookieParser = require("cookie-parser");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
config.connectToDatabase();

app.use("/api/notifications", notificationRoutes);

app.get("/", (req, res) => res.send("API NOTIFICATION is running"));

const PORT = config.port;
app.listen(PORT, () =>
  console.log(`Server NOTIFICATION started on port ${PORT}`)
);
