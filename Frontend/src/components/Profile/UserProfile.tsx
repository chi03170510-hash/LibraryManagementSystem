import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Grid, TextField, Chip, Button, Divider } from "@mui/material";
import SnackbarAlert from "../common/SnackbarAlert";
import { profileApi } from "../../api";
import { useProfile } from "../context/ProfileContext";

const UserProfile: React.FC = () => {
  const { profile, refreshProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean; message: string; severity: 'success'|'error'|'info'|'warning'}>({ open: false, message: '', severity: 'info' });

  const [form, setForm] = useState({
    username: '',
    fullName: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        username: profile.username || '',
        fullName: (profile as any).fullName || (profile as any).name || '',
        phone: profile.phone || '',
        email: profile.email || '',
        address: profile.address || '',
      });
    }
  }, [profile]);

  const roleColor = (role?: string) => role === 'ADMIN' || role === 'STAFF' ? '#6C76F6' : '#8758FF';
  const roleBg = (role?: string) => role === 'ADMIN' || role === 'STAFF' ? 'rgba(108, 118, 246, 0.1)' : 'rgba(135, 88, 255, 0.1)';
  const statusColor = (status?: string) => status === 'ACTIVE' ? '#4CAF50' : '#F44336';
  const statusBg = (status?: string) => status === 'ACTIVE' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)';

  const handleSave = async () => {
    try {
      await profileApi.updateProfile({
        username: form.username,
        phone: form.phone,
        email: form.email,
        address: form.address,
        fullName: form.fullName,
      });
      await refreshProfile();
      setIsEditing(false);
      setSnackbar({ open: true, message: '✅ Cập nhật thông tin thành công!', severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: '❌ Không thể cập nhật hồ sơ!', severity: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 700, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}
        >
          Thông tin cá nhân
        </Typography>
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 8px 24px rgba(91, 110, 245, 0.12)', border: '1px solid rgba(91, 110, 245, 0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                Thông tin liên hệ
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Tên đăng nhập"
                    fullWidth
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'Roboto, sans-serif',
                        '& fieldset': { borderColor: 'rgba(108, 118, 246, 0.2)' },
                      },
                      '& .MuiInputLabel-root': { fontFamily: 'Roboto, sans-serif' }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Họ và tên"
                    fullWidth
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'Roboto, sans-serif',
                        '& fieldset': { borderColor: 'rgba(108, 118, 246, 0.2)' },
                      },
                      '& .MuiInputLabel-root': { fontFamily: 'Roboto, sans-serif' }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Số điện thoại"
                    fullWidth
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'Roboto, sans-serif',
                        '& fieldset': { borderColor: 'rgba(108, 118, 246, 0.2)' },
                      },
                      '& .MuiInputLabel-root': { fontFamily: 'Roboto, sans-serif' }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Email"
                    fullWidth
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'Roboto, sans-serif',
                        '& fieldset': { borderColor: 'rgba(108, 118, 246, 0.2)' },
                      },
                      '& .MuiInputLabel-root': { fontFamily: 'Roboto, sans-serif' }
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Địa chỉ"
                    fullWidth
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    disabled={!isEditing}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        fontFamily: 'Roboto, sans-serif',
                        '& fieldset': { borderColor: 'rgba(108, 118, 246, 0.2)' },
                      },
                      '& .MuiInputLabel-root': { fontFamily: 'Roboto, sans-serif' }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: '#1A202C', fontFamily: 'Roboto, sans-serif' }}>
                Tài khoản
              </Typography>
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                  <strong style={{ color: '#1A202C' }}>Tên đăng nhập:</strong> {profile?.username}
                </Typography>
                <Box>
                  <Chip 
                    label={profile?.role}
                    sx={{
                      backgroundColor: roleBg(profile?.role),
                      color: roleColor(profile?.role),
                      fontWeight: 700,
                      fontFamily: 'Roboto, sans-serif',
                    }}
                  />
                  <Chip 
                    label={profile?.status}
                    sx={{
                      ml: 1,
                      backgroundColor: statusBg(profile?.status),
                      color: statusColor(profile?.status),
                      fontWeight: 700,
                      fontFamily: 'Roboto, sans-serif',
                    }}
                  />
                </Box>
                <Divider sx={{ my: 1, borderColor: 'rgba(108, 118, 246, 0.1)' }} />
                <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#718096' }}>
                  <strong style={{ color: '#1A202C' }}>Số điện thoại:</strong> {profile?.phone || '-'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Bottom actions */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
        {!isEditing ? (
          <Button
            variant="contained"
            onClick={() => setIsEditing(true)}
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
            Chỉnh sửa thông tin
          </Button>
        ) : (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              onClick={() => setIsEditing(false)}
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
              onClick={handleSave} 
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
              Lưu thay đổi
            </Button>
          </Box>
        )}
      </Box>

      <SnackbarAlert
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </Box>
  );
};

export default UserProfile;
