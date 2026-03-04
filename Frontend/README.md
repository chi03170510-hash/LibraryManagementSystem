# 📚 Library Management System - Frontend

Hệ thống quản lý thư viện được xây dựng với React + TypeScript + Vite + Material-UI

## 🚀 Công nghệ sử dụng

- **React 19** - UI Library
- **TypeScript** - Type safety
- **Vite 7** - Build tool & dev server
- **Material-UI (MUI)** - Component library
- **React Router DOM v7** - Routing
- **Axios** - HTTP client
- **Emotion** - CSS-in-JS
- **jsPDF & XLSX** - Export reports
- **Recharts** - Data visualization
- **React Icons** - Icons

## 📁 Cấu trúc dự án

```
src/
├── api/                    # API services
│   ├── authApi.ts         # Authentication
│   ├── publicBooksApi.ts  # Public books API
│   ├── profileApi.ts      # User profile
│   ├── transactionApi.ts  # Transactions
│   ├── commentApi.ts      # Comments
│   ├── notificationApi.ts # Notifications
│   ├── staffBooksApi.ts   # Staff: Books management
│   ├── staffTransactionApi.ts # Staff: Transactions
│   ├── staffUsersApi.ts   # Staff: Users management
│   ├── staffFinesApi.ts   # Staff: Fines management
│   ├── staffCategoriesApi.ts # Staff: Categories
│   ├── staffNotificationApi.ts # Staff: Send notifications
│   ├── staffCommentApi.ts # Staff: Comment management
│   └── README.md          # API documentation
├── types/
│   ├── api.types.ts       # API TypeScript types
│   └── images.d.ts        # Image type declarations
├── components/
│   ├── layout/            # Layout components
│   │   ├── Layout.tsx     # Main layout (Reader)
│   │   └── StaffLayout.tsx # Staff layout
│   ├── reader/            # Reader pages
│   │   ├── Dashboard.tsx
│   │   ├── Books.tsx
│   │   ├── Transactions.tsx
│   │   ├── Profile.tsx
│   │   ├── Notifications.tsx
│   │   └── Social.tsx
│   ├── StaffPages/        # Staff pages
│   │   ├── BookManagement.tsx
│   │   ├── StaffTransactions.tsx
│   │   ├── StaffUsers.tsx
│   │   ├── FineManagement.tsx
│   │   └── StaffNotifications.tsx
│   ├── Context/           # React Context (uppercase)
│   │   ├── BookContext.tsx
│   │   ├── UserContext.tsx
│   │   ├── TransactionContext.tsx
│   │   ├── SocialContext.tsx
│   │   └── FineContext.tsx
│   ├── context/           # React Context (lowercase)
│   │   ├── BookContext.tsx
│   │   ├── NotificationContext.tsx
│   │   ├── ProfileContext.tsx
│   │   └── TransactionContext.tsx
│   ├── Profile/
│   │   └── UserProfile.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Home.tsx
│   ├── BooksPage.tsx
│   └── BorrowHistoryPage.tsx
├── route/
│   └── privateRoute.tsx   # Protected route wrapper
└── assets/                # Static assets

```

## 🔐 Roles & Permissions

### 👤 READER (Người đọc)
- Xem danh sách sách
- Tìm kiếm sách
- Xem chi tiết sách
- Xem lịch sử mượn sách
- Bình luận và đánh giá sách
- Nhận thông báo
- Quản lý profile cá nhân

### 👨‍💼 STAFF (Nhân viên)
- Tất cả quyền của Reader
- Quản lý sách (CRUD)
- Quản lý giao dịch mượn/trả
- Xem danh sách quá hạn
- Quản lý người dùng (khóa/mở khóa)
- Quản lý phạt
- Gửi thông báo
- Xuất báo cáo (PDF, Excel)
- Quản lý thể loại sách

## 🛠️ Setup & Installation

### Prerequisites
- Node.js >= 18
- npm hoặc yarn

### Install
```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 API Configuration

Backend API: `https://library-be-g64g.onrender.com`

Proxy configuration trong `vite.config.ts`:
```typescript
server: {
  proxy: {
    '/api': {
      target: 'https://library-be-g64g.onrender.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

## 📖 API Services Documentation

Xem chi tiết tại [src/api/README.md](src/api/README.md)

### Quick Example

```typescript
import { authApi, publicBooksApi } from '@/api';

// Login
const response = await authApi.login({
  phone: "0123456789",
  password: "password"
});
sessionStorage.setItem("token", response.token);

// Search books
const books = await publicBooksApi.searchBooks({
  title: "Clean Code",
  page: 0,
  size: 10
});
```

## 🔑 Authentication

Authentication sử dụng JWT Token lưu trong `sessionStorage`.

### Login Flow
1. User nhập phone & password
2. Gọi API `/public/login`
3. Lưu token vào sessionStorage
4. Redirect đến trang chính
5. Token tự động thêm vào mọi request thông qua axios interceptor

### Protected Routes
```typescript
<Route path="/profile" element={
  <PrivateRoute>
    <Profile />
  </PrivateRoute>
} />
```

## 📱 Routes

### Public Routes
- `/login` - Đăng nhập
- `/register` - Đăng ký

### Reader Routes (Protected)
- `/` - Trang chủ
- `/books` - Danh sách sách
- `/history` - Lịch sử mượn
- `/reader/dashboard` - Dashboard
- `/reader/books` - Sách (reader view)
- `/reader/transactions` - Giao dịch
- `/reader/social` - Mạng xã hội
- `/reader/profile` - Profile
- `/reader/notifications` - Thông báo

### Staff Routes (Protected)
- `/staff/books` - Quản lý sách
- `/staff/booklists` - Danh sách sách
- `/staff/transactions` - Quản lý giao dịch
- `/staff/transactions/overdue` - Sách quá hạn
- `/staff/users` - Quản lý người dùng
- `/staff/fines` - Quản lý phạt
- `/staff/notifications` - Gửi thông báo
- `/staff/social` - Quản lý social

## 🎨 UI/UX Features

- ✨ Modern gradient design (Purple theme)
- 📱 Fully responsive (Mobile, Tablet, Desktop)
- 🎭 Smooth animations & transitions
- 🔔 Real-time notifications
- 📊 Interactive charts & statistics
- 📥 Export to PDF & Excel
- 🔍 Advanced search & filters
- 💬 Comments & ratings system
- 🏆 Streak tracking

## 🚀 Development

### Code Structure Guidelines

1. **API Services** - Tách biệt theo domain
2. **Types** - TypeScript types cho API responses
3. **Components** - Reusable components
4. **Context** - Global state management
5. **Routes** - Protected & public routes

### Best Practices

- ✅ TypeScript strict mode
- ✅ Error handling với try-catch
- ✅ Loading states
- ✅ Form validation
- ✅ Responsive design
- ✅ Clean code principles
- ✅ Component composition
- ✅ Custom hooks
- ✅ API service layer

## 📦 Build & Deploy

```bash
# Build
npm run build

# Output: dist/
```

Deploy `dist/` folder lên hosting platform:
- Vercel
- Netlify
- Render
- GitHub Pages

## 🐛 Troubleshooting

### CORS Issues
Đảm bảo proxy configuration trong `vite.config.ts` đúng.

### Authentication Issues
- Kiểm tra token trong sessionStorage
- Kiểm tra token còn hạn
- Xem Network tab trong DevTools

### API Errors
- Xem Console logs
- Kiểm tra Network requests
- Verify API endpoints

## 📝 License

This project is for educational purposes (BTL OOP - University project).

## 👥 Contributors

- Team members from BTL OOP course

## 📞 Support

For issues and questions, please create an issue in the repository.

---

**Happy Coding! 🎉**
