import { User } from "@/src/data/types";
import { apiClient } from "@/src/lib/instance";

export class AuthService {
  static async register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    turnstileToken: string
  ): Promise<{ success: boolean; message: string; email: string }> {
    const ip = await this.getClientIP();
    const response = await apiClient.register(
      firstName,
      lastName,
      email,
      password,
      turnstileToken,
      ip
    );
    return response;
  }

  static async verifyEmail(
    token: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.get<{ success: boolean; message: string }>(
      `/auth/verify-email?token=${token}`
    );
    return response.data;
  }

  static async login(
    email: string,
    password: string,
    turnstileToken: string
  ): Promise<{ token: string; refreshToken: string }> {
    const ip = await this.getClientIP();
    const tokens = await apiClient.login(email, password, turnstileToken, ip);
    return tokens;
  }

  static async sendOTP(email: string): Promise<void> {
    await apiClient.sendOTP(email);
  }
  static async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<void> {
    await apiClient.resetPassword(email, otp, newPassword);
  }

  static async redirectGoogleLogin(code: string): Promise<void> {
    await apiClient.getTokenByGoogleLogin(code);
  }

  static loginGoogle(): void {
    apiClient.loginGoogle();
  }

  static logout(): void {
    apiClient.logout();
  }

  static async getUserProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>("/auth/profile");
      return response.data;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  }

  private static async getClientIP(): Promise<string> {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error getting IP:", error);
      return "";
    }
  }
}
