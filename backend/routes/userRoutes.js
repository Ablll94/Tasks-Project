const express = require('express');
const router = express.Router();
const {
  getUnreadNotifications,
  markNotificationAsRead,
  getUserTasks,
  completeTask
} = require('../controllers/userController');

router.get('/notifications/:userId', getUnreadNotifications);
router.put('/notifications/:id/read', markNotificationAsRead);
router.get('/tasks/:userId', getUserTasks);
router.put('/tasks/:id/complete', completeTask);

module.exports = router;
