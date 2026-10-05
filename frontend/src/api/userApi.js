import api from './client';

export const getUnreadNotifications = (userId) =>
  api.get(`/user/notifications/${userId}`);

export const markNotificationAsRead = (id) =>
  api.put(`/user/notifications/${id}/read`);

export const getUserTasks = (userId) =>
  api.get(`/user/tasks/${userId}`);

export const completeTask = (id) =>
  api.put(`/user/tasks/${id}/complete`);
