import { apiClient } from "@/src/lib/instance";

// Types/Interfaces
export interface Notification {
    _id: string;
    userId: string;
    title: string;
    message: string;
    isRead?: boolean;
    type?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateNotificationDto {
    userId: string;
    title: string;
    message: string;
    isRead?: boolean;
    type?: string;
}

export interface UpdateNotificationDto {
    title?: string;
    message?: string;
    isRead?: boolean;
    type?: string;
}

export class NotificationService {
    private readonly baseUrl = "/notifications";

    /**
     * Tạo thông báo mới
     */

    async getAllNotifications(page = 1, limit = 10): Promise<Notification[]> {
        const response = await apiClient.get<any>(
            `${this.baseUrl}?page=${page}&limit=${limit}`,

        );
        const resData = response.data;
        if (Array.isArray(resData)) return resData;
        if (resData && Array.isArray(resData.data)) return resData.data;
        return [];
    }



}

// Export instance để sử dụng
export const notificationService = new NotificationService();