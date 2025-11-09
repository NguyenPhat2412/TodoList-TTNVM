const express = require("express");
const router = express.Router();

const todoController = require("../../controllers/ClientController");
const {
  authMiddlewareLocalStorage,
} = require("../../middleware/authMiddleware");

router.post("/todos", todoController.createTodo);
router.get("/todos", todoController.getTodos);
router.get("/todos/:id", todoController.getTodoById);
router.put("/todos/:id", todoController.updateTodo);
router.delete("/todos/:id", todoController.deleteTodo);
router.patch("/todos/reorder", todoController.reorderTodos);
router.get("/todos/user/:userId", todoController.getTodoByUserId);

// number todo with category by userId
router.get(
  "/todos/category/count/:userId",
  todoController.getNumberOfCategoriesTodo
);

// register
router.post("/register", todoController.registerUser);

// login
router.post("/login", todoController.loginUser);

// logout
router.get("/logout", todoController.logoutUser);

// select category
router.get("/selectCategory/:userId/:category", todoController.selectCategory);

// get user profile
router.get(
  "/profile",
  authMiddlewareLocalStorage,
  todoController.getUserProfile
);

// get todo by userId and category
router.get("/todos/:userId/:category", todoController.getTodoByCategory);

module.exports = router;
