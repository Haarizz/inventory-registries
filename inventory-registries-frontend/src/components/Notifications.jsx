import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaCheckDouble,
  FaInfoCircle,
  FaExclamationTriangle,
  FaTrash,
  FaClock,
} from "react-icons/fa";

import {
  getNotifications,
  markNotificationRead,
  deleteNotificationApi,
} from "../api/notificationApi";

// utility for time display
const formatTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleString();
};

const Notifications = () => {
  // ---------------- STATE ----------------
  const [notifications, setNotifications] = useState([]);

  // ---------------- LOAD ----------------
  useEffect(() => {
    getNotifications().then((res) => setNotifications(res.data));
  }, []);

  // ---------------- HANDLERS ----------------
  const markAsRead = (id) => {
    markNotificationRead(id).then(() =>
      setNotifications((n) =>
        n.map((x) => (x.id === id ? { ...x, read: true } : x))
      )
    );
  };

  const deleteNotification = (id) => {
    deleteNotificationApi(id).then(() =>
      setNotifications((n) => n.filter((x) => x.id !== id))
    );
  };

  const markAllRead = () => {
    // UI only (optional backend enhancement later)
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // ---------------- STYLES ----------------
  const styles = `
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .page-wrapper { padding: 0 10px; animation: fadeIn 0.6s ease-out; color: var(--text-primary); }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-title h1 { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .page-title p { color: var(--text-secondary); font-size: 0.9rem; margin-top: 4px; }
    .stats-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .stat-card { background: var(--bg-sidebar); padding: 20px; border-radius: 12px; border: 1px solid var(--border-color); display: flex; align-items: center; gap: 15px; }
    .stat-icon { width: 45px; height: 45px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
    .icon-blue { background: rgba(37, 99, 235, 0.1); color: #3b82f6; }
    .notification-list { background: var(--bg-sidebar); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; }
    .noti-item { padding: 20px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: flex-start; }
    .noti-item.unread { border-left: 4px solid #2563eb; background: rgba(37, 99, 235, 0.02); }
    .noti-content { display: flex; gap: 15px; }
    .type-alert { color: #ef4444; }
    .type-info { color: #3b82f6; }
    .noti-time { font-size: 0.75rem; color: var(--text-secondary); display: flex; align-items: center; gap: 5px; }
    .btn-action { background: none; border: none; cursor: pointer; padding: 8px; }
    .btn-delete:hover { color: #ef4444; }
  `;

  return (
    <div className="page-wrapper">
      <style>{styles}</style>

      <div className="page-header">
        <div className="page-title">
          <h1>Notifications</h1>
          <p>Stay updated on inventory events and registry alerts.</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline" onClick={markAllRead}>
            <FaCheckDouble /> Mark All as Read
          </button>
        )}
      </div>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <FaBell />
          </div>
          <div>
            <div className="stat-title">Unread Alerts</div>
            <div className="stat-value">{unreadCount}</div>
          </div>
        </div>
      </div>

      <div className="notification-list">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div key={n.id} className={`noti-item ${!n.read ? "unread" : ""}`}>
              <div className="noti-content">
                <div
                  className={
                    n.type === "ALERT" ? "type-alert" : "type-info"
                  }
                >
                  {n.type === "ALERT" ? (
                    <FaExclamationTriangle />
                  ) : (
                    <FaInfoCircle />
                  )}
                </div>
                <div>
                  <h4>{n.title}</h4>
                  <p>{n.message}</p>
                  <span className="noti-time">
                    <FaClock size={10} />
                    {formatTime(n.createdAt)}
                  </span>
                </div>
              </div>

              <div>
                {!n.read && (
                  <button onClick={() => markAsRead(n.id)}>
                    <FaCheckDouble />
                  </button>
                )}
                <button onClick={() => deleteNotification(n.id)}>
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <FaBell size={32} />
            <p>No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
