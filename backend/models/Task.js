const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: String, required: true },
    deadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'overdue'],
      default: 'pending'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
