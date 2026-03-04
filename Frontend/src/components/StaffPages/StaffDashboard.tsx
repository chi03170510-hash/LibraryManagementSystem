import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import {
  LibraryBooks,
  People,
  SwapHoriz,
  Schedule,
  TrendingUp,
  BookmarkAdded,
  Paid,
} from '@mui/icons-material';
import staffUsersApi from '../../api/staffUsersApi';
import publicBooksApi from '../../api/publicBooksApi';
import staffTransactionApi from '../../api/staffTransactionApi';
import staffFinesApi from '../../api/staffFinesApi';
import type { Book } from '../../types/api.types';

interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  activeBorrowTransactions: number; // current borrowed transactions
  overdueTransactions: number;
  booksAvailable: number; // sum availableQuantity
  booksBorrowed: number; // sum (quantity - availableQuantity)
  unpaidFines: number; // count of UNPAID fines
}

const StaffDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrowTransactions: 0,
    overdueTransactions: 0,
    booksAvailable: 0,
    booksBorrowed: 0,
    unpaidFines: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Run independent API calls in parallel
        const [users, booksRes, borrowedTx, overdueTx, unpaidFinesList] = await Promise.all([
          // Users
          staffUsersApi.getAllUsers().catch(() => []),
          // Books (public search with no filters -> all)
          publicBooksApi.searchBooks({ page: 0, size: 1000 }).catch(() => []),
          // Transactions
          staffTransactionApi.getBorrowedTransactions().catch(() => []),
          staffTransactionApi.getOverdueTransactions().catch(() => []),
          // Fines (only UNPAID)
          staffFinesApi.getAllFines({ status: 'UNPAID' }).catch(() => []),
        ]);

        // Normalize books result: supports both array and paginated shape
        let totalBooks = 0;
        let booksAvailable = 0;
        let booksBorrowed = 0;

        const borrowedCount = (borrowedTx as any[]).length; // number of active borrow transactions
        if (Array.isArray(booksRes)) {
          const booksArr = booksRes as Book[];
          totalBooks = booksArr.length;
          booksAvailable = booksArr.reduce((sum, b: any) => sum + (b.availableQuantity ?? 0), 0);
          booksBorrowed = booksArr.reduce((sum, b: any) => sum + Math.max(0, (b.quantity ?? 0) - (b.availableQuantity ?? 0)), 0);
        } else if (booksRes && Array.isArray((booksRes as any).items)) {
          const pageObj = booksRes as any;
          const items: any[] = pageObj.items || [];
          totalBooks = Number.isFinite(pageObj.totalItems) ? pageObj.totalItems : items.length;
          // If we likely have all items in one page, compute exact sums; else fall back to transaction-based approximation
          if (items.length >= totalBooks) {
            booksAvailable = items.reduce((sum, b: any) => sum + (b.availableQuantity ?? 0), 0);
            booksBorrowed = items.reduce((sum, b: any) => sum + Math.max(0, (b.quantity ?? 0) - (b.availableQuantity ?? 0)), 0);
          } else {
            // Approximation based on transactions when full inventory isn't loaded
            booksBorrowed = borrowedCount;
            booksAvailable = Math.max(0, totalBooks - booksBorrowed);
          }
        } else {
          // Unknown shape -> derive from transactions only
          totalBooks = 0;
          booksBorrowed = borrowedCount;
          booksAvailable = 0;
        }

        setStats({
          totalBooks,
          totalUsers: (users as any[]).length,
          activeBorrowTransactions: borrowedCount,
          overdueTransactions: (overdueTx as any[]).length,
          booksAvailable,
          booksBorrowed,
          unpaidFines: (unpaidFinesList as any[]).length,
        });
      } catch (e) {
        console.error('Error fetching dashboard data:', e);
        setError('Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Tổng số sách',
      value: stats.totalBooks,
      icon: <LibraryBooks sx={{ fontSize: 40 }} />,
      color: '#5B6EF5',
      bgColor: 'rgba(91, 110, 245, 0.1)',
    },
    {
      title: 'Người dùng',
      value: stats.totalUsers,
      icon: <People sx={{ fontSize: 40 }} />,
      color: '#8758FF',
      bgColor: 'rgba(135, 88, 255, 0.1)',
    },
    {
      title: 'Giao dịch đang mượn',
      value: stats.activeBorrowTransactions,
      icon: <SwapHoriz sx={{ fontSize: 40 }} />,
      color: '#4CAF50',
      bgColor: 'rgba(76, 175, 80, 0.1)',
    },
    {
      title: 'Sách trễ hạn',
      value: stats.overdueTransactions,
      icon: <Schedule sx={{ fontSize: 40 }} />,
      color: '#ff6b6b',
      bgColor: 'rgba(255, 107, 107, 0.1)',
    },
    {
      title: 'Sách có sẵn',
      value: stats.booksAvailable,
      icon: <BookmarkAdded sx={{ fontSize: 40 }} />,
      color: '#00BCD4',
      bgColor: 'rgba(0, 188, 212, 0.1)',
    },
    {
      title: 'Đang được mượn',
      value: stats.booksBorrowed,
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#FF9800',
      bgColor: 'rgba(255, 152, 0, 0.1)',
    },
    {
      title: 'Phạt chưa thanh toán',
      value: stats.unpaidFines,
      icon: <Paid sx={{ fontSize: 40 }} />,
      color: '#E53935',
      bgColor: 'rgba(229, 57, 53, 0.1)',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: '#E53935', fontWeight: 600 }}>
        {error}
      </Box>
    );
  }

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
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(91, 110, 245, 0.12)',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(91, 110, 245, 0.08)',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(91, 110, 245, 0.18)',
                },
              }}
            >
              <CardContent sx={{ padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#718096',
                        fontWeight: 500,
                        fontSize: '0.9rem',
                        mb: 1,
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    >
                      {card.title}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        color: '#1A202C',
                        fontFamily: 'Roboto, sans-serif',
                      }}
                    >
                      {card.value.toLocaleString()}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 2,
                      backgroundColor: card.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Additional stats or charts can be added here */}
      <Box sx={{ mt: 4 }}>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: '0 8px 24px rgba(91, 110, 245, 0.12)',
            border: '1px solid rgba(91, 110, 245, 0.08)',
          }}
        >
          <CardContent sx={{ padding: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#1A202C',
                mb: 2,
                fontFamily: 'Roboto, sans-serif',
              }}
            >
              Thống kê tổng quan
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Tỷ lệ sách đang mượn
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#5B6EF5' }}>
                  {stats.totalBooks ? ((stats.booksBorrowed / stats.totalBooks) * 100).toFixed(1) : '0.0'}%
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Tỷ lệ trễ hạn (trên giao dịch đang mượn)
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#ff6b6b' }}>
                  {stats.activeBorrowTransactions ? ((stats.overdueTransactions / stats.activeBorrowTransactions) * 100).toFixed(1) : '0.0'}%
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Giao dịch đang mượn / người dùng
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#4CAF50' }}>
                  {stats.totalUsers ? (stats.activeBorrowTransactions / stats.totalUsers).toFixed(2) : '0.00'}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default StaffDashboard;