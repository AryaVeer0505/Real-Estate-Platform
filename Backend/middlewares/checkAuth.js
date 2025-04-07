const jwt = require('jsonwebtoken');
const secretKey = process.env.ACCESS_TOKEN_SECRET;
require('dotenv').config();
const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("JWT Verification Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired, please login again" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token!!" });
    } else {
      return res.status(500).json({ message: "Authentication Failed" });
    }
  }
};

module.exports = checkAuth;
