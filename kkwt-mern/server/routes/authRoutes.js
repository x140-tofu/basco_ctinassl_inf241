import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// SIGN UP
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: "Username or email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "kkwt_secret", {
      expiresIn: "7d",
    });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOG IN (Supports Username OR Email)
router.post("/login", async (req, res) => {
  try {
    const { identifier, email, password } = req.body;
    const loginValue = identifier || email;

    const user = await User.findOne({
      $or: [{ email: loginValue }, { username: loginValue }],
    });

    if (!user) {
      return res.status(400).json({ message: "Account not found. Please sign up first." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "kkwt_secret", {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;