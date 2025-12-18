// src/api/notification.js
import api from "./axiosConfig";

export const getNotifications = () =>
  api.get("/api/notifications");

export const markNotificationRead = (id) =>
  api.put(`/api/notifications/${id}/read`);

export const deleteNotificationApi = (id) =>
  api.delete(`/api/notifications/${id}`);
