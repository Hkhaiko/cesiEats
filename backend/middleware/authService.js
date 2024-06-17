const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const authServiceUrl = process.env.AUTH_SERVICE_URL;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    const response = await axios.post(
      `${authServiceUrl}/verify-token`,
      {},
      {
        withCredentials: true,
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );
    req.user = response.data.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: "Token verification failed" });
  }
};

module.exports = {
  verifyToken,
};
