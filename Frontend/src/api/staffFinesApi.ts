// ============================================
// STAFF FINE MANAGEMENT API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { Fine, CreateFineRequest, UpdateFineRequest, FineSearchQuery } from "../types/api.types";

const staffFinesApi = {
  /**
   * GET /staff/fines
   * Xem tất cả khoản phạt
   */
  getAllFines: async (query?: FineSearchQuery): Promise<Fine[]> => {
    const response = await axiosClient.get<Fine[]>("/staff/fines", { params: query });
    return response.data;
  },

  /**
   * GET /staff/transactions/{transactionId}/fines
   * Xem phạt theo giao dịch
   */
  getFinesByTransaction: async (transactionId: number): Promise<Fine[]> => {
    const response = await axiosClient.get<Fine[]>(`/staff/transactions/${transactionId}/fines`);
    return response.data;
  },

  /**
   * POST /staff/fines
   * Tạo khoản phạt mới
   */
  createFine: async (data: CreateFineRequest): Promise<Fine> => {
    const response = await axiosClient.post<Fine>("/staff/fines", data);
    return response.data;
  },

  /**
   * PUT /staff/fines/{id}
   * Cập nhật khoản phạt
   */
  updateFine: async (id: number, data: UpdateFineRequest): Promise<Fine> => {
    const response = await axiosClient.put<Fine>(`/staff/fines/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /staff/fines/{id}
   * Xóa khoản phạt
   */
  deleteFine: async (id: number): Promise<void> => {
    await axiosClient.delete(`/staff/fines/${id}`);
  },

  /**
   * PUT /staff/fines/{id}/mark-paid
   * Đánh dấu đã thanh toán phạt
   */
  markAsPaid: async (id: number): Promise<Fine> => {
    const response = await axiosClient.put<Fine>(`/staff/fines/${id}/mark-paid`);
    return response.data;
  },

  /**
   * GET /staff/fines/export
   * Xuất danh sách phạt ra Excel
   */
  exportFines: async (): Promise<Blob> => {
    const response = await axiosClient.get("/staff/fines/export", {
      responseType: "blob",
    });
    return response.data;
  },
};

export default staffFinesApi;
