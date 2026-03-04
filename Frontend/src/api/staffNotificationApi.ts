// ============================================
// STAFF NOTIFICATION API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { SendNotificationRequest } from "../types/api.types";

const staffNotificationApi = {
  /**
   * POST /staff/notification/send
   * Gửi thông báo
   */
  sendNotification: async (data: SendNotificationRequest): Promise<void> => {
    const { recipientId, userId, title, body } = data as any;
    const payload = {
      recipientId: recipientId ?? userId,
      title,
      body,
    };
    await axiosClient.post("/staff/notification/send", payload);
  },
};

export default staffNotificationApi;
