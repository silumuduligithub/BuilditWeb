import React, { useState } from 'react';
import { ShieldCheck, Store, Users, Truck, DollarSign, Check, X, AlertCircle } from 'lucide-react';
import { useApp } from '../../store';

export const AdminDashboard: React.FC = () => {
  const { retailers, orders, products, showToast } = useApp();

  const totalGMV = orders.reduce((sum, o) => sum + o.totalAmount, 0) * 12; // annualized/aggregate platform mock
  const totalStores = retailers.length;
  const activeOrdersCount = orders.filter((o) => o.status !== 'delivered').length;

  const [storesList, setStoresList] = useState(retailers);

  const handleVerifyStore = (storeId: string) => {
    setStoresList((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, badges: [...(s.badges || []), 'Verified Admin Pro'] } : s))
    );
    showToast(`Store #${storeId} verified and approved for marketplace listings!`, 'success');
  };

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Header */}
        <div
          className="card"
          style={{
            backgroundColor: '#1E1B4B',
            color: '#FFFFFF',
            padding: '24px 32px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ backgroundColor: '#7C3AED', color: '#FFF', width: '56px', height: '56px', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={32} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF' }}>BuildIt Platform Admin & Governance</h1>
              <p style={{ color: '#C7D2FE', fontSize: '0.8125rem' }}>
                System health, hardware store onboarding verification, and gross marketplace volume.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-success" style={{ padding: '6px 12px' }}>
              ● API SERVICES ONLINE
            </span>
          </div>
        </div>

        {/* Platform KPIs */}
        <div className="grid grid-cols-4 gap-lg" style={{ marginBottom: '32px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '6px' }}>
              TOTAL PLATFORM GMV
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Outfit' }}>
              ₹{(totalGMV / 100000).toFixed(1)} Lakhs
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700, marginTop: '4px' }}>
              ↑ +34.2% MoM
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '6px' }}>
              VERIFIED STORE PARTNERS
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, fontFamily: 'Outfit' }}>
              {totalStores} Dealers
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Across 6 city zones
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '6px' }}>
              CATALOG MATERIALS (SKUs)
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, fontFamily: 'Outfit' }}>
              {products.length * 15}+ Items
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              BIS Grade Certified
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '6px' }}>
              ACTIVE DISPATCH PIPELINE
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#2563EB', fontFamily: 'Outfit' }}>
              {activeOrdersCount} Loads
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              En-route or in packing
            </div>
          </div>
        </div>

        {/* Store Verification & Onboarding Review */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Hardware Store Merchant Approvals</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Review GSTIN documents, trade licenses, and dispatch radius configs.
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Store & Merchant</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>GSTIN Registration</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Delivery Types</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Rating & Trust</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Admin Verification</th>
                </tr>
              </thead>
              <tbody>
                {storesList.map((store) => (
                  <tr key={store.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 800 }}>{store.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{store.address}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-dark">{store.gstin || '36AABCU9603R1ZM'}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {store.deliveryTypes.map((dt) => (
                          <span key={dt} className="badge badge-info" style={{ fontSize: '0.6875rem' }}>
                            {dt}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      ⭐ <strong>{store.rating}</strong> ({store.reviewsCount} reviews)
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                      <button
                        onClick={() => handleVerifyStore(store.id)}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Check size={14} />
                        <span>Approve Merchant</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
