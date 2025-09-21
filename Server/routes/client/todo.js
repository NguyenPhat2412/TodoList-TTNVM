const express = require("express");
const router = express.Router();

const todoController = require("../../controllers/ClientController");
const {
  authMiddleware,
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
router.post("/register", todoController.registerUser);
router.post("/login", todoController.loginUser);

router.get("/logout", todoController.logoutUser);

router.get(
  "/profile",
  authMiddlewareLocalStorage,
  todoController.getUserProfile
);
module.exports = router;
