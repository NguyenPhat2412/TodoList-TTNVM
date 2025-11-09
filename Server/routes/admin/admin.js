const express = require("express");
const router = express.Router();

const AdminsController = require("../../controllers/AdminsController");
const authMiddlewareLocalStorageAdmin =
  require("../../middleware/authMiddleware").authMiddlewareLocalStorageAdmin;

const upload = require("../../middleware/multerMiddleware");
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

router.put(
  "/users/change-password",
  authMiddlewareLocalStorageAdmin,
  AdminsController.changePassword
);
// update user
router.put(
  "/users/:id",
  authMiddlewareLocalStorageAdmin,
  AdminsController.UpdateUser
);

// get inform user after login
router.get(
  "/users/me",
  authMiddlewareLocalStorageAdmin,
  AdminsController.getUserInfoAfterLogin
);

// update admin profile with avatar
router.put(
  "/users/avatar/:id",
  authMiddlewareLocalStorageAdmin,
  upload.single("avatar"),
  AdminsController.UpdateAvatarUser
);

// get Number of User on Date.
router.get(
  "/users/stats",
  /* authenticateAdmin, */ AdminsController.getNumberTasksByUserOnDate
);

// get Number User
router.get(
  "/users/number",
  /* authenticateAdmin, */ AdminsController.getNumberUsersOnDate
);
// contact form
router.post("/contact", AdminsController.contactAdmin);

// get Number Tasks by User
router.get(
  "/tasks/user/stats/:userId",
  /* authenticateAdmin, */ AdminsController.getNumberTasksByUsers
);

// update user status (active/inactive)
router.put(
  "/users/status/:userId",
  authMiddlewareLocalStorageAdmin,
  AdminsController.UpdateStatusUser
);

// forget password
router.post("/forgot-password", AdminsController.forgotPassword);

// otp
router.post("/verify-otp", AdminsController.verifyOTP);

// reset password
router.post("/reset-password", AdminsController.resetPassword);
module.exports = router;
