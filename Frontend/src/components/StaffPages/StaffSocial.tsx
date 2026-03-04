import React from "react";
import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Typography,
    Box,
    Chip,
    TableContainer,
    Paper,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import { Comment as CommentIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useSocial } from "../context/SocialContext";
import ConfirmDialog from "../common/ConfirmDialog";
import SnackbarAlert from "../common/SnackbarAlert";

const StaffSocial: React.FC = () => {
    const { comments, page, size, total, loading, setPage, deleteComment, error } = useSocial();

    // Confirm delete dialog state
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [selectedId, setSelectedId] = React.useState<number | null>(null);
    const [selectedInfo, setSelectedInfo] = React.useState<{ user: string; content: string } | null>(null);

    // Snackbar state
    const [snackbar, setSnackbar] = React.useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({ open: false, message: '', severity: 'success' });

    const openConfirm = (id: number, user: string, content: string) => {
        setSelectedId(id);
        setSelectedInfo({ user, content });
        setConfirmOpen(true);
    };
    const closeConfirm = () => setConfirmOpen(false);
    const handleConfirmDelete = async () => {
        if (selectedId == null) return;
        try {
            await deleteComment(selectedId);
            setSnackbar({ open: true, message: 'Đã xóa bình luận thành công', severity: 'success' });
        } catch (_e) {
            // In case deleteComment bubbles error; context also sets error state
            setSnackbar({ open: true, message: 'Xóa bình luận thất bại', severity: 'error' });
        }
    };

    return (
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
                Quản lý bình luận
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
                                ID
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <CommentIcon sx={{ fontSize: 20, color: '#6C76F6' }} />
                                    Người dùng
                                </Box>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                                Nội dung
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                                Trạng thái
                            </TableCell>
                            <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                                Hành động
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {error && (
                            <TableRow>
                                <TableCell colSpan={5} sx={{ textAlign: 'center', color: '#E53935', fontWeight: 600 }}>
                                    {error}
                                </TableCell>
                            </TableRow>
                        )}
                        {loading && (
                            <TableRow>
                                <TableCell colSpan={5} sx={{ textAlign: 'center', color: '#718096' }}>
                                    Đang tải bình luận...
                                </TableCell>
                            </TableRow>
                        )}
                        {!loading && comments.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} sx={{ textAlign: 'center', color: '#718096' }}>
                                    Không có bình luận nào.
                                </TableCell>
                            </TableRow>
                        )}
                        {!loading && comments.map((c, index) => (
                            <TableRow 
                                key={c.id}
                                sx={{
                                    '&:hover': {
                                        backgroundColor: 'rgba(108, 118, 246, 0.04)',
                                    },
                                }}
                            >
                                <TableCell sx={{ fontFamily: 'Roboto, sans-serif' }}>
                                    {page * size + index + 1}
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                                    {c.user}
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096', maxWidth: 300 }}>
                                    {c.content}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={
                                            c.commentStatus === "pending"
                                                ? "Chờ duyệt"
                                                : c.commentStatus === "approved"
                                                ? "Đã duyệt"
                                                : "Bị gắn cờ"
                                        }
                                        sx={{
                                            backgroundColor: 
                                                c.commentStatus === "pending" 
                                                    ? 'rgba(255, 152, 0, 0.1)' 
                                                    : c.commentStatus === "approved"
                                                    ? 'rgba(76, 175, 80, 0.1)'
                                                    : 'rgba(244, 67, 54, 0.1)',
                                            color: 
                                                c.commentStatus === "pending" 
                                                    ? '#FF9800' 
                                                    : c.commentStatus === "approved"
                                                    ? '#4CAF50'
                                                    : '#F44336',
                                            fontWeight: 700,
                                            fontFamily: 'Roboto, sans-serif',
                                        }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => openConfirm(c.id, c.user, c.content)}
                                            sx={{
                                                textTransform: 'none',
                                                fontWeight: 600,
                                                fontFamily: 'Roboto, sans-serif',
                                                backgroundColor: '#F44336',
                                                color: '#fff',
                                                '&:hover': {
                                                    backgroundColor: '#E53935',
                                                }
                                            }}
                                        >
                                            Xóa
                                        </Button>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={confirmOpen}
                onClose={closeConfirm}
                onConfirm={handleConfirmDelete}
                title="Xóa bình luận"
                message={
                    <span>
                        Bạn có chắc chắn muốn xóa bình luận của <strong>{selectedInfo?.user}</strong>?<br/>
                        <em style={{ color: '#4A5568' }}>
                            "{selectedInfo?.content?.length ? selectedInfo?.content : ''}"
                        </em>
                    </span>
                }
                confirmText="Xóa"
                cancelText="Hủy"
                confirmColor="error"
            />

            {/* Snackbar Feedback */}
            <SnackbarAlert
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <TablePagination
                    component="div"
                    count={total}
                    page={page}
                    onPageChange={(_e, newPage) => setPage(newPage)}
                    rowsPerPage={size}
                    rowsPerPageOptions={[10]}
                />
            </Box>
        </Box>
    );
};

export default StaffSocial;
