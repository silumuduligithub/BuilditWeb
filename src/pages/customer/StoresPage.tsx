import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, MapPin, Phone, Star, Clock, Truck, ShieldCheck, Plus, ArrowLeft, Search } from 'lucide-react';
import { useApp } from '../../store';

export const StoresPage: React.FC = () => {
  const { retailers } = useApp();
  const [search, setSearch] = useState('');

  const filtered = retailers.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Verified Hardware Stores</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
              Find licensed construction material dealers and stockists in your locality.
            </p>
          </div>

          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search store name or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '38px', width: '100%' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-lg">
          {filtered.map((store) => (
            <div key={store.id} className="card card-interactive" style={{ display: 'flex', overflow: 'hidden' }}>
              <img
                src={store.bannerImage || '/images/hardware_store_front.jpg'}
                alt={store.name}
                style={{ width: '190px', objectFit: 'cover' }}
              />
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <Link to={`/stores/${store.id}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-text-main)' }}>{store.name}</h3>
                  </Link>
                  <span
                    style={{
                      backgroundColor: store.isOpen ? '#DCFCE7' : '#FEE2E2',
                      color: store.isOpen ? '#166534' : '#991B1B',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    {store.isOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                  <MapPin size={15} color="var(--color-primary)" />
                  <span>{store.address}</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                  <span>📍 <strong>{store.distance} km</strong> away</span>
                  <span>⭐ <strong>{store.rating}</strong> ({store.reviewsCount} reviews)</span>
                  <span>🚚 <strong>{store.deliveryRadiusKm} km</strong> radius</span>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {store.badges?.map((b, i) => (
                    <span key={i} className="badge badge-info" style={{ fontSize: '0.6875rem' }}>
                      {b}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: 'auto' }}>
                  <Link to={`/stores/${store.id}`} className="btn btn-primary btn-sm btn-full">
                    View Complete Inventory Catalog →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StoreDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { retailers, products, offers, addToCart, showToast } = useApp();

  const store = retailers.find((r) => r.id === id) || retailers[0];
  const storeOffers = offers.filter((o) => o.retailerId === store.id);

  const [activeCategoryTab, setActiveCategoryTab] = useState('all');

  const storeProducts = products.filter((p) => storeOffers.some((o) => o.productId === p.id));
  const filteredProducts =
    activeCategoryTab === 'all'
      ? storeProducts
      : storeProducts.filter((p) => p.category.toLowerCase().includes(activeCategoryTab.toLowerCase()));

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Breadcrumb */}
        <div style={{ marginBottom: '16px', fontSize: '0.875rem' }}>
          <Link to="/stores" style={{ color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={16} />
            <span>All Stores Directory</span>
          </Link>
        </div>

        {/* Store Banner & Header */}
        <div
          className="card"
          style={{
            overflow: 'hidden',
            marginBottom: '28px',
          }}
        >
          <div style={{ height: '200px', position: 'relative' }}>
            <img
              src={store.bannerImage || '/images/hardware_store_front.jpg'}
              alt={store.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 70%)',
              }}
            />
            <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px', color: '#FFFFFF' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge badge-primary">{store.isOpen ? 'OPEN FOR ORDERS' : 'CLOSED'}</span>
                    <span className="badge badge-info">⭐ {store.rating} ({store.reviewsCount} Reviews)</span>
                    <span className="badge badge-dark">GST: {store.gstin || '36AABCU9603R1ZM'}</span>
                  </div>
                  <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#FFFFFF' }}>{store.name}</h1>
                  <p style={{ fontSize: '0.875rem', color: '#D1D5DB' }}>{store.address}</p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <a
                    href={`tel:${store.phone || '+919848011223'}`}
                    className="btn btn-secondary btn-sm"
                    style={{ backgroundColor: '#FFFFFF', color: '#111827' }}
                  >
                    <Phone size={15} />
                    <span>Call Store</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              padding: '16px 24px',
              backgroundColor: 'var(--color-bg)',
              display: 'flex',
              gap: '24px',
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
            }}
          >
            <div>⏱️ Operating Hours: <strong>{store.operatingHours || '08:00 AM - 09:00 PM'}</strong></div>
            <div>📍 Distance: <strong>{store.distance} km from your site</strong></div>
            <div>🚚 Fleet Dispatch Radius: <strong>{store.deliveryRadiusKm} km</strong></div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="tabs-container" style={{ marginBottom: '20px' }}>
          <button className={`tab-btn ${activeCategoryTab === 'all' ? 'active' : ''}`} onClick={() => setActiveCategoryTab('all')}>
            All Available Products ({storeProducts.length})
          </button>
          <button className={`tab-btn ${activeCategoryTab === 'structural' ? 'active' : ''}`} onClick={() => setActiveCategoryTab('structural')}>
            🏗️ Structural (Cement/Steel)
          </button>
          <button className={`tab-btn ${activeCategoryTab === 'electrical' ? 'active' : ''}`} onClick={() => setActiveCategoryTab('electrical')}>
            ⚡ Electrical
          </button>
          <button className={`tab-btn ${activeCategoryTab === 'plumbing' ? 'active' : ''}`} onClick={() => setActiveCategoryTab('plumbing')}>
            🚿 Plumbing
          </button>
          <button className={`tab-btn ${activeCategoryTab === 'finishing' ? 'active' : ''}`} onClick={() => setActiveCategoryTab('finishing')}>
            🎨 Paints & Finishing
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-4 gap-md">
          {filteredProducts.map((prod) => {
            const offer = storeOffers.find((o) => o.productId === prod.id) || offers[0];

            return (
              <div key={prod.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                <Link to={`/product/${prod.id}`} style={{ position: 'relative', height: '160px' }}>
                  <img
                    src={prod.imageUrl || '/images/ultratech_cement.jpg'}
                    alt={prod.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#111827', color: '#FFF', fontSize: '0.6875rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                    {prod.brand}
                  </div>
                </Link>

                <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                    {prod.unit}
                  </div>

                  <Link to={`/product/${prod.id}`} style={{ textDecoration: 'none' }}>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '8px', color: 'var(--color-text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '2.7em' }}>
                      {prod.name}
                    </h4>
                  </Link>

                  <div style={{ fontSize: '0.75rem', color: offer.stock > 0 ? 'var(--color-success)' : 'var(--color-error)', fontWeight: 700, marginBottom: '12px' }}>
                    {offer.stock > 0 ? `In Stock (${offer.stock} Units)` : 'Out of Stock'}
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--color-border-light)' }}>
                    <div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-main)', fontFamily: 'Outfit' }}>
                        ₹{offer.price.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(offer, prod, store, 1)}
                      className="btn btn-primary btn-sm"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Plus size={16} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
