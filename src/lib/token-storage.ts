import { TokenPair } from "@/src/data/types";
import * as SecureStore from "expo-secure-store";

export class TokenStorage {
  private static ACCESS_TOKEN_KEY = "access_token";
  private static REFRESH_TOKEN_KEY = "refresh_token";
  private static USER_KEY = "user";

  static async getTokens(): Promise<TokenPair | null> {
    try {
      const token = await SecureStore.getItemAsync(this.ACCESS_TOKEN_KEY);
      const refreshToken = await SecureStore.getItemAsync(
        this.REFRESH_TOKEN_KEY
      );

      if (!token || !refreshToken) return null;

      return { token, refreshToken };
    } catch (error) {
      console.error("Error getting tokens:", error);
      return null;
    }
  }

  static async setTokens(tokens: TokenPair): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.ACCESS_TOKEN_KEY, tokens.token);
      await SecureStore.setItemAsync(
        this.REFRESH_TOKEN_KEY,
        tokens.refreshToken
      );
    } catch (error) {
      console.error("Error setting tokens:", error);
    }
  }

  static async clearTokens(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(this.REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(this.USER_KEY);
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  }

  static async getUser(): Promise<any | null> {
    try {
      const userString = await SecureStore.getItemAsync(this.USER_KEY);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error("Error getting user:", error);
      return null;
    }
  }

  static async setUser(user: any): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error setting user:", error);
    }
  }
}
