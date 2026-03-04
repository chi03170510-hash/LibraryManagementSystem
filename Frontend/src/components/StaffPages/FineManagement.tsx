import { useState } from "react";
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
  MenuItem,
  Chip,
  TableContainer,
  Paper,
  CircularProgress,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import usePagination from "../../utils/usePagination";
import { Add, Edit, Delete, CheckCircle, AttachMoney, Receipt } from "@mui/icons-material";
import { useFines } from "../context/FineContext";
import type { FineCreate } from "../context/FineContext";

/* 🔧 Hàm tiện ích định dạng ngày */
const formatDate = (arr: number[] | null) => {
  if (!arr) return "-";
  const [year, month, day, hour, minute] = arr;
  const date = new Date(year, month - 1, day, hour, minute);
  return date.toLocaleString("vi-VN", { hour12: false });
};

const FineManagement = () => {
  const { fines, loading, error, addFine, updateFine, deleteFine, refreshFines, markFineAsPaid } = useFines();

  const [openDialog, setOpenDialog] = useState(false);
  const [editingFineId, setEditingFineId] = useState<number | null>(null);

  const [formData, setFormData] = useState<FineCreate>({
    amount: 0,
    transactionId: 0,
    issuedDate: [2025, 10, 1, 9, 0],
    paidDate: null,
    reason: "",
    paidStatus: "UNPAID" as "PAID" | "UNPAID",
  });

  /* 🟢 Mở form thêm / sửa */
  const handleOpenDialog = (fineToEdit?: any) => {
    if (fineToEdit) {
      setEditingFineId(fineToEdit.id);
      setFormData({
        amount: fineToEdit.amount,
        transactionId: fineToEdit.transactionId,
        issuedDate: fineToEdit.issuedDate,
        paidDate: fineToEdit.paidDate,
        reason: fineToEdit.reason,
        paidStatus: fineToEdit.paidStatus,
      });
    } else {
      setEditingFineId(null);
      setFormData({
        amount: 0,
        transactionId: 0,
        issuedDate: [2025, 10, 1, 9, 0],
        paidDate: null,
        reason: "",
        paidStatus: "UNPAID",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFineId(null);
  };

  /* 💾 Lưu dữ liệu */
  const handleSaveFine = async () => {
    try {
      if (editingFineId) {
        await updateFine(editingFineId, formData);
        console.log("✅ Đã cập nhật fine thành công");
      } else {
        await addFine(formData);
        console.log("✅ Đã thêm fine mới thành công");
      }
      await refreshFines();
      handleCloseDialog();
    } catch (error) {
      console.error("Lỗi khi lưu fine:", error);
      alert("Lưu thất bại, xem console để biết chi tiết.");
    }
  };

  const handleDeleteFine = async (id: number) => {
    if (window.confirm("Bạn có chắc muốn xóa tiền phạt này?")) {
      await deleteFine(id);
      await refreshFines();
    }
  };

  const handleMarkAsPaid = async (id: number) => {
    if (!window.confirm("Xác nhận đánh dấu khoản phạt này đã được thanh toán?")) return;
    try {
      await markFineAsPaid(id);
      await refreshFines();
      alert("✅ Đã đánh dấu khoản phạt là ĐÃ THANH TOÁN!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thanh toán:", error);
      alert("Không thể đánh dấu đã thanh toán.");
    }
  };

  const { page, rowsPerPage, total, data: pagedFines, handleChangePage } = usePagination(fines, 10);

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
          Quản lý thẻ phạt
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
          Thêm tiền phạt
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress sx={{ color: '#6C76F6' }} />
        </Box>
      )}
      {error && <Typography sx={{ color: '#F44336', fontFamily: 'Roboto, sans-serif' }}>{error}</Typography>}

      {!loading && (
        <Box>
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
                    <AttachMoney sx={{ fontSize: 20, color: '#6C76F6' }} />
                    Số tiền
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Receipt sx={{ fontSize: 20, color: '#6C76F6' }} />
                    ID giao dịch
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                  Ngày phạt
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                  Ngày thanh toán
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                  Lý do
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                  Trạng thái
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                  Hành động
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pagedFines.map((fine) => (
                <TableRow 
                  key={fine.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(108, 118, 246, 0.04)',
                    },
                  }}
                >
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 600, color: '#1A202C' }}>
                    {fine.amount.toLocaleString("vi-VN")} ₫
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                    {fine.transactionId}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                    {formatDate(fine.issuedDate)}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                    {formatDate(fine.paidDate)}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096', maxWidth: 200 }}>
                    {fine.reason}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={fine.paidStatus === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
                      sx={{
                        backgroundColor: fine.paidStatus === "PAID" 
                          ? 'rgba(76, 175, 80, 0.1)' 
                          : 'rgba(244, 67, 54, 0.1)',
                        color: fine.paidStatus === "PAID" ? '#4CAF50' : '#F44336',
                        fontWeight: 700,
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                      <IconButton 
                        onClick={() => handleOpenDialog(fine)}
                        sx={{
                          backgroundColor: '#6C76F6',
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: '#5B6EF5',
                          }
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteFine(fine.id)}
                        sx={{
                          backgroundColor: '#F44336',
                          color: '#fff',
                          '&:hover': {
                            backgroundColor: '#E53935',
                          }
                        }}
                      >
                        <Delete />
                      </IconButton>

                      {/* 🔥 Nút Đánh dấu đã thanh toán */}
                      {fine.paidStatus === "UNPAID" && (
                        <IconButton
                          onClick={() => handleMarkAsPaid(fine.id)}
                          title="Đánh dấu đã thanh toán"
                          sx={{
                            backgroundColor: '#4CAF50',
                            color: '#fff',
                            '&:hover': {
                              backgroundColor: '#45A049',
                            }
                          }}
                        >
                          <CheckCircle />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
        </Box>
      )}

      {/* 🧩 Dialog thêm / sửa */}
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
        }}>
          {editingFineId ? "Chỉnh sửa tiền phạt" : "Thêm tiền phạt mới"}
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Số tiền (₫)"
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
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
            label="ID giao dịch"
            type="number"
            value={formData.transactionId}
            onChange={(e) => setFormData({ ...formData, transactionId: Number(e.target.value) })}
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
            label="Lý do"
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            fullWidth
            multiline
            rows={3}
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
            select
            label="Trạng thái thanh toán"
            value={formData.paidStatus}
            onChange={(e) =>
              setFormData({
                ...formData,
                paidStatus: e.target.value as "PAID" | "UNPAID",
              })
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
            <MenuItem value="PAID" sx={{ fontFamily: 'Roboto, sans-serif' }}>
              Đã thanh toán
            </MenuItem>
            <MenuItem value="UNPAID" sx={{ fontFamily: 'Roboto, sans-serif' }}>
              Chưa thanh toán
            </MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(108, 118, 246, 0.1)' }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontFamily: 'Roboto, sans-serif',
              color: '#718096',
            }}
          >
            Hủy
          </Button>
          <Button 
            onClick={handleSaveFine} 
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
            {editingFineId ? "Lưu thay đổi" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FineManagement;
