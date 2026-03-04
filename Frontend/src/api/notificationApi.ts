// ============================================
// USER NOTIFICATION API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { Notification } from "../types/api.types";

const notificationApi = {
  /**
   * GET /notification
   * Xem danh sách thông báo
   */
  getMyNotifications: async (): Promise<Notification[]> => {
    const response = await axiosClient.get<Notification[]>("/notification");
    return response.data;
  },

  /**
   * PUT /notification/{id}/read
   * Đánh dấu thông báo đã đọc
   */
  markAsRead: async (id: number): Promise<void> => {
    await axiosClient.put(`/notification/${id}/read`);
  },
};

export default notificationApi;
