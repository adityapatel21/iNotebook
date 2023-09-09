const express = require("express");
const { model } = require("mongoose");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../Middleware/fetchuser");

const router = express.Router();

const JWT_SEC = "thisissecretkey21"; ////Save this thing in save place in production code.

// ROUTE 1 : Create a user using API : "/api/auth/createUser" No Login Required
router.post(
  "/createUser",
  [
    body("name", "Name should have atleast 3 characters").isLength({ min: 3 }),
    body("email", "Not a valid email").isEmail(),
    body("password", "Password is weak").isLength({ min: 8 }),
  ],
  async (req, res) => {
    let success = false;
    const result = validationResult(req);

    // if express validator find a error it will status code 400 with json of error.
    if (!result.isEmpty()) {
      return res.status(400).json({ success, result: result.array() });
    }

    // check whether this email is already registered.
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: "Email is already registered try forget Password",
        });
      }

      const salt = bcrypt.genSaltSync(10);
      const secPassword = bcrypt.hashSync(req.body.password, salt);

      //   create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPassword,
      });

      const data = {
        user: {
          id: user._id,
        },
      };

      const authtoken = jwt.sign(data, JWT_SEC);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Some error Occured");
    }
  }
);

// ROUTE 2: Authenticate a user using API : "/api/auth/login" No Login Required
router.post(
  "/login",
  [
    body("email", "Please enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    const result = validationResult(req);

    let success = false;

    // if express validator find a error it will status code 400 with json of error.
    if (!result.isEmpty()) {
      return res.status(400).json({ result: result.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        res
          .status(400)
          .json({ error: "Please login with correct credentials" });
      }

      const checkPassword = bcrypt.compareSync(password, user.password);

      if (!checkPassword) {
        success = false;
        res
          .status(400)
          .json({ success, error: "Please login with correct credentials" });
      }

      const data = {
        user: {
          id: user._id,
        },
      };
      success = true;

      const authtoken = jwt.sign(data, JWT_SEC);
      res.json({ success, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Get user detail using API : "/api/auth/getUser" Login Required

router.post("/getUser", fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
