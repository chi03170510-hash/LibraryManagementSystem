import React, { createContext, useContext, useEffect, useState } from "react";
import staffCommentApi from "../../api/staffCommentApi";
import type { StaffCommentPage } from "../../api/staffCommentApi";

// UI-facing comment shape for staff moderation view
export interface StaffComment {
  id: number;
  user: string;
  content: string;
  commentStatus: "pending" | "approved" | "flagged";
  owner?: boolean;
}

interface SocialContextType {
  comments: StaffComment[];
  page: number;
  size: number;
  total: number;
  loading: boolean;
  error?: string;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;
  deleteComment: (id: number) => Promise<void>;
}

const SocialContext = createContext<SocialContextType | undefined>(undefined);

export const SocialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [comments, setComments] = useState<StaffComment[]>([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10); // fixed as per UI for now
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const mapItems = (res: StaffCommentPage): StaffComment[] =>
    res.items.map((c) => ({
      id: c.id,
      user: c.userName,
      content: c.comment,
      commentStatus: "approved",
      owner: c.owner,
    }));

  // Loader function
  const load = async (p = page) => {
    setLoading(true);
    setError(undefined);
    try {
      const res: StaffCommentPage = await staffCommentApi.getComments(p, size);
      setComments(mapItems(res));
      setTotal(res.totalItems);
    } catch (err) {
      console.error("Failed to load staff comments:", err);
      setError("Không thể tải danh sách bình luận");
      setComments([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and when page changes
  useEffect(() => {
    load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const deleteComment = async (id: number) => {
    setLoading(true);
    setError(undefined);
    try {
      await staffCommentApi.deleteComment(id);
      // Reload current page. If current page becomes empty and page>0, go to previous page
      const res = await staffCommentApi.getComments(page, size);
      if (res.items.length === 0 && page > 0) {
        setPage(page - 1); // effect will trigger load
      } else {
        setComments(mapItems(res));
        setTotal(res.totalItems);
      }
    } catch (err) {
      console.error("Failed to delete comment:", err);
      setError("Không thể xóa bình luận");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SocialContext.Provider value={{ comments, page, size, total, loading, error, setPage, refresh: () => load(page), deleteComment }}>
      {children}
    </SocialContext.Provider>
  );
};

export const useSocial = () => {
  const ctx = useContext(SocialContext);
  if (!ctx) throw new Error("useSocial must be used inside SocialProvider");
  return ctx;
};
