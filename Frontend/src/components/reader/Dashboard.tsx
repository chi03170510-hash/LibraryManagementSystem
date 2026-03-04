// src/components/reader/Dashboard.tsx
import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalLibrary, Whatshot, Notifications } from '@mui/icons-material';

const SectionTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: '1.4rem',
  color: '#1A202C',
  marginBottom: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  fontFamily: 'Roboto, sans-serif',
  letterSpacing: '-0.02em',
  '& svg': {
    fontSize: '1.8rem',
    color: '#1A202C',
  },
});

const DashboardCard = styled(Card)({
  borderRadius: 20,
  boxShadow: '0 8px 32px rgba(91, 110, 245, 0.12)',
  background: 'white',
  border: '1px solid rgba(91, 110, 245, 0.08)',
  flex: 1,
  minWidth: 300,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 16px 48px rgba(91, 110, 245, 0.2)',
  },
});

const Dashboard = () => {
  // Mock dữ liệu (sau này có thể thay bằng API)
  const borrowedBooks = [
    { id: 1, title: 'Nhà giả kim', dueDate: '2025-10-12' },
    { id: 2, title: 'Đắc nhân tâm', dueDate: '2025-10-15' },
  ];

  const notifications = [
    { id: 1, message: 'Sách "Nhà giả kim" sắp đến hạn trả' },
    { id: 2, message: 'Bạn đã duy trì streak 5 ngày liên tiếp 🎉' },
  ];

  const streakDays = 5;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 800, 
          color: '#1A202C',
          mb: 2,
          fontFamily: 'Roboto, sans-serif',
          letterSpacing: '-0.03em',
        }}
      >
        Tổng quan cá nhân
      </Typography>

      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {/* Sách đang mượn */}
        <DashboardCard>
          <CardContent sx={{ padding: '28px !important' }}>
            <SectionTitle><LocalLibrary /> Sách đang mượn</SectionTitle>
            <List>
              {borrowedBooks.map((book, index) => (
                <Box key={book.id}>
                  <ListItem sx={{ padding: '12px 0' }}>
                    <ListItemText
                      primary={book.title}
                      secondary={`Hạn trả: ${book.dueDate}`}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          color: '#1A202C',
                          fontFamily: 'Roboto, sans-serif',
                        },
                        '& .MuiListItemText-secondary': {
                          color: '#718096',
                          fontSize: '0.95rem',
                          fontFamily: 'Roboto, sans-serif',
                          marginTop: '4px',
                        },
                      }}
                    />
                  </ListItem>
                  {index < borrowedBooks.length - 1 && <Divider sx={{ borderColor: 'rgba(91, 110, 245, 0.1)' }} />}
                </Box>
              ))}
            </List>
          </CardContent>
        </DashboardCard>

        {/* Streak */}
        <DashboardCard>
          <CardContent sx={{ padding: '28px !important' }}>
            <SectionTitle><Whatshot /> Chuỗi ngày đọc</SectionTitle>
            <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Typography 
                sx={{ 
                  color: '#1A202C',
                  fontSize: '3.5rem',
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                🔥 {streakDays}
              </Typography>
              <Typography sx={{ 
                color: '#718096', 
                mt: 2,
                fontSize: '1.05rem',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
              }}>
                ngày liên tiếp
              </Typography>
              <Typography sx={{ 
                textAlign: 'center', 
                color: '#4A5568', 
                mt: 2,
                fontSize: '0.95rem',
                fontFamily: 'Roboto, sans-serif',
              }}>
                Cố gắng duy trì để nhận phần thưởng!
              </Typography>
            </Box>
          </CardContent>
        </DashboardCard>

        {/* Thông báo gần đây */}
        <DashboardCard>
          <CardContent sx={{ padding: '28px !important' }}>
            <SectionTitle><Notifications /> Thông báo gần đây</SectionTitle>
            <List>
              {notifications.map((noti, index) => (
                <Box key={noti.id}>
                  <ListItem sx={{ padding: '12px 0' }}>
                    <ListItemText 
                      primary={noti.message}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 500,
                          fontSize: '1rem',
                          color: '#4A5568',
                          fontFamily: 'Roboto, sans-serif',
                          lineHeight: 1.6,
                        },
                      }}
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider sx={{ borderColor: 'rgba(91, 110, 245, 0.1)' }} />}
                </Box>
              ))}
            </List>
          </CardContent>
        </DashboardCard>
      </Box>
    </Box>
  );
};

export default Dashboard;
