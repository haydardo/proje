const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { validateUser, validateLogin } = require("../middleware/authMiddleware");

// Auth routes
router.post("/register", validateUser, authController.register);
router.post("/login", validateLogin, authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

module.exports = router;
