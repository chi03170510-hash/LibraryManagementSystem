import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";
import usePagination from "../../utils/usePagination";
import { Schedule, Person, LibraryBooks, Warning } from "@mui/icons-material";
import { staffTransactionApi } from "../../api";

interface TransactionDetail {
  bookTitle: string;
  conditionNote: string;
  status: string;
}

interface Transaction {
  id: number;
  borrowDate: number[];
  dueDate: number[];
  returnDate: number[] | null;
  fineAmount: number | null;
  note: string;
  status: string;
  readerName: string;
  staffName: string;
  details: TransactionDetail[];
}

const OverdueList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverdueTransactions = async () => {
    setLoading(true);
    try {
      const res = await staffTransactionApi.getOverdueTransactions();
      setTransactions(res as any);
    } catch (err: any) {
      console.error("❌ Lỗi khi tải danh sách trễ hạn:", err);
      setError("Không thể tải danh sách trễ hạn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdueTransactions();
  }, []);

  const formatDate = (arr: number[] | null) => {
    if (!arr) return "—";
    const [y, m, d, h = 0, min = 0] = arr;
    return `${d.toString().padStart(2, "0")}/${m.toString().padStart(
      2,
      "0"
    )}/${y} ${h.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
  };

  const calcOverdueDays = (dueDate: number[]): number => {
    const due = new Date(dueDate[0], dueDate[1] - 1, dueDate[2]);
    const now = new Date();
    const diffMs = now.getTime() - due.getTime();
    const daysLate = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return daysLate > 0 ? daysLate : 0;
  };

  const overdueList = transactions.filter(
    (t) => t.returnDate === null && calcOverdueDays(t.dueDate) > 0
  );

  const { page, rowsPerPage, total, data: paged, handleChangePage } = usePagination(overdueList, 10);

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 6 }}>
      <CircularProgress sx={{ color: '#6C76F6' }} />
      <Typography sx={{ mt: 2, fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
        Đang tải danh sách trễ hạn...
      </Typography>
    </Box>
  );
  
  if (error) return (
    <Typography sx={{ color: '#F44336', p: 3, fontFamily: 'Roboto, sans-serif' }}>
      {error}
    </Typography>
  );

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
          Danh sách trễ hạn
        </Typography>
      </Box>

      {/* Summary Card */}
      <Card sx={{ 
        mb: 4, 
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.1) 0%, rgba(244, 67, 54, 0.05) 100%)',
        border: '1px solid rgba(244, 67, 54, 0.2)',
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 56,
              height: 56,
              borderRadius: 2,
              backgroundColor: 'rgba(244, 67, 54, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Warning sx={{ fontSize: 32, color: '#F44336' }} />
            </Box>
            <Box>
              <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096', fontSize: '0.9rem' }}>
                Tổng số giao dịch trễ hạn
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#F44336', fontFamily: 'Roboto, sans-serif' }}>
                {overdueList.length}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {overdueList.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          p: 6, 
          backgroundColor: '#F7F9FC', 
          borderRadius: 3,
          border: '1px solid rgba(108, 118, 246, 0.1)',
        }}>
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
            ✅ Hiện không có độc giả nào trễ hạn.
          </Typography>
        </Box>
      ) : (
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
                  STT
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person sx={{ fontSize: 20, color: '#6C76F6' }} />
                    Độc giả
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                  Nhân viên
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                  Ngày mượn
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Schedule sx={{ fontSize: 20, color: '#6C76F6' }} />
                    Hạn trả
                  </Box>
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                  Số ngày trễ
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LibraryBooks sx={{ fontSize: 20, color: '#6C76F6' }} />
                    Sách đang mượn
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paged.map((t, idx) => (
                <TableRow 
                  key={t.id}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(244, 67, 54, 0.04)',
                    },
                  }}
                >
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif' }}>
                    {page * rowsPerPage + idx + 1}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 500 }}>
                    {t.readerName}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                    {t.staffName}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                    {formatDate(t.borrowDate)}
                  </TableCell>
                  <TableCell sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                    {formatDate(t.dueDate)}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`${calcOverdueDays(t.dueDate)} ngày`}
                      sx={{
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        color: '#F44336',
                        fontWeight: 700,
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {t.details.map((detail, i) => (
                        <Chip
                          key={i}
                          label={detail.bookTitle}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(108, 118, 246, 0.1)',
                            color: '#6C76F6',
                            fontWeight: 600,
                            fontFamily: 'Roboto, sans-serif',
                            maxWidth: '100%',
                          }}
                        />
                      ))}
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
    </Box>
  );
};

export default OverdueList;
