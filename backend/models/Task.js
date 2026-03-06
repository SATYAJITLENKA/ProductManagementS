import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["Todo", "In Progress", "Done"],
    default: "Todo"
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },

  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true
  }

},
{ timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;