const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  index: { type: Number, default: 0 },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  description: { type: String, default: "", required: true },
  category: { type: String, default: "Work", required: true },
  startDate: { type: Date, default: null, required: true },
  dueDate: { type: Date, default: null, required: true },
  progress: { type: String, default: "Not Start", required: true },
  prioritize: { type: String, default: "Medium", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

TodoSchema.index({ userId: 1, title: 1, category: 1 });

const Todo = mongoose.model("Todo", TodoSchema);

module.exports = Todo;
