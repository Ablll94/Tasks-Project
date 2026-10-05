import api from './client';

export const createTask = (taskData) =>
  api.post('/admin/tasks', taskData);

export const sendInfoNotification = (infoData) =>
  api.post('/admin/notifications/info', infoData);

export const checkOverdueTasks = () =>
  api.post('/admin/check-overdue');
