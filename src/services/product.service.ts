import { apiClient } from "@/src/lib/instance";

// Types/Interfaces
export interface Product {
  _id: string;
  name: string;
  brand: string;
  imageUrl?: string;
  shopeeUrl?: string;
  isActive?: boolean;
  description?: string;
  price?: number;
  categories?: string[];
  benefits?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductDto {
  name: string;
  brand: string;
  imageUrl?: string;
  shopeeUrl?: string;
  isActive?: boolean;
  description?: string;
  price?: number;
  categories?: string[];
  benefits?: string[];
}

export interface UpdateProductDto {
  name?: string;
  brand?: string;
  imageUrl?: string;
  shopeeUrl?: string;
  isActive?: boolean;
  description?: string;
  price?: number;
  categories?: string[];
  benefits?: string[];
}

export class ProductService {
  private readonly baseUrl = "/products";

  /**
   * Tạo sản phẩm mới
   */
  async createProduct(data: CreateProductDto): Promise<Product> {
    const response = await apiClient.post<Product>(this.baseUrl, data);
    return response.data;
  }

  /**
   * Lấy tất cả sản phẩm
   */
  async getAllProducts(): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(this.baseUrl);
    return response.data;
  }

  /**
   * Lấy sản phẩm theo thương hiệu
   */
  async getProductsByBrand(brand: string): Promise<Product[]> {
    const response = await apiClient.get<Product[]>(
      `${this.baseUrl}/brand/${encodeURIComponent(brand)}`
    );
    return response.data;
  }

  /**
   * Lấy sản phẩm theo ID
   */
  async getProductById(id: string): Promise<Product> {
    const response = await apiClient.get<Product>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  /**
   * Cập nhật sản phẩm
   */
  async updateProduct(id: string, data: UpdateProductDto): Promise<Product> {
    const response = await apiClient.patch<Product>(
      `${this.baseUrl}/${id}`,
      data
    );
    return response.data;
  }

  /**
   * Xóa sản phẩm
   */
  async deleteProduct(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`);
  }

  /**
   * Lọc sản phẩm theo nhiều điều kiện
   */
  async filterProducts(filters: {
    brand?: string;
    categories?: string[];
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
  }): Promise<Product[]> {
    const products = await this.getAllProducts();

    return products.filter((product) => {
      if (filters.brand && product.brand !== filters.brand) {
        return false;
      }

      if (filters.categories && filters.categories.length > 0) {
        const hasMatchingCategory = filters.categories.some((cat) =>
          product.categories?.includes(cat)
        );
        if (!hasMatchingCategory) return false;
      }

      if (
        filters.minPrice &&
        product.price &&
        product.price < filters.minPrice
      ) {
        return false;
      }

      if (
        filters.maxPrice &&
        product.price &&
        product.price > filters.maxPrice
      ) {
        return false;
      }

      if (
        filters.isActive !== undefined &&
        product.isActive !== filters.isActive
      ) {
        return false;
      }

      return true;
    });
  }

  /**
   * Tìm kiếm sản phẩm theo tên
   */
  async searchProducts(query: string): Promise<Product[]> {
    const products = await this.getAllProducts();
    const searchTerm = query.toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Lấy các thương hiệu có sẵn
   */
  async getAvailableBrands(): Promise<string[]> {
    const products = await this.getAllProducts();
    const brands = [...new Set(products.map((product) => product.brand))];
    return brands.sort();
  }

  /**
   * Lấy các danh mục có sẵn
   */
  async getAvailableCategories(): Promise<string[]> {
    const products = await this.getAllProducts();
    const categories = new Set<string>();

    products.forEach((product) => {
      product.categories?.forEach((category) => categories.add(category));
    });

    return Array.from(categories).sort();
  }
}

// Export instance để sử dụng
export const productService = new ProductService();
