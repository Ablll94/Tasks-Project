const express = require('express');
const router = express.Router();
const {
  createTask,
  sendInfoNotification,
  checkOverdueTasks
} = require('../controllers/adminController');

router.post('/tasks', createTask);
router.post('/notifications/info', sendInfoNotification);
router.post('/check-overdue', checkOverdueTasks);

module.exports = router;
