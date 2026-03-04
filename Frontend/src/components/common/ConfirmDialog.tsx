import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';

export interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message?: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  confirmColor?: 'primary' | 'error' | 'inherit' | 'secondary' | 'success' | 'info' | 'warning';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Xác nhận',
  message = 'Bạn có chắc chắn muốn thực hiện thao tác này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  onClose,
  onConfirm,
  confirmColor = 'error',
}) => {
  const [submitting, setSubmitting] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirm();
    } finally {
      setSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { borderRadius: 3, overflow: 'hidden' } }}
    >
      <DialogTitle sx={{
        fontWeight: 700,
        color: '#1A202C',
        fontFamily: 'Roboto, sans-serif',
        borderBottom: '1px solid rgba(108, 118, 246, 0.1)',
      }}>
        {title}
      </DialogTitle>
      <DialogContent>
        {typeof message === 'string' ? (
          <Typography sx={{ fontFamily: 'Roboto, sans-serif', color: '#4A5568' }}>{message}</Typography>
        ) : (
          <Box>{message}</Box>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: '1px solid rgba(108, 118, 246, 0.1)' }}>
        <Button
          onClick={onClose}
          variant="contained"
          disabled={submitting}
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
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={submitting}
          color={confirmColor}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontFamily: 'Roboto, sans-serif',
            ...(confirmColor === 'error' && {
              background: 'linear-gradient(135deg, #F56565 0%, #E53E3E 100%)',
              '&:hover': { background: 'linear-gradient(135deg, #E53E3E 0%, #C53030 100%)' },
              color: '#fff',
            })
          }}
        >
          {submitting ? 'Đang xử lý...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
