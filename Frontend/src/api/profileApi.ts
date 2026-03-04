// ============================================
// USER PROFILE API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { User, UpdateProfileRequest } from "../types/api.types";

const profileApi = {
  /**
   * GET /profile
   * Xem thông tin cá nhân
   */
  getProfile: async (): Promise<User> => {
    const response = await axiosClient.get<User>("/profile");
    return response.data;
  },

  /**
   * PUT /profile
   * Cập nhật thông tin cá nhân
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await axiosClient.put<User>("/profile", data);
    return response.data;
  },
};

export default profileApi;
