const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config/config");
const cookieParser = require("cookie-parser");
const customerRoutes = require("./routes/customerRoutes");

const app = express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
config.connectToDatabase();

//Routes
app.use("/api", customerRoutes);

app.get("/", (req, res) => res.send("API CLIENT is running"));
const PORT = config.port;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
