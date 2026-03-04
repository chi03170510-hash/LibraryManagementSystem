import { useState, useMemo, useEffect } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
} from "@mui/material";
import {
  Search,
  BookmarkAdd,
  Person,
  CalendarToday,
  PictureAsPdf,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useBooks } from "./context/BookContext";

// ===================== STYLES =====================
const SearchContainer = styled(Box)({
  marginBottom: "32px",
  "& .MuiTextField-root": {
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      backgroundColor: "rgba(255,255,255,0.9)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      border: "1px solid rgba(255,255,255,0.8)",
      "&:hover": {
        boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
      },
      "&.Mui-focused": {
        boxShadow: "0 12px 32px rgba(102, 126, 234, 0.2)",
        borderColor: "#667eea",
      },
    },
  },
});

const BookCard = styled(Card)({
  borderRadius: "20px",
  boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
  border: "1px solid rgba(255,255,255,0.8)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  overflow: "hidden",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },
});

// ✅ Cập nhật phần ảnh bìa
const BookCover = styled("img")({
  width: "100%",
  height: "220px",
  objectFit: "cover",
  backgroundColor: "#f5f6fa",
  borderBottom: "1px solid #ecf0f1",
});

const BookContent = styled(CardContent)({
  padding: "20px",
  "&:last-child": {
    paddingBottom: "20px",
  },
});

const BookTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: "1.1rem",
  color: "#2c3e50",
  marginBottom: "8px",
  lineHeight: 1.3,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const BookAuthor = styled(Typography)({
  color: "#7f8c8d",
  fontSize: "0.9rem",
  marginBottom: "12px",
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

const BookQuantity = styled(Typography)({
  color: "#95a5a6",
  fontSize: "0.85rem",
  lineHeight: 1.4,
  marginBottom: "16px",
});

const BookMeta = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
});

const BorrowButton = styled(Button)({
  borderRadius: "12px",
  textTransform: "none",
  fontWeight: 600,
  padding: "8px 16px",
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)",
  "&:hover": {
    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
    boxShadow: "0 6px 16px rgba(102, 126, 234, 0.4)",
    transform: "translateY(-2px)",
  },
  "&:disabled": {
    background: "#bdc3c7",
    color: "#7f8c8d",
    boxShadow: "none",
  },
});

// ===================== COMPONENT =====================
const BooksPage = () => {
  const { books, loading, error, refreshBooks } = useBooks();
  const [searchTerm, setSearchTerm] = useState("");
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [selectedBook, setSelectedBook] = useState<any>(null);

  // Fetch books when component mounts
  useEffect(() => {
    refreshBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  const handleOpenBookInfoDialog = (book: any) => {
    setSelectedBook(book);
    setOpenInfoDialog(true);
  };

  const handleCloseBookinfoDialog = () => {
    setSelectedBook(null);
    setOpenInfoDialog(false);
  };

  if (loading) return <Typography>Đang tải dữ liệu...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      {/* Tìm kiếm */}
      <SearchContainer>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Tìm kiếm sách theo tên, tác giả hoặc thể loại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "#667eea" }} />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>

      {/* Danh sách sách */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {filteredBooks.map((book) => (
          <BookCard key={book.id}>
            {/* ✅ Ảnh bìa sách */}
            <BookCover
              src={book.coverPhotoUrl || "/no-cover.jpg"}
              alt={book.title}
              onClick={() => handleOpenBookInfoDialog(book)}
            />

            <BookContent>
              <BookTitle variant="h6">{book.title}</BookTitle>
              <BookAuthor>
                <Person sx={{ fontSize: "1rem" }} /> {book.author}
              </BookAuthor>

              <BookQuantity>
                <strong>Số lượng:</strong> {book.quantity}
              </BookQuantity>

              <BookMeta>
                <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <CalendarToday sx={{ fontSize: "0.9rem", color: "#95a5a6" }} />
                  <Typography sx={{ fontSize: "0.8rem", color: "#95a5a6" }}>
                    {book.publishYear || "Không rõ"}
                  </Typography>
                </Box>
              </BookMeta>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Chip
                  label={book.category}
                  size="small"
                  sx={{
                    backgroundColor: "rgba(102, 126, 234, 0.1)",
                    color: "#667eea",
                    fontWeight: 600,
                    borderRadius: "8px",
                  }}
                />
                <Chip
                  label={book.status === "AVAILABLE" ? "Có sẵn" : "Hết"}
                  size="small"
                  sx={{
                    backgroundColor:
                      book.status === "AVAILABLE"
                        ? "rgba(46, 204, 113, 0.1)"
                        : "rgba(231, 76, 60, 0.1)",
                    color:
                      book.status === "AVAILABLE" ? "#27ae60" : "#e74c3c",
                    fontWeight: 600,
                    borderRadius: "8px",
                  }}
                />
              </Box>

              <BorrowButton
                fullWidth
                variant="contained"
                onClick={() => handleOpenBookInfoDialog(book)}
                startIcon={<BookmarkAdd />}
              >
                Xem thông tin
              </BorrowButton>
            </BookContent>
          </BookCard>
        ))}
      </Box>

      {/* ===================== DIALOG ===================== */}
      <Dialog
        open={openInfoDialog}
        onClose={handleCloseBookinfoDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>📘 Thông tin sách</DialogTitle>

        <DialogContent dividers>
          {selectedBook && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* ✅ Ảnh bìa */}
              <img
                src={selectedBook.coverPhotoUrl || "/no-cover.jpg"}
                alt={selectedBook.title}
                style={{
                  width: "100%",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "12px",
                  marginBottom: "16px",
                }}
              />

              <Typography>
                <strong>Tiêu đề:</strong> {selectedBook.title}
              </Typography>
              <Typography>
                <strong>Tác giả:</strong> {selectedBook.author}
              </Typography>
              <Typography>
                <strong>Thể loại:</strong> {selectedBook.category}
              </Typography>
              <Typography>
                <strong>Năm xuất bản:</strong>{" "}
                {selectedBook.publishYear || "Không rõ"}
              </Typography>
              <Typography>
                <strong>Số lượng:</strong> {selectedBook.quantity}
              </Typography>
              <Typography>
                <strong>Trạng thái:</strong>{" "}
                <Chip
                  label={
                    selectedBook.status === "AVAILABLE" ? "Có sẵn" : "Hết"
                  }
                  sx={{
                    backgroundColor:
                      selectedBook.status === "AVAILABLE"
                        ? "rgba(46, 204, 113, 0.1)"
                        : "rgba(231, 76, 60, 0.1)",
                    color:
                      selectedBook.status === "AVAILABLE"
                        ? "#27ae60"
                        : "#e74c3c",
                    fontWeight: 600,
                    borderRadius: "8px",
                  }}
                />
              </Typography>

              {/* ✅ Nút xem PDF */}
              {selectedBook.pdfUrl && (
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<PictureAsPdf />}
                  sx={{ mt: 1, alignSelf: "flex-start" }}
                  onClick={() => window.open(selectedBook.pdfUrl, "_blank")}
                >
                  Xem PDF
                </Button>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseBookinfoDialog}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BooksPage;
