const express = require("express");
const router = express.Router();

const AdminsController = require("../../controllers/AdminsController");
const authMiddlewareLocalStorageAdmin =
  require("../../middleware/authMiddleware").authMiddlewareLocalStorageAdmin;

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
  authMiddlewareLocalStorageAdmin,
  AdminsController.UpdateUser
);

router.get(
  "/users/me",
  authMiddlewareLocalStorageAdmin,
  AdminsController.getUserInfoAfterLogin
);

// change password
router.put(
  "/users/change-password",
  authMiddlewareLocalStorageAdmin,
  AdminsController.changePassword
);

module.exports = router;
