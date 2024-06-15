const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const config = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const cookieParser = require("cookie-parser");

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "API documentation for the Delivery service",
    },
    servers: [
      {
        url: "http://localhost:5004/api",
        description: "Local server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Connect to MongoDB
config.connectToDatabase();

//Route
app.use("/api/auth", authRoutes);
app.use("/api/auth/customer", customerRoutes);
app.use("/api/auth/restaurant", restaurantRoutes);
app.use("/api/auth/delivery", deliveryRoutes);

app.get("/", (req, res) => res.send("API AUTH is running"));

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
