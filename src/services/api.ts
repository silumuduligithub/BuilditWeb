import type {
  CategoryItem,
  Product,
  Retailer,
  RetailerProductOffer,
} from '../types';
import {
  mockCategories,
  mockProducts,
  mockRetailers,
  mockOffers,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api/v1';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('buildit_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('buildit_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('buildit_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.warn(`Fetch failed for ${endpoint}, using fallback mock data.`, error);
      throw error;
    }
  }

  // Health check
  async checkHealth(): Promise<{ status: string; service: string }> {
    try {
      return await this.request<{ status: string; service: string }>('/health');
    } catch {
      return { status: 'mock_mode', service: 'BuildKart Web Mock Engine' };
    }
  }

  // Categories
  async getCategories(): Promise<CategoryItem[]> {
    try {
      return await this.request<CategoryItem[]>('/categories/screen');
    } catch {
      return mockCategories;
    }
  }

  // Stores
  async getStores(): Promise<Retailer[]> {
    try {
      return await this.request<Retailer[]>('/stores');
    } catch {
      return mockRetailers;
    }
  }

  async getStoreById(id: string): Promise<Retailer | undefined> {
    try {
      return await this.request<Retailer>(`/stores/${id}`);
    } catch {
      return mockRetailers.find((r) => r.id === id);
    }
  }

  // Products & Offers
  async getProducts(): Promise<Product[]> {
    try {
      return await this.request<Product[]>('/products');
    } catch {
      return mockProducts;
    }
  }

  async getOffersForProduct(productId: string): Promise<RetailerProductOffer[]> {
    try {
      return await this.request<RetailerProductOffer[]>(`/products/${productId}/offers`);
    } catch {
      return mockOffers.filter((o) => o.productId === productId);
    }
  }

  // Search
  async search(query: string) {
    try {
      return await this.request(`/search?q=${encodeURIComponent(query)}`);
    } catch {
      const q = query.toLowerCase();
      const filteredProducts = mockProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
      const filteredStores = mockRetailers.filter(
        (r) => r.name.toLowerCase().includes(q) || r.address.toLowerCase().includes(q)
      );
      return { products: filteredProducts, stores: filteredStores };
    }
  }
}

export const api = new ApiService();
