const User = require("../models/User");
const Todo = require("../models/Todo");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
const UserOtp = "";

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
  const { name, email, phone, avatar } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, avatar },
      { new: true, fields: "-password" }
    );

    if (!avatar) {
      updatedUser.avatar = `${process.env.LOCALHOST_URL}/uploads/avatar_admin/avatar_default.jpg`;
    }

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

exports.UpdateAvatarUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const avatarUrl = `${process.env.LOCALHOST_URL}/uploads/avatar_admin/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true, fields: "-password" }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Avatar updated successfully", user: updatedUser });
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

// Number Tasks by User on the date
exports.getNumberTasksByUserOnDate = async (req, res) => {
  const { start, end } = req.query;
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    endDate.setDate(endDate.getDate() + 1);

    const results = await Todo.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
          completedCount: {
            $sum: { $cond: [{ $eq: ["$progress", "Completed"] }, 1, 0] },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const formattedResults = results.map((item) => ({
      date: item._id,
      count: item.count,
      completedCount: item.completedCount || 0,
    }));

    res.status(200).json(formattedResults);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getNumberUsersOnDate = async (req, res) => {
  const { start, end } = req.query;
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    endDate.setDate(endDate.getDate() + 1);

    const results = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lt: endDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const formattedResults = results.map((item) => ({
      date: item._id,
      count: item.count,
    }));

    res.status(200).json(formattedResults);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Contact Admin
exports.contactAdmin = async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    const adminUsers = await User.find({ role: "admin" });

    if (adminUsers.length === 0) {
      return res.status(404).json({ message: "No admin users found" });
    }

    // Send mail to each admin (email sending logic not implemented here)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_HOST,
      subject: `Contact Form Message from ${name}`,
      text: `You have received a new message from ${name} (${email}) (${subject}):\n\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({ message: "Message sent to admin(s) successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Number of Users
exports.getNumberTasksByUsers = async (req, res) => {
  const userId = req.params.userId;
  try {
    const userInfo = await User.findById(userId, "-password");
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    // Count number of tasks for the user
    const taskCount = await Todo.countDocuments({ userId: userId });

    // Count nuumber of completed tasks for the user
    const completedTaskCount = await Todo.countDocuments({
      userId: userId,
      progress: "Completed",
    });
    userInfo.taskCount = taskCount;
    userInfo.completedTaskCount = completedTaskCount;

    res.status(200).json({
      user: userInfo,
      taskCount: taskCount,
      completedTaskCount: completedTaskCount,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update status online of user (handled in index.js with socket.io)
exports.UpdateStatusUser = async (req, res) => {
  const userId = req.params.userId;
  const { status } = req.body;
  try {
    const UpdateUser = await User.findByIdAndUpdate(
      userId,
      { status: status },
      { new: true }
    );
    if (!UpdateUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User status updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email, role: "admin" });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Admin with this email not found" });
    }
    const otp = generateOtp();

    // Save OTP and its expiration time (10 minutes) to the user document
    user.otp = otp;
    user.otpExpiration = Date.now() + 10 * 60 * 1000; // 10 minutes from now
    await user.save();
    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_HOST,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email, role: "admin" });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Admin with this email not found" });
    }

    console.log({ userOtp: user.otp, userOtpExpiration: user.otpExpiration });

    // check otp validity
    if (
      user.otp !== otp ||
      !user.otpExpiration ||
      user.otpExpiration < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  console.log({ email, newPassword });
  try {
    const user = await User.findOne({ email, role: "admin" });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Admin with this email not found" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    // Update the user's password
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
