const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.verifyToken = (req, res) => {
  const token = req.cookies.token;
  console.log(JSON.parse(JSON.stringify(req.headers)));

  console.log(
    `Verfy Token function from auth service works here your token : `,
    token
  );

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded.user });
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

exports.logout = (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.json({ msg: "Logout successful" });
};
