"use client";

import { createContext, useState, useEffect, useCallback, ReactNode } from "react";

interface AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("bloomnext_user");
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to access localStorage", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback((username: string) => {
    try {
      localStorage.setItem("bloomnext_user", username);
      setUser(username);
    } catch (error) {
      console.error("Failed to access localStorage", error);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem("bloomnext_user");
      setUser(null);
    } catch (error) {
      console.error("Failed to access localStorage", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
