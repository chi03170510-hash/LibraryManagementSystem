import React, { createContext, useContext, useEffect, useState } from "react";
import { profileApi } from "../../api";

export interface Profile {
  id: number;
  username: string;
  phone: string;
  email: string;
  password: string;
  address: string;
  fullName: string;
  role: string;
  status: string;
}

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await profileApi.getProfile();
      setProfile(res as any);
    } catch (err: any) {
      setError(err.message || "Không thể tải thông tin cá nhân");
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      const res = await profileApi.updateProfile(data);
      setProfile((prev) => prev ? { ...prev, ...res } : res as any);
    } catch (err) {
      alert("Không thể cập nhật thông tin cá nhân.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        refreshProfile: fetchProfile,
        updateProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside ProfileProvider");
  return ctx;
};