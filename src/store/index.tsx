import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  UserRole,
  Product,
  Retailer,
  RetailerProductOffer,
  CartItem,
  Order,
  Promotion,
  DeliveryAddress,
  DeliveryTrip,
  DriverStats,
} from '../types';
import {
  mockProducts,
  mockRetailers,
  mockOffers,
  mockAddresses,
  mockPromotions,
  initialMockOrders,
  mockDriverTrips,
  mockDriverStats,
} from '../services/mockData';

export interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

interface AppContextType {
  // Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;

  // Location & Address
  currentAddress: DeliveryAddress;
  setCurrentAddress: (addr: DeliveryAddress) => void;
  savedAddresses: DeliveryAddress[];
  addAddress: (addr: DeliveryAddress) => void;

  // Catalog
  products: Product[];
  retailers: Retailer[];
  offers: RetailerProductOffer[];
  promotions: Promotion[];
  addProduct: (product: Product, offer: RetailerProductOffer) => void;
  updateProduct: (product: Product) => void;
  updateOfferPrice: (offerId: string, newPrice: number) => void;
  updateOfferStock: (offerId: string, newStock: number) => void;
  addPromotion: (promo: Promotion) => void;
  deletePromotion: (id: string) => void;

  // Retailer Store Settings
  isStoreOpen: boolean;
  toggleStoreOpen: () => void;
  retailerProfile: Retailer;
  updateRetailerProfile: (partial: Partial<Retailer>) => void;

  // Cart
  cart: CartItem[];
  addToCart: (offer: RetailerProductOffer, product: Product, retailer: Retailer, qty?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartGst: number;
  cartTotal: number;
  appliedCoupon: Promotion | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  activeTrackingOrderId: string | null;
  setActiveTrackingOrderId: (id: string | null) => void;

  // Driver / Logistics
  isDriverOnline: boolean;
  toggleDriverOnline: () => void;
  driverTrips: DeliveryTrip[];
  driverStats: DriverStats;
  acceptDeliveryTrip: (tripId: string) => void;
  completeDeliveryTrip: (tripId: string, enteredOtp: string) => { success: boolean; message: string };

  // Modals & UI States
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isMaterialCalcOpen: boolean;
  setIsMaterialCalcOpen: (open: boolean) => void;
  newOrderAlert: Order | null;
  setNewOrderAlert: (order: Order | null) => void;

  // Toasts
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial role
  const [currentRole, setCurrentRole] = useState<UserRole>('customer');

  // Address
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>(() => {
    const saved = localStorage.getItem('buildit_addresses');
    return saved ? JSON.parse(saved) : mockAddresses;
  });
  const [currentAddress, setCurrentAddress] = useState<DeliveryAddress>(savedAddresses[0] || mockAddresses[0]);

  // Catalog State - merge fresh mock images & full product list
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('buildit_products');
    if (!saved) return mockProducts;
    try {
      const parsed: Product[] = JSON.parse(saved);
      // Ensure all mockProducts are present with updated imageUrl
      const parsedMap = new Map(parsed.map(p => [p.id, p]));
      return mockProducts.map(mp => {
        const existing = parsedMap.get(mp.id);
        return existing ? { ...existing, imageUrl: mp.imageUrl, specifications: mp.specifications || existing.specifications } : mp;
      });
    } catch {
      return mockProducts;
    }
  });
  const [retailers] = useState<Retailer[]>(() => {
    const saved = localStorage.getItem('buildit_retailers');
    if (!saved) return mockRetailers;
    try {
      const parsed: Retailer[] = JSON.parse(saved);
      const parsedMap = new Map(parsed.map(r => [r.id, r]));
      return mockRetailers.map(mr => {
        const existing = parsedMap.get(mr.id);
        return existing ? { ...existing, bannerImage: mr.bannerImage, avatarImage: mr.avatarImage } : mr;
      });
    } catch {
      return mockRetailers;
    }
  });
  const [offers, setOffers] = useState<RetailerProductOffer[]>(() => {
    const saved = localStorage.getItem('buildit_offers');
    if (!saved) return mockOffers;
    try {
      const parsed: RetailerProductOffer[] = JSON.parse(saved);
      // If cached offers are fewer than full catalog, default to mockOffers
      if (parsed.length < mockOffers.length) return mockOffers;
      return parsed;
    } catch {
      return mockOffers;
    }
  });
  const [promotions, setPromotions] = useState<Promotion[]>(() => {
    const saved = localStorage.getItem('buildit_promos');
    return saved ? JSON.parse(saved) : mockPromotions;
  });

  // Store Management
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [retailerProfile, setRetailerProfile] = useState<Retailer>(mockRetailers[0]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('buildit_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [appliedCoupon, setAppliedCoupon] = useState<Promotion | null>(null);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('buildit_orders');
    return saved ? JSON.parse(saved) : initialMockOrders;
  });
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(initialMockOrders[0].id);

  // Driver
  const [isDriverOnline, setIsDriverOnline] = useState(true);
  const [driverTrips, setDriverTrips] = useState<DeliveryTrip[]>(mockDriverTrips);
  const [driverStats, setDriverStats] = useState<DriverStats>(mockDriverStats);

  // UI Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMaterialCalcOpen, setIsMaterialCalcOpen] = useState(false);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('buildit_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('buildit_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('buildit_products', JSON.stringify(products));
    localStorage.setItem('buildit_offers', JSON.stringify(offers));
    localStorage.setItem('buildit_promos', JSON.stringify(promotions));
  }, [products, offers, promotions]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Address
  const addAddress = (addr: DeliveryAddress) => {
    const updated = [addr, ...savedAddresses];
    setSavedAddresses(updated);
    setCurrentAddress(addr);
    localStorage.setItem('buildit_addresses', JSON.stringify(updated));
    showToast(`Address saved: ${addr.label}`, 'success');
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.offer.price * item.quantity, 0);
  const cartGst = Math.round(cartSubtotal * 0.18);
  const discountAmount = appliedCoupon ? Math.round((cartSubtotal * appliedCoupon.discountPct) / 100) : 0;
  const cartTotal = cartSubtotal + cartGst - discountAmount;

  const addToCart = (offer: RetailerProductOffer, product: Product, retailer: Retailer, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.offer.id === offer.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty };
        return updated;
      }
      return [
        ...prev,
        {
          id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          offer,
          product,
          retailer,
          quantity: qty,
        },
      ];
    });
    showToast(`Added ${product.name} to Cart`, 'success');
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const promo = promotions.find((p) => p.couponCode.toUpperCase() === code.trim().toUpperCase() && p.status === 'active');
    if (!promo) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (promo.minOrderValue && cartSubtotal < promo.minOrderValue) {
      return { success: false, message: `Minimum order value of ₹${promo.minOrderValue} required for this coupon.` };
    }
    setAppliedCoupon(promo);
    showToast(`Coupon ${promo.couponCode} applied! Saved ${promo.discountPct}%`, 'success');
    return { success: true, message: `Applied ${promo.discountPct}% discount!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Orders
  const placeOrder = (orderData: Partial<Order>): Order => {
    const newOrder: Order = {
      id: `BK-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(10000 + Math.random() * 90000)}`,
      customerId: 'c1',
      customerName: currentAddress.name || 'Suresh Reddy',
      customerPhone: currentAddress.phone || '+91 98480 22334',
      retailerId: cart[0]?.retailer.id || 'r1',
      retailerName: cart[0]?.retailer.name || 'Sri Venkateshwara Hardware & Steels',
      status: 'placed',
      items: [...cart],
      subtotal: cartSubtotal,
      gst: cartGst,
      deliveryFee: orderData.deliveryType === 'bulk' ? 250 : 60,
      discountAmount,
      couponCode: appliedCoupon?.couponCode,
      totalAmount: cartTotal + (orderData.deliveryType === 'bulk' ? 250 : 60),
      deliveryAddress: currentAddress,
      deliveryType: orderData.deliveryType || 'express',
      deliveryModel: 'retailer_fleet',
      paymentMethod: orderData.paymentMethod || 'UPI',
      paymentStatus: 'paid',
      otp: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toISOString(),
      estimatedDeliveryMins: 35,
      ...orderData,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setActiveTrackingOrderId(newOrder.id);
    clearCart();

    // Trigger retailer incoming alert
    setNewOrderAlert(newOrder);

    // Also add to driver trips
    const newTrip: DeliveryTrip = {
      id: `TRIP-${Math.floor(1000 + Math.random() * 9000)}`,
      orderId: newOrder.id,
      pickupStore: newOrder.retailerName || 'Sri Venkateshwara Hardware & Steels',
      pickupAddress: 'Plot 45, Main Road, Hitec City',
      dropAddress: `${newOrder.deliveryAddress.line1}, ${newOrder.deliveryAddress.city}`,
      distanceKm: 3.2,
      earnings: newOrder.deliveryType === 'bulk' ? 450 : 180,
      status: 'available',
      payloadWeight: `${newOrder.items.reduce((acc, i) => acc + i.quantity, 0)} Units Materials`,
      itemSummary: newOrder.items.map((i) => `${i.quantity}x ${i.product.name}`).join(', '),
      customerPhone: newOrder.customerPhone || '+91 98480 22334',
      otp: newOrder.otp,
    };
    setDriverTrips((prev) => [newTrip, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o))
    );
    showToast(`Order ${orderId} updated to ${status.replace(/_/g, ' ').toUpperCase()}`, 'info');
  };

  // Retailer Actions
  const toggleStoreOpen = () => {
    setIsStoreOpen((prev) => {
      const next = !prev;
      showToast(`Store is now ${next ? 'OPEN for Orders' : 'CLOSED'}`, next ? 'success' : 'warning');
      return next;
    });
  };

  const updateRetailerProfile = (partial: Partial<Retailer>) => {
    setRetailerProfile((prev) => ({ ...prev, ...partial }));
    showToast('Store profile updated successfully', 'success');
  };

  const addProduct = (product: Product, offer: RetailerProductOffer) => {
    setProducts((prev) => [product, ...prev]);
    setOffers((prev) => [offer, ...prev]);
    showToast(`Added ${product.name} to Store Catalog`, 'success');
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
    showToast(`Updated ${product.name}`, 'info');
  };

  const updateOfferPrice = (offerId: string, newPrice: number) => {
    setOffers((prev) => prev.map((o) => (o.id === offerId ? { ...o, price: newPrice } : o)));
    showToast(`Updated item price to ₹${newPrice}`, 'info');
  };

  const updateOfferStock = (offerId: string, newStock: number) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, stock: newStock, isAvailable: newStock > 0 } : o))
    );
    showToast(`Updated stock to ${newStock}`, 'info');
  };

  const addPromotion = (promo: Promotion) => {
    setPromotions((prev) => [promo, ...prev]);
    showToast(`Created promotion "${promo.title}"`, 'success');
  };

  const deletePromotion = (id: string) => {
    setPromotions((prev) => prev.filter((p) => p.id !== id));
    showToast('Promotion deleted', 'info');
  };

  // Driver Actions
  const toggleDriverOnline = () => {
    setIsDriverOnline((prev) => {
      const next = !prev;
      showToast(next ? 'You are now ONLINE. Searching for delivery trips...' : 'You are OFFLINE', next ? 'success' : 'info');
      return next;
    });
  };

  const acceptDeliveryTrip = (tripId: string) => {
    setDriverTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: 'ongoing' } : t))
    );
    const trip = driverTrips.find((t) => t.id === tripId);
    if (trip) {
      updateOrderStatus(trip.orderId, 'driver_assigned');
    }
    showToast('Trip accepted! Navigate to pickup store.', 'success');
  };

  const completeDeliveryTrip = (tripId: string, enteredOtp: string) => {
    const trip = driverTrips.find((t) => t.id === tripId);
    if (!trip) return { success: false, message: 'Trip not found.' };

    if (trip.otp !== enteredOtp.trim()) {
      return { success: false, message: 'Invalid Customer OTP. Please check with customer.' };
    }

    setDriverTrips((prev) =>
      prev.map((t) => (t.id === tripId ? { ...t, status: 'completed' } : t))
    );
    updateOrderStatus(trip.orderId, 'delivered');
    setDriverStats((prev) => ({
      ...prev,
      todayEarnings: prev.todayEarnings + trip.earnings,
      completedTrips: prev.completedTrips + 1,
    }));

    showToast(`Delivery completed! ₹${trip.earnings} credited to your wallet.`, 'success');
    return { success: true, message: 'Delivery successfully verified and closed!' };
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentAddress,
        setCurrentAddress,
        savedAddresses,
        addAddress,
        products,
        retailers,
        offers,
        promotions,
        addProduct,
        updateProduct,
        updateOfferPrice,
        updateOfferStock,
        addPromotion,
        deletePromotion,
        isStoreOpen,
        toggleStoreOpen,
        retailerProfile,
        updateRetailerProfile,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartGst,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        orders,
        placeOrder,
        updateOrderStatus,
        activeTrackingOrderId,
        setActiveTrackingOrderId,
        isDriverOnline,
        toggleDriverOnline,
        driverTrips,
        driverStats,
        acceptDeliveryTrip,
        completeDeliveryTrip,
        isCartOpen,
        setIsCartOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isMaterialCalcOpen,
        setIsMaterialCalcOpen,
        newOrderAlert,
        setNewOrderAlert,
        toasts,
        showToast,
      }}
    >
      {children}

      {/* Global Toast Container */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: '12px 18px',
              backgroundColor:
                toast.type === 'error'
                  ? 'var(--color-error)'
                  : toast.type === 'warning'
                  ? 'var(--color-warning)'
                  : '#111827',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-xl)',
              fontSize: '0.9rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              pointerEvents: 'auto',
              animation: 'slideInRight 0.25s ease-out',
            }}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
