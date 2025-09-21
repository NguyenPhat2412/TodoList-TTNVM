const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  index: { type: Number, default: 0 },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  description: { type: String, default: "", required: true },
  category: { type: String, default: "Work", required: true },
  startDate: { type: Date, default: null },
  dueDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;
