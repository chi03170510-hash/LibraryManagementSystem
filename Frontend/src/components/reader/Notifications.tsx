import React, { useEffect } from "react";
import { FaBell, FaCheckCircle, FaEnvelopeOpen, FaEnvelope } from "react-icons/fa";
import { useNotifications } from "../context/NotificationContext";
import "./Notifications.css";

function formatDate(arr?: number[] | null) {
  if (!arr) return "";
  const [y, m, d, hh = 0, mm = 0] = arr;
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y} ${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

const Notifications: React.FC = () => {
  const {
    notifications,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  } = useNotifications();

  // Fetch notifications when component mounts
  useEffect(() => {
    refreshNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="notifications-wrapper">
      <div className="notifications-header">
        <div className="notifications-title">
          <FaBell className="notifications-icon" />
          <h2>Thông báo</h2>
        </div>
        <button onClick={markAllAsRead} className="notifications-markall">
          <FaCheckCircle /> Đánh dấu tất cả đã đọc
        </button>
      </div>

      {loading && <div className="loading">Đang tải thông báo...</div>}
      {error && <div className="error">{error}</div>}

      <div className="notifications-list">
        {notifications.length === 0 && !loading && (
          <div className="no-result">Không có thông báo nào.</div>
        )}
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`notifications-item ${n.status === "READ" ? "read" : "unread"}`}
            onClick={() => n.status === "UNREAD" && markAsRead(n.id)}
            title={n.status === "UNREAD" ? "Đánh dấu đã đọc" : ""}
          >
            <div className="notifications-item-icon">
              {n.status === "UNREAD" ? <FaEnvelope /> : <FaEnvelopeOpen />}
            </div>
            <div className="notifications-item-content">
              <p className="notifications-title">{n.title}</p>
              <p className="notifications-body">{n.body}</p>
              <div className="notifications-meta">
                <span>👤 {n.senderName}</span>
                <span>⏰ {formatDate(n.sentAt)}</span>
              </div>
            </div>
            {n.status === "UNREAD" && <span className="notifications-badge">Mới</span>}
          </div>
        ))}
      </div>
      <button className="notifications-refresh" onClick={refreshNotifications}>
        Làm mới
      </button>
    </div>
  );
};

export default Notifications;