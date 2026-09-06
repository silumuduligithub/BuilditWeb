import React, { useState } from 'react';
import { Tag, Plus, Trash2, Calendar, X } from 'lucide-react';
import { useApp } from '../../store';
import { Promotion } from '../../types';

export const RetailerPromotionsPage: React.FC = () => {
  const { promotions, addPromotion, deletePromotion } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [promoTitle, setPromoTitle] = useState('');
  const [productName, setProductName] = useState('All Store Materials');
  const [discountPct, setDiscountPct] = useState<number>(10);
  const [couponCode, setCouponCode] = useState('');
  const [minOrder, setMinOrder] = useState<number>(5000);

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle || !couponCode) return;

    const newPromo: Promotion = {
      id: `promo_${Date.now()}`,
      title: promoTitle,
      productName,
      discountPct,
      couponCode: couponCode.toUpperCase(),
      startDate: 'Today',
      endDate: '30 Sep, 2026',
      status: 'active',
      minOrderValue: minOrder,
    };

    addPromotion(newPromo);
    setIsCreateModalOpen(false);
    setPromoTitle('');
    setCouponCode('');
  };

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Store Promotions & Discount Campaigns</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
              Create targeted coupons for contractors and boost bulk construction sales.
            </p>
          </div>

          <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} />
            <span>Launch New Promo Campaign</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-lg">
          {promotions.map((promo) => (
            <div key={promo.id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span className="badge badge-primary">{promo.discountPct}% OFF</span>
                  <button onClick={() => deletePromotion(promo.id)} style={{ color: 'var(--color-text-muted)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>{promo.title}</h3>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  Target: {promo.productName}
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>COUPON CODE</div>
                  <div style={{ fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Outfit' }}>{promo.couponCode}</div>
                </div>
                <span className="badge badge-success">{promo.status.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Create Promo Modal */}
        {isCreateModalOpen && (
          <div className="modal-overlay" onClick={() => setIsCreateModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create New Discount Promo</h3>
                <button onClick={() => setIsCreateModalOpen(false)} style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'var(--color-bg)' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreatePromo}>
                <div className="form-group">
                  <label className="form-label">Promotion Campaign Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Foundation Casting Special 12% OFF"
                    value={promoTitle}
                    onChange={(e) => setPromoTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <div className="form-group">
                    <label className="form-label">Coupon Code</label>
                    <input
                      type="text"
                      placeholder="e.g. CASTING12"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Discount Percentage (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={discountPct}
                      onChange={(e) => setDiscountPct(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Minimum Order Value (₹)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(Number(e.target.value))}
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary" style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Launch Promotion
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
