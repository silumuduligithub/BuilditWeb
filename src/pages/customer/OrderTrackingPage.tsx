import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  ShieldCheck,
  ArrowLeft,
  Navigation,
  Key,
  Play,
} from 'lucide-react';
import { useApp } from '../../store';
import { OrderStatus } from '../../types';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, updateOrderStatus, showToast } = useApp();

  const order = orders.find((o) => o.id === id) || orders[0];

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'placed', label: 'Order Placed', desc: 'Order received by marketplace' },
    { key: 'confirmed', label: 'Store Confirmed', desc: 'Store accepted & invoice generated' },
    { key: 'preparing', label: 'Preparing & Packing', desc: 'Materials staged for loading' },
    { key: 'driver_assigned', label: 'Driver Assigned', desc: 'Truck dispatched to store' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'En route to construction site' },
    { key: 'delivered', label: 'Delivered', desc: 'Unloaded & OTP verified at site' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
      case 'driver_assigned':
      case 'pickup':
        return 3;
      case 'out_for_delivery':
        return 4;
      case 'delivered':
        return 5;
      default:
        return 0;
    }
  };

  const currentStepIdx = getStepIndex(order.status);

  const handleSimulateNextStep = () => {
    const sequence: OrderStatus[] = ['placed', 'confirmed', 'preparing', 'driver_assigned', 'out_for_delivery', 'delivered'];
    const currentSeqIdx = sequence.indexOf(order.status === 'ready' ? 'preparing' : order.status);
    const nextStatus = sequence[Math.min(sequence.length - 1, currentSeqIdx + 1)];
    updateOrderStatus(order.id, nextStatus);
    showToast(`Simulated Order Status: ${nextStatus.toUpperCase()}`, 'info');
  };

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Top bar with back link and Simulation tester */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Link to="/orders" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} />
            <span>My Orders</span>
          </Link>

          {/* Dev/Demo Simulation Button */}
          <button
            onClick={handleSimulateNextStep}
            className="btn btn-secondary btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#111827', color: '#FFF' }}
          >
            <Play size={14} color="#22C55E" />
            <span>Simulate Next Delivery Step</span>
          </button>
        </div>

        {/* Order Header & OTP Card */}
        <div className="grid grid-cols-2 gap-lg" style={{ marginBottom: '28px' }}>
          {/* Status Overview Card */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <span className="badge badge-primary" style={{ marginBottom: '6px' }}>
                  {order.deliveryType.toUpperCase()} FREIGHT
                </span>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Tracking Order #{order.id}</h1>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                  Placed on {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>ESTIMATED ARRIVAL</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#2563EB' }}>
                  {order.status === 'delivered' ? 'DELIVERED ✅' : '⚡ ~25 Mins'}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
              Fulfilling Store: <strong>{order.retailerName || 'Sri Venkateshwara Hardware & Steels'}</strong>
            </div>
          </div>

          {/* Doorstep Delivery OTP Card */}
          <div
            className="card"
            style={{
              padding: '24px',
              backgroundColor: '#111827',
              color: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px' }}>
                <Key size={16} />
                <span>SITE UNLOADING PASSKEY (OTP)</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>
                Share this secure 4-digit code with the delivery driver once materials are safely unloaded at site.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
              <div
                style={{
                  fontSize: '2.25rem',
                  fontWeight: 900,
                  letterSpacing: '8px',
                  color: '#FFFFFF',
                  fontFamily: 'Outfit',
                  backgroundColor: '#1F2937',
                  padding: '6px 20px',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                {order.otp || '4821'}
              </div>

              <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                {order.paymentStatus === 'paid' ? 'Paid Online' : 'COD Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Live Interactive Map & Driver Details */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '28px', marginBottom: '32px' }}>
          {/* Simulated Map View */}
          <div className="card" style={{ padding: '0', overflow: 'hidden', height: '360px', position: 'relative' }}>
            <div
              style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#E2E8F0',
                backgroundImage: `
                  linear-gradient(#CBD5E1 1px, transparent 1px),
                  linear-gradient(90deg, #CBD5E1 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Simulated Roads & Route Path */}
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <path
                  d="M 120 260 Q 300 240 450 120"
                  fill="none"
                  stroke="#E02020"
                  strokeWidth="5"
                  strokeDasharray="8 6"
                />
              </svg>

              {/* Hardware Store Pin */}
              <div
                style={{
                  position: 'absolute',
                  left: '100px',
                  top: '235px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#111827',
                    color: '#FFF',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    marginBottom: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🏪 Store Pickup
                </div>
                <div style={{ backgroundColor: '#111827', color: '#FFF', padding: '8px', borderRadius: '50%' }}>
                  <Package size={18} />
                </div>
              </div>

              {/* Moving Vehicle */}
              <div
                style={{
                  position: 'absolute',
                  left: order.status === 'delivered' ? '440px' : '280px',
                  top: order.status === 'delivered' ? '100px' : '175px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'all 1s ease-in-out',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#E02020',
                    color: '#FFF',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    marginBottom: '4px',
                    whiteSpace: 'nowrap',
                    animation: 'pulseGlow 2s infinite',
                  }}
                >
                  🚚 {order.driverVehicle || 'Tata Ace (TS 09 UB 8921)'}
                </div>
                <div style={{ backgroundColor: '#E02020', color: '#FFF', padding: '10px', borderRadius: '50%', boxShadow: '0 4px 12px rgba(224,32,32,0.4)' }}>
                  <Truck size={20} className="animate-truck" />
                </div>
              </div>

              {/* Construction Site Destination Pin */}
              <div
                style={{
                  position: 'absolute',
                  left: '430px',
                  top: '95px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    backgroundColor: '#16A34A',
                    color: '#FFF',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    marginBottom: '4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🏗️ Project Site
                </div>
                <div style={{ backgroundColor: '#16A34A', color: '#FFF', padding: '8px', borderRadius: '50%' }}>
                  <MapPin size={18} />
                </div>
              </div>

              {/* Live Tracking overlay badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                }}
              >
                <span className="animate-pulse-live" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }} />
                <span>Live GPS Feed Connected</span>
              </div>
            </div>
          </div>

          {/* Assigned Driver & Site Contact */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Driver Card */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                ASSIGNED FREIGHT DRIVER
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      backgroundColor: '#EFF6FF',
                      color: '#2563EB',
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                    }}
                  >
                    🚛
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '1rem' }}>{order.driverName || 'Ravi Teja'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                      Vehicle: {order.driverVehicle || 'Tata Ace (TS 09 UB 8921)'}
                    </div>
                  </div>
                </div>

                <a
                  href={`tel:${order.driverPhone || '+919876544321'}`}
                  className="btn btn-primary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Phone size={14} />
                  <span>Call Driver</span>
                </a>
              </div>

              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                📍 Drop Location: <strong>{order.deliveryAddress.line1}</strong>
              </div>
            </div>

            {/* Items Summary in this load */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                PAYLOAD MANIFEST ({order.items.length} materials)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8125rem' }}>
                {order.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.quantity}x {item.product.name}</span>
                    <strong style={{ fontFamily: 'Outfit' }}>₹{(item.offer.price * item.quantity).toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Timeline */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '24px' }}>
            Dispatch & Delivery Lifecycle
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${steps.length}, 1fr)`, gap: '12px', position: 'relative' }}>
            {steps.map((step, idx) => {
              const isPassed = idx <= currentStepIdx;
              const isCurrent = idx === currentStepIdx;

              return (
                <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                  {/* Circle indicator */}
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      backgroundColor: isPassed ? 'var(--color-primary)' : 'var(--color-border)',
                      color: isPassed ? '#FFFFFF' : 'var(--color-text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      marginBottom: '10px',
                      boxShadow: isCurrent ? '0 0 0 4px var(--color-primary-glow)' : 'none',
                    }}
                  >
                    {isPassed ? <CheckCircle size={20} /> : idx + 1}
                  </div>

                  <div style={{ fontWeight: isPassed ? 800 : 500, fontSize: '0.875rem', color: isPassed ? 'var(--color-text-main)' : 'var(--color-text-muted)' }}>
                    {step.label}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px', lineHeight: 1.3 }}>
                    {step.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
