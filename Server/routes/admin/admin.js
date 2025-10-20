const express = require("express");
const router = express.Router();

const AdminsController = require("../../controllers/AdminsController");
const authMiddlewareLocalStorage =
  require("../../middleware/authMiddleware").authMiddlewareLocalStorage;

// Route to get all users (admin only)
router.get("/users", /* authenticateAdmin, */ AdminsController.getAllUsers);

// Delete user by ID (admin only)
router.delete(
  "/delete-users/:id",
  /* authenticateAdmin, */ AdminsController.deleteUser
);

// Login
router.post("/login", AdminsController.Login);

// Register admin
router.post("/register", AdminsController.RegisterAdmin);

// get all user with role
router.get("/users/role/:role", AdminsController.getAllUsersWithRole);

// update user
router.put(
  "/users/:id",
  authMiddlewareLocalStorage,
  AdminsController.UpdateUser
);

router.get(
  "/users/me",
  authMiddlewareLocalStorage,
  AdminsController.getUserInfoAfterLogin
);

// change password
router.put(
  "/users/change-password",
  authMiddlewareLocalStorage,
  AdminsController.changePassword
);

module.exports = router;
