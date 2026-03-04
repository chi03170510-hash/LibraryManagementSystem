// ============================================
// PUBLIC AUTHORS & PUBLISHERS API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { Author, Publisher } from "../types/api.types";

const publicMetadataApi = {
  /**
   * GET /public/author
   * Tìm kiếm tác giả (query param: name)
   */
  searchAuthors: async (name?: string): Promise<Author[]> => {
    const response = await axiosClient.get<Author[]>("/public/author", {
      params: { name },
    });
    return response.data;
  },

  /**
   * GET /public/publisher
   * Tìm kiếm nhà xuất bản (query param: name)
   */
  searchPublishers: async (name?: string): Promise<Publisher[]> => {
    const response = await axiosClient.get<Publisher[]>("/public/publisher", {
      params: { name },
    });
    return response.data;
  },
};

export default publicMetadataApi;
