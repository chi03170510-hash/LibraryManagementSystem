import React, { createContext, useContext, useState } from "react";
import { staffTransactionApi } from "../../api";
// =======================
// 1️⃣ Định nghĩa kiểu dữ liệu
// =======================
export interface TransactionDetail {
  bookTitle: string;
  conditionNote: string;
  status: "BORROWED" | "RETURNED";
}

export interface Transaction {
  id: number;
  borrowDate: number[]; // [YYYY, MM, DD, HH, mm, ss, ms?]
  dueDate: number[];
  returnDate: number[] | null;
  fineAmount: number | null;
  note?: string;
  status: "BORROWED" | "RETURNED";
  readerName: string;
  staffName: string;
  details: TransactionDetail[];
}

interface TransactionDetailRequest {
  bookId: number;
  conditionNote: string;
}

interface TransactionRequest {
  readerId: number;
  transactionDetails: TransactionDetailRequest[];
  note?: string;
  dueDate: string; // ISO format
}

interface TransactionContextType {
  transaction: Transaction[]; // For staff (singular naming)
  transactions: Transaction[]; // For reader (plural naming) - alias of transaction
  createTransaction: (data: TransactionRequest) => Promise<void>;
  returnTransaction: (id: number) => Promise<void>; 
  loading: boolean;
  error: string | null;
  fetchTransactionHistory: () => Promise<void>;
  calcFineDays: (t: Transaction) => number;
}

// =======================
// 2️⃣ Tạo Context
// =======================
const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined
);

// =======================
// 3️⃣ Provider
// =======================
export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 🟢 Gọi API lấy toàn bộ lịch sử giao dịch
  const fetchTransactionHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch borrowed transactions for staff view
      const res = await staffTransactionApi.getBorrowedTransactions();
      setTransaction(res as any); // API trả về mảng
    } catch (err: any) {
      console.error("❌ Lỗi khi tải lịch sử giao dịch:", err);
      setError(err.message || "Không thể tải dữ liệu giao dịch");
    } finally {
      setLoading(false);
    }
  };

  // 🧮 Tính số ngày phạt (nếu trả trễ)
  const calcFineDays = (t: Transaction): number => {
    if (!t.returnDate) return 0;

    const due = new Date(
      t.dueDate[0],
      (t.dueDate[1] || 1) - 1,
      t.dueDate[2] || 1
    );
    const returned = new Date(
      t.returnDate[0],
      (t.returnDate[1] || 1) - 1,
      t.returnDate[2] || 1
    );

    const diffMs = returned.getTime() - due.getTime();
    const daysLate = Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 0);
    return daysLate;
  };

  // 🟣 Tạo giao dịch mới
  const createTransaction = async (data: TransactionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await staffTransactionApi.createTransaction(data as any);
      console.log("✅ Giao dịch mượn đã tạo thành công:", res);
      await fetchTransactionHistory(); // refresh lại danh sách sau khi tạo
    } catch (err: any) {
      console.error("❌ Lỗi khi tạo giao dịch:", err);
      setError(err.response?.data || err.message);
      alert("❌ Không thể tạo giao dịch!");
    } finally {
      setLoading(false);
    }
  };

  const returnTransaction = async (id: number) => {
  setLoading(true);
  setError(null);
  try {
    const res = await staffTransactionApi.returnTransaction(id);
    console.log("✅ Trả lại sách đã mượn thành công", res);
    await fetchTransactionHistory(); // refresh lại danh sách
  } catch (err: any) {
    console.error("❌ Lỗi khi trả lại sách:", err);
    setError(err.response?.data || err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <TransactionContext.Provider
      value={{
        transaction,
        transactions: transaction, // Alias for reader components
        createTransaction,
        returnTransaction,
        loading,
        error,
        fetchTransactionHistory,
        calcFineDays,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// =======================
// 4️⃣ Custom hook
// =======================
export const useTransaction = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx)
    throw new Error("useTransaction must be used inside TransactionProvider");
  return ctx;
};

// Alias for consistency (some components use plural)
export const useTransactions = useTransaction;
