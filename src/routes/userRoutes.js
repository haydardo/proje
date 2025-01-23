const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  authenticateToken,
  validateUser,
} = require("../middleware/authMiddleware");

// User routes
router.get("/", authenticateToken, userController.getAllUsers);
router.get("/:id", authenticateToken, userController.getUser);
router.put("/:id", authenticateToken, validateUser, userController.updateUser);
router.delete("/:id", authenticateToken, userController.deleteUser);

module.exports = router;
