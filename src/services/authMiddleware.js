const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/database");

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });
  console.log("jwt verify secret: ", jwtSecret);
  jwt.verify(token, jwtSecret, (err, user) => {
    if (err)
      () => {
        console.log("Failed verification jws secret");
        return res.status(403).json({ message: "Invalid token" });
      };
    console.log("Secret verified successfully");
    req.user = user;
    next();
  });
};

const authorizeRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  next();
};

module.exports = { authenticateToken, authorizeRole };
