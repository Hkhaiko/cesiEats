const { verifyToken } = require("../middleware/authService");

const auth = (req, res, next) => {
  verifyToken(req, res, next);
};

module.exports = auth;
