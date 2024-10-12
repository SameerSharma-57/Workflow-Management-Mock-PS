// backend/routes/authRoutes.js
import express from "express";
import { signup, login, logout } from "../controllers/authControllers.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Sign Up
router.post("/signup", signup);

// Login
router.post("/login", login);

// Logout
router.post("/logout", authMiddleware, logout);

export default router;
