// ============================================
// STAFF BOOKS MANAGEMENT API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { Book, CreateBookRequest, UpdateBookRequest } from "../types/api.types";

const staffBooksApi = {
  /**
   * POST /staff/books
   * Tạo sách mới
   */
  createBook: async (data: CreateBookRequest): Promise<Book> => {
    const response = await axiosClient.post<Book>("/staff/books", data);
    return response.data;
  },

  /**
   * GET /staff/books/{id}
   * Xem chi tiết sách
   */
  getBookById: async (id: number): Promise<Book> => {
    const response = await axiosClient.get<Book>(`/staff/books/${id}`);
    return response.data;
  },

  /**
   * PUT /staff/books/{id}
   * Cập nhật thông tin sách
   */
  updateBook: async (id: number, data: UpdateBookRequest): Promise<Book> => {
    const response = await axiosClient.put<Book>(`/staff/books/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /staff/books/{id}
   * Xóa sách
   */
  deleteBook: async (id: number): Promise<void> => {
    await axiosClient.delete(`/staff/books/${id}`);
  },
};

export default staffBooksApi;
