// ============================================
// STAFF USER MANAGEMENT API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { User } from "../types/api.types";

const staffUsersApi = {
  /**
   * GET /staff/users
   * Xem tất cả độc giả
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await axiosClient.get<User[]>("/staff/users");
    return response.data;
  },

  /**
   * PUT /staff/users/{id}/lock
   * Khóa tài khoản người dùng
   */
  lockUser: async (id: number): Promise<User> => {
    const response = await axiosClient.put<User>(`/staff/users/${id}/lock`);
    return response.data;
  },

  /**
   * PUT /staff/users/{id}/unlock
   * Mở khóa tài khoản người dùng
   */
  unlockUser: async (id: number): Promise<User> => {
    const response = await axiosClient.put<User>(`/staff/users/${id}/unlock`);
    return response.data;
  },
};

export default staffUsersApi;
