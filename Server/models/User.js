const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "client" },
  status: { type: String, default: "offline" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model("User", User);
module.exports = UserModel;
