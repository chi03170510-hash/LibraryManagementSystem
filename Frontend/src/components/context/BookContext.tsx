import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { publicBooksApi, staffBooksApi } from "../../api";
import { toDriveImageUrl, toDrivePdfPreviewUrl, toDriveThumbnailUrl } from "../../utils/driveLinks";

// UI-facing book shape used across components
export interface Book {
  id: number;
  title: string;
  author: string;
  // description?: string;
  category: string;
  // rating?: number;
  publishYear?: number;
  status?: string;
  quantity: number;
  pdfUrl?: string | null;
  coverPhotoUrl?: string | null;
}

export interface BookCreate {
  id: number;
  title: string;
  author_id: number;
  category_id: number;
  publish_id: number;
  publishYear: number;
  quantity: number;
  status: string;
  pdfUrl?: string | null;
  coverPhotoUrl?: string | null;
}

interface BookContextType {
  books: Book[];
  loading: boolean;
  error: string | null;
  fetchBookById: (id: number) => Promise<Book | null>;
  refreshBooks: () => Promise<void>;
  addBook: (book: Omit<BookCreate, "id">) => Promise<void>;
  updateBook: (id: number, data: Partial<BookCreate>) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  //Goi api de lay tat ca sach
  const fetchBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await publicBooksApi.searchBooks({ page: 0, size: 1000 } as any);
      // Support both array and paginated shape { items, totalItems, ... }
      const items: any[] = Array.isArray(res) ? (res as any[]) : ((res as any)?.items ?? []);
      // Map API book shape to UI book shape safely
      const mapped = items.map((b: any) => ({
        id: b.id,
        title: b.title,
        author: typeof b.author === 'string' ? b.author : (b.author?.name ?? ''),
        category: typeof b.category === 'string' ? b.category : (b.category?.name ?? ''),
        publishYear: b.publishedYear ?? b.publishYear,
        status: b.status ?? undefined,
        quantity: b.quantity ?? b.availableQuantity ?? 0,
  pdfUrl: toDrivePdfPreviewUrl(b.pdfUrl ?? null),
  coverPhotoUrl: toDriveThumbnailUrl(b.coverPhotoUrl ?? b.coverImage ?? null, 256) || toDriveImageUrl(b.coverPhotoUrl ?? b.coverImage ?? null),
      })) as Book[];
      setBooks(mapped);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách sách");
    } finally {
      setLoading(false);
    }
  }, []);

  //goi api lay 1 sach theo id
  const fetchBookById = useCallback(async (id: number): Promise<Book | null> => {
    try {
      const b: any = await publicBooksApi.getBookById(id);
      const mapped: Book = {
        id: b.id,
        title: b.title,
        author: typeof b.author === 'string' ? b.author : (b.author?.name ?? ''),
        category: typeof b.category === 'string' ? b.category : (b.category?.name ?? ''),
        publishYear: b.publishedYear ?? b.publishYear,
        status: b.status ?? undefined,
        quantity: b.quantity ?? b.availableQuantity ?? 0,
  pdfUrl: toDrivePdfPreviewUrl(b.pdfUrl ?? null),
  coverPhotoUrl: toDriveThumbnailUrl(b.coverPhotoUrl ?? b.coverImage ?? null, 512) || toDriveImageUrl(b.coverPhotoUrl ?? b.coverImage ?? null),
      };
      return mapped;
    } catch (err) {
      console.error("❌ Không thể lấy sách theo ID:", err);
      return null;
    }
  }, []);


  // fetch thong tin all sach
  // ❌ REMOVED: Auto-fetch on mount causes slow initial load
  // useEffect(() => {
  //   fetchBooks();
  // }, []);

  // ✅ Instead: Components should call refreshBooks() when needed


  const addBook = useCallback(async (book: Omit<BookCreate, "id">) => {
    try {
      const res = await staffBooksApi.createBook(book as any);
      setBooks((prev) => [...prev, res as any]);
    } catch(err) {
      console.error("Add error:", err);
      alert("Không thể thêm sách (có thể bạn chưa có quyền)");
    }
  }, []);

  const updateBook = useCallback(async (id: number, data: Partial<BookCreate>) => {
    try {
      const res = await staffBooksApi.updateBook(id, data as any);
      setBooks((prev) => 
        prev.map((b) => (b.id === id ? {...b, ...res as any} : b))
      );
    } catch(err) {
      console.error("Update error:", err);
      alert("Không thể cập nhật sách (có thể bạn chưa có quyền");
    }
  }, []);

  const deleteBook = useCallback(async (id: number) => {
    try {
      await staffBooksApi.deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id != id));
    } catch (err){
      console.error("Delete error:", err);
      alert("Không thể xóa sách (có thể bạn chưa có quyền");
    }
  }, []);

  // Memoize context value to avoid unnecessary re-renders of consumers
  const value = useMemo(() => ({
    books,
    loading,
    error,
    refreshBooks: fetchBooks,
    fetchBookById,
    addBook,
    updateBook,
    deleteBook,
  }), [books, loading, error, fetchBooks, fetchBookById, addBook, updateBook, deleteBook]);

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};

//hook dung trong component khac
export const useBooks = () => {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error("useBooks must be used inside BookProvider");
  return ctx;
};
