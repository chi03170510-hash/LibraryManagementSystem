// ============================================
// USER COMMENT API SERVICE
// ============================================
import axiosClient from "./axiosClient";
import type { Comment, CreateCommentRequest, UpdateCommentRequest, PublicCommentList } from "../types/api.types";

const commentApi = {
  /**
   * POST /comment
   * Tạo bình luận mới
   */
  createComment: async (data: CreateCommentRequest): Promise<Comment> => {
    // Backend expects { bookId, comment }
    const response = await axiosClient.post<Comment>("/comment", data);
    return response.data;
  },

  /**
   * GET /comment/{bookId}
   * Xem bình luận của một cuốn sách
   */
  getCommentsByBook: async (bookId: number): Promise<PublicCommentList> => {
    // Public endpoint returns paginated object: { items: [...], currentPage, pageSize, totalItems, totalPages }
    const response = await axiosClient.get<PublicCommentList>(`/public/comment/${bookId}`);
    return response.data;
  },

  /**
   * PUT /comment/{id}
   * Cập nhật bình luận
   */
  updateComment: async (id: number, data: UpdateCommentRequest): Promise<Comment> => {
    const response = await axiosClient.put<Comment>(`/comment/${id}`, data);
    return response.data;
  },

  /**
   * DELETE /comment/{id}
   * Xóa bình luận
   */
  deleteComment: async (id: number): Promise<void> => {
    await axiosClient.delete(`/comment/${id}`);
  },
};

export default commentApi;
