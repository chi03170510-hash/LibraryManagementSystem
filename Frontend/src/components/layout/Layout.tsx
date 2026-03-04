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
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Popover,
  CircularProgress,
} from '@mui/material';
import logoImage from '../../assets/logo.png';
import {
  LibraryBooks,
  History,
  Person,
  Settings,
  ExitToApp,
  Notifications,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import notificationApi from '../../api/notificationApi';

const drawerWidth = 260;

const StyledDrawer = styled(Drawer)({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    borderRight: '1px solid var(--border)',
    borderRadius: 0,
    paddingBottom: 32,
    boxShadow: 'none',
  },
});

const LogoContainer = styled(Box)({
  padding: '28px 24px',
  borderBottom: '1px solid var(--border)',
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  cursor: 'pointer',
  transition: 'background var(--transition)',
  '&:hover': {
    backgroundColor: 'var(--surface-muted)',
  },
});

const LogoImage = styled('img')({
  width: '48px',
  height: '48px',
  borderRadius: 12,
  boxShadow: '0 10px 20px rgba(15, 23, 42, 0.1)',
  border: '1px solid var(--border)',
  objectFit: 'cover',
  objectPosition: 'center',
});

const LogoText = styled(Typography)({
  fontWeight: 700,
  fontSize: '1.2rem',
  color: 'var(--text-primary)',
  letterSpacing: 0.2,
  fontFamily: 'Inter, sans-serif',
});

const UserAvatar = styled(Box)({
  marginTop: 'auto',
  padding: '20px 24px',
  borderTop: '1px solid var(--border)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  cursor: 'pointer',
  transition: 'background var(--transition)',
  '&:hover': {
    backgroundColor: 'var(--surface-muted)',
  },
});

const AvatarCircle = styled(Box)({
  width: '46px',
  height: '46px',
  borderRadius: '50%',
  background: 'var(--brand-soft)',
  color: 'var(--brand-strong)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid var(--border)',
});

const MainContent = styled(Box)({
  flexGrow: 1,
  padding: '32px',
  background: 'var(--surface-muted)',
  minHeight: '100vh',
});

const ContentWrapper = styled(Box)({
  backgroundColor: 'var(--surface-bordered)',
  borderRadius: 28,
  boxShadow: '0 24px 48px rgba(15, 23, 42, 0.08)',
  padding: 24,
  minHeight: 'calc(100vh - 140px)',
  border: '1px solid var(--border)',
  position: 'relative',
});

const NotificationIcon = styled(IconButton)({
  width: '44px',
  height: '44px',
  borderRadius: '14px',
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: '#ff6b6b',
  boxShadow: 'var(--shadow-sm)',
  '&:hover': {
    background: 'var(--surface-muted)',
  },
});

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNoti, setLoadingNoti] = useState(false);

  const fetchNotifications = async () => {
    try{
      setLoadingNoti(true);
      const res = await notificationApi.getMyNotifications();
      setNotifications(res || []);
    } catch (err){
      console.error("Lỗi khi tải thông báo:", err);
    } finally {
      setLoadingNoti(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [])

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const menuItems = [
    { text: 'Danh mục sách', icon: <LibraryBooks />, path: '/books' },
    { text: 'Lịch sử mượn sách', icon: <History />, path: '/history' },
  ];

  const userMenuItems = [
    { text: 'Thông tin cá nhân', icon: <Person />, action: () => navigate('/profile') },
    { text: 'Đổi mật khẩu', icon: <Settings />, action: () => navigate('/change-password') },
    { text: 'Đăng xuất', icon: <ExitToApp />, action: () => {
      sessionStorage.clear();
      navigate('/login') 
    }},
  ];

  // Get page title based on current route
  return (
    <Box sx={{ display: 'flex' }}>
      <StyledDrawer variant="permanent">
        <LogoContainer onClick={() => navigate('/')}>
          <LogoImage src={logoImage} alt="Logo" />
          <LogoText variant="h6">PTIT Library</LogoText>
        </LogoContainer>
        <List sx={{ padding: '20px 16px' }}>
          {menuItems.map((item) => (
            <ListItem
              component="div"
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: 'pointer',
                borderRadius: 2,
                mb: 1,
                padding: '12px 16px',
                border: '1px solid transparent',
                color: 'var(--text-secondary)',
                transition: 'border var(--transition), background var(--transition)',
                '&:hover': {
                  backgroundColor: 'var(--surface-muted)',
                  borderColor: 'var(--border)',
                },
              }}
            >
              <ListItemIcon sx={{ 
                color: 'var(--brand-strong)', 
                minWidth: 44, 
                fontSize: '1.5rem',
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 600,
                    fontSize: '1rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'Inter, sans-serif',
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
        <UserAvatar onClick={handleUserMenuClick}>
          <AvatarCircle>
            <Person sx={{ color: 'var(--brand-strong)', fontSize: '1.35rem' }} />
          </AvatarCircle>
          <Box>
            <Typography sx={{
              color: 'var(--text-primary)',
              fontWeight: 700,
              fontSize: '0.95rem',
              fontFamily: 'Inter, sans-serif',
            }}>
              Người dùng
            </Typography>
            <Typography sx={{
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 500,
            }}>
              Thành viên
            </Typography>
          </Box>
        </UserAvatar>
      </StyledDrawer>

      <Box sx={{ flexGrow: 1 }}>
        <MainContent>
          <ContentWrapper>
            <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 2 }}>
              <NotificationIcon onClick={handleNotificationClick}>
                <Badge
                  badgeContent={notifications?.filter((n: any) => n.status !== "READ").length ?? 0}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#ff6b6b",
                      color: "white",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                    },
                  }}
                >
                  <Notifications sx={{ color: "#ff6b6b", fontSize: "1.2rem" }} />
                </Badge>
              </NotificationIcon>
            </Box>
            {children}
          </ContentWrapper>
        </MainContent>
      </Box>

      {/* === User menu === */}
      <Menu anchorEl={userMenuAnchor} open={Boolean(userMenuAnchor)} onClose={handleUserMenuClose}>
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

      {/* === Notification popover === */}
      <Popover
        open={Boolean(notificationAnchor)}
        anchorEl={notificationAnchor}
        onClose={handleNotificationClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <List sx={{ width: 320, maxHeight: 400, overflowY: "auto", p: 1 }}>
          {loadingNoti ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : notifications?.length === 0 ? (
            <Typography sx={{ p: 2, textAlign: "center", color: "gray" }}>
              Không có thông báo
            </Typography>
          ) : (
            notifications?.map((noti: any) => (
              <ListItem
                key={noti.id}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: noti.status === "READ" ? "#fff" : "rgba(255,107,107,0.1)",
                  "&:hover": { backgroundColor: "rgba(255,107,107,0.2)" },
                }}
                onClick={() => {
                  // tuỳ chọn: đánh dấu đã đọc
                  notificationApi.markAsRead?.(noti.id);
                  console.log("Đã đọc thông báo", noti.title);
                  fetchNotifications();
                }}
              >
                <ListItemText
                  primary={noti.title}
                  secondary={noti.body}
                  sx={{
                    "& .MuiListItemText-primary": { fontWeight: noti.isRead ? 400 : 600 },
                    "& .MuiListItemText-secondary": { color: "#555" },
                  }}
                />
              </ListItem>
            ))
          )}
        </List>
      </Popover>
    </Box>
  );
};

export default Layout;
