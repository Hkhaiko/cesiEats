const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const deliveryPersonRoutes = require("./routes/deliveryPersonRoutes");
const deliveryHistoryRoutes = require("./routes/deliveryHistoryRoutes");
const cookieParser = require("cookie-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const config = require("./config/config");
const http = require("http");
const socket = require("./config/socket");




const corsOptions = {
  origin: "http://localhost:3000", // Le frontend tourne sur localhost:3001
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


const server = http.createServer(app);
const io = socket.init(server); // Initialiser io

// Configuration de Socket.io
io.on("connection", (socket) => {
  console.log("New client connected", socket.id);
});

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
        url: "http://localhost:5003/api",
        description: "Local server",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Secure Routes
app.use("/api", deliveryPersonRoutes);
app.use("/api", deliveryHistoryRoutes);

app.get("/", (req, res) => res.send("API delivery is running"));

const PORT = config.port;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
