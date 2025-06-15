import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthService } from "@/src/services/auth.service";
import { User } from "@/src/data/types";
import { TokenStorage } from "@/src/lib/token-storage";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Add timeout to prevent stuck loading
    const timeout = setTimeout(() => {
      console.log("AuthContext: Timeout reached, setting loading to false");
      setIsLoading(false);
      setUser(null);
    }, 5000); // 5 second timeout

    checkAuthState().finally(() => {
      clearTimeout(timeout);
    });

    return () => clearTimeout(timeout);
  }, []);

  const checkAuthState = async () => {
    console.log("AuthContext: Checking auth state...");
    try {
      const tokens = await TokenStorage.getTokens();
      const isAuth = !!tokens;
      console.log("AuthContext: isAuthenticated =", isAuth);

      if (isAuth) {
        const currentUser = await TokenStorage.getUser();
        console.log("AuthContext: currentUser =", currentUser);
        setUser(currentUser);
      } else {
        console.log("AuthContext: No auth token found");
        setUser(null);
      }
    } catch (error) {
      console.error("AuthContext: Check auth state error:", error);
      setUser(null);
    } finally {
      console.log("AuthContext: Setting loading to false");
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // Note: turnstileToken cần được implement từ UI
    await AuthService.login(email, password, ""); // Empty turnstile for now
    const profile = await AuthService.getUserProfile();
    await TokenStorage.setUser(profile);
    setUser(profile);
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    // Note: turnstileToken cần được implement từ UI
    await AuthService.register(firstName, lastName, email, password, ""); // Empty turnstile for now
  };

  const logout = async () => {
    AuthService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const profile = await AuthService.getUserProfile();
      await TokenStorage.setUser(profile);
      setUser(profile);
    } catch (error) {
      console.error("Refresh user error:", error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
