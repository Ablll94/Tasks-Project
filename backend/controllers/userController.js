const Task = require('../models/Task');
const Notification = require('../models/Notification');

exports.getUnreadNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.params.userId,
      isRead: false
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markNotificationAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ message: 'تم تعليم الإشعار كمقروء' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.completeTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: 'completed' },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'المهمة غير موجودة' });
    }

    await Notification.create({
      userId: task.assignedTo,
      message: `أحسنت! لقد أكملت المهمة بنجاح: "${task.title}"`,
      type: 'TASK_COMPLETED',
      taskId: task._id
    });

    res.json({ message: 'تم إنجاز المهمة بنجاح', task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
