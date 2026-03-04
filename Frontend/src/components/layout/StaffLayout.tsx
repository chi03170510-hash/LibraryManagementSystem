import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import logoImage from '../../assets/logo.png';
import {
  Person,
  ExitToApp,
  CollectionsBookmark,
  Dashboard,
  SwapHoriz,
  Schedule,
  Comment,
  People,
  NotificationsActive,
  CreditCard,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { decodeToken, type JWTPayload } from '../../utils/jwtUtils';

const drawerWidth = 260;

const StyledDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: 'linear-gradient(180deg, #715BB9 0%, #6C5DA8 50%, #715BB9 100%)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    color: 'white',
    borderRight: '0',
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: 0,
    boxShadow: '0 24px 48px rgba(113, 91, 185, 0.25), 0 0 80px rgba(108, 93, 168, 0.15)',
    // Make the sidebar stick to the viewport and not scroll with main content
    height: '100vh',
    position: 'sticky',
    top: 0,
    alignSelf: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      zIndex: -1,
    },
  },
});

const LogoContainer = styled(Box)({
  padding: '28px 24px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  cursor: 'pointer',
  borderTopRightRadius: 0,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: 'translateY(-2px)',
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
      animation: 'shimmer 2s infinite',
    },
  },
  '@keyframes shimmer': {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
});

const LogoImage = styled('img')({
  width: '56px',
  height: '56px',
  borderRadius: 0,
  boxShadow: 'none',
  border: 'none',
  transition: 'all 0.3s ease',
  objectFit: 'cover',
  objectPosition: 'center',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const LogoText = styled(Typography)({
  fontWeight: 800,
  fontSize: '1.35rem',
  color: 'white',
  letterSpacing: 0.5,
  textShadow: '0 2px 8px rgba(0,0,0,0.3), 0 0 20px rgba(255,255,255,0.2)',
  fontFamily: 'Roboto, sans-serif',
});

const UserAvatar = styled(Box)({
  width: '100%',
  padding: '24px',
  borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  marginTop: 'auto',
  flexShrink: 0,
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: 'translateY(-3px)',
    boxShadow: '0 -4px 12px rgba(0,0,0,0.15)',
  },
  borderBottomRightRadius: 28,
});

const AvatarCircle = styled(Box)({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '3px solid rgba(255,255,255,0.4)',
  boxShadow: '0 4px 16px rgba(0,0,0,0.25), inset 0 2px 8px rgba(255,255,255,0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
  },
});

const MainContent = styled(Box)({
  flexGrow: 1,
  padding: '28px',
  background: '#F7F9FC',
  // Only main content scrolls
  height: '100%',
  overflow: 'auto',
});

const ContentWrapper = styled(Box)({
  backgroundColor: 'white',
  borderRadius: 24,
  boxShadow: '0 24px 48px rgba(91, 110, 245, 0.08)',
  padding: 20,
  minHeight: 'calc(100vh - 140px)',
  border: '1px solid rgba(91, 110, 245, 0.08)',
  transition: 'all 0.3s ease',
  position: 'relative',
});

const SidebarScroll = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
});

const StaffLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [userName, setUserName] = useState<string>('Người dùng');
  const [userRole, setUserRole] = useState<string>('Thành viên');

  const mapRoleLabel = (role?: string | null) => {
    switch (role) {
      case 'ADMIN':
        return 'Quản trị';
      case 'STAFF':
        return 'Nhân viên';
      case 'READER':
        return 'Độc giả';
      default:
        return 'Thành viên';
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    const payload = decodeToken(token) as JWTPayload | null;
    if (payload) {
      const name = (payload as any).fullName || (payload as any).name || payload.username || payload.sub || 'Người dùng';
      setUserName(name);
      setUserRole(mapRoleLabel(payload.role));
    }
  }, []);

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/staff' },
    { text: 'Quản lý sách', icon: <CollectionsBookmark />, path: '/staff/books' },
    { text: 'Giao dịch', icon: <SwapHoriz />, path: '/staff/transactions' },
    { text: 'Danh sách trễ hạn', icon: <Schedule />, path: '/staff/transactions/overdue' },
    { text: 'Quản lý bình luận', icon: <Comment />, path: '/staff/social' },
    { text: 'Quản lý người dùng', icon: <People />, path: '/staff/users' },
    { text: 'Quản lý thông báo', icon: <NotificationsActive />, path: '/staff/notifications' },
    { text: 'Quản lý thẻ phạt', icon: <CreditCard />, path: '/staff/fines' },
  ];

  const userMenuItems = [
    { text: 'Thông tin cá nhân', icon: <Person />, action: () => navigate('/profile') },
    {
      text: 'Đăng xuất', icon: <ExitToApp />, action: () => {
        sessionStorage.clear();
        navigate('/login')
      }
    },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <StyledDrawer variant="permanent">
        <LogoContainer onClick={() => navigate('/staff')}>
          <LogoImage src={logoImage} alt="Logo" />
          <LogoText variant="h6">PTIT Library</LogoText>
        </LogoContainer>
        <SidebarScroll>
          <List sx={{ padding: '20px 16px' }}>
            {menuItems.map((item) => (
              <ListItem
                component="div"
                key={item.text}
                onClick={() => navigate(item.path || "/")}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 3,
                  mb: 1.5,
                  padding: '14px 18px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    transform: 'translateX(10px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                    '&::before': {
                      opacity: 1,
                    },
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    background: 'white',
                    opacity: 0,
                    transition: 'all 0.3s ease',
                    borderRadius: '0 4px 4px 0',
                  },
                  '&.active': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  },
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'white', 
                  minWidth: 48, 
                  fontSize: '1.5rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.15) rotate(5deg)',
                    filter: 'drop-shadow(0 4px 8px rgba(255,255,255,0.3))',
                  },
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontWeight: 600,
                      fontSize: '1.05rem',
                      color: 'white',
                      textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      fontFamily: 'Roboto, sans-serif',
                      letterSpacing: '0.02em',
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </SidebarScroll>
        <UserAvatar onClick={handleUserMenuClick}>
          <AvatarCircle>
            <Person sx={{ color: 'white', fontSize: '1.5rem' }} />
          </AvatarCircle>
          <Box>
            <Typography sx={{
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontFamily: 'Roboto, sans-serif',
            }}>
              {userName}
            </Typography>
            <Typography sx={{
              color: 'rgba(255,255,255,0.85)',
              fontSize: '0.8rem',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              fontWeight: 500,
            }}>
              {userRole}
            </Typography>
          </Box>
        </UserAvatar>
      </StyledDrawer>

      <Box sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden' }}>
        <MainContent>
          <ContentWrapper>
            {children}
          </ContentWrapper>
        </MainContent>
      </Box>

      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        {userMenuItems.map((item) => (
          <MenuItem
            key={item.text}
            onClick={() => {
              item.action();
              handleUserMenuClose();
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default StaffLayout;
