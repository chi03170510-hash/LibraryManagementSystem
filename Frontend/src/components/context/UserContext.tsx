import React, { createContext, useContext, useState } from "react";
import { staffUsersApi } from "../../api";

interface User {
  id: number,
  username: string,
  phone: string,
  email: string,
  password: string,
  address: string,
  fullName: string,
  role: string,
  status: string,
}

interface UserContextType {
  users: User[];
  loading: boolean;
  error: string | null;
  lockUserAccount: (id: number) => void;
  unlockUserAccount: (id: number) => void;
  fetchUserAccount: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);

  const fetchUserAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await staffUsersApi.getAllUsers();
      setUsers(res as any);
    } catch (err : any) {
      setError(err.message || "Không thể lấy được dữ liệu người dùng!");
    } finally{
      setLoading(false);
    }
  }
  
  const lockUserAccount = async (id: number) => {
    try {
      await staffUsersApi.lockUser(id);
      setUsers((prev) => 
        prev.map((u) => (u.id === id ? {...u, status: "ACTIVE"} : u))
      );
      fetchUserAccount();
    } catch (err: any){
      console.error("lỗi khi khóa tài khoản:", err.message);
      setError("không thể khóa tài khoản!");
    }
  }

  const unlockUserAccount = async (id: number) => {
    try {
      await staffUsersApi.unlockUser(id);
      setUsers((prev) => 
        prev.map((u) => (u.id === id ? {...u, status: "INACTIVE "} : u))
      );
      fetchUserAccount();
    } catch(err: any) {
      console.log("Lỗi khi mở khóa tài khoản:", err.message);
      setError("Không thể mở khóa tài khoản");
    }
  }

  return (
    <UserContext.Provider value={{ users, loading, error, lockUserAccount, unlockUserAccount, fetchUserAccount }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUsers must be used within UserProvider");
  return ctx;
};
