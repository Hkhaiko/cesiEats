const axios = require("axios");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const verifyToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token verification failed" });
  }
};

module.exports = {
  verifyToken,
};
