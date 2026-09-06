import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Zap,
  ArrowLeft,
  ArrowRightLeft,
  Check,
  Calculator,
} from 'lucide-react';
import { useApp } from '../../store';
import { mockProducts } from '../../services/mockData';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, offers, retailers, addToCart, setIsCartOpen, setIsMaterialCalcOpen } = useApp();

  const product = products.find((p) => p.id === id) || mockProducts[0];
  const productOffers = offers.filter((o) => o.productId === product.id);

  // Default selected offer (cheapest available)
  const [selectedOfferId, setSelectedOfferId] = useState<string>(
    productOffers[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);

  const selectedOffer = productOffers.find((o) => o.id === selectedOfferId) || productOffers[0];
  const selectedStore = retailers.find((r) => r.id === selectedOffer?.retailerId) || retailers[0];

  const handleAddToCart = () => {
    if (!selectedOffer) return;
    addToCart(selectedOffer, product, selectedStore, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedOffer) return;
    addToCart(selectedOffer, product, selectedStore, quantity);
    setIsCartOpen(true);
  };

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '0.875rem' }}>
          <Link to="/" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <span style={{ color: 'var(--color-text-secondary)' }}>{product.category}</span>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <span style={{ color: 'var(--color-text-main)', fontWeight: 600 }}>{product.name}</span>
        </div>

        {/* Product Hero Section */}
        <div className="grid grid-cols-2 gap-xl" style={{ marginBottom: '40px', alignItems: 'flex-start' }}>
          {/* Left: Product Image & Badges */}
          <div>
            <div
              className="card"
              style={{
                overflow: 'hidden',
                position: 'relative',
                height: '420px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FFFFFF',
              }}
            >
              <img
                src={product.imageUrl || '/images/ultratech_cement.jpg'}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '24px' }}
              />
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: '#111827',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.8125rem',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {product.brand}
              </div>
            </div>

            {/* Quick Estimator CTA Banner under image */}
            <div
              style={{
                marginTop: '16px',
                backgroundColor: 'var(--color-primary-faded)',
                border: '1px solid rgba(224, 32, 32, 0.2)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calculator size={22} color="var(--color-primary)" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem' }}>Need Quantity Estimation?</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    Calculate exact bags or tons based on your site floor dimensions.
                  </div>
                </div>
              </div>
              <button onClick={() => setIsMaterialCalcOpen(true)} className="btn btn-primary btn-sm">
                Open Calc
              </button>
            </div>
          </div>

          {/* Right: Product Details & Order Box */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-info">{product.category}</span>
              <span className="badge badge-success">⭐ {product.rating || 4.8} ({product.reviewCount || 320} reviews)</span>
              <span className="badge badge-dark">SKU: {product.sku || 'UTC-53'}</span>
            </div>

            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, lineHeight: 1.25, marginBottom: '12px' }}>
              {product.name}
            </h1>

            <p style={{ fontSize: '0.9375rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              {product.description}
            </p>

            {/* Price Box */}
            <div
              style={{
                backgroundColor: 'var(--color-bg)',
                padding: '20px',
                borderRadius: 'var(--radius-lg)',
                marginBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '2.25rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Outfit' }}>
                  ₹{(selectedOffer?.price || 385).toLocaleString()}
                </span>
                {selectedOffer?.mrp && (
                  <span style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                    ₹{selectedOffer.mrp.toLocaleString()}
                  </span>
                )}
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                  per {product.unit} (Inclusive of GST)
                </span>
              </div>

              {/* Bulk discount tiers */}
              {product.bulkDiscountTiers && (
                <div style={{ marginTop: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
                    BULK WHOLESALE PRICING TIERS:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {product.bulkDiscountTiers.map((tier, i) => (
                      <span key={i} className="badge badge-warning" style={{ fontSize: '0.75rem' }}>
                        {tier.minQty}+ Units: {tier.discountPct}% OFF
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Stepper & CTAs */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Qty:</span>
                <div className="qty-stepper">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                    <Minus size={14} />
                  </button>
                  <span style={{ minWidth: '40px' }}>{quantity}</span>
                  <button onClick={() => setQuantity((q) => q + 1)}>
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="btn btn-secondary btn-lg"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <ShoppingCart size={18} />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="btn btn-primary btn-lg"
                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Zap size={18} />
                <span>Instant Checkout</span>
              </button>
            </div>

            {/* Selected Store Fulfilling Badge */}
            <div
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8125rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--color-text-muted)' }}>Fulfilling Store:</span>{' '}
                <strong>{selectedStore.name}</strong> ({selectedStore.distance} km away)
              </div>
              <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                ⚡ Dispatch in {selectedOffer?.estimatedDeliveryMins || 35} Mins
              </span>
            </div>
          </div>
        </div>

        {/* Multi-Seller Offers Comparison Table */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Compare Local Store Offers ({productOffers.length})</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Choose the best price and fastest delivery time among local dealers.
              </p>
            </div>
            <Link to="/compare" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowRightLeft size={16} />
              <span>Full Store Comparison Tool</span>
            </Link>
          </div>

          <div className="card" style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Hardware Store</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Distance</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Stock Availability</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Est. Delivery</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700 }}>Unit Price</th>
                  <th style={{ padding: '14px 16px', fontWeight: 700, textAlign: 'right' }}>Select Seller</th>
                </tr>
              </thead>
              <tbody>
                {productOffers.map((offer) => {
                  const store = retailers.find((r) => r.id === offer.retailerId) || retailers[0];
                  const isSelected = selectedOffer?.id === offer.id;

                  return (
                    <tr
                      key={offer.id}
                      style={{
                        borderBottom: '1px solid var(--color-border)',
                        backgroundColor: isSelected ? 'var(--color-primary-faded)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: 700 }}>
                        <div>{store.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>⭐ {store.rating} Rating</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>{store.distance} km</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${offer.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                          {offer.stock > 0 ? `${offer.stock} Units In Stock` : 'Out of Stock'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 600 }}>⚡ {offer.estimatedDeliveryMins} Mins</td>
                      <td style={{ padding: '14px 16px', fontWeight: 900, fontSize: '1.05rem', color: 'var(--color-primary)', fontFamily: 'Outfit' }}>
                        ₹{offer.price.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        {isSelected ? (
                          <span className="btn btn-sm btn-primary" style={{ pointerEvents: 'none' }}>
                            <Check size={14} /> Selected
                          </span>
                        ) : (
                          <button onClick={() => setSelectedOfferId(offer.id)} className="btn btn-sm btn-secondary">
                            Select
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical Specifications */}
        {product.specifications && (
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '16px' }}>
              Technical Specifications & Compliance
            </h3>
            <div className="card" style={{ padding: '20px' }}>
              <div className="grid grid-cols-2 gap-md">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '10px 0',
                      borderBottom: '1px solid var(--color-border-light)',
                      fontSize: '0.875rem',
                    }}
                  >
                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>{key}</span>
                    <span style={{ color: 'var(--color-text-main)', fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
