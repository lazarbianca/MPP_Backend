const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("./config/database");
const { body, validationResult } = require("express-validator");
const User = require("./model/user");
const {
  authenticateToken,
  authorizeRole,
} = require("./services/authMiddleware");
const router = express.Router();

// Register
router.post(
  "/register",
  [
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty(),
    body("role").isString().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        password: hashedPassword,
        role,
      });
      res.status(201).json({ message: "User registered", user });
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    }
  }
);

// Login
router.post(
  "/login",
  [
    body("username").isString().notEmpty(),
    body("password").isString().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    try {
      const user = await User.findOne({ where: { username } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
      console.log("jwt sign secret: ", jwtSecret);
      const token = jwt.sign(
        { userId: user.userId, username: user.username, role: user.role },
        jwtSecret
      );

      res.json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// router.get("/protected", authenticateToken, (req, res) => {
//   res.json({ message: "Protected data", user: req.user });
// });

// router.get(
//   "/admin",
//   authenticateToken,
//   authorizeRole(["Admin"]),
//   (req, res) => {
//     res.json({ message: "Admin data", user: req.user });
//   }
// );

module.exports = router;
