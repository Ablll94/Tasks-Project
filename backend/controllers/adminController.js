const Task = require('../models/Task');
const Notification = require('../models/Notification');

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline, priority } = req.body;

    const newTask = await Task.create({
      title,
      description,
      assignedTo,
      deadline,
      priority: priority || 'medium'
    });

    const prioLabel = { high: '🔴 عاجلة', medium: '🟡 مهمة', low: '🟢 عادية' }[newTask.priority] || '';

    await Notification.create({
      userId: assignedTo,
      message: `تم إسناد مهمة جديدة لك: "${title}" ${prioLabel}. الموعد النهائي: ${new Date(deadline).toLocaleString('ar-SA')}`,
      type: 'NEW_TASK',
      taskId: newTask._id
    });

    res.status(201).json({
      message: 'تم إنشاء المهمة وإرسال الإشعار بنجاح',
      task: newTask
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendInfoNotification = async (req, res) => {
  try {
    const { userId, message } = req.body;

    await Notification.create({
      userId,
      message,
      type: 'INFO'
    });

    res.status(201).json({ message: 'تم إرسال إشعار الاطلاع بنجاح' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkOverdueTasks = async (req, res) => {
  try {
    const now = new Date();
    const overdueTasks = await Task.find({
      deadline: { $lt: now },
      status: 'pending'
    });

    for (const task of overdueTasks) {
      task.status = 'overdue';
      await task.save();

      await Notification.create({
        userId: task.assignedTo,
        message: `تنبيه: لقد تأخرت في تسليم المهمة: "${task.title}"!`,
        type: 'TASK_OVERDUE',
        taskId: task._id
      });
    }

    res.json({
      message: `تم تحديث ${overdueTasks.length} مهام متأخرة وإرسال الإشعارات`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
