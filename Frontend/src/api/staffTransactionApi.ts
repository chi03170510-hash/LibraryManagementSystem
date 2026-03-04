// ============================================
// STAFF TRANSACTION MANAGEMENT API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { Transaction, CreateTransactionRequest } from "../types/api.types";

const staffTransactionApi = {
  /**
   * POST /staff/transaction
   * Tạo giao dịch mượn sách
   */
  createTransaction: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await axiosClient.post<Transaction>("/staff/transaction", data);
    return response.data;
  },

  /**
   * GET /staff/transaction/{id}
   * Xem chi tiết giao dịch
   */
  getTransactionById: async (id: number): Promise<Transaction> => {
    const response = await axiosClient.get<Transaction>(`/staff/transaction/${id}`);
    return response.data;
  },

  /**
   * GET /staff/transaction/overdue
   * Xem danh sách sách quá hạn
   */
  getOverdueTransactions: async (): Promise<Transaction[]> => {
    const response = await axiosClient.get<Transaction[]>("/staff/transaction/overdue");
    return response.data;
  },

  /**
   * GET /staff/transaction/borrowed
   * Xem danh sách sách đang mượn
   */
  getBorrowedTransactions: async (): Promise<Transaction[]> => {
    const response = await axiosClient.get<Transaction[]>("/staff/transaction/borrowed");
    return response.data;
  },

  /**
   * PUT /staff/transaction/return/{id}
   * Đánh dấu sách đã trả
   */
  returnTransaction: async (id: number): Promise<Transaction> => {
    const response = await axiosClient.put<Transaction>(`/staff/transaction/return/${id}`);
    return response.data;
  },
};

export default staffTransactionApi;
