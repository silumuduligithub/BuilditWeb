import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, ArrowUpDown, Plus, Check, Star, Truck, ArrowLeft } from 'lucide-react';
import { useApp } from '../../store';
import { mockCategories } from '../../services/mockData';

export const CategoriesPage: React.FC = () => {
  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Material Categories</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
            Select a construction category to view verified store supplies, manufacturer grades & pricing.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-lg">
          {mockCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="card card-interactive"
              style={{ padding: '24px', textDecoration: 'none' }}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>{cat.icon}</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-text-main)', marginBottom: '6px' }}>
                {cat.name}
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                {cat.subcategories}
              </p>
              <span className="btn btn-secondary btn-sm btn-full" style={{ color: 'var(--color-primary)' }}>
                View All {cat.itemCount} Items →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CategoryProductsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, offers, retailers, addToCart } = useApp();

  const currentCategory = mockCategories.find((c) => c.slug === slug) || mockCategories[0];

  // Filters
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [priceSort, setPriceSort] = useState<'asc' | 'desc' | 'default'>('default');

  const categoryProducts = products.filter((p) => {
    if (slug === 'structural') return p.category === 'Structural Materials';
    if (slug === 'electrical') return p.category === 'Electrical Supplies';
    if (slug === 'plumbing') return p.category === 'Plumbing & Sanitary';
    if (slug === 'finishing') return p.category === 'Paints & Finishing';
    if (slug === 'hardware') return p.category === 'Power Tools & Hardware';
    return true;
  });

  const availableBrands = Array.from(new Set(categoryProducts.map((p) => p.brand)));

  let filtered = categoryProducts.filter((p) => (selectedBrand === 'all' ? true : p.brand === selectedBrand));

  if (priceSort === 'asc') {
    filtered.sort((a, b) => {
      const pA = offers.find((o) => o.productId === a.id)?.price || 0;
      const pB = offers.find((o) => o.productId === b.id)?.price || 0;
      return pA - pB;
    });
  } else if (priceSort === 'desc') {
    filtered.sort((a, b) => {
      const pA = offers.find((o) => o.productId === a.id)?.price || 0;
      const pB = offers.find((o) => o.productId === b.id)?.price || 0;
      return pB - pA;
    });
  }

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', fontSize: '0.875rem' }}>
          <Link to="/categories" style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowLeft size={16} />
            <span>All Categories</span>
          </Link>
          <span style={{ color: 'var(--color-text-muted)' }}>/</span>
          <span style={{ color: 'var(--color-text-secondary)', fontWeight: 600 }}>{currentCategory.name}</span>
        </div>

        {/* Category Header */}
        <div
          style={{
            backgroundColor: 'var(--color-dark-surface)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            padding: '28px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '2rem', marginBottom: '4px' }}>{currentCategory.icon}</div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#FFFFFF' }}>{currentCategory.name}</h1>
            <p style={{ color: '#D1D5DB', fontSize: '0.875rem', marginTop: '4px' }}>{currentCategory.subcategories}</p>
          </div>
          <span className="badge badge-primary" style={{ fontSize: '0.875rem', padding: '6px 14px' }}>
            {filtered.length} Materials Available
          </span>
        </div>

        {/* Layout with Filters & Catalog */}
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px' }}>
          {/* Filters Sidebar */}
          <aside>
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, marginBottom: '16px' }}>
                <Filter size={18} color="var(--color-primary)" />
                <span>Filters & Refinements</span>
              </div>

              {/* Brand Filter */}
              <div className="form-group">
                <label className="form-label">Manufacturer Brand</label>
                <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
                  <option value="all">All Brands ({categoryProducts.length})</option>
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Price */}
              <div className="form-group">
                <label className="form-label">Sort by Price</label>
                <select
                  value={priceSort}
                  onChange={(e) => setPriceSort(e.target.value as 'asc' | 'desc' | 'default')}
                >
                  <option value="default">Popularity & Rating</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main>
            <div className="grid grid-cols-3 gap-md">
              {filtered.map((prod) => {
                const bestOffer = offers.find((o) => o.productId === prod.id) || offers[0];
                const store = retailers.find((r) => r.id === bestOffer.retailerId) || retailers[0];

                return (
                  <div key={prod.id} className="card card-interactive" style={{ display: 'flex', flexDirection: 'column' }}>
                    <Link to={`/product/${prod.id}`} style={{ position: 'relative', height: '170px' }}>
                      <img
                        src={prod.imageUrl || '/images/ultratech_cement.jpg'}
                        alt={prod.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          backgroundColor: '#111827',
                          color: '#FFF',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                        }}
                      >
                        {prod.brand}
                      </div>
                    </Link>

                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                        {prod.unit}
                      </div>

                      <Link to={`/product/${prod.id}`} style={{ textDecoration: 'none' }}>
                        <h4
                          style={{
                            fontSize: '0.9375rem',
                            fontWeight: 700,
                            lineHeight: 1.35,
                            marginBottom: '8px',
                            color: 'var(--color-text-main)',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '2.7em',
                          }}
                        >
                          {prod.name}
                        </h4>
                      </Link>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                        <span>📍 {store.name.slice(0, 18)}...</span>
                        <span style={{ fontWeight: 700, color: '#D97706' }}>⭐ {prod.rating || 4.8}</span>
                      </div>

                      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--color-border-light)' }}>
                        <div>
                          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-main)', fontFamily: 'Outfit' }}>
                            ₹{bestOffer.price.toLocaleString()}
                          </div>
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
          </main>
        </div>
      </div>
    </div>
  );
};
