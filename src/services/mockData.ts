// BuildIt Dynamic Web Client
// Static mock data removed — Application now strictly communicates with live backend APIs.

import type { CategoryItem, Product, Retailer, RetailerProductOffer, Order, Promotion, DeliveryTrip, DriverStats, DeliveryAddress } from '../types';

export const mockCategories: CategoryItem[] = [];
export const mockRetailers: Retailer[] = [];
export const mockProducts: Product[] = [];
export const mockOffers: RetailerProductOffer[] = [];
export const mockAddresses: DeliveryAddress[] = [];
export const mockPromotions: Promotion[] = [];
export const mockOrders: Order[] = [];
export const initialMockOrders: Order[] = [];
export const mockDeliveryTrips: DeliveryTrip[] = [];
export const mockDriverTrips: DeliveryTrip[] = [];
export const mockDriverStats: DriverStats = {
  todayEarnings: 0,
  weeklyEarnings: 0,
  completedTrips: 0,
  onlineHours: 0,
  rating: 5.0,
  acceptanceRate: 100,
};
