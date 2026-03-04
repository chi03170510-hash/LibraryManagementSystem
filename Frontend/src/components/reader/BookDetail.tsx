import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaUser,
  FaTags,
  FaStar,
  FaTrash,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import { commentApi } from "../../api";
import { useBooks } from "../context/BookContext";
import type { Book } from "../context/BookContext";
import "./BookDetail.css";

// Use the centralized Book type from context so Drive links are normalized
type BookDetailType = Book & {
  description?: string;
  rating?: number;
};

interface CommentType {
  id: number;
  userName: string;
  comment: string;
  owner: boolean;
}

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { fetchBookById } = useBooks();
  const [activeTab, setActiveTab] = useState<"read" | "reviews">("read");
  const [book, setBook] = useState<BookDetailType | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState("");

  // Set initial tab from query string (?tab=read|desc|reviews)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    if (tab === 'read' || tab === 'reviews') {
      setActiveTab(tab as any);
    }
  }, []);

  // Fetch book detail (via context to ensure Drive URLs are transformed)
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        const mapped = await fetchBookById(Number(id));
        setBook(mapped as any);
      } catch {
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, fetchBookById]);

  // Fetch comments
  const fetchComments = async () => {
    try {
      const res = await commentApi.getCommentsByBook(Number(id));
      // API returns { items: [...], ...pagination }
      setComments(res.items as any);
    } catch {
      setComments([]);
    }
  };

  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line
  }, [id]);

  // Add comment
  const handleAddComment = async () => {
    if (!commentInput.trim()) return;
    try {
      await commentApi.createComment({ 
        bookId: Number(id), 
        comment: commentInput 
      });
      setCommentInput("");
      fetchComments();
    } catch {
      alert("Không thể gửi bình luận.");
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bình luận này?")) return;
    try {
      await commentApi.deleteComment(commentId);
      fetchComments();
    } catch {
      alert("Không thể xóa bình luận.");
    }
  };

  // Edit comment
  const handleEditComment = (commentId: number, content: string) => {
    setEditingId(commentId);
    setEditingContent(content);
  };

  const handleSaveEdit = async (commentId: number) => {
    try {
      await commentApi.updateComment(commentId, {
        content: editingContent,
      });
      setEditingId(null);
      setEditingContent("");
      fetchComments();
    } catch {
      alert("Không thể cập nhật bình luận.");
    }
  };

  if (loading) return <div className="bookdetail-wrapper">Đang tải...</div>;
  if (!book) return <div className="bookdetail-wrapper">Không tìm thấy sách.</div>;

  return (
    <div className="bookdetail-wrapper">
      {/* --- HEADER --- */}
      <div className="bookdetail-header">
        {book.coverPhotoUrl ? (
          <img
            src={book.coverPhotoUrl}
            alt={book.title}
            className="bookdetail-cover"
          />
        ) : (
          <div className="bookdetail-cover placeholder">No image</div>
        )}
        <div className="bookdetail-info">
          <h2 className="bookdetail-title">
            <FaBook /> {book.title}
          </h2>
          <div className="bookdetail-meta">
            <span><FaUser /> <strong>Tác giả:</strong> {book.author}</span>
            <span><FaTags /> <strong>Thể loại:</strong> {book.category}</span>
            <span>📦 <strong>Còn lại:</strong> {book.quantity}</span>
            <span><FaStar color="gold" /> <strong>Đánh giá TB:</strong> {book.rating ?? "?"}</span>
            <span>📅 <strong>Năm XB:</strong> {book.publishYear}</span>
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="bookdetail-tabs">
        <button
          className={activeTab === "read" ? "active" : ""}
          onClick={() => setActiveTab("read")}
        >
          📖 Đọc online
        </button>
        <button
          className={activeTab === "reviews" ? "active" : ""}
          onClick={() => setActiveTab("reviews")}
        >
          💬 Bình luận
        </button>
      </div>

      {/* --- CONTENT --- */}
      <div className="bookdetail-content">
        {activeTab === "read" && (
          <div className="bookdetail-reader">
            {book.pdfUrl ? (
              <iframe
                src={book.pdfUrl}
                title="Ebook Reader"
                className="bookdetail-iframe"
              />
            ) : (
              <p className="bookdetail-empty">
                ❌ Hiện chưa có phiên bản online cho sách này.
              </p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bookdetail-reviews">
            <h3>Đánh giá & bình luận</h3>

            <div className="bookdetail-review-form">
              <textarea
                placeholder="Nhập bình luận của bạn..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
              />
              <button className="btn-primary" onClick={handleAddComment}>
                Gửi bình luận
              </button>
            </div>

            <div className="bookdetail-review-list">
              {comments.length === 0 && (
                <p className="bookdetail-empty">Chưa có bình luận nào.</p>
              )}

              {comments.map((c) => (
                <div key={c.id} className="review-item">
                  <div className="review-header">
                    <strong>{c.userName}</strong>
                  </div>

                  {editingId === c.id ? (
                    <div className="review-editing">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                      />
                      <div className="review-actions">
                        <button
                          className="btn-success"
                          onClick={() => handleSaveEdit(c.id)}
                        >
                          <FaSave /> Lưu
                        </button>
                        <button
                          className="btn-gray"
                          onClick={() => setEditingId(null)}
                        >
                          <FaTimes /> Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="review-body">
                      <p>{c.comment}</p>
                      {c.owner && (
                        <div className="review-actions">
                          <button
                            className="btn-warning"
                            onClick={() => handleEditComment(c.id, c.comment)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-danger"
                            onClick={() => handleDeleteComment(c.id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetail;
