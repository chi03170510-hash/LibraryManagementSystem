// ============================================
// PUBLIC BOOKS API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { Book, BookSearchQuery } from "../types/api.types";

const publicBooksApi = {
  /**
   * GET /public/books
   * Tìm kiếm sách (có query params)
   */
  searchBooks: async (query?: BookSearchQuery): Promise<Book[]> => {
    const response = await axiosClient.get<Book[]>("/public/books", { params: query });
    return response.data;
  },

  /**
   * GET /public/books/{id}
   * Lấy thông tin chi tiết sách theo ID
   */
  getBookById: async (id: number): Promise<Book> => {
    const response = await axiosClient.get<Book>(`/public/books/${id}`);
    return response.data;
  },
};

export default publicBooksApi;
