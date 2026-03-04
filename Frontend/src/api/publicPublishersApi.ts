// ============================================
// PUBLIC PUBLISHERS API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { Publisher } from "../types/api.types";

const publicPublishersApi = {
  /**
   * GET /public/publisher
   * Lấy danh sách nhà xuất bản công khai
   */
  getAllPublishers: async (): Promise<Publisher[]> => {
    const response = await axiosClient.get<Publisher[]>("/public/publisher");
    return response.data;
  },
};

export default publicPublishersApi;
