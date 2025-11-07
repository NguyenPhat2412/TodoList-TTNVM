const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "client" },
  status: { type: String, default: "offline" },
  avatar: {
    type: String,
    default: `${process.env.LOCALHOST_URL}/uploads/avatar_admin/avatar_default.jpg`,
  },
  otp: { type: String, default: "" },
  otpExpiration: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

User.index({ email: 1, name: 1, phone: 1 });

const UserModel = mongoose.model("User", User);
module.exports = UserModel;
