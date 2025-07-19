import { useRouter } from "expo-router";
import React, { ReactNode, useEffect } from "react";
import { useAuth } from "../contexts/auth-context";
import LoadingScreen from "./loading-screen";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/onboarding");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || (!isAuthenticated && !fallback)) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
