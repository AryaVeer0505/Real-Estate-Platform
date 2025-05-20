require('dotenv').config();
const jwt = require('jsonwebtoken');
const secretKey = process.env.ACCESS_TOKEN_SECRET;

const checkAuth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(400).json({ message: "Token not found in headers" });
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(400).json({ message: "Token is missing" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    console.log(decoded.role); 
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      return res.status(500).json({ message: "Authentication failed", error: error.message });
    }
  }
};

const generateToken = (userData) => {
  return jwt.sign(userData, secretKey, { expiresIn: "1h" });
};

module.exports = { checkAuth, generateToken };
