import { ImagePickerAsset } from "expo-image-picker";
import { TokenStorage } from "../lib/token-storage";

export interface FileResponse {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export class FileService {
  private readonly baseUrl = "/files";
  private readonly baseApiUrl = "https://stepnavilabs-broglow-production.up.railway.app/api";

  /**
   * Tải lên một tệp tin từ React Native - phiên bản hoạt động
   */
  async uploadFromReactNative(asset: ImagePickerAsset) : Promise<string> {
    try {
      const tokens = await TokenStorage.getTokens();
      
      if (!tokens?.token) {
        throw new Error("No authentication token found");
      }

      const formData = new FormData();
      const fileName = asset.fileName || `mobile-upload-${Date.now()}.jpg`;
      
      // Tạo file object theo cấu trúc React Native - ĐÚNG CÁCH
      const fileData = {
        uri: asset.uri,
        name: fileName,
        type: asset.mimeType || 'image/jpeg',
      };

      console.log("Uploading file:", fileData);
      
      // Sử dụng chính xác tên field 'file' như trong curl
      formData.append('file', fileData as any);

      const response = await fetch(`${this.baseApiUrl}${this.baseUrl}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.token}`,
          'Accept': 'application/json',
          // QUAN TRỌNG: Không set Content-Type, để fetch tự động set với boundary
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed response:", errorText);
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log("Upload successful:", responseData);
      return `https://stepnavilabs-broglow-production.up.railway.app/${responseData.path}`;

    } catch (error) {
      console.error("Upload failed in FileService:", error);
      throw error;
    }
  }

  /**
   * Phiên bản backup sử dụng XMLHttpRequest (nếu fetch không hoạt động)
   */
  async uploadFromReactNativeXHR(asset: ImagePickerAsset): Promise<FileResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      TokenStorage.getTokens().then(tokens => {
        if (!tokens?.token) {
          reject(new Error("No authentication token found"));
          return;
        }

        const formData = new FormData();
        const fileName = asset.fileName || `mobile-upload-${Date.now()}.jpg`;
        
        const fileData = {
          uri: asset.uri,
          name: fileName,
          type: asset.mimeType || 'image/jpeg',
        };

        console.log("Uploading file via XHR:", fileData);
        formData.append('file', fileData as any);

        xhr.open('POST', `${this.baseApiUrl}${this.baseUrl}/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${tokens.token}`);
        xhr.setRequestHeader('Accept', 'application/json');
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              console.log("XHR Upload successful:", response);
              resolve(response as FileResponse);
            } catch (error) {
              console.error("XHR Parse error:", error);
              reject(new Error('Invalid response format'));
            }
          } else {
            console.error("XHR Upload failed:", xhr.responseText);
            reject(new Error(`Upload failed: ${xhr.status} - ${xhr.responseText}`));
          }
        };

        xhr.onerror = () => {
          console.error("XHR Network error");
          reject(new Error('Network error during upload'));
        };

        xhr.send(formData);
      }).catch(reject);
    });
  }

  /**
   * Tải lên với theo dõi tiến trình
   */
  async uploadWithProgress(
    asset: ImagePickerAsset, 
    onProgress?: (progress: number) => void
  ): Promise<FileResponse> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      TokenStorage.getTokens().then(tokens => {
        if (!tokens?.token) {
          reject(new Error("No authentication token found"));
          return;
        }

        const formData = new FormData();
        const fileName = asset.fileName || `mobile-upload-${Date.now()}.jpg`;
        
        const fileData = {
          uri: asset.uri,
          name: fileName,
          type: asset.mimeType || 'image/jpeg',
        };

        formData.append('file', fileData as any);

        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(Math.round(progress));
          }
        });

        xhr.open('POST', `${this.baseApiUrl}${this.baseUrl}/upload`);
        xhr.setRequestHeader('Authorization', `Bearer ${tokens.token}`);
        xhr.setRequestHeader('Accept', 'application/json');
        
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response as FileResponse);
            } catch (error) {
              reject(new Error('Invalid response format'));
            }
          } else {
            reject(new Error(`Upload failed: ${xhr.status} - ${xhr.responseText}`));
          }
        };

        xhr.onerror = () => {
          reject(new Error('Network error during upload'));
        };

        xhr.send(formData);
      }).catch(reject);
    });
  }

  /**
   * Validate file trước khi upload
   */
  validateFile(asset: ImagePickerAsset): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (asset.fileSize && asset.fileSize > maxSize) {
      return { isValid: false, error: 'File size too large (max 10MB)' };
    }

    if (asset.mimeType && !allowedTypes.includes(asset.mimeType)) {
      return { isValid: false, error: 'File type not supported' };
    }

    return { isValid: true };
  }

  /**
   * Debug method để kiểm tra FormData
   */
  debugFormData(formData: FormData) {
    console.log("=== FormData Debug ===");
    // Note: Trong React Native, có thể không thể iterate FormData
    // Nhưng chúng ta có thể log các giá trị đã append
    console.log("FormData created successfully");
  }
}

// Export instance để sử dụng trong toàn bộ ứng dụng
export const fileService = new FileService();