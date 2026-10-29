import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  X,
  Store,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../store';
import { Product, RetailerProductOffer } from '../../types';

export const RetailerInventoryPage: React.FC = () => {
  const {
    products,
    offers,
    retailers,
    selectedRetailerId,
    setSelectedRetailerId,
    selectedStore,
    updateOfferStock,
    updateOfferPrice,
    stockFromCatalog,
    addProduct,
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isStockCatalogModalOpen, setIsStockCatalogModalOpen] = useState(false);
  const [isAddCustomModalOpen, setIsAddCustomModalOpen] = useState(false);

  // Stock from catalog state
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCatalogProduct, setSelectedCatalogProduct] = useState<Product | null>(null);
  const [stockPrice, setStockPrice] = useState<number>(420);
  const [stockQty, setStockQty] = useState<number>(100);
  const [minOrderQty, setMinOrderQty] = useState<number>(1);

  // Custom product state
  const [newProdName, setNewProdName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('Structural Materials');
  const [newUnit, setNewUnit] = useState('50 Kg Bag');
  const [newPrice, setNewPrice] = useState<number>(390);
  const [newStock, setNewStock] = useState<number>(100);

  // Active Store resolution
  const activeStoreId = selectedRetailerId || selectedStore.id;

  // Store offers filtered by active store, or available offers
  const matchingOffers = offers.filter((o) => o.retailerId === activeStoreId);
  const storeOffers = matchingOffers.length > 0 ? matchingOffers : offers.filter((o) => o.retailerId === selectedStore.id || o.retailerId === retailers[0]?.id);

  const inventoryItems = storeOffers.map((offer) => {
    const product = products.find((p) => p.id === offer.productId) || {
      id: offer.productId,
      name: 'Building Material',
      brand: 'Standard',
      category: 'General',
      unit: 'Units',
      imageUrl: '/images/tmt_steel_rebars.jpg',
      isActive: true,
    };
    return { offer, product };
  });

  const categories = ['All', ...Array.from(new Set(inventoryItems.map((i) => i.product.category).filter(Boolean)))];

  const filtered = inventoryItems.filter((item) => {
    const matchesSearch =
      item.product.name.toLowerCase().includes(search.toLowerCase()) ||
      item.product.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.product.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Quick stock all catalog items if empty
  const handleStockAllCatalog = () => {
    products.forEach((prod) => {
      stockFromCatalog(prod.id, 450, 100);
    });
  };

  // Inventory stats
  const totalSkus = storeOffers.length;
  const inStockCount = storeOffers.filter((o) => o.stock > 10).length;
  const lowStockCount = storeOffers.filter((o) => o.stock > 0 && o.stock <= 10).length;
  const outOfStockCount = storeOffers.filter((o) => o.stock === 0).length;
  const totalInventoryValue = storeOffers.reduce((sum, o) => sum + o.price * o.stock, 0);

  // Master catalog candidates (unstocked or all)
  const masterCatalogFiltered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(catalogSearch.toLowerCase())
  );

  const handleSelectCatalogProduct = (p: Product) => {
    setSelectedCatalogProduct(p);
    const existingAny = offers.find((o) => o.productId === p.id);
    const basePrice = existingAny ? existingAny.price : 450;
    setStockPrice(basePrice);
    setStockQty(50);
  };

  const handleStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatalogProduct) return;
    stockFromCatalog(selectedCatalogProduct.id, stockPrice, stockQty, minOrderQty);
    setIsStockCatalogModalOpen(false);
    setSelectedCatalogProduct(null);
  };

  const handleAddNewCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newBrand || !newPrice) return;

    const prodId = `prod_${Date.now()}`;
    const offerId = `off_${selectedRetailerId}_${prodId}`;

    const newProduct: Product = {
      id: prodId,
      name: newProdName,
      brand: newBrand,
      category: newCategory,
      unit: newUnit,
      isActive: true,
      imageUrl: '/images/tmt_steel_rebars.jpg',
    };

    const newOffer: RetailerProductOffer = {
      id: offerId,
      productId: prodId,
      retailerId: selectedRetailerId,
      price: newPrice,
      stock: newStock,
      isAvailable: true,
      estimatedDeliveryMins: 35,
      storeName: selectedStore.name,
      storeRating: selectedStore.rating,
    };

    addProduct(newProduct, newOffer);
    setIsAddCustomModalOpen(false);
    setNewProdName('');
    setNewBrand('');
  };

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Multi-Vendor Store Switcher Bar */}
        <div
          className="card"
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '20px 28px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#FFF',
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Store size={26} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Vendor Store
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#FFFFFF' }}>{selectedStore.name}</h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Switch Store:</span>
            <select
              value={selectedRetailerId}
              onChange={(e) => setSelectedRetailerId(e.target.value)}
              style={{
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                border: '1px solid #334155',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {retailers.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.address.split(',')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Page Header & Primary Actions */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Store Inventory & Stock Levels</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
              Manage active warehouse SKUs, real-time stock counts, and instant wholesale pricing.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                setSelectedCatalogProduct(null);
                setIsStockCatalogModalOpen(true);
              }}
              className="btn btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Package size={18} />
              <span>Stock from Master Catalog</span>
            </button>

            <button
              onClick={() => setIsAddCustomModalOpen(true)}
              className="btn btn-secondary"
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Plus size={18} />
              <span>Add Custom SKU</span>
            </button>
          </div>
        </div>

        {/* Inventory Summary Stats */}
        <div className="grid grid-cols-4 gap-md" style={{ marginBottom: '28px' }}>
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>TOTAL SKUS</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '4px', fontFamily: 'Outfit' }}>{totalSkus}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>Catalog items stocked</div>
          </div>
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 700 }}>IN STOCK</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '4px', fontFamily: 'Outfit', color: '#16A34A' }}>
              {inStockCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '2px' }}>Ready for dispatch</div>
          </div>
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', color: '#D97706', fontWeight: 700 }}>LOW STOCK</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '4px', fontFamily: 'Outfit', color: '#D97706' }}>
              {lowStockCount}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#D97706', marginTop: '2px' }}>Under 10 units</div>
          </div>
          <div className="card" style={{ padding: '18px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>EST. STOCK VALUE</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '4px', fontFamily: 'Outfit' }}>
              ₹{totalInventoryValue.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>At current selling rates</div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: selectedCategory === cat ? 'var(--color-primary)' : 'var(--color-bg)',
                  color: selectedCategory === cat ? '#FFFFFF' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search material SKU or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '38px', width: '100%' }}
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Material Name</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Category & Unit</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Warehouse Stock</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Selling Price</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Quick Adjust</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      <Package size={42} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--color-text)' }}>
                        No inventory items found for {selectedStore.name}.
                      </div>
                      <div style={{ fontSize: '0.875rem', marginTop: '6px', marginBottom: '16px' }}>
                        Stock materials directly from the live master catalog or add custom vendor SKUs.
                      </div>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button onClick={() => setIsStockCatalogModalOpen(true)} className="btn btn-primary btn-sm">
                          Browse Master Catalog
                        </button>
                        <button onClick={handleStockAllCatalog} className="btn btn-secondary btn-sm">
                          ⚡ Auto-Stock Live Catalog ({products.length} SKUs)
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map(({ offer, product }) => (
                    <tr key={offer.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={product.imageUrl || '/images/tmt_steel_rebars.jpg'}
                            alt={product.name}
                            style={{ width: '42px', height: '42px', borderRadius: '8px', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80';
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 800 }}>{product.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                              Brand: {product.brand} • SKU: {product.sku || product.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600 }}>{product.category}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{product.unit}</div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit' }}>
                            {offer.stock}
                          </span>
                          {offer.stock <= 10 && offer.stock > 0 && <span className="badge badge-warning">Low</span>}
                          {offer.stock === 0 && <span className="badge badge-error">Out</span>}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span
                            style={{
                              fontSize: '1.15rem',
                              fontWeight: 900,
                              color: 'var(--color-primary)',
                              fontFamily: 'Outfit',
                            }}
                          >
                            ₹{offer.price}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`badge ${offer.stock > 0 ? 'badge-success' : 'badge-error'}`}>
                          {offer.stock > 0 ? 'ACTIVE (In Stock)' : 'OUT OF STOCK'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => updateOfferStock(offer.id, Math.max(0, offer.stock - 20))}
                            className="btn btn-secondary btn-sm"
                            title="Decrease stock by 20"
                          >
                            -20
                          </button>
                          <button
                            onClick={() => updateOfferStock(offer.id, offer.stock + 50)}
                            className="btn btn-secondary btn-sm"
                            title="Increase stock by 50"
                          >
                            +50
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Master Catalog Stocking Modal */}
        {isStockCatalogModalOpen && (
          <div className="modal-overlay" onClick={() => setIsStockCatalogModalOpen(false)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '780px', width: '90%', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '20px',
                  borderBottom: '1px solid var(--color-border)',
                  paddingBottom: '16px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 900 }}>Stock Product from Master Catalog</h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    Select a verified material from the BuildKart master catalog and set your store's pricing & stock.
                  </p>
                </div>
                <button
                  onClick={() => setIsStockCatalogModalOpen(false)}
                  style={{
                    padding: '8px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-bg)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {!selectedCatalogProduct ? (
                <div>
                  <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <Search
                      size={18}
                      color="var(--color-text-muted)"
                      style={{ position: 'absolute', left: '12px', top: '12px' }}
                    />
                    <input
                      type="text"
                      placeholder="Search master catalog by material, brand, or category..."
                      value={catalogSearch}
                      onChange={(e) => setCatalogSearch(e.target.value)}
                      style={{ paddingLeft: '38px', width: '100%' }}
                      autoFocus
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                    {masterCatalogFiltered.slice(0, 12).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelectCatalogProduct(p)}
                        style={{
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          backgroundColor: '#FFFFFF',
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)')}
                      >
                        <img
                          src={p.imageUrl || '/images/tmt_steel_rebars.jpg'}
                          alt={p.name}
                          style={{ width: '100%', height: '110px', objectFit: 'cover', borderRadius: '6px', marginBottom: '10px' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80';
                          }}
                        />
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                          {p.category}
                        </div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', marginTop: '2px', lineHeight: 1.3 }}>
                          {p.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                          Brand: {p.brand} • Unit: {p.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleStockSubmit}>
                  {/* Selected Product Preview Card */}
                  <div
                    style={{
                      backgroundColor: 'var(--color-bg)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '20px',
                      display: 'flex',
                      gap: '20px',
                      marginBottom: '24px',
                    }}
                  >
                    <img
                      src={selectedCatalogProduct.imageUrl || '/images/tmt_steel_rebars.jpg'}
                      alt={selectedCatalogProduct.name}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80';
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span className="badge badge-primary">{selectedCatalogProduct.category}</span>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 900, marginTop: '6px' }}>
                            {selectedCatalogProduct.name}
                          </h4>
                          <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                            Brand: <strong>{selectedCatalogProduct.brand}</strong> • Standard Unit: <strong>{selectedCatalogProduct.unit}</strong>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedCatalogProduct(null)}
                          className="btn btn-secondary btn-sm"
                        >
                          Change Material
                        </button>
                      </div>

                      {selectedCatalogProduct.specifications && Object.keys(selectedCatalogProduct.specifications).length > 0 && (
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                          {Object.entries(selectedCatalogProduct.specifications).map(([key, val]) => (
                            <span
                              key={key}
                              style={{
                                fontSize: '0.75rem',
                                backgroundColor: '#FFFFFF',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid var(--color-border)',
                              }}
                            >
                              <strong>{key}:</strong> {String(val)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Stock Input Fields */}
                  <div className="grid grid-cols-3 gap-md" style={{ marginBottom: '24px' }}>
                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700 }}>
                        Your Selling Price (₹)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={stockPrice}
                        onChange={(e) => setStockPrice(Number(e.target.value))}
                        required
                        style={{ fontSize: '1.1rem', fontWeight: 800 }}
                      />
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Per {selectedCatalogProduct.unit}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700 }}>
                        Stock to Add (Units)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={stockQty}
                        onChange={(e) => setStockQty(Number(e.target.value))}
                        required
                        style={{ fontSize: '1.1rem', fontWeight: 800 }}
                      />
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Current warehouse count
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 700 }}>
                        Min Order Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={minOrderQty}
                        onChange={(e) => setMinOrderQty(Number(e.target.value))}
                        required
                        style={{ fontSize: '1.1rem', fontWeight: 800 }}
                      />
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Min units per order
                      </div>
                    </div>
                  </div>

                  {/* Margin & Gross Revenue Preview */}
                  <div
                    style={{
                      backgroundColor: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      borderRadius: 'var(--radius-md)',
                      padding: '14px 18px',
                      marginBottom: '24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <TrendingUp size={20} color="#059669" />
                      <div>
                        <div style={{ fontWeight: 800, color: '#065F46', fontSize: '0.9rem' }}>
                          Stock Value Addition: ₹{(stockPrice * stockQty).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                          Target Store: <strong>{selectedStore.name}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setIsStockCatalogModalOpen(false)}
                      className="btn btn-secondary"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                      Confirm & Add to {selectedStore.name}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Custom SKU Modal */}
        {isAddCustomModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddCustomModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Add Custom Material SKU</h3>
                <button
                  onClick={() => setIsAddCustomModalOpen(false)}
                  style={{
                    padding: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--color-bg)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddNewCustomProduct}>
                <div className="form-group">
                  <label className="form-label">Material Name</label>
                  <input
                    type="text"
                    placeholder="e.g. JSW Neosteel 550D TMT Bar (16mm)"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-md">
                  <div className="form-group">
                    <label className="form-label">Brand</label>
                    <input
                      type="text"
                      placeholder="e.g. JSW Steel"
                      value={newBrand}
                      onChange={(e) => setNewBrand(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                      <option value="Structural Materials">Structural Materials</option>
                      <option value="Electrical Supplies">Electrical Supplies</option>
                      <option value="Plumbing & Sanitary">Plumbing & Sanitary</option>
                      <option value="Paints & Finishing">Paints & Finishing</option>
                      <option value="Power Tools & Hardware">Power Tools & Hardware</option>
                      <option value="Aggregates & Sand">Aggregates & Sand</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-md">
                  <div className="form-group">
                    <label className="form-label">Unit of Measure</label>
                    <input
                      type="text"
                      placeholder="e.g. Piece / Bag"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Initial Stock</label>
                    <input
                      type="number"
                      value={newStock}
                      onChange={(e) => setNewStock(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddCustomModalOpen(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Save Material to Store
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
