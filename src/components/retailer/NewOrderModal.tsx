import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, XCircle, MapPin, Package, Clock, Truck } from 'lucide-react';
import { useApp } from '../../store';

export const NewOrderModal: React.FC = () => {
  const { newOrderAlert, setNewOrderAlert, updateOrderStatus } = useApp();
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!newOrderAlert) return;
    setTimeLeft(60);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setNewOrderAlert(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [newOrderAlert, setNewOrderAlert]);

  if (!newOrderAlert) return null;

  const handleAccept = () => {
    updateOrderStatus(newOrderAlert.id, 'confirmed');
    setNewOrderAlert(null);
  };

  const handleReject = () => {
    updateOrderStatus(newOrderAlert.id, 'rejected');
    setNewOrderAlert(null);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1100 }}>
      <div
        className="modal-content"
        style={{
          borderTop: '6px solid var(--color-primary)',
          maxWidth: '520px',
          padding: '24px',
        }}
      >
        {/* Urgent Header with Ping */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulseGlow 1.5s infinite',
              }}
            >
              <Bell size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>⚡ NEW INCOMING ORDER!</h3>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Order #{newOrderAlert.id}
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--color-warning-bg)',
              color: 'var(--color-warning)',
              border: '1px solid var(--color-warning-border)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Clock size={14} />
            <span>Auto-reject in {timeLeft}s</span>
          </div>
        </div>

        {/* Amount & Items preview */}
        <div
          style={{
            backgroundColor: 'var(--color-bg)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>
              Order Value
            </span>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Outfit' }}>
              ₹{newOrderAlert.totalAmount.toLocaleString()}
            </span>
          </div>

          <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              ORDERED MATERIALS ({newOrderAlert.items.length} items):
            </div>
            {newOrderAlert.items.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}
              >
                <span>{item.quantity}x {item.product.name}</span>
                <span>₹{(item.offer.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
          <MapPin size={16} color="var(--color-primary)" />
          <span>
            Deliver to: <strong>{newOrderAlert.deliveryAddress.line1}</strong> ({newOrderAlert.deliveryAddress.label})
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleReject}
            className="btn btn-secondary"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-error)' }}
          >
            <XCircle size={18} />
            <span>Reject</span>
          </button>

          <button
            onClick={handleAccept}
            className="btn btn-primary"
            style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <CheckCircle size={18} />
            <span>Accept & Prepare Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
