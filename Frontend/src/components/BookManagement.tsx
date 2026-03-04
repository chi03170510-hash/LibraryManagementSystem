import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  InputAdornment,
  TableContainer,
  Paper,
  MenuItem,
} from "@mui/material";
import { Add, Edit, Delete, Search, MenuBook, Category, Person, PictureAsPdf } from "@mui/icons-material";
import { useBooks } from "./context/BookContext";
import { publicAuthorsApi, publicPublishersApi, staffCategoriesApi } from "../api";
import type { Author, Publisher, Category as CategoryType } from "../types/api.types";
import TablePagination from "@mui/material/TablePagination";
import usePagination from "../utils/usePagination";
import ConfirmDialog from "./common/ConfirmDialog";
import React from "react";

const BookManagement = () => {
  const { books, loading, addBook, updateBook, deleteBook, refreshBooks } = useBooks();
  const PLACEHOLDER_IMG = React.useMemo(() =>
    'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect width="100%" height="100%" fill="#EDF2F7"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#A0AEC0" font-family="Arial" font-size="10">No Image</text></svg>`
    ), []);

  // Fetch books from GET /public/books on first render
  useEffect(() => {
    refreshBooks();
  }, [refreshBooks]);

  

  const [openDialog, setOpenDialog] = useState(false);
  const [editingBookId, setEditingBookId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{open: boolean; id: number | null; title?: string}>({ open: false, id: null });
  const [pdfViewer, setPdfViewer] = useState<{ open: boolean; url: string | null; title?: string }>({ open: false, url: null });

  const [formData, setFormData] = useState({
    title: "",
    author_id: 0,
    category_id: 0,
    publish_id: 0,
    publishYear: 0,
    quantity: 0,
    status: "",
    coverPhotoUrl: "", // 🆕 Thêm URL ảnh bìa
    pdfUrl: "", // 🆕 Thêm URL file PDF
  });

  // Dữ liệu chọn cho Author/Category/Publisher
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [publishers, setPublishers] = useState<Publisher[]>([]);

  // Tải danh sách cho select khi mở trang
  useEffect(() => {
    (async () => {
      try {
        const [a, c, p] = await Promise.all([
          publicAuthorsApi.getAllAuthors().catch(() => []),
          staffCategoriesApi.getAllCategories().catch(() => []),
          publicPublishersApi.getAllPublishers().catch(() => []),
        ]);
        setAuthors(a as any);
        setCategories(c as any);
        setPublishers(p as any);
      } catch {}
    })();
  }, []);

  // Khi danh sách đã có và đang ở chế độ edit, map tên -> id nếu chưa có
  useEffect(() => {
    if (!editingBookId) return;
    const target = books.find(b => b.id === editingBookId);
    if (!target) return;
    setFormData(prev => ({
      ...prev,
      author_id: prev.author_id || authors.find(a => a.name === target.author)?.id || 0,
      category_id: prev.category_id || categories.find(c => c.name === target.category)?.id || 0,
    }));
  }, [authors, categories, editingBookId, books]);

  // mở form thêm/sửa
  const handleOpenDialog = (bookToEdit?: any) => {
    if (bookToEdit) {
      setEditingBookId(bookToEdit.id);
      setFormData({
        title: bookToEdit.title,
        // map theo tên sang id nếu có dữ liệu; nếu không, để 0 và người dùng chọn lại
        author_id: authors.find(a => a.name === bookToEdit.author)?.id || 0,
        category_id: categories.find(cat => cat.name === bookToEdit.category)?.id || 0,
        publish_id: 0,
        publishYear: bookToEdit.publishYear,
        quantity: bookToEdit.quantity,
        status: bookToEdit.status,
        coverPhotoUrl: bookToEdit.coverPhotoUrl || "", // 🆕
        pdfUrl: bookToEdit.pdfUrl || "", // 🆕
      });
    } else {
      setEditingBookId(null);
      setFormData({
        title: "",
        author_id: 0,
        category_id: 0,
        publish_id: 0,
        publishYear: 0,
        quantity: 0,
        status: "",
        coverPhotoUrl: "", // 🆕
        pdfUrl: "", // 🆕
      });
    }
    setOpenDialog(true);
  };

  // đóng form
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingBookId(null);
  };

  // thêm/sửa sách
  const handleSaveBook = async () => {
    try {
      // Validate các trường bắt buộc
      if (!formData.title.trim()) return alert("Vui lòng nhập tiêu đề sách");
      if (!formData.author_id || !formData.category_id || !formData.publish_id) {
        return alert("Vui lòng chọn Tác giả, Thể loại và Nhà xuất bản");
      }
      if (editingBookId) {
        const oldBook = books.find((b) => b.id === editingBookId);
        if (!oldBook) return;

        // 🛠️ Cập nhật sách
        await updateBook(editingBookId, {
          title: formData.title,
          author_id: formData.author_id,
          category_id: formData.category_id,
          publish_id: formData.publish_id,
          publishYear: formData.publishYear,
          quantity: formData.quantity,
          status: formData.status,
          coverPhotoUrl: formData.coverPhotoUrl, // 🆕
          pdfUrl: formData.pdfUrl, // 🆕
        });

        await refreshBooks();
        console.log("✅ Đã cập nhật sách thành công");
      } else {
        // 🆕 Thêm sách mới
        await addBook({
          title: formData.title,
          author_id: formData.author_id,
          category_id: formData.category_id,
          publish_id: formData.publish_id,
          publishYear: formData.publishYear,
          quantity: formData.quantity,
          status: "AVAILABLE",
          coverPhotoUrl: formData.coverPhotoUrl, // 🆕
          pdfUrl: formData.pdfUrl, // 🆕
        });

        await refreshBooks();
        console.log("✅ Đã thêm sách mới thành công");
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Lỗi khi lưu sách:", error);
      alert("Lưu sách thất bại, xem console để biết chi tiết.");
    }
  };

  // xóa sách
  const handleDeleteBook = async (id: number) => {
    setConfirmDelete({ open: true, id, title: "Xóa sách" });
  };

  const confirmDeleteAction = async () => {
    if (!confirmDelete.id) return;
    await deleteBook(confirmDelete.id);
    await refreshBooks();
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { page, rowsPerPage, total, data: pagedBooks, handleChangePage } = usePagination(filteredBooks, 10);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><Typography>Đang tải dữ liệu...</Typography></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#1A202C',
            fontFamily: 'Roboto, sans-serif',
          }}
        >
          Quản lý sách
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #6C76F6 0%, #5B6EF5 100%)',
            color: '#fff',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1.5,
            borderRadius: 2,
            fontFamily: 'Roboto, sans-serif',
            '&:hover': {
              background: 'linear-gradient(135deg, #5B6EF5 0%, #4A5DE4 100%)',
              boxShadow: '0 8px 16px rgba(108, 118, 246, 0.3)',
            }
          }}
        >
          Thêm sách mới
        </Button>
      </Box>

      {/* Search Bar */}
      <TextField
        fullWidth
        placeholder="Tìm kiếm theo tên sách, tác giả, thể loại..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: '#718096' }} />
            </InputAdornment>
          ),
          sx: {
            borderRadius: 2,
            fontFamily: 'Roboto, sans-serif',
            '& fieldset': {
              borderColor: 'rgba(108, 118, 246, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(108, 118, 246, 0.4)',
            },
          }
        }}
      />

      {/* Table */}
      <TableContainer 
        component={Paper} 
        sx={{ 
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(91, 110, 245, 0.12)',
          border: '1px solid rgba(91, 110, 245, 0.08)',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F7F9FC' }}>
              <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MenuBook sx={{ fontSize: 20, color: '#6C76F6' }} />
                  Tiêu đề
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person sx={{ fontSize: 20, color: '#6C76F6' }} />
                  Tác giả
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Category sx={{ fontSize: 20, color: '#6C76F6' }} />
                  Thể loại
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>Số lượng</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif', width: 92, minWidth: 92 }}>Ảnh bìa</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif', whiteSpace: 'nowrap', width: 180, minWidth: 160 }}>PDF</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedBooks.map((book) => (
              <TableRow
                key={book.id}
                sx={{ '&:hover': { backgroundColor: 'rgba(108, 118, 246, 0.04)' } }}
              >
                <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>{book.title}</TableCell>
                <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>{book.author}</TableCell>
                <TableCell>
                  <Chip
                    label={book.category}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(108, 118, 246, 0.1)',
                      color: '#6C76F6',
                      fontWeight: 600,
                      fontFamily: 'Roboto, sans-serif',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ fontFamily: 'Roboto, sans-serif' }}>
                  <Chip
                    label={book.quantity}
                    size="small"
                    sx={{
                      backgroundColor: book.quantity > 0 ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                      color: book.quantity > 0 ? '#4CAF50' : '#F44336',
                      fontWeight: 700,
                      fontFamily: 'Roboto, sans-serif',
                    }}
                  />
                </TableCell>
                <TableCell sx={{ width: 92 }}>
                  {book.coverPhotoUrl ? (
                    <img
                      src={book.coverPhotoUrl}
                      alt="cover"
                      width={56}
                      height={56}
                      style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', objectFit: 'cover' }}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMG; }}
                    />
                  ) : (
                    <Typography sx={{ color: '#CBD5E0', fontFamily: 'Roboto, sans-serif' }}>—</Typography>
                  )}
                </TableCell>
                <TableCell sx={{ whiteSpace: 'nowrap', width: 180, minWidth: 160 }}>
                  {book.pdfUrl ? (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<PictureAsPdf />}
                      onClick={() => setPdfViewer({ open: true, url: book.pdfUrl!, title: book.title })}
                      sx={{
                        minWidth: 120,
                        px: 1.5,
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.875rem',
                        fontFamily: 'Roboto, sans-serif',
                        color: '#ffffff !important',
                        background: 'linear-gradient(135deg, #6C76F6 0%, #5B6EF5 100%)',
                        boxShadow: '0 4px 10px rgba(91,110,245,0.2)',
                        zIndex: 1,
                        position: 'relative',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5B6EF5 0%, #4A5DE4 100%)',
                          boxShadow: '0 6px 14px rgba(91,110,245,0.3)'
                        }
                      }}
                    >
                      Xem PDF
                    </Button>
                  ) : (
                    <Typography sx={{ color: '#CBD5E0', fontFamily: 'Roboto, sans-serif' }}>—</Typography>
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={() => handleOpenDialog(book)}
                    sx={{
                      backgroundColor: '#6C76F6',
                      color: '#fff',
                      '&:hover': { backgroundColor: '#5B6EF5' }
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteBook(book.id)}
                    sx={{
                      backgroundColor: '#F44336',
                      color: '#fff',
                      ml: 1,
                      '&:hover': { backgroundColor: '#E53935' }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ConfirmDialog
        open={confirmDelete.open}
        title={confirmDelete.title || 'Xác nhận xóa'}
        message={
          confirmDelete.id ? (
            <Box>
              <Typography sx={{ fontFamily: 'Roboto, sans-serif' }}>Bạn có chắc muốn xóa sách này?</Typography>
            </Box>
          ) : undefined
        }
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={confirmDeleteAction}
        onClose={() => setConfirmDelete({ open: false, id: null })}
        confirmColor="error"
      />

      {/* PDF Preview Dialog */}
      <Dialog
        open={pdfViewer.open}
        onClose={() => setPdfViewer({ open: false, url: null })}
        maxWidth="lg"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontFamily: 'Roboto, sans-serif' }}>
          {pdfViewer.title || 'Xem PDF'}
        </DialogTitle>
        <DialogContent dividers sx={{ p: 0 }}>
          {pdfViewer.url ? (
            <Box sx={{ width: '100%', height: '80vh' }}>
              <iframe
                src={pdfViewer.url}
                title={pdfViewer.title || 'PDF'}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="autoplay"
              />
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Typography>Không có PDF để hiển thị.</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPdfViewer({ open: false, url: null })} variant="contained" sx={{ textTransform: 'none' }}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[10]}
        />
      </Box>

      {/* Dialog thêm/sửa */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            fontFamily: 'Roboto, sans-serif',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          color: '#1A202C',
          fontFamily: 'Roboto, sans-serif',
          borderBottom: '1px solid rgba(108, 118, 246, 0.1)',
          position: 'sticky',
          top: 0,
          bgcolor: '#fff',
          zIndex: 1,
        }}>
          {editingBookId ? "Chỉnh sửa sách" : "Thêm sách mới"}
        </DialogTitle>
  <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: '5px' }}>
          <TextField
            label="Tiêu đề"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            fullWidth
            sx={{
              mt: '10px',
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Roboto, sans-serif',
                '& fieldset': {
                  borderColor: 'rgba(108, 118, 246, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(108, 118, 246, 0.4)',
                },
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Roboto, sans-serif',
              }
            }}
          />
          <TextField
            select
            label="Tác giả"
            value={formData.author_id}
            onChange={(e) => setFormData({ ...formData, author_id: Number(e.target.value) })}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Roboto, sans-serif',
                '& fieldset': {
                  borderColor: 'rgba(108, 118, 246, 0.2)',
                },
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Roboto, sans-serif',
              }
            }}
          >
            {authors.map((a) => (
              <MenuItem key={a.id} value={a.id} sx={{ fontFamily: 'Roboto, sans-serif' }}>
                {a.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Thể loại"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Roboto, sans-serif',
                '& fieldset': {
                  borderColor: 'rgba(108, 118, 246, 0.2)',
                },
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Roboto, sans-serif',
              }
            }}
          >
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id} sx={{ fontFamily: 'Roboto, sans-serif' }}>
                {c.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Nhà xuất bản"
            value={formData.publish_id}
            onChange={(e) => setFormData({ ...formData, publish_id: Number(e.target.value) })}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Roboto, sans-serif',
                '& fieldset': {
                  borderColor: 'rgba(108, 118, 246, 0.2)',
                },
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Roboto, sans-serif',
              }
            }}
          >
            {publishers.map((p) => (
              <MenuItem key={p.id} value={p.id} sx={{ fontFamily: 'Roboto, sans-serif' }}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Năm xuất bản"
            type="number"
            value={formData.publishYear}
            onChange={(e) => setFormData({ ...formData, publishYear: Number(e.target.value) })}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Roboto, sans-serif',
                '& fieldset': {
                  borderColor: 'rgba(108, 118, 246, 0.2)',
                },
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Roboto, sans-serif',
              }
            }}
          />
          <TextField
            label="Số lượng"
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Roboto, sans-serif',
                '& fieldset': {
                  borderColor: 'rgba(108, 118, 246, 0.2)',
                },
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Roboto, sans-serif',
              }
            }}
          />
          <TextField
            label="Trạng thái"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Roboto, sans-serif',
                '& fieldset': {
                  borderColor: 'rgba(108, 118, 246, 0.2)',
                },
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Roboto, sans-serif',
              }
            }}
          />
          <TextField
            label="Ảnh bìa (URL)"
            value={formData.coverPhotoUrl}
            onChange={(e) => setFormData({ ...formData, coverPhotoUrl: e.target.value })}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Roboto, sans-serif',
                '& fieldset': {
                  borderColor: 'rgba(108, 118, 246, 0.2)',
                },
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Roboto, sans-serif',
              }
            }}
          />
          <TextField
            label="PDF (URL)"
            value={formData.pdfUrl}
            onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                fontFamily: 'Roboto, sans-serif',
                '& fieldset': {
                  borderColor: 'rgba(108, 118, 246, 0.2)',
                },
              },
              '& .MuiInputLabel-root': {
                fontFamily: 'Roboto, sans-serif',
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(108, 118, 246, 0.1)' }}>
          <Button 
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: 'Roboto, sans-serif',
              color: '#fff',
              background: 'linear-gradient(135deg, #A0AEC0 0%, #718096 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #718096 0%, #4A5568 100%)',
              }
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSaveBook} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #6C76F6 0%, #5B6EF5 100%)',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: 'Roboto, sans-serif',
              '&:hover': {
                background: 'linear-gradient(135deg, #5B6EF5 0%, #4A5DE4 100%)',
              }
            }}
          >
            {editingBookId ? "Lưu thay đổi" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookManagement;
