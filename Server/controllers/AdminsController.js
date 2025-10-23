const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const deleteUser = await User.findByIdAndDelete(userId);
    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserInfo = async (req, res) => {
  const userId = req.user.id;
  try {
    const userInfo = await User.findById(userId, "-password");
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userLogin = await User.findOne({ email, role: "admin" });

    if (!userLogin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    if (userLogin.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const isMatch = await bcrypt.compare(password, userLogin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: userLogin._id, role: userLogin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password: _, ...userData } = userLogin.toObject();

    // save token in local storage (handled on client side)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    res
      .status(200)
      .json({ message: "Login successful", user: userData, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.RegisterAdmin = async (req, res) => {
  const { name, password, email, phone } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new User({
      name,
      password: hashedPassword,
      email,
      phone,
      role: "admin",
    });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await newAdmin.save();
    res.status(201).json({ message: "Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getAllUsersWithRole = async (req, res) => {
  const role = req.params.role;
  try {
    const users = await User.find({ role }, "-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.UpdateUser = async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone },
      { new: true, fields: "-password" }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getUserInfoAfterLogin = async (req, res) => {
  const userId = req.id;
  try {
    const userInfo = await User.findById(userId, "-password");
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userInfo);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Number Tasks by User on the day
