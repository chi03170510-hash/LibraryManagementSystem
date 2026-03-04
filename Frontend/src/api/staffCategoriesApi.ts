// ============================================
// STAFF CATEGORIES MANAGEMENT API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from "../types/api.types";

const staffCategoriesApi = {
  /**
   * GET /staff/categories
   * Xem tất cả thể loại
   */
  getAllCategories: async (): Promise<Category[]> => {
    const response = await axiosClient.get<Category[]>("/staff/categories");
    return response.data;
  },

  /**
   * POST /staff/categories
   * Tạo thể loại mới
   */
  createCategory: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await axiosClient.post<Category>("/staff/categories", data);
    return response.data;
  },

  /**
   * PUT /staff/categories/{id}
   * Cập nhật thể loại
   */
  updateCategory: async (id: number, data: UpdateCategoryRequest): Promise<Category> => {
    const response = await axiosClient.put<Category>(`/staff/categories/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /staff/categories/{id}
   * Xóa thể loại
   */
  deleteCategory: async (id: number): Promise<void> => {
    await axiosClient.delete(`/staff/categories/${id}`);
  },
};

export default staffCategoriesApi;
