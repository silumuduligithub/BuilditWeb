import type {
  Product,
  Retailer,
  RetailerProductOffer,
  CartItem,
  Order,
  OrderStatus,
  DeliveryAddress,
  CategoryItem,
} from '../types';

export const parseNumber = (val: any, fallback: number = 0): number => {
  if (typeof val === 'number') return val;
  if (!val) return fallback;
  const cleaned = String(val).replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? fallback : parsed;
};

export const mapBackendProductToProduct = (item: any): Product => {
  if (!item) {
    return {
      id: '',
      name: '',
      brand: '',
      category: '',
      unit: 'Piece',
    };
  }

  const categoryName =
    typeof item.category === 'string'
      ? item.category
      : item.category?.name || item.category_id?.name || 'General Materials';

  const brandName =
    typeof item.brand === 'string'
      ? item.brand
      : item.brand?.name || item.brand_id?.name || 'Standard';

  const catLower = (categoryName || '').toLowerCase();
  const nameLower = (item.name || item.product_name || '').toLowerCase();

  let fallbackImage = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80';
  if (catLower.includes('cement') || nameLower.includes('cement')) {
    fallbackImage = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('steel') || nameLower.includes('steel') || nameLower.includes('rebar') || nameLower.includes('tmt')) {
    fallbackImage = 'https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('sand') || nameLower.includes('sand') || nameLower.includes('aggregate')) {
    fallbackImage = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('brick') || nameLower.includes('brick') || nameLower.includes('block')) {
    fallbackImage = 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('plywood') || catLower.includes('timber') || nameLower.includes('plywood') || nameLower.includes('wood')) {
    fallbackImage = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('paint') || catLower.includes('putty') || catLower.includes('coating') || nameLower.includes('paint') || nameLower.includes('putty')) {
    fallbackImage = 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('electric') || catLower.includes('wire') || catLower.includes('cable') || nameLower.includes('wire')) {
    fallbackImage = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('plumb') || catLower.includes('pipe') || catLower.includes('sanitary') || nameLower.includes('pipe')) {
    fallbackImage = 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('tile') || catLower.includes('marble') || catLower.includes('floor') || nameLower.includes('tile')) {
    fallbackImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80';
  } else if (catLower.includes('tool') || catLower.includes('hardware') || nameLower.includes('drill') || nameLower.includes('hammer')) {
    fallbackImage = 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=80';
  }

  const primaryImage =
    item.primary_image ||
    (typeof item.images?.[0] === 'string' ? item.images[0] : item.images?.[0]?.url) ||
    item.image_url ||
    item.imageUrl ||
    item.image ||
    fallbackImage;

  const unitStr =
    item.unit ||
    item.marketplace?.available_units?.[0] ||
    item.specifications?.unit ||
    'Unit';

  return {
    id: item.id || item._id || item.product_id || '',
    name: item.name || item.product_name || 'Material',
    brand: brandName,
    category: categoryName,
    unit: unitStr,
    imageUrl: primaryImage,
    description: item.short_description || item.description || '',
    sku: item.product_code || item.sku || '',
    isActive: item.is_active !== undefined ? item.is_active : true,
    specifications: item.specifications || {},
    rating: typeof item.rating === 'number' ? item.rating : 4.8,
    reviewCount: typeof item.reviewCount === 'number' ? item.reviewCount : item.marketplace?.retailer_count ? item.marketplace.retailer_count * 12 : 24,
  };
};

export const mapBackendCategoryToCategoryItem = (item: any): CategoryItem => {
  if (!item) {
    return {
      id: '',
      name: 'Category',
      slug: 'category',
      subcategories: 'Materials & Hardware',
      icon: '🏗️',
      itemCount: 0,
    };
  }

  const categoryIcons: Record<string, string> = {
    cement: '🏗️',
    steel: '🔩',
    sand: '🏖️',
    brick: '🧱',
    plywood: '🪵',
    paint: '🎨',
    electrical: '⚡',
    plumbing: '🚿',
    tiles: '🏛️',
    tools: '🔨',
  };

  const slug = item.slug || (item.name ? item.name.toLowerCase().replace(/\s+/g, '-') : 'category');
  let icon = item.icon || '🏗️';
  for (const [key, ic] of Object.entries(categoryIcons)) {
    if (slug.includes(key)) {
      icon = ic;
      break;
    }
  }

  return {
    id: item.id || item._id || item.slug || '',
    name: item.name || 'Category',
    slug,
    subcategories: item.description || item.subcategories || 'Materials & Hardware',
    icon,
    image: item.image_url || item.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
    itemCount: typeof item.itemCount === 'number' ? item.itemCount : item.product_count || 12,
  };
};

export const mapBackendStoreToRetailer = (store: any): Retailer => {
  if (!store) {
    return {
      id: '',
      name: 'Hardware Store',
      address: '',
      distance: 0,
      rating: 4.8,
      isServiceable: true,
      deliveryTypes: ['express', 'scheduled', 'bulk'],
    };
  }

  const addressStr =
    typeof store.address === 'string'
      ? store.address
      : store.address
      ? `${store.address.address_line1 || ''}, ${store.address.city || ''}, ${store.address.state || ''}`.replace(/^, /, '')
      : 'Hyderabad, Telangana';

  return {
    id: store.id || store._id || '',
    name: store.store_name || store.name || 'BuildKart Partner Store',
    address: addressStr,
    distance: typeof store.distance_km === 'number' ? store.distance_km : store.distance || 1.8,
    rating: typeof store.rating === 'number' ? store.rating : 4.8,
    reviewsCount: store.rating_count || store.reviewsCount || 48,
    isServiceable: true,
    deliveryTypes: ['express', 'scheduled', 'bulk'],
    phone: store.phone || store.user_id?.phone || '+91 98450 12345',
    isOpen: store.is_open ?? true,
    operatingHours: '08:00 AM – 09:00 PM',
    deliveryRadiusKm: store.delivery?.max_delivery_radius_km || 15,
    gstin: store.gst_number || store.gstin || '36AABCU9603R1ZM',
    bannerImage: store.bannerImage || store.banner_url || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&q=80',
    avatarImage: store.logo_url || store.avatarImage || 'https://cdn-icons-png.flaticon.com/512/869/869636.png',
  };
};

export const mapBackendOfferToOffer = (offer: any, defaultStoreId: string = ''): RetailerProductOffer => {
  if (!offer) {
    return {
      id: '',
      productId: '',
      retailerId: defaultStoreId,
      price: 0,
      stock: 0,
      isAvailable: false,
      estimatedDeliveryMins: 35,
    };
  }

  const retailerId =
    offer.retailer?.id ||
    offer.retailer?._id ||
    (typeof offer.retailer_id === 'string' ? offer.retailer_id : offer.retailer_id?._id) ||
    offer.retailerId ||
    defaultStoreId;

  const productId =
    typeof offer.product_id === 'string'
      ? offer.product_id
      : offer.product_id?._id || offer.productId || '';

  const price = parseNumber(offer.selling_price ?? offer.price, 0);
  const stock = typeof offer.available_quantity === 'number' ? offer.available_quantity : offer.stock ?? 100;

  return {
    id: offer.offerId || offer._id || offer.id || `off-${Math.random().toString(36).substr(2, 9)}`,
    productId,
    retailerId,
    price,
    mrp: offer.mrp ? parseNumber(offer.mrp, price * 1.15) : Math.round(price * 1.15),
    stock,
    isAvailable: offer.is_in_stock ?? (stock > 0),
    estimatedDeliveryMins: offer.estimated_delivery_time ? parseNumber(offer.estimated_delivery_time, 35) : 35,
    storeName: offer.retailer?.name || offer.store_name || offer.storeName,
    storeRating: offer.retailer?.rating || offer.store_rating || offer.storeRating || 4.8,
  };
};

export const mapBackendOrderToOrder = (o: any): Order => {
  if (!o) {
    return {
      id: 'BK-000000',
      customerId: '',
      retailerId: 'ret_1',
      status: 'placed',
      items: [],
      subtotal: 0,
      gst: 0,
      totalAmount: 0,
      deliveryFee: 0,
      deliveryAddress: {
        label: 'Site',
        name: 'Site Engineer',
        phone: '+91 98450 11223',
        line1: 'Whitefield Road',
        city: 'Bengaluru',
        pincode: '560087',
      },
      deliveryType: 'express',
      paymentMethod: 'UPI',
      paymentStatus: 'paid',
      otp: '1234',
      createdAt: new Date().toISOString(),
    };
  }

  const mappedStatus: OrderStatus = ((): OrderStatus => {
    switch (o.order_status || o.status) {
      case 'placed':
      case 'confirmed':
      case 'preparing':
      case 'ready':
      case 'driver_assigned':
      case 'pickup':
      case 'out_for_delivery':
      case 'delivered':
      case 'rejected':
        return (o.order_status || o.status) as OrderStatus;
      case 'packed':
        return 'ready';
      case 'dispatched':
      case 'in_transit':
        return 'out_for_delivery';
      case 'cancelled':
        return 'rejected';
      default:
        return 'placed';
    }
  })();

  const subtotal = parseNumber(o.item_total ?? o.subtotal, 0);
  const gst = parseNumber(o.tax_total ?? o.gst, Math.round(subtotal * 0.18));
  const totalAmount = parseNumber(o.grand_total ?? o.totalAmount, subtotal + gst);
  const deliveryFee = parseNumber(o.delivery_charge ?? o.deliveryFee, 0);

  const cartItems: CartItem[] = Array.isArray(o.items)
    ? o.items.map((i: any, idx: number) => {
        const prod = mapBackendProductToProduct(i.product || i);
        return {
          id: i.id || i._id || `item-${idx}`,
          product: prod,
          offer: {
            id: `off-${idx}`,
            productId: prod.id,
            retailerId: o.retailer_id || o.retailerId || 'ret_1',
            price: parseNumber(i.unit_price ?? i.price, 0),
            stock: 100,
            isAvailable: true,
            estimatedDeliveryMins: 35,
          },
          retailer: {
            id: o.retailer_id || o.retailerId || 'ret_1',
            name: o.retailer_name || o.retailerName || 'Balaji Hardware',
            address: 'Bengaluru, Karnataka',
            distance: 1.5,
            rating: 4.8,
            isServiceable: true,
            deliveryTypes: ['express'],
          },
          quantity: i.quantity || 1,
        };
      })
    : [];

  const addr = o.delivery_address || o.deliveryAddress || o.address_id;
  const deliveryAddress: DeliveryAddress = {
    label: addr?.label || 'Site',
    name: addr?.name || o.customerName || 'Site Contractor',
    phone: addr?.phone || o.customerPhone || '+91 98450 11223',
    line1: addr?.address_line1 || addr?.line1 || 'Main Site Address',
    line2: addr?.address_line2 || addr?.line2 || '',
    city: addr?.city || 'Bengaluru',
    pincode: addr?.pincode || '560087',
  };

  return {
    id: o.order_code || o.id || o._id || `BK-${Date.now().toString().slice(-6)}`,
    customerId: o.customer_id || o.customerId || 'cust_01',
    customerName: o.customer_name || o.customerName || 'Site Contractor',
    customerPhone: o.customer_phone || o.customerPhone || '+91 98450 11223',
    retailerId: o.retailer_id || o.retailerId || 'ret_1',
    retailerName: o.retailer_name || o.retailerName || 'Balaji Hardware & Building Materials',
    status: mappedStatus,
    items: cartItems,
    subtotal,
    gst,
    totalAmount,
    deliveryFee,
    discountAmount: parseNumber(o.discount_amount ?? o.discountAmount, 0),
    couponCode: o.coupon_code || o.couponCode,
    deliveryAddress,
    deliveryType: o.delivery_type || o.deliveryType || 'express',
    paymentMethod: o.payment_method || o.paymentMethod || 'UPI',
    paymentStatus: o.payment_status || o.paymentStatus || 'paid',
    driverName: o.driver_name || o.driverName || 'Ramesh Gowda',
    driverPhone: o.driver_phone || o.driverPhone || '+91 98451 11223',
    driverVehicle: o.driver_vehicle || o.driverVehicle || 'Tata Ace (KA-05-AB-4567)',
    otp: o.otp || '4829',
    createdAt: o.created_at || o.createdAt || new Date().toISOString(),
    updatedAt: o.updated_at || o.updatedAt,
  };
};
