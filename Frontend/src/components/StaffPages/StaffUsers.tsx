import React, { useEffect } from "react";
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
  CircularProgress,
  TableContainer,
  Paper,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import usePagination from "../../utils/usePagination";
import { Person, Email, Phone, LockOpen, Lock } from "@mui/icons-material";
import { useUsers } from "../context/UserContext";

const StaffUsers: React.FC = () => {
  const { users, loading, lockUserAccount, unlockUserAccount, fetchUserAccount} = useUsers();

  useEffect(() => {
    fetchUserAccount();
  }, []);

  const { page, rowsPerPage, total, data: pagedUsers, handleChangePage } = usePagination(users, 10);

  if(loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 6 }}>
      <CircularProgress sx={{ color: '#6C76F6' }} />
      <Typography sx={{ mt: 2, fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
        Đang tải danh sách người dùng...
      </Typography>
    </Box>
  );

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
        Quản lý người dùng
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
                  <Person sx={{ fontSize: 20, color: '#6C76F6' }} />
                  Tên đăng nhập
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 20, color: '#6C76F6' }} />
                  Điện thoại
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 20, color: '#6C76F6' }} />
                  Email
                </Box>
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                Địa chỉ
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                Họ và tên
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                Vai trò
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
            {pagedUsers.map(user => (
              <TableRow 
                key={user.id}
                sx={{
                  '&:hover': {
                    backgroundColor: 'rgba(108, 118, 246, 0.04)',
                  },
                }}
              >
                <TableCell sx={{ fontFamily: 'Roboto, sans-serif' }}>
                  {user.id}
                </TableCell>
                <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                  {user.username}
                </TableCell>
                <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                  {user.phone}
                </TableCell>
                <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                  {user.email}
                </TableCell>
                <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                  {user.address}
                </TableCell>
                <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                  {user.fullName}
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
                <TableCell>
                  <Chip
                    label={user.status === "ACTIVE" ? "Hoạt động" : "Đã khóa"}
                    sx={{
                      backgroundColor: user.status === "ACTIVE"
                        ? 'rgba(76, 175, 80, 0.1)'
                        : 'rgba(244, 67, 54, 0.1)',
                      color: user.status === "ACTIVE" ? '#4CAF50' : '#F44336',
                      fontWeight: 700,
                      fontFamily: 'Roboto, sans-serif',
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={user.status === "ACTIVE" ? <Lock /> : <LockOpen />}
                    onClick={() => 
                      user.status ==="ACTIVE"
                      ? lockUserAccount(user.id)
                      : unlockUserAccount(user.id)
                    }
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      fontFamily: 'Roboto, sans-serif',
                      backgroundColor: user.status === "ACTIVE" ? '#F44336' : '#4CAF50',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: user.status === "ACTIVE" ? '#E53935' : '#45A049',
                      }
                    }}
                  >
                    {user.status === "ACTIVE" ? "Khóa tài khoản" : "Mở khóa"}
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
    </Box>
  );
};

export default StaffUsers;
