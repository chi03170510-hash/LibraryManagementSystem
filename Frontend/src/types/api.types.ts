// ============================================
// API Request & Response Types
// ============================================

// Common Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================
// Authentication Types
// ============================================
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  roleId: number;
  address?: string;
}

export interface AuthResponse {
  token: string;
  role: 'READER' | 'STAFF' | 'ADMIN';
  user?: User; // Optional because backend might not always return user object
}

// ============================================
// User Types
// ============================================
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: 'READER' | 'STAFF' | 'ADMIN';
  status: 'ACTIVE' | 'LOCKED';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  // Keep backward compatibility while supporting full update payload
  username?: string;
  phone?: string;
  email?: string;
  address?: string;
  fullName?: string;
  name?: string; // legacy alias for fullName
}

// ============================================
// Book Types
// ============================================
export interface Book {
  id: number;
  title: string;
  isbn: string;
  author: Author;
  publisher: Publisher;
  category: Category;
  publishedYear: number;
  quantity: number;
  availableQuantity: number;
  description?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookSearchQuery {
  title?: string;
  author?: string;
  category?: string;
  isbn?: string;
  page?: number;
  size?: number;
}

export interface CreateBookRequest {
  title: string;
  isbn: string;
  authorId: number;
  publisherId: number;
  categoryId: number;
  publishedYear: number;
  quantity: number;
  description?: string;
  coverImage?: string;
}

export interface UpdateBookRequest extends Partial<CreateBookRequest> {}

// ============================================
// Author & Publisher Types
// ============================================
export interface Author {
  id: number;
  name: string;
  bio?: string;
  createdAt: string;
}

export interface Publisher {
  id: number;
  name: string;
  address?: string;
  createdAt: string;
}

// ============================================
// Category Types
// ============================================
export interface Category {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {}

// ============================================
// Transaction Types
// ============================================
export interface Transaction {
  id: number;
  user: User;
  book: Book;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  userId: number;
  bookId: number;
  dueDate: string;
}

export interface TransactionHistory {
  transactions: Transaction[];
  total: number;
}

// ============================================
// Comment Types
// ============================================
export interface Comment {
  id: number;
  user: User;
  book: Book;
  content: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentRequest {
  bookId: number;
  // Backend for create expects field name `comment`
  comment: string;
  rating?: number;
}

export interface UpdateCommentRequest {
  content?: string;
  rating?: number;
}

// Public comment list shape (GET /public/comment/{bookId})
export interface PublicCommentItem {
  id: number;
  userName: string;
  comment: string;
  owner: boolean;
}

export interface PublicCommentList {
  items: PublicCommentItem[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// ============================================
// Notification Types
// ============================================
export interface Notification {
  id: number;
  userId: number;
  title: string;
  body: string;
  status: 'UNREAD' | 'READ';
  createdAt: string;
}

export interface SendNotificationRequest {
  // Hỗ trợ cả hai khóa để tương thích backend
  recipientId?: number; // preferred by backend
  userId?: number; // backward compatibility
  title: string;
  body: string;
}

// ============================================
// Fine Types
// ============================================
export interface Fine {
  id: number;
  transaction: Transaction;
  amount: number;
  reason: string;
  status: 'UNPAID' | 'PAID';
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFineRequest {
  transactionId: number;
  amount: number;
  reason: string;
}

export interface UpdateFineRequest {
  amount?: number;
  reason?: string;
}

export interface FineSearchQuery {
  status?: 'UNPAID' | 'PAID';
  page?: number;
  size?: number;
}
