import React, { useState } from 'react';
import { ArrowRightLeft, Check, ShoppingCart, Star, Truck, MapPin } from 'lucide-react';
import { useApp } from '../../store';

export const StoreComparePage: React.FC = () => {
  const { products, offers, retailers, addToCart } = useApp();

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || 'p_cement_1');
  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  const productOffers = offers.filter((o) => o.productId === selectedProduct.id);

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.875rem' }}>
            <ArrowRightLeft size={18} />
            <span>TRANSPARENT MARKETPLACE BENCHMARK</span>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '4px' }}>Store-to-Store Price & Delivery Comparison</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
            Compare live dealer quotes, freight availability, and dispatch times across local hardware stores.
          </p>
        </div>

        {/* Material Selector Pills */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', marginBottom: '28px', paddingBottom: '4px' }}>
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProductId(p.id)}
              className={`btn ${selectedProductId === p.id ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.875rem' }}
            >
              <span>{p.name.split(' ').slice(0, 3).join(' ')}</span>
            </button>
          ))}
        </div>

        {/* Comparison Matrix Card */}
        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
            <img
              src={selectedProduct.imageUrl || '/images/ultratech_cement.jpg'}
              alt={selectedProduct.name}
              style={{ width: '80px', height: '80px', objectFit: 'contain', borderRadius: 'var(--radius-md)' }}
            />
            <div>
              <span className="badge badge-primary">{selectedProduct.brand}</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '4px' }}>{selectedProduct.name}</h2>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Unit: {selectedProduct.unit}</div>
            </div>
          </div>

          {/* Side-by-Side Store Cards */}
          <div className="grid grid-cols-3 gap-lg">
            {productOffers.map((offer) => {
              const store = retailers.find((r) => r.id === offer.retailerId) || retailers[0];

              return (
                <div
                  key={offer.id}
                  style={{
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px',
                    backgroundColor: 'var(--color-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{store.name}</h3>
                      <span className="badge badge-success">⭐ {store.rating}</span>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                      📍 {store.address}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Distance:</span>
                        <strong>{store.distance} km</strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Stock Available:</span>
                        <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>
                          {offer.stock} {selectedProduct.unit.split(' ')[0]}s
                        </span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Est. Dispatch:</span>
                        <strong>⚡ {offer.estimatedDeliveryMins} Mins</strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--color-text-muted)' }}>Delivery Model:</span>
                        <span>{store.deliveryTypes.join(' / ').toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Unit Price</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Outfit' }}>
                        ₹{offer.price.toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(offer, selectedProduct, store, 1)}
                      className="btn btn-primary btn-full"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <ShoppingCart size={16} />
                      <span>Order from {store.name.split(' ')[0]}</span>
                    </button>
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
