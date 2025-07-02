import { apiClient } from "@/src/lib/instance";

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
  
}

// Export instance để sử dụng trong toàn bộ ứng dụng
export const blogService = new BlogService();