import React from 'react';
import { Percent, Tag, Copy, Check, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../../store';

export const OffersPage: React.FC = () => {
  const { promotions, showToast } = useApp();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast(`Copied coupon code ${code}`, 'success');
  };

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D97706', fontWeight: 700, fontSize: '0.875rem' }}>
            <Percent size={18} />
            <span>EXCLUSIVE CONSTRUCTION DEALS & TENDERS</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>
            Site Coupons & Bulk Rebates
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
            Apply these promotional promo codes at checkout for instant discounts on heavy materials.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-lg">
          {promotions.map((promo) => (
            <div
              key={promo.id}
              className="card"
              style={{
                border: '1.5px dashed var(--color-primary)',
                backgroundColor: '#FFFFFF',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="badge badge-primary" style={{ fontSize: '0.875rem' }}>
                    {promo.discountPct}% FLAT DISCOUNT
                  </span>
                  <span className="badge badge-success">{promo.status.toUpperCase()}</span>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>{promo.title}</h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  Applicable on: <strong>{promo.productName}</strong>
                </p>

                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  <div>• Min Order Value: ₹{promo.minOrderValue?.toLocaleString() || 5000}</div>
                  <div>• Valid Till: {promo.endDate}</div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>COUPON CODE</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '1px', color: 'var(--color-primary)', fontFamily: 'Outfit' }}>
                    {promo.couponCode}
                  </div>
                </div>

                <button
                  onClick={() => handleCopyCode(promo.couponCode)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Copy size={14} />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
