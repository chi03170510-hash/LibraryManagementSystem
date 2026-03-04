// ============================================
// USER TRANSACTION HISTORY API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { Transaction } from "../types/api.types";

const transactionApi = {
  /**
   * GET /transaction/history
   * Xem lịch sử mượn sách
   */
  getHistory: async (): Promise<Transaction[]> => {
    const response = await axiosClient.get<Transaction[]>("/transaction/history");
    return response.data;
  },
};

export default transactionApi;
