import type {
  CategoryItem,
  Product,
  Retailer,
  RetailerProductOffer,
  Order,
  UserRole,
} from '../types';
import {
  mapBackendProductToProduct,
  mapBackendCategoryToCategoryItem,
  mapBackendStoreToRetailer,
  mapBackendOfferToOffer,
  mapBackendOrderToOrder,
} from './mappers';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'https://builditbackend.onrender.com/api/v1';

class ApiService {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private isRefreshing = false;
  private refreshSubscribers: Array<(token: string | null) => void> = [];

  constructor() {
    try {
      this.token = typeof localStorage !== 'undefined' ? localStorage.getItem('buildit_token') : null;
      this.refreshToken = typeof localStorage !== 'undefined' ? localStorage.getItem('buildit_refresh_token') : null;
    } catch {
      this.token = null;
      this.refreshToken = null;
    }
  }

  setTokens(token: string | null, refreshToken?: string | null) {
    this.token = token;
    if (refreshToken !== undefined) {
      this.refreshToken = refreshToken;
    }
    try {
      if (token) {
        localStorage.setItem('buildit_token', token);
      } else {
        localStorage.removeItem('buildit_token');
      }
      if (this.refreshToken) {
        localStorage.setItem('buildit_refresh_token', this.refreshToken);
      } else if (refreshToken === null) {
        localStorage.removeItem('buildit_refresh_token');
      }
    } catch (e) {
      console.warn('Could not save tokens to localStorage', e);
    }
  }

  setToken(token: string) {
    this.setTokens(token);
  }

  getToken(): string | null {
    return this.token;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  clearToken() {
    this.token = null;
    this.refreshToken = null;
    try {
      localStorage.removeItem('buildit_token');
      localStorage.removeItem('buildit_refresh_token');
    } catch (e) {
      console.warn('Could not remove tokens from localStorage', e);
    }
  }

  private onRefreshed(token: string | null) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(cb: (token: string | null) => void) {
    this.refreshSubscribers.push(cb);
  }

  private async attemptTokenRefresh(): Promise<string | null> {
    if (!this.refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      const resJson = await response.json();
      if (response.ok && resJson?.data?.tokens?.access_token) {
        const newAccessToken = resJson.data.tokens.access_token;
        const newRefreshToken = resJson.data.tokens.refresh_token || this.refreshToken;
        this.setTokens(newAccessToken, newRefreshToken);
        return newAccessToken;
      } else if (response.status === 401 || response.status === 403) {
        this.clearToken();
        return null;
      }
      return null;
    } catch {
      return null;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      // Handle 401 with silent token refresh
      if (
        response.status === 401 &&
        !isRetry &&
        !endpoint.includes('/auth/login') &&
        !endpoint.includes('/auth/refresh')
      ) {
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          const newToken = await this.attemptTokenRefresh();
          this.isRefreshing = false;
          this.onRefreshed(newToken);

          if (newToken) {
            return this.request<T>(endpoint, options, true);
          }
        } else {
          return new Promise<T>((resolve, reject) => {
            this.addRefreshSubscriber((newToken) => {
              if (newToken) {
                this.request<T>(endpoint, options, true).then(resolve).catch(reject);
              } else {
                reject(new Error('Session expired. Please log in again.'));
              }
            });
          });
        }
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        const errorMsg = errJson?.message || `API Error: ${response.status} ${response.statusText}`;
        const error = new Error(errorMsg);
        (error as any).status = response.status;
        (error as any).data = errJson;
        throw error;
      }

      const data = await response.json();
      return data.data !== undefined ? data.data : data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // ========================================================
  // 1. HEALTH & SYSTEM
  // ========================================================
  async checkHealth(): Promise<{ status: string; service: string }> {
    return await this.request<{ status: string; service: string }>('/health');
  }

  // ========================================================
  // 2. AUTHENTICATION & USER MANAGEMENT
  // ========================================================
  async login(credentials: { identifier?: string; email?: string; phone?: string; password?: string; role?: UserRole }) {
    const payload = {
      identifier: credentials.identifier || credentials.phone || credentials.email,
      email: credentials.email,
      phone: credentials.phone,
      password: credentials.password,
      role: credentials.role || 'customer',
    };

    const data = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const token = data?.tokens?.access_token || data?.token || data?.access_token;
    const refreshToken = data?.tokens?.refresh_token || data?.refreshToken;
    if (token) {
      this.setTokens(token, refreshToken);
    }
    return { success: true, data };
  }

  async register(userData: {
    name: string;
    phone: string;
    email?: string;
    password?: string;
    role?: string;
    customer_type?: string;
    company_name?: string;
    gst_number?: string;
    store_name?: string;
    license_number?: string;
  }) {
    const data = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    const token = data?.tokens?.access_token || data?.token || data?.access_token;
    const refreshToken = data?.tokens?.refresh_token || data?.refreshToken;
    if (token) {
      this.setTokens(token, refreshToken);
    }
    return { success: true, data };
  }

  async sendOtp(phone: string) {
    return await this.request<any>('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ phone }),
    });
  }

  async verifyOtp(payload: { phone: string; otp: string; role?: string; customer_type?: string }) {
    const data = await this.request<any>('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const token = data?.tokens?.access_token || data?.token || data?.access_token;
    const refreshToken = data?.tokens?.refresh_token || data?.refreshToken;
    if (token) {
      this.setTokens(token, refreshToken);
    }
    return { success: true, data };
  }

  async getMe() {
    return await this.request<any>('/auth/me');
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch {}
    this.clearToken();
  }

  // ========================================================
  // 3. CATALOG & DISCOVERY (Live Dynamic Endpoints)
  // ========================================================
  async getCategories(): Promise<CategoryItem[]> {
    const data = await this.request<any>('/categories');
    const list = Array.isArray(data) ? data : data?.categories || [];
    return list.map(mapBackendCategoryToCategoryItem);
  }

  async getCategoriesScreen(): Promise<any> {
    const data = await this.request<any>('/categories/screen');
    return data;
  }

  async getCategoryBySlug(slug: string): Promise<any> {
    try {
      const data = await this.request<any>(`/categories/${encodeURIComponent(slug)}`);
      return data;
    } catch {
      return null;
    }
  }

  async getCategoryProducts(categoryId: string): Promise<Product[]> {
    if (!categoryId || !/^[0-9a-fA-F]{24}$/.test(categoryId)) {
      return [];
    }
    try {
      const data = await this.request<any>(`/categories/${categoryId}/products`);
      const list = Array.isArray(data) ? data : data?.products || [];
      return list.map(mapBackendProductToProduct);
    } catch {
      return [];
    }
  }

  async getBrands(): Promise<any[]> {
    const data = await this.request<any>('/brands');
    return Array.isArray(data) ? data : data?.brands || [];
  }

  async getProducts(params?: { categoryId?: string; search?: string; limit?: number }): Promise<Product[]> {
    const queryParts: string[] = [];
    queryParts.push(`limit=${params?.limit || 100}`);
    if (params?.search) {
      queryParts.push(`q=${encodeURIComponent(params.search)}`);
    }
    if (params?.categoryId) {
      queryParts.push(`categoryId=${encodeURIComponent(params.categoryId)}`);
    }
    const url = `/products?${queryParts.join('&')}`;
    const data = await this.request<any>(url);
    const list = Array.isArray(data) ? data : data?.products || data?.items || [];
    return list.map(mapBackendProductToProduct);
  }

  async getProductById(id: string): Promise<Product> {
    const data = await this.request<any>(`/products/${id}`);
    return mapBackendProductToProduct(data);
  }

  async getOffersForProduct(productId: string): Promise<RetailerProductOffer[]> {
    const data = await this.request<any>(`/products/${productId}/offers`);
    const list = Array.isArray(data) ? data : data?.offers || [];
    return list.map((o: any) => ({
      ...mapBackendOfferToOffer(o),
      productId: o.productId || data?.product?.id || productId,
    }));
  }

  async getHomeFeed(): Promise<any> {
    const data = await this.request<any>('/home');
    return {
      banners: data?.banners || [],
      categories: (data?.categories || []).map(mapBackendCategoryToCategoryItem),
      featuredProducts: (data?.featured_products || data?.featuredProducts || []).map(mapBackendProductToProduct),
      nearbyStores: (data?.nearby_stores || data?.nearbyStores || []).map(mapBackendStoreToRetailer),
    };
  }

  async getStores(): Promise<Retailer[]> {
    const data = await this.request<any>('/stores');
    const list = Array.isArray(data) ? data : data?.stores || [];
    return list.map(mapBackendStoreToRetailer);
  }

  async getStoreById(id: string): Promise<Retailer> {
    const data = await this.request<any>(`/stores/${id}`);
    return mapBackendStoreToRetailer(data);
  }

  async search(query: string) {
    const data = await this.request<any>(`/search?q=${encodeURIComponent(query)}`);
    const products = (data?.products || []).map(mapBackendProductToProduct);
    const stores = (data?.stores || []).map(mapBackendStoreToRetailer);
    return { products, stores };
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    const data = await this.request<any>(`/search/suggestions?q=${encodeURIComponent(query)}`);
    return Array.isArray(data) ? data : data?.suggestions || [];
  }

  // ========================================================
  // 4. CART & ORDERS (Live Dynamic Endpoints)
  // ========================================================
  async getCart() {
    const data = await this.request<any>('/cart');
    return data;
  }

  async addToCart(item: { offerId: string; quantity: number }) {
    return await this.request('/cart/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateCartItem(itemId: string, quantity: number) {
    return await this.request(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeCartItem(itemId: string) {
    return await this.request(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart() {
    return await this.request('/cart', { method: 'DELETE' });
  }

  async getOrders(): Promise<Order[]> {
    const data = await this.request<any>('/orders');
    const list = Array.isArray(data) ? data : data?.orders || [];
    return list.map(mapBackendOrderToOrder);
  }

  async getOrderDetail(id: string): Promise<Order> {
    const data = await this.request<any>(`/orders/${id}`);
    return mapBackendOrderToOrder(data);
  }

  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const data = await this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
    return mapBackendOrderToOrder(data);
  }

  async reorder(orderId: string) {
    return await this.request(`/orders/${orderId}/reorder`, { method: 'POST' });
  }

  // ========================================================
  // 5. RETAILER PRODUCT OFFERS & STORE INVENTORY
  // ========================================================
  async getRetailerOffers(): Promise<RetailerProductOffer[]> {
    const data = await this.request<any>('/retailer/product-offers');
    const list = Array.isArray(data) ? data : data?.offers || [];
    return list.map(mapBackendOfferToOffer);
  }

  async createRetailerOffer(offerData: Partial<RetailerProductOffer>) {
    return await this.request('/retailer/product-offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  }

  async updateRetailerOffer(id: string, updates: Partial<RetailerProductOffer>) {
    return await this.request(`/retailer/product-offers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteRetailerOffer(id: string) {
    return await this.request(`/retailer/product-offers/${id}`, {
      method: 'DELETE',
    });
  }

  async acceptRetailerOrder(orderId: string) {
    return await this.request<any>(`/retailer/orders/${orderId}/accept`, {
      method: 'POST',
    });
  }

  async rejectRetailerOrder(orderId: string, reason?: string) {
    return await this.request<any>(`/retailer/orders/${orderId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason: reason || 'Out of stock' }),
    });
  }

  async getRetailerOrders(status?: string): Promise<any[]> {
    const url = status && status !== 'all' ? `/retailer/orders?status=${encodeURIComponent(status)}` : '/retailer/orders';
    const data = await this.request<any>(url);
    const list = Array.isArray(data) ? data : data?.items || data?.orders || [];
    return list;
  }

  async updateRetailerOrderStatus(orderId: string, status: string) {
    return await this.request<any>(`/retailer/orders/${orderId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  }

  // ========================================================
  // 6. DRIVER & LOGISTICS APIS
  // ========================================================
  async getDriverAvailableJobs() {
    return await this.request<any>('/driver/jobs');
  }

  async acceptDriverJob(deliveryId: string) {
    return await this.request<any>(`/driver/jobs/${deliveryId}/accept`, {
      method: 'POST',
    });
  }

  async updateDriverDeliveryStatus(deliveryId: string, status: string, otp?: string) {
    return await this.request<any>(`/driver/jobs/${deliveryId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, otp }),
    });
  }

  async updateDriverLocation(coordinates: [number, number], isAvailable: boolean = true) {
    return await this.request<any>('/driver/location', {
      method: 'POST',
      body: JSON.stringify({
        latitude: coordinates[1],
        longitude: coordinates[0],
        is_available: isAvailable,
      }),
    });
  }

  // ========================================================
  // 6.1 PAYMENT GATEWAY APIS
  // ========================================================
  async createPaymentIntent(orderId: string, paymentMethod: string = 'UPI') {
    return await this.request<any>('/payments/create-intent', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId, payment_method: paymentMethod }),
    });
  }

  async verifyPayment(payload: {
    order_id: string;
    payment_id?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  }) {
    return await this.request<any>('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // ========================================================
  // 7. ADMIN GOVERNANCE APIS
  // ========================================================
  async adminGetCategories() {
    return await this.request('/admin/categories');
  }

  async adminCreateCategory(category: Partial<CategoryItem>) {
    return await this.request('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async adminGetProducts() {
    return await this.request('/admin/products');
  }

  async adminCreateProduct(product: Partial<Product>) {
    return await this.request('/admin/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  }

  async adminGetOffers() {
    return await this.request('/admin/product-offers');
  }

  async adminUpdateOfferStatus(id: string, status: string) {
    return await this.request(`/admin/product-offers/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  }
}

export const api = new ApiService();
export default api;
