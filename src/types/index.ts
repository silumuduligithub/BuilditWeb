export type UserRole = 'customer' | 'retailer' | 'delivery' | 'admin';

export type DeliveryType = 'express' | 'scheduled' | 'bulk';

export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'driver_assigned'
  | 'pickup'
  | 'out_for_delivery'
  | 'delivered'
  | 'rejected';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  subcategories: string;
  icon: string;
  image?: string;
  itemCount: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  unit: string;
  imageUrl?: string;
  description?: string;
  sku?: string;
  isActive?: boolean;
  specifications?: Record<string, string>;
  minOrderQty?: number;
  bulkDiscountTiers?: { minQty: number; discountPct: number }[];
  hsnCode?: string;
  rating?: number;
  reviewCount?: number;
}

export interface Retailer {
  id: string;
  name: string;
  address: string;
  distance: number; // km
  rating: number;
  reviewsCount?: number;
  isServiceable: boolean;
  deliveryTypes: DeliveryType[];
  phone?: string;
  isOpen?: boolean;
  operatingHours?: string;
  deliveryRadiusKm?: number;
  gstin?: string;
  bannerImage?: string;
  avatarImage?: string;
  badges?: string[];
  totalProductsCount?: number;
}

export interface RetailerProductOffer {
  id: string;
  productId: string;
  retailerId: string;
  price: number;
  mrp?: number;
  stock: number;
  isAvailable: boolean;
  estimatedDeliveryMins: number;
  storeName?: string;
  storeDistance?: number;
  storeRating?: number;
}

export interface CartItem {
  id: string;
  offer: RetailerProductOffer;
  product: Product;
  retailer: Retailer;
  quantity: number;
}

export interface DeliveryAddress {
  id?: string;
  label: 'Home' | 'Site' | 'Office' | string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  coordinates?: { lat: number; lng: number };
  isDefault?: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName?: string;
  customerPhone?: string;
  retailerId: string;
  retailerName?: string;
  status: OrderStatus;
  items: CartItem[];

  // Pricing
  subtotal: number;
  gst: number;
  deliveryFee: number;
  discountAmount?: number;
  couponCode?: string;
  totalAmount: number;

  // Delivery
  deliveryAddress: DeliveryAddress;
  deliveryType: DeliveryType;
  deliveryModel?: 'retailer_fleet' | 'third_party_logistics';
  estimatedDeliveryMins?: number;
  scheduledSlot?: string;

  // Payment
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'COD';
  paymentStatus: 'pending' | 'paid' | 'refunded';

  // Logistics
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  driverVehicle?: string;
  otp: string;

  // Timeline
  createdAt: string;
  updatedAt?: string;
  estimatedDeliveryTime?: string;
}

export interface Promotion {
  id: string;
  title: string;
  productName: string;
  discountPct: number;
  couponCode: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'upcoming' | 'expired';
  minOrderValue?: number;
  maxDiscount?: number;
}

export interface DeliveryTrip {
  id: string;
  orderId: string;
  pickupStore: string;
  pickupAddress: string;
  dropAddress: string;
  distanceKm: number;
  earnings: number;
  status: 'available' | 'ongoing' | 'completed';
  payloadWeight: string;
  itemSummary: string;
  customerPhone: string;
  otp: string;
}

export interface DriverStats {
  todayEarnings: number;
  weeklyEarnings: number;
  completedTrips: number;
  onlineHours: number;
  rating: number;
  acceptanceRate: number;
}
