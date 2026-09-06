import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Trash2, ArrowRight, Tag, ShieldAlert, Truck, Clock } from 'lucide-react';
import { useApp } from '../../store';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    cartGst,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingBag size={20} color="var(--color-primary)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Construction Cart ({cart.length})</h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'var(--color-bg)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🛒</div>
              <h4 style={{ color: 'var(--color-text-main)', marginBottom: '6px' }}>Your Cart is Empty</h4>
              <p style={{ fontSize: '0.875rem', marginBottom: '20px' }}>
                Add cement, TMT steel rebars, wires, or plumbing fittings to start ordering.
              </p>
              <button onClick={() => setIsCartOpen(false)} className="btn btn-primary btn-sm">
                Explore Materials
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Store source label */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Truck size={16} color="var(--color-primary)" />
                <span>
                  Fulfilling from <strong>{cart[0]?.retailer.name || 'Local Store'}</strong>
                </span>
              </div>

              {/* Items List */}
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  <img
                    src={item.product.imageUrl || '/images/ultratech_cement.jpg'}
                    alt={item.product.name}
                    style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--color-text-main)', marginBottom: '2px' }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                      Unit: {item.product.unit} • ₹{item.offer.price}/{item.product.unit.split(' ')[0]}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="qty-stepper">
                        <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)}>+</button>
                      </div>

                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', fontFamily: 'Outfit' }}>
                        ₹{(item.offer.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ color: 'var(--color-text-muted)', alignSelf: 'flex-start' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              {/* Coupon Code Section */}
              <div style={{ marginTop: '12px' }}>
                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Enter Coupon (e.g. MONSOON10)"
                      value={couponInput}
                      onChange={(e) => {
                        setCouponInput(e.target.value);
                        setCouponError('');
                      }}
                      style={{ flex: 1, textTransform: 'uppercase' }}
                    />
                    <button type="submit" className="btn btn-secondary btn-sm">
                      Apply
                    </button>
                  </form>
                ) : (
                  <div
                    style={{
                      backgroundColor: 'var(--color-success-bg)',
                      border: '1px solid var(--color-success-border)',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8125rem',
                      color: 'var(--color-success)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                      <Tag size={15} />
                      <span>{appliedCoupon.couponCode} applied ({appliedCoupon.discountPct}% OFF)</span>
                    </div>
                    <button onClick={removeCoupon} style={{ color: 'var(--color-error)', fontWeight: 700 }}>
                      Remove
                    </button>
                  </div>
                )}
                {couponError && (
                  <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '4px' }}>
                    {couponError}
                  </div>
                )}
              </div>

              {/* Bill Details Breakdown */}
              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '16px',
                  borderRadius: 'var(--radius-lg)',
                  marginTop: '12px',
                  fontSize: '0.875rem',
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: '10px' }}>Bill Details (GST Compliant)</div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                  <span>Items Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                  <span>GST (18% ITC applicable)</span>
                  <span>₹{cartGst.toLocaleString()}</span>
                </div>

                {appliedCoupon && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--color-success)' }}>
                    <span>Coupon Discount</span>
                    <span>-₹{Math.round((cartSubtotal * appliedCoupon.discountPct) / 100).toLocaleString()}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', color: 'var(--color-text-secondary)' }}>
                  <span>Estimated Delivery</span>
                  <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Calculated at Checkout</span>
                </div>

                <div
                  style={{
                    borderTop: '1.5px dashed var(--color-border-strong)',
                    paddingTop: '10px',
                    marginTop: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 900,
                    fontSize: '1.05rem',
                  }}
                >
                  <span>Grand Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>₹{cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer / Checkout CTA */}
        {cart.length > 0 && (
          <div style={{ padding: '20px', borderTop: '1px solid var(--color-border)', backgroundColor: '#FFFFFF' }}>
            <button
              onClick={handleProceedToCheckout}
              className="btn btn-primary btn-full btn-lg"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.75rem', opacity: 0.85, fontWeight: 500 }}>GRAND TOTAL</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 900 }}>₹{cartTotal.toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
