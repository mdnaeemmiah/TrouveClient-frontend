"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import baseApi from "@/src/api/baseApi";
import { ENDPOINTS } from "@/src/api/endPoints";

export type Role = "admin" | "customer" | "business";

export interface AuthUser {
  email: string;
  role: Role;
  name: string;
  isEmailVerified: boolean;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const USER_KEY = "user";
const TOKEN_KEY = "access_token";
const PROFILE_NAME_KEY = "profile_name";
const PROFILE_IMAGE_KEY = "profile_image";

function normalizeRole(role: unknown): Role {
  const value = String(role ?? "").toLowerCase();
  if (value === "admin" || value === "customer") return value;
  if (value === "business" || value === "business_owner") return "business";
  return "customer";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    baseApi
      .get(ENDPOINTS.getUserProfile)
      .then((response) => {
        const result = response.data?.data?.result ?? response.data?.data ?? response.data;
        const authUser: AuthUser = {
          email: result?.email,
          role: normalizeRole(result?.role),
          name: result?.fullName ?? result?.name ?? result?.email,
          isEmailVerified: Boolean(result?.isEmailVerified),
        };
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time session hydration on mount, not a state sync loop
        setUser(authUser);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(PROFILE_NAME_KEY);
        localStorage.removeItem(PROFILE_IMAGE_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const response = await baseApi.post(ENDPOINTS.login, { email, password });
    const result = response.data?.data?.result ?? response.data?.data ?? response.data;

    const accessToken: string | undefined = result?.accessToken;
    const rawUser = result?.user ?? result;
    const authUser: AuthUser = {
      email: rawUser?.email ?? email,
      role: normalizeRole(rawUser?.role),
      name: rawUser?.fullName ?? rawUser?.name ?? email,
      isEmailVerified: Boolean(rawUser?.isEmailVerified),
    };

    if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    localStorage.setItem(PROFILE_NAME_KEY, authUser.name);
    if (rawUser?.profileImage) localStorage.setItem(PROFILE_IMAGE_KEY, rawUser.profileImage);

    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    baseApi.post(ENDPOINTS.logout).catch(() => {});
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PROFILE_NAME_KEY);
    localStorage.removeItem(PROFILE_IMAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
