import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle,
  ShieldCheck,
  Building,
  ArrowLeft,
  Lock,
  Clock,
} from 'lucide-react';
import { useApp } from '../../store';
import { DeliveryType } from '../../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartSubtotal,
    cartGst,
    cartTotal,
    appliedCoupon,
    currentAddress,
    setIsLocationModalOpen,
    placeOrder,
  } = useApp();

  const [deliveryType, setDeliveryType] = useState<DeliveryType>('express');
  const [scheduledSlot, setScheduledSlot] = useState('Tomorrow, 09:00 AM – 12:00 PM');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Net Banking' | 'COD'>('UPI');
  const [gstinInput, setGstinInput] = useState('36AABCU9603R1ZM');
  const [companyName, setCompanyName] = useState('Suresh Construction Infra Pvt Ltd');
  const [isGstEnabled, setIsGstEnabled] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="main-content" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="app-container">
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🛒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Please select materials from our catalog to proceed with checkout.
          </p>
          <Link to="/categories" className="btn btn-primary">
            Explore Materials Catalog
          </Link>
        </div>
      </div>
    );
  }

  const deliveryFee = deliveryType === 'bulk' ? 250 : 60;
  const finalPayable = cartTotal + deliveryFee;

  const handlePlaceOrder = () => {
    setIsSubmitting(true);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#E02020', '#111827', '#22C55E', '#F59E0B'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      const order = placeOrder({
        deliveryType,
        scheduledSlot: deliveryType === 'scheduled' ? scheduledSlot : undefined,
        paymentMethod,
        deliveryFee,
        totalAmount: finalPayable,
      });

      setIsSubmitting(false);
      navigate(`/tracking/${order.id}`);
    }, 800);
  };

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '28px' }}>
          Secure Checkout & Site Dispatch
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '32px', alignItems: 'flex-start' }}>
          {/* Left Column: Delivery, Fleet Mode, GST, Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* 1. Delivery Address Card */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ backgroundColor: 'var(--color-primary-faded)', color: 'var(--color-primary)', padding: '8px', borderRadius: 'var(--radius-md)' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Construction Site Delivery Address</h3>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Materials will be unloaded directly at this location</div>
                  </div>
                </div>

                <button onClick={() => setIsLocationModalOpen(true)} className="btn btn-secondary btn-sm">
                  Change Address
                </button>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: '4px' }}>
                  {currentAddress.label}: {currentAddress.name} ({currentAddress.phone})
                </div>
                <div style={{ color: 'var(--color-text-secondary)' }}>
                  {currentAddress.line1}
                  {currentAddress.line2 && `, ${currentAddress.line2}`}, {currentAddress.city} - {currentAddress.pincode}
                </div>
              </div>
            </div>

            {/* 2. Delivery Logistics Mode Selection */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#EFF6FF', color: '#2563EB', padding: '8px', borderRadius: 'var(--radius-md)' }}>
                  <Truck size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Choose Freight Delivery Speed</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Dedicated heavy vehicle fleet & express courier options</div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Option 1: Express */}
                <div
                  onClick={() => setDeliveryType('express')}
                  style={{
                    border: deliveryType === 'express' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: deliveryType === 'express' ? 'var(--color-primary-faded)' : 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.5rem' }}>⚡</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>60-Minute Express Site Delivery</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Priority driver dispatched instantly from closest store</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, color: 'var(--color-primary)' }}>₹60</div>
                    <span className="badge badge-success">Fastest</span>
                  </div>
                </div>

                {/* Option 2: Heavy Truck Bulk Freight */}
                <div
                  onClick={() => setDeliveryType('bulk')}
                  style={{
                    border: deliveryType === 'bulk' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: deliveryType === 'bulk' ? 'var(--color-primary-faded)' : 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.5rem' }}>🚛</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Heavy Fleet (Tata Ace / 407 Truck)</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Ideal for multi-ton cement bags, TMT rebars & sand</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, color: 'var(--color-primary)' }}>₹250</div>
                    <span className="badge badge-info">Heavy Load</span>
                  </div>
                </div>

                {/* Option 3: Scheduled Slot */}
                <div
                  onClick={() => setDeliveryType('scheduled')}
                  style={{
                    border: deliveryType === 'scheduled' ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                    backgroundColor: deliveryType === 'scheduled' ? 'var(--color-primary-faded)' : 'var(--color-surface)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.5rem' }}>📅</span>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Scheduled Site Slot</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Pick a specific delivery window for morning concrete casting</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, color: 'var(--color-primary)' }}>₹60</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. GST Invoice Details */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#F0FDF4', color: '#16A34A', padding: '8px', borderRadius: 'var(--radius-md)' }}>
                  <Building size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>GST Invoice & Input Tax Credit (ITC)</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Save up to 18% with tax compliant business invoice</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div className="form-group">
                  <label className="form-label">GSTIN (15 Digits)</label>
                  <input
                    type="text"
                    value={gstinInput}
                    onChange={(e) => setGstinInput(e.target.value)}
                    placeholder="e.g. 36AABCU9603R1ZM"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Company / Builder Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Suresh Construction Infra Pvt Ltd"
                  />
                </div>
              </div>
            </div>

            {/* 4. Payment Method Selection */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#FFFBEB', color: '#D97706', padding: '8px', borderRadius: 'var(--radius-md)' }}>
                  <CreditCard size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>Payment Method</h3>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>100% Encrypted & Safe Payments</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-md">
                {(['UPI', 'Card', 'Net Banking', 'COD'] as const).map((method) => (
                  <div
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      border: paymentMethod === method ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: paymentMethod === method ? 'var(--color-primary-faded)' : 'var(--color-surface)',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontWeight: 700,
                      fontSize: '0.9375rem',
                    }}
                  >
                    <span>
                      {method === 'UPI' && '📱 UPI (GPay / PhonePe)'}
                      {method === 'Card' && '💳 Credit / Debit Card'}
                      {method === 'Net Banking' && '🏦 Net Banking'}
                      {method === 'COD' && '💵 Pay On Delivery / Credit'}
                    </span>
                    {paymentMethod === method && <CheckCircle size={16} color="var(--color-primary)" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order CTA */}
          <div>
            <div className="card" style={{ padding: '24px', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>
                Order Summary ({cart.length} items)
              </h3>

              {/* Items summary list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '220px', overflowY: 'auto' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.quantity}x {item.product.name}
                    </span>
                    <strong style={{ fontFamily: 'Outfit' }}>₹{(item.offer.price * item.quantity).toLocaleString()}</strong>
                  </div>
                ))}
              </div>

              {/* Bill Details */}
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Materials Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>GST (18% ITC)</span>
                  <span>₹{cartGst.toLocaleString()}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                  <span>Site Freight ({deliveryType.toUpperCase()})</span>
                  <span>₹{deliveryFee}</span>
                </div>

                {appliedCoupon && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-success)', fontWeight: 600 }}>
                    <span>Coupon ({appliedCoupon.couponCode})</span>
                    <span>-₹{Math.round((cartSubtotal * appliedCoupon.discountPct) / 100).toLocaleString()}</span>
                  </div>
                )}

                <div
                  style={{
                    borderTop: '1.5px dashed var(--color-border-strong)',
                    paddingTop: '12px',
                    marginTop: '8px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontWeight: 900,
                    fontSize: '1.25rem',
                  }}
                >
                  <span>Grand Total</span>
                  <span style={{ color: 'var(--color-primary)' }}>₹{finalPayable.toLocaleString()}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="btn btn-primary btn-full btn-lg"
                style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Lock size={18} />
                <span>{isSubmitting ? 'Processing Dispatch...' : `Confirm & Pay ₹${finalPayable.toLocaleString()}`}</span>
              </button>

              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '12px' }}>
                🔒 256-Bit SSL Encrypted • Direct Store Fulfillment Guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
