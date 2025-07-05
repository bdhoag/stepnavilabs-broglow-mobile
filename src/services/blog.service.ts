import { apiClient } from "@/src/lib/instance";
import { TokenStorage } from "../lib/token-storage";

// =================================================================
// Các kiểu dữ liệu (Types/Interfaces) cho API /blogs
// =================================================================

// Interface cho đối tượng Tác giả
export interface Author {
  _id: string;
  email: string;
}

// Interface cho đối tượng Hình ảnh trong bài blog
export interface Image {
  _id: string;
  url: string;
  caption: string;
}

// Interface cho đối tượng Bình luận
export interface Comment {
  _id: string;
  author: Author;
  content: string;
  likes: number;
  likedBy: Author[];
  createdAt: string;
  updatedAt: string;
}

// Interface chính cho đối tượng Blog
export interface Blog {
  _id: string;
  title: string;
  content: string;
  author: Author;
  likedBy: Author[];
  likesCount: number;
  sharesCount: number;
  isActive: boolean;
  tags: string[];
  images: Image[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

// Interface cho thông tin phân trang
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Interface cho toàn bộ response từ API khi lấy danh sách blog
export interface PaginatedBlogResponse {
  data: Blog[];
  pagination: Pagination;
}


// =================================================================
// Service để tương tác với API /blogs
// =================================================================

export class BlogService {
  private readonly baseUrl = "/blogs";

  /**
   * Lấy danh sách các bài blog có phân trang.
   * @param page - Số trang hiện tại (mặc định là 1)
   * @param limit - Số lượng mục trên mỗi trang (mặc định là 10)
   * @returns Một Promise chứa đối tượng với dữ liệu blog và thông tin phân trang.
   */
  async getBlogs(page = 1, limit = 10): Promise<PaginatedBlogResponse> {
    const response = await apiClient.get<PaginatedBlogResponse>(
      `${this.baseUrl}?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  /**
   * Thích hoặc bỏ thích một bài blog theo ID.
   * @param blogId - ID của bài blog
   */
  async likeBlog(blogId: string): Promise<void> { // Changed to void as it likely returns no content
    const tokens = await TokenStorage.getTokens();
    
    // Corrected API call: The second argument is data (null here), the third is config.
    await apiClient.post(
        `${this.baseUrl}/${blogId}/like`,
        null, // No request body is needed for this action
        {
            headers: {
                Authorization: `Bearer ${tokens?.token}`,
            },
        }
    );
  }

  /**
   * Bỏ thích một bài blog theo ID.
   * @param blogId - ID của bài blog
   */
  async getBlogById(blogId: string): Promise<Blog> {
    const response = await apiClient.get<Blog>(`${this.baseUrl}/${blogId}`);
    return response.data;
  }
  

  /**
   * Thêm một bình luận vào bài blog.
   * @param blogId - ID của bài blog
   * @param content - Nội dung bình luận
   * @returns Promise chứa đối tượng bình luận vừa được tạo
   */
  async likeComment(blogId: string, commentId: string): Promise<void> {
    const tokens = await TokenStorage.getTokens();
    
    await apiClient.post(
        `${this.baseUrl}/${blogId}/comments/${commentId}/like`,
        null, // No request body is needed for this action
        {
            headers: {
                Authorization: `Bearer ${tokens?.token}`,
            },
        }
    );
  }

  /**
   * Thêm một bình luận vào bài blog.
   * @param blogId - ID của bài blog
   * @param content - Nội dung bình luận
   * @returns Promise chứa đối tượng bình luận vừa được tạo
   */
  async addComment(blogId: string, content: string): Promise<void> {
    const tokens = await TokenStorage.getTokens();
    
    await apiClient.post<Comment>(
      `${this.baseUrl}/${blogId}/comments`,
      { content },
      {
        headers: {
          Authorization: `Bearer ${tokens?.token}`,
        },
      }
    );
  }

  /**
   * Tăng lượt chia sẻ một bài blog.
   * @param blogId - ID của bài blog
   */
  async shareBlog(blogId: string): Promise<void> {
    const tokens = await TokenStorage.getTokens();
    
    await apiClient.post(
      `${this.baseUrl}/${blogId}/share`,
      null, // No request body is needed for this action
      {
        headers: {
          Authorization: `Bearer ${tokens?.token}`,
        },
      }
    );
  }
}

// Export instance để sử dụng trong toàn bộ ứng dụng
export const blogService = new BlogService();