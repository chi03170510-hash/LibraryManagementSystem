// ============================================
// PUBLIC AUTHORS API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { Author } from "../types/api.types";

const publicAuthorsApi = {
  /**
   * GET /public/author
   * Lấy danh sách tác giả công khai
   */
  getAllAuthors: async (): Promise<Author[]> => {
    const response = await axiosClient.get<Author[]>("/public/author");
    return response.data;
  },
};

export default publicAuthorsApi;
