const express = require("express");
const router = express.Router();

const todoController = require("../../controllers/ClientController");

router.post("/todos", todoController.createTodo);
router.get("/todos", todoController.getTodos);
router.get("/todos/:id", todoController.getTodoById);
router.put("/todos/:id", todoController.updateTodo);
router.delete("/todos/:id", todoController.deleteTodo);
router.patch("/todos/reorder", todoController.reorderTodos);

router.post("/register", todoController.registerUser);
router.post("/login", todoController.loginUser);
router.get("/profile", todoController.getUserProfile);
router.get("/logout", todoController.logoutUser);

module.exports = router;
