const express = require("express");
const router = express.Router();

const AdminsController = require("../../controllers/AdminsController");
// const authenticateAdmin = require("../../middlewares/authenticateAdmin");

// Route to get all users (admin only)
router.get("/users", /* authenticateAdmin, */ AdminsController.getAllUsers);

// Delete user by ID (admin only)
router.delete(
  "/users/:id",
  /* authenticateAdmin, */ AdminsController.deleteUser
);

// Login
router.post("/login", AdminsController.Login);

// Register admin
router.post("/register", AdminsController.RegisterAdmin);

module.exports = router;
