const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['NEW_TASK', 'TASK_COMPLETED', 'TASK_OVERDUE', 'INFO'],
      required: true
    },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', default: null },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
