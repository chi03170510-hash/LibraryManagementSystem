import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress,
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Chip,
  TableContainer,
  Paper,
} from "@mui/material";
import { staffUsersApi } from "../../api";
import TablePagination from "@mui/material/TablePagination";
import usePagination from "../../utils/usePagination";
import { Add } from "@mui/icons-material";
import { useBooks } from "../context/BookContext";
import { useTransaction } from "../context/TransactionContext";
import ConfirmDialog from "../common/ConfirmDialog";
import SnackbarAlert from "../common/SnackbarAlert";

const StaffTransaction: React.FC<{ id?: number }> = () => {
  const { books } = useBooks();
  const {
    transaction,
    createTransaction,
    returnTransaction,
    fetchTransactionHistory,
    loading,
    error,
    calcFineDays,
  } = useTransaction();

  const [open, setOpen] = useState(false);
  const [readerId, setReaderId] = useState<number>(0);
  const [note, setNote] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedBooks, setSelectedBooks] = useState<
    { bookId: number; conditionNote: string }[]
  >([]);
  const [readers, setReaders] = useState<any[]>([]);
  const [confirmReturn, setConfirmReturn] = useState<{open: boolean; id: number | null}>({ open: false, id: null });
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success'|'error'|'info'|'warning'}>({ open: false, message: '', severity: 'info' });


  // ✅ Gọi API khi component mount
  useEffect(() => {
    fetchTransactionHistory();
  }, []);

  // Fetch all users and filter READER for selection
  useEffect(() => {
    (async () => {
      try {
        const users = await staffUsersApi.getAllUsers();
        const onlyReaders = (users as any[]).filter(u => (u.role === 'READER'));
        setReaders(onlyReaders);
      } catch (e) {
        console.error('Không thể tải danh sách độc giả:', e);
      }
    })();
  }, []);

  // ✅ Định dạng ngày từ mảng [yyyy, mm, dd, hh, mm]
  const formatDate = (arr?: number[] | null) => {
    if (!arr || arr.length < 3) return "-";
    const [y, m, d, hh = 0, mm = 0] = arr;
    return `${d.toString().padStart(2, "0")}/${m
      .toString()
      .padStart(2, "0")}/${y} ${hh.toString().padStart(2, "0")}:${mm
      .toString()
      .padStart(2, "0")}`;
  };

  // ==========================
  // 🔹 Thêm/xử lý form tạo giao dịch
  // ==========================
  const handleAddBook = () => {
    setSelectedBooks((prev) => [...prev, { bookId: 0, conditionNote: "" }]);
  };

  const handleChangeBook = (index: number, field: string, value: any) => {
    const updated = [...selectedBooks];
    (updated[index] as any)[field] = value;
    setSelectedBooks(updated);
  };

  const handleSubmitTransaction = async () => {
    if (!readerId || !dueDate || selectedBooks.length === 0) {
      setSnackbar({ open: true, message: '⚠️ Vui lòng nhập đầy đủ thông tin!', severity: 'warning' });
      return;
    }

    const formattedDueDate = new Date(dueDate).toISOString().slice(0, 19);
    const data = {
      readerId,
      transactionDetails: selectedBooks,
      note,
      dueDate: formattedDueDate,
    };

    try {
      await createTransaction(data);
      setSnackbar({ open: true, message: '✅ Tạo giao dịch mượn thành công!', severity: 'success' });
      setOpen(false);
      setReaderId(0);
      setNote("");
      setDueDate("");
      setSelectedBooks([]);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: '❌ Lỗi khi tạo giao dịch!', severity: 'error' });
    }
  };

  // ==========================
  // 🔹 Loading / Error
  // ==========================
  if (loading && !transaction)
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 6 }}>
        <CircularProgress sx={{ color: '#6C76F6' }} />
        <Typography sx={{ mt: 2, fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );

  if (error) return <Typography sx={{ color: '#F44336', p: 3, fontFamily: 'Roboto, sans-serif' }}>Lỗi: {error}</Typography>;

  // ==========================
  // 🔹 Hiển thị lịch sử giao dịch
  // ==========================
  const list = Array.isArray(transaction) ? transaction : [];
  const { page, rowsPerPage, total, data: pagedTransactions, handleChangePage } = usePagination(list, 10);

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
          Quản lý giao dịch
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
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
          Tạo giao dịch mượn
        </Button>
      </Box>


      {list.length > 0 ? (
        pagedTransactions.map((t) => (
          <Card
            key={t.id}
            sx={{
              mb: 3,
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(91, 110, 245, 0.12)",
              border: '1px solid rgba(91, 110, 245, 0.08)',
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    fontFamily: 'Roboto, sans-serif',
                    color: '#1A202C',
                  }}
                >
                  Giao dịch #{t.id}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  {t.status === "BORROWED" && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => setConfirmReturn({ open: true, id: t.id })}
                      sx={{
                        background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                        color: '#fff',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontFamily: 'Roboto, sans-serif',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #45A049 0%, #3D8B40 100%)',
                        }
                      }}
                    >
                      Trả sách
                    </Button>
                  )}
                  
                  <Chip
                    label={
                      t.status === "BORROWED"
                        ? "Đang mượn"
                        : t.status === "RETURNED"
                        ? "Đã trả"
                        : t.status
                    }
                    sx={{
                      backgroundColor: t.status === "BORROWED" 
                        ? 'rgba(255, 152, 0, 0.1)' 
                        : 'rgba(76, 175, 80, 0.1)',
                      color: t.status === "BORROWED" ? '#FF9800' : '#4CAF50',
                      fontWeight: 700,
                      fontFamily: 'Roboto, sans-serif',
                    }}
                  />
                </Box>
              </Box>

              <Divider sx={{ my: 2, borderColor: 'rgba(108, 118, 246, 0.1)' }} />

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 2 }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                  <strong style={{ color: '#1A202C' }}>Độc giả:</strong> {t.readerName}
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                  <strong style={{ color: '#1A202C' }}>Nhân viên:</strong> {t.staffName}
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                  <strong style={{ color: '#1A202C' }}>Ngày mượn:</strong> {formatDate(t.borrowDate)}
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                  <strong style={{ color: '#1A202C' }}>Hạn trả:</strong> {formatDate(t.dueDate)}
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                  <strong style={{ color: '#1A202C' }}>Ngày trả:</strong> {formatDate(t.returnDate)}
                </Typography>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                  <strong style={{ color: '#1A202C' }}>Ghi chú:</strong> {t.note || "-"}
                </Typography>
              </Box>

              {calcFineDays(t) > 0 && (
                <Box sx={{ 
                  backgroundColor: 'rgba(244, 67, 54, 0.1)', 
                  borderRadius: 2, 
                  p: 2, 
                  mb: 2,
                  border: '1px solid rgba(244, 67, 54, 0.2)',
                }}>
                  <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#F44336', fontWeight: 600 }}>
                    ⚠️ Tiền phạt: {calcFineDays(t) * 5000} VND ({calcFineDays(t)} ngày trễ)
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2, borderColor: 'rgba(108, 118, 246, 0.1)' }} />

              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 600, 
                  mb: 2,
                  fontFamily: 'Roboto, sans-serif',
                  color: '#1A202C',
                }}
              >
                Danh sách sách:
              </Typography>
              <TableContainer 
                component={Paper} 
                sx={{ 
                  boxShadow: 'none',
                  border: '1px solid rgba(108, 118, 246, 0.1)',
                  borderRadius: 2,
                }}
              >
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#F7F9FC' }}>
                      <TableCell sx={{ fontWeight: 700, fontFamily: 'Roboto, sans-serif', color: '#1A202C' }}>
                        Tên sách
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, fontFamily: 'Roboto, sans-serif', color: '#1A202C' }}>
                        Ghi chú tình trạng
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, fontFamily: 'Roboto, sans-serif', color: '#1A202C' }}>
                        Trạng thái
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {t.details?.map((d: any, i: number) => (
                      <TableRow 
                        key={i}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(108, 118, 246, 0.04)',
                          },
                        }}
                      >
                        <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                          {d.bookTitle}
                        </TableCell>
                        <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                          {d.conditionNote}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              d.status === "BORROWED" ? "Đang mượn" : "Đã trả"
                            }
                            size="small"
                            sx={{
                              backgroundColor: d.status === "BORROWED" 
                                ? 'rgba(255, 152, 0, 0.1)' 
                                : 'rgba(76, 175, 80, 0.1)',
                              color: d.status === "BORROWED" ? '#FF9800' : '#4CAF50',
                              fontWeight: 700,
                              fontFamily: 'Roboto, sans-serif',
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        ))
      ) : (
        <Box sx={{ 
          textAlign: 'center', 
          p: 6, 
          backgroundColor: '#F7F9FC', 
          borderRadius: 3,
          border: '1px solid rgba(108, 118, 246, 0.1)',
        }}>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
            Không có giao dịch nào.
          </Typography>
        </Box>
      )}

      {list.length > 0 && (
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
      )}

      <ConfirmDialog
        open={confirmReturn.open}
        title="Xác nhận trả sách"
        message={`Bạn có chắc muốn trả sách cho giao dịch #${confirmReturn.id}?`}
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={async () => {
          if (!confirmReturn.id) return;
          try {
            await returnTransaction(confirmReturn.id);
            setSnackbar({ open: true, message: '✅ Trả sách thành công!', severity: 'success' });
            fetchTransactionHistory();
          } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: '❌ Lỗi khi trả sách!', severity: 'error' });
          }
        }}
        onClose={() => setConfirmReturn({ open: false, id: null })}
      />

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />

      

      {/* Dialog tạo giao dịch */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        fullWidth 
        maxWidth="sm"
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
        }}>
          Tạo giao dịch mượn
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            select
            fullWidth
            label="Độc giả"
            value={readerId}
            onChange={(e) => setReaderId(Number(e.target.value))}
            margin="dense"
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
            {readers.map((u) => (
              <MenuItem key={u.id} value={u.id} sx={{ fontFamily: 'Roboto, sans-serif' }}>
                {u.fullName || u.name || u.username || `User #${u.id}`}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Ghi chú"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            margin="dense"
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
            fullWidth
            type="datetime-local"
            label="Hạn trả sách"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            margin="dense"
            InputLabelProps={{ shrink: true }}
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

          <Typography 
            variant="subtitle1" 
            sx={{ 
              mt: 3, 
              mb: 1, 
              fontWeight: 600, 
              fontFamily: 'Roboto, sans-serif',
              color: '#1A202C',
            }}
          >
            Danh sách sách mượn:
          </Typography>
          {selectedBooks.map((book, i) => (
            <Box key={i} sx={{ display: "flex", gap: 1, mb: 1.5 }}>
              <TextField
                select
                label="Chọn sách"
                value={book.bookId}
                onChange={(e) =>
                  handleChangeBook(i, "bookId", Number(e.target.value))
                }
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
                {books.map((b) => (
                  <MenuItem 
                    key={b.id} 
                    value={b.id}
                    sx={{ fontFamily: 'Roboto, sans-serif' }}
                  >
                    {b.title}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Ghi chú tình trạng"
                value={book.conditionNote}
                onChange={(e) =>
                  handleChangeBook(i, "conditionNote", e.target.value)
                }
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
            </Box>
          ))}

          <Button 
            onClick={handleAddBook}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #6C76F6 0%, #5B6EF5 100%)',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: 'Roboto, sans-serif',
              borderRadius: 2,
              px: 2,
              '&:hover': {
                background: 'linear-gradient(135deg, #5B6EF5 0%, #4A5DE4 100%)',
              }
            }}
          >
            + Thêm sách
          </Button>
        </DialogContent>

        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(108, 118, 246, 0.1)' }}>
          <Button 
            onClick={() => setOpen(false)}
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
            onClick={handleSubmitTransaction}
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #6C76F6 0%, #5B6EF5 100%)',
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: 'Roboto, sans-serif',
              '&:hover': {
                background: 'linear-gradient(135deg, #5B6EF5 0%, #4A5DE4 100%)',
              },
              '&:disabled': {
                background: '#CBD5E0',
                color: '#fff',
              }
            }}
          >
            {loading ? "Đang tạo..." : "Xác nhận"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffTransaction;
