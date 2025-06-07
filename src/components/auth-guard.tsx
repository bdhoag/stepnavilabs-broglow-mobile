import React, { ReactNode } from "react";
import { useAuth } from "../../src/contexts/auth-context";
import LoadingScreen from "./loading-screen";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    // Return fallback instead of redirecting (let index.tsx handle redirect)
    return fallback || <LoadingScreen />;
  }

  return <>{children}</>;
}
