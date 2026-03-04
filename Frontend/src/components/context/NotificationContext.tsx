import React, { createContext, useContext, useState } from "react";
import { notificationApi } from "../../api";

export interface Notification {
  id: number;
  title: string;
  body: string;
  status: "READ" | "UNREAD";
  sentAt: number[]; // [yyyy, MM, dd, hh, mm, ss, ms]
  senderName: string;
  recipientName: string;
}

interface NotificationContextType {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refreshNotifications: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await notificationApi.getMyNotifications();
      const data = Array.isArray(res) ? res : (Array.isArray((res as any).data) ? (res as any).data : []);
      setNotifications(data as any);
    } catch (err: any) {
      setError(err.message || "Không thể tải thông báo");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "READ" } : n))
      );
    } catch (err) {
      alert("Không thể đánh dấu đã đọc.");
    }
  };

  const markAllAsRead = async () => {
    try {
      // Mark all notifications as read by calling markAsRead for each unread notification
      const unreadNotifications = notifications.filter(n => n.status === "UNREAD");
      await Promise.all(unreadNotifications.map(n => notificationApi.markAsRead(n.id)));
      setNotifications((prev) => prev.map((n) => ({ ...n, status: "READ" as const })));
    } catch (err) {
      alert("Không thể đánh dấu tất cả đã đọc.");
    }
  };

  // ❌ REMOVED: Auto-fetch causes slow load and unnecessary API calls
  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  // ✅ Components should call refreshNotifications() when they need data

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        loading,
        error,
        refreshNotifications: fetchNotifications,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
};