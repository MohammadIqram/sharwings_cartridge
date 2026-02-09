"use client";

import { useEffect, ReactNode } from "react";
import { useUserStore } from "../../../stores/useUserStore"; // adjust path if needed

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuth } = useUserStore();

  useEffect(() => {
    checkAuth(); // Check auth status on mount
  }, []);

  return <>{children}</>;
}
