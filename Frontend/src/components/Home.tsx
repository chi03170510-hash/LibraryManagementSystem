import { Typography, Box, Card, CardContent } from '@mui/material';
import { LibraryBooks, TrendingUp, People, BookmarkAdd } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const WelcomeCard = styled(Card)({
  borderRadius: '20px',
  boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
  border: '1px solid rgba(255,255,255,0.8)',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
  },
});

const StatCard = styled(Card)({
  borderRadius: '16px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  border: '1px solid rgba(255,255,255,0.8)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
  },
});

const StatIcon = styled(Box)({
  width: '60px',
  height: '60px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '16px',
});

const Home = () => {
  const stats = [
    {
      title: 'Tổng số sách',
      value: '1,234',
      icon: <LibraryBooks sx={{ fontSize: '2rem', color: '#667eea' }} />,
      color: 'rgba(102, 126, 234, 0.1)',
    },
    {
      title: 'Sách đang mượn',
      value: '89',
      icon: <BookmarkAdd sx={{ fontSize: '2rem', color: '#27ae60' }} />,
      color: 'rgba(39, 174, 96, 0.1)',
    },
    {
      title: 'Thành viên',
      value: '456',
      icon: <People sx={{ fontSize: '2rem', color: '#e74c3c' }} />,
      color: 'rgba(231, 76, 60, 0.1)',
    },
    {
      title: 'Lượt mượn tháng này',
      value: '234',
      icon: <TrendingUp sx={{ fontSize: '2rem', color: '#f39c12' }} />,
      color: 'rgba(243, 156, 18, 0.1)',
    },
  ];

  return (
    <Box>
      <WelcomeCard sx={{ mb: 4 }}>
        <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
          <Typography variant="h3" component="h1" sx={{ 
            fontWeight: 800, 
            mb: 2,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}>
            📚 Chào mừng đến với thư viện!
          </Typography>
          <Typography variant="h6" sx={{ 
            opacity: 0.9,
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
          }}>
            Khám phá kho tàng tri thức với hàng nghìn cuốn sách từ mọi lĩnh vực
          </Typography>
        </CardContent>
      </WelcomeCard>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { 
          xs: '1fr', 
          sm: 'repeat(2, 1fr)', 
          md: 'repeat(4, 1fr)' 
        }, 
        gap: 3 
      }}>
        {stats.map((stat, index) => (
          <StatCard key={index}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <StatIcon sx={{ backgroundColor: stat.color, mx: 'auto' }}>
                  {stat.icon}
                </StatIcon>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  color: '#2c3e50',
                  mb: 1,
                }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#7f8c8d',
                  fontWeight: 600,
                }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </StatCard>
        ))}
      </Box>
    </Box>
  );
};

export default Home;
