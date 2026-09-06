import React from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Zap,
  ArrowRight,
  Calculator,
  Store,
  Plus,
  ArrowRightLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../store';
import { mockCategories } from '../../services/mockData';

export const HomePage: React.FC = () => {
  const { products, retailers, offers, addToCart, setIsMaterialCalcOpen } = useApp();

  return (
    <div className="main-content">
      {/* Hero Section — Soft Slate Ergonomic Palette */}
      <section
        style={{
          background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 55%, #182234 100%)',
          color: '#FFFFFF',
          padding: '52px 0 68px',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Subtle geometric pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(220, 38, 38, 0.1) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }}
        />

        <div className="app-container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="grid grid-cols-2 gap-xl" style={{ alignItems: 'center' }}>
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(220, 38, 38, 0.14)',
                  border: '1px solid rgba(220, 38, 38, 0.28)',
                  padding: '5px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  color: '#FCA5A5',
                  marginBottom: '18px',
                  letterSpacing: '0.02em',
                }}
              >
                <Zap size={14} />
                <span>ON-DEMAND CONSTRUCTION MATERIALS & HARDWARE</span>
              </div>

              <h1
                style={{
                  fontSize: '2.8rem',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  lineHeight: 1.15,
                  letterSpacing: '-0.02em',
                  marginBottom: '18px',
                }}
              >
                Heavy Materials Delivered to Your Site in <span style={{ color: '#EF4444' }}>60 Minutes</span>
              </h1>

              <p style={{ fontSize: '1.05rem', color: '#CBD5E1', lineHeight: 1.65, marginBottom: '30px', maxWidth: '520px' }}>
                Order UltraTech Cement, Tata Tiscon TMT rebars, washed river sand, Havells wiring & plumbing supplies from top-rated local hardware stores with live GPS tracking.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link to="/categories" className="btn btn-primary btn-lg" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Browse 1,000+ Materials</span>
                  <ArrowRight size={18} />
                </Link>

                <button
                  onClick={() => setIsMaterialCalcOpen(true)}
                  className="btn btn-secondary btn-lg"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                >
                  <Calculator size={18} color="#F87171" />
                  <span>Slab & Steel Estimator</span>
                </button>
              </div>

              {/* Stats Bar */}
              <div
                style={{
                  display: 'flex',
                  gap: '28px',
                  marginTop: '36px',
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'Outfit' }}>50+</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Verified Local Stores</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'Outfit' }}>60 Mins</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Avg Site Dispatch</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#FFFFFF', fontFamily: 'Outfit' }}>100%</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>BIS Certified Materials</div>
                </div>
              </div>
            </div>

            {/* Hero Interactive Preview Card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div
                className="card"
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.85)',
                  backdropFilter: 'blur(8px)',
                  borderColor: 'rgba(51, 65, 85, 0.8)',
                  color: '#FFFFFF',
                  maxWidth: '440px',
                  width: '100%',
                  padding: '24px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: '#22C55E',
                        boxShadow: '0 0 8px #22C55E',
                      }}
                    />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#94A3B8' }}>LIVE SITE DELIVERY</span>
                  </div>
                  <span className="badge badge-primary">Order #BK-260906</span>
                </div>

                <div style={{ backgroundColor: '#0F172A', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ backgroundColor: 'var(--color-primary)', color: '#FFF', padding: '10px', borderRadius: 'var(--radius-md)' }}>
                      <Truck size={24} className="animate-truck" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem' }}>Heavy Truck Dispatched</div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>50x UltraTech Cement OPC 53 Grade</div>
                    </div>
                  </div>

                  <div style={{ marginTop: '14px', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#CBD5E1' }}>
                    <span>Destination: Hitec City Phase 2</span>
                    <span style={{ color: '#38BDF8', fontWeight: 700 }}>Arriving in 18 Mins</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link to="/tracking/BK-260906-00125" className="btn btn-primary btn-sm btn-full">
                    Track Live GPS Route →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ padding: '52px 0 28px' }}>
        <div className="app-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Material Categories</h2>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem', marginTop: '2px' }}>
                Procure directly from top industrial manufacturers & hardware distributors.
              </p>
            </div>
            <Link
              to="/categories"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: '0.9375rem',
              }}
            >
              <span>View All</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-md">
            {mockCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="category-card"
              >
                <div className="category-thumb">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80'}
                    alt={cat.name}
                    loading="lazy"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {cat.name}
                    </h3>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cat.subcategories}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700, marginTop: '4px', display: 'inline-block' }}>
                    {cat.itemCount} Items Available →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Construction Materials */}
      <section style={{ padding: '36px 0 48px' }}>
        <div className="app-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.8125rem' }}>
                <TrendingUp size={16} />
                <span>POPULAR ON SITE TODAY</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '2px' }}>
                Trending Construction Supplies
              </h2>
            </div>
            <Link
              to="/compare"
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <ArrowRightLeft size={16} />
              <span>Compare Store Prices</span>
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-md">
            {products.slice(0, 8).map((prod) => {
              const bestOffer = offers.find((o) => o.productId === prod.id) || offers[0];
              const store = retailers.find((r) => r.id === bestOffer.retailerId) || retailers[0];

              return (
                <div key={prod.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Product Image */}
                  <Link to={`/product/${prod.id}`} className="product-img-wrapper">
                    <img
                      src={prod.imageUrl || '/images/ultratech_cement.jpg'}
                      alt={prod.name}
                      loading="lazy"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        backgroundColor: '#0F172A',
                        color: '#FFFFFF',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      {prod.brand}
                    </div>

                    {bestOffer.mrp && bestOffer.mrp > bestOffer.price && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          backgroundColor: 'var(--color-primary)',
                          color: '#FFFFFF',
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '3px 7px',
                          borderRadius: 'var(--radius-full)',
                          boxShadow: '0 2px 4px rgba(220,38,38,0.3)',
                        }}
                      >
                        {Math.round(((bestOffer.mrp - bestOffer.price) / bestOffer.mrp) * 100)}% OFF
                      </div>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                      {prod.category} • {prod.unit}
                    </div>

                    <Link to={`/product/${prod.id}`} style={{ textDecoration: 'none' }}>
                      <h4
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 700,
                          lineHeight: 1.4,
                          marginBottom: '8px',
                          color: 'var(--color-text-main)',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          height: '2.8em',
                        }}
                      >
                        {prod.name}
                      </h4>
                    </Link>

                    {/* Store Origin & Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
                        📍 {store.name}
                      </span>
                      <span style={{ fontWeight: 700, color: '#D97706' }}>⭐ {prod.rating || 4.8}</span>
                    </div>

                    {/* Price and Cart Action */}
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--color-border-light)' }}>
                      <div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-main)', fontFamily: 'Outfit' }}>
                          ₹{bestOffer.price.toLocaleString()}
                        </div>
                        {bestOffer.mrp && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textDecoration: 'line-through' }}>
                            ₹{bestOffer.mrp.toLocaleString()}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => addToCart(bestOffer, prod, store, 1)}
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
      </section>

      {/* Verified Local Hardware Stores Directory */}
      <section style={{ padding: '48px 0', backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="app-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#2563EB', fontWeight: 700, fontSize: '0.8125rem' }}>
                <Store size={16} />
                <span>HYPERLOCAL STORE PARTNERS</span>
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '2px' }}>
                Hardware Stores Near Your Project
              </h2>
            </div>
            <Link to="/stores" style={{ color: 'var(--color-primary)', fontWeight: 700, fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>View All Stores</span>
              <ChevronRight size={18} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-lg">
            {retailers.map((store) => (
              <div key={store.id} className="card" style={{ display: 'flex', overflow: 'hidden' }}>
                <div style={{ width: '190px', flexShrink: 0, position: 'relative', overflow: 'hidden', backgroundColor: 'var(--color-surface-soft)' }}>
                  <img
                    src={store.bannerImage || '/images/hardware_store_front.jpg'}
                    alt={store.name}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <Link to={`/stores/${store.id}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                        {store.name}
                      </h3>
                    </Link>
                    <span
                      style={{
                        backgroundColor: store.isOpen ? '#DCFCE7' : '#FEE2E2',
                        color: store.isOpen ? '#166534' : '#991B1B',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                      }}
                    >
                      {store.isOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '8px', lineHeight: 1.4 }}>
                    {store.address}
                  </p>

                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '12px', flexWrap: 'wrap' }}>
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

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                    <Link to={`/stores/${store.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                      Visit Store Catalog →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
