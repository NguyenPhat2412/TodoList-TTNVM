// List models used in this controller
const Todo = require("../models/Todo");
const User = require("../models/User");

const nodemailer = require("nodemailer");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { default: mongoose } = require("mongoose");

const { sendOrderConfirmationEmail } = require("../utils/emailService");
const { sendContactEmail } = require("../utils/contactService");

let otpStore = {};

function generateOTP() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

// Todo CRUD Operations
exports.createTodo = async (req, res) => {
  const { title, completed, description, index } = req.body;
  try {
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (typeof completed !== "boolean") {
      return res.status(400).json({ error: "Completed must be a boolean" });
    }

    if (title.length > 100) {
      return res
        .status(400)
        .json({ error: "Title cannot exceed 100 characters" });
    }
    if (description && description.length > 500) {
      return res
        .status(400)
        .json({ error: "Description cannot exceed 500 characters" });
    }
    if (index !== undefined && typeof index !== "number") {
      return res.status(400).json({ error: "Index must be a number" });
    }

    const newTodo = new Todo({ title, completed, description, index });
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
};

// reorder todos
exports.reorderTodos = async (req, res) => {
  try {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "Invalid data format" });
    }
    for (let i = 0; i < orderedIds.length; i++) {
      const id = orderedIds[i];
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: `Invalid todo ID: ${id}` });
      }
      await Todo.findByIdAndUpdate(id, { index: i, updatedAt: Date.now() });
    }
    res.status(200).json({ message: "Todos reordered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reorder todos" });
  }
};

// Get all todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve todos" });
  }
};

// Get a single todo by ID
exports.getTodoById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid todo ID" });
    }

    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve todo" });
  }
};

// Update a todo
exports.updateTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const { title, completed, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid todo ID" });
    }

    if (title && title.length > 100) {
      return res
        .status(400)
        .json({ error: "Title cannot exceed 100 characters" });
    }
    if (description && description.length > 500) {
      return res
        .status(400)
        .json({ error: "Description cannot exceed 500 characters" });
    }
    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({ error: "Completed must be a boolean" });
    }
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, completed, description, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update todo" });
  }
};

// Save todo before drag and drop

// Delete a todo
exports.deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid todo ID" });
    }

    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete todo" });
  }
};

// User Registration
exports.registerUser = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // send otp to email
    const otp = generateOTP();
    otpStore[email] = { otp, createdAt: Date.now() + 5 * 60 * 1000 }; // OTP valid for 5 minutes

    // send mail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send OTP email" });
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .json({ message: "OTP sent to email. Please verify to continue." });
      }
    });

    const newUser = new User({ name, email, phone, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({
      email,
    });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: "Failed to login" });
  }
};

// User Logout
exports.logoutUser = async (req, res) => {
  try {
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to logout user" });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user profile" });
  }
};
