import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { staffFinesApi } from "../../api";

export interface Fine {
  id: number;
  amount: number;
  transactionId: number;
  issuedDate: number[]; // [YYYY, MM, DD, HH, mm]
  paidDate: number[] | null;
  reason: string;
  paidStatus: "PAID" | "UNPAID";
}

export type FineCreate = Omit<Fine, "id">;

interface FineContextType {
  fines: Fine[];
  loading: boolean;
  error: string | null;
  refreshFines: () => Promise<void>;
  addFine: (data: FineCreate) => Promise<void>;
  updateFine: (id: number, data: Partial<FineCreate>) => Promise<void>;
  deleteFine: (id: number) => Promise<void>;
  markFineAsPaid: (id: number) => Promise<void>
}

const FineContext = createContext<FineContextType | undefined>(undefined);

export const FineProvider = ({ children }: { children: ReactNode }) => {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFines = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await staffFinesApi.getAllFines();
      setFines(res as any);
    } catch (err: any) {
      console.error("Lỗi khi tải fines:", err);
      setError("Không thể tải danh sách tiền phạt.");
    } finally {
      setLoading(false);
    }
  };

  const addFine = async (data: FineCreate) => {
    try {
      await staffFinesApi.createFine(data as any);
      await fetchFines();
    } catch (err) {
      console.error("Lỗi khi thêm fine:", err);
    }
  };

  const updateFine = async (id: number, data: Partial<FineCreate>) => {
    try {
      await staffFinesApi.updateFine(id, data as any);
      await fetchFines();
    } catch (err) {
      console.error("Lỗi khi cập nhật fine:", err);
    }
  };

  const deleteFine = async (id: number) => {
    try {
      await staffFinesApi.deleteFine(id);
      await fetchFines();
    } catch (err) {
      console.error("Lỗi khi xóa fine:", err);
    }
  };

  const refreshFines = async () => {
    await fetchFines();
  };

  const markFineAsPaid = async (fineId: number) => {
    try {
      await staffFinesApi.markAsPaid(fineId);
      setFines((prev) =>
        prev.map((fine) =>
          fine.id === fineId ? { ...fine, paidStatus: "PAID" as const } : fine
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
    }
  };


  useEffect(() => {
    fetchFines();
  }, []);

  return (
    <FineContext.Provider
      value={{ fines, loading, error, refreshFines, addFine, updateFine, deleteFine, markFineAsPaid }}
    >
      {children}
    </FineContext.Provider>
  );
};

export const useFines = (): FineContextType => {
  const context = useContext(FineContext);
  if (!context) {
    throw new Error("useFines phải được dùng trong <FineProvider>");
  }
  return context;
};