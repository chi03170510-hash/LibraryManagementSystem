import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

interface BorrowRecord {
  id: number;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
}

const BorrowHistoryPage = () => {
  // Mock data - thay thế bằng dữ liệu thật sau
  const borrowRecords: BorrowRecord[] = [
    {
      id: 1,
      bookTitle: 'Clean Code',
      borrowDate: '2023-09-01',
      dueDate: '2023-09-15',
    },
    {
      id: 2,
      bookTitle: 'Design Patterns',
      borrowDate: '2023-08-25',
      dueDate: '2023-09-08',
    },
    // Thêm lịch sử mượn khác ở đây
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Lịch sử mượn sách
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>STT</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Tên sách</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ngày mượn</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Hạn trả</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {borrowRecords.map((record, index) => (
              <TableRow
                key={record.id}
                sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell>{record.bookTitle}</TableCell>
                <TableCell>{new Date(record.borrowDate).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>{new Date(record.dueDate).toLocaleDateString('vi-VN')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default BorrowHistoryPage;
