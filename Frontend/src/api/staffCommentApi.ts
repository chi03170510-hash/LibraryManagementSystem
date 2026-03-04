// ============================================
// STAFF COMMENT MANAGEMENT API SERVICE
// ============================================
import axiosClient from "./axiosClient";

// Response shape returned by backend for staff comments (paginated)
export interface StaffCommentItem {
  id: number;
  userName: string;
  comment: string;
  owner: boolean;
}

export interface StaffCommentPage {
  items: StaffCommentItem[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

const staffCommentApi = {
  /**
   * GET /staff/comment?page={page}&size={size}
   * Lấy bình luận dạng phân trang (dành cho nhân viên)
   */
  getComments: async (page = 0, size = 10): Promise<StaffCommentPage> => {
    const response = await axiosClient.get<StaffCommentPage>("/staff/comment", {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * DELETE /staff/comment/{id}
   * Xóa bình luận (admin)
   */
  deleteComment: async (id: number): Promise<void> => {
    await axiosClient.delete(`/staff/comment/${id}`);
  },
};

export default staffCommentApi;
