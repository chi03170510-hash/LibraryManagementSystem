import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Box,
  CircularProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  TableContainer,
  Paper,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import usePagination from "../../utils/usePagination";
import { NotificationsActive, Person, Email, Send } from "@mui/icons-material";
import { useUsers } from "../context/UserContext";
import staffNotificationApi from "../../api/staffNotificationApi";
import ConfirmDialog from "../common/ConfirmDialog";
import SnackbarAlert from "../common/SnackbarAlert";


const StaffNotifications: React.FC = () => {

    const {users, loading, fetchUserAccount} = useUsers();

    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [sending, setSending] = useState(false);
    const [confirmSend, setConfirmSend] = useState(false);
    const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success'|'error'|'info'|'warning'}>({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        fetchUserAccount();
    }, []);

    const { page, rowsPerPage, total, data: pagedUsers, handleChangePage } = usePagination(users ?? [], 10);

    const handleOpen = (user: any) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setTitle("");
        setBody("");
        setSelectedUser(null);
    };

    const requestSend = () => {
        if (!title.trim() || !body.trim()) {
            setSnackbar({ open: true, message: '⚠️ Vui lòng nhập đủ tiêu đề và nội dung', severity: 'warning' });
            return;
        }
        setConfirmSend(true);
    };

    const handleSendNotification = async () => {
        try {
            setSending(true);
            await staffNotificationApi.sendNotification({
                title,
                body,
                recipientId: selectedUser.id,
            });
            setSnackbar({ open: true, message: `✅ Đã gửi thông báo tới ${selectedUser.fullName}`, severity: 'success' });
            handleClose();
        } catch (error) {
            console.error(error);
            setSnackbar({ open: true, message: '❌ Lỗi khi gửi thông báo', severity: 'error' });
        } finally {
            setSending(false);
        }
    };

    if(loading) return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 6 }}>
            <CircularProgress sx={{ color: '#6C76F6' }} />
            <Typography sx={{ mt: 2, fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                Đang tải danh sách người dùng...
            </Typography>
        </Box>
    );

    return  (
        <Box>
            <Typography 
                variant="h4" 
                sx={{ 
                    mb: 4,
                    fontWeight: 700, 
                    color: '#1A202C',
                    fontFamily: 'Roboto, sans-serif',
                }}
            >
                Quản lý thông báo 
            </Typography>

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
                                STT
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Person sx={{ fontSize: 20, color: '#6C76F6' }} />
                                    Họ và tên
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Email sx={{ fontSize: 20, color: '#6C76F6' }} />
                                    Email
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                                Vai trò
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pagedUsers.map((user: any, index: number) => (
                            <TableRow 
                                key={user.id}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(108, 118, 246, 0.04)',
                                    },
                                }}
                            >
                                <TableCell sx={{ fontFamily: 'Roboto, sans-serif' }}>
                                    {page * rowsPerPage + index + 1}
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                                    {user.fullName}
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                                    {user.email}
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={user.role}
                                        size="small"
                                        sx={{
                                            backgroundColor: user.role === 'STAFF' || user.role === 'ADMIN'
                                                ? 'rgba(108, 118, 246, 0.1)'
                                                : 'rgba(135, 88, 255, 0.1)',
                                            color: user.role === 'STAFF' || user.role === 'ADMIN'
                                                ? '#6C76F6'
                                                : '#8758FF',
                                            fontWeight: 700,
                                            fontFamily: 'Roboto, sans-serif',
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<Send />}
                                        onClick={() => handleOpen(user)}
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
                                        Tạo thông báo
                                    </Button>
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
            
            <Dialog 
                open={open} 
                onClose={handleClose} 
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
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}>
                    <NotificationsActive sx={{ color: '#6C76F6' }} />
                    Gửi thông báo tới {selectedUser?.fullName}
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Tiêu đề"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ 
                            mt: 1,
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
                        multiline
                        rows={4}
                        label="Nội dung thông báo"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        sx={{ 
                            mt: 2,
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
                        onClick={handleClose}
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
                        variant="contained"
                        onClick={requestSend}
                        disabled={sending}
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
                        {sending ? "Đang gửi..." : "Gửi"}
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmDialog
                open={confirmSend}
                title="Xác nhận gửi thông báo"
                message={
                    selectedUser ? (
                        <Box>
                            <Typography sx={{ fontFamily: 'Roboto, sans-serif' }}>
                                Gửi thông báo tới <strong>{selectedUser.fullName}</strong>?
                            </Typography>
                            <Typography sx={{ fontFamily: 'Roboto, sans-serif', mt: 1 }}>
                                Tiêu đề: <strong>{title}</strong>
                            </Typography>
                        </Box>
                    ) : undefined
                }
                confirmText="Gửi"
                cancelText="Hủy"
                confirmColor="success"
                onConfirm={handleSendNotification}
                onClose={() => setConfirmSend(false)}
            />

            <SnackbarAlert
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </Box>
    )
}

export default StaffNotifications;