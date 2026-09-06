import React, { useState } from 'react';
import { Package, Plus, Edit2, AlertCircle, Check, Search, Trash2, X } from 'lucide-react';
import { useApp } from '../../store';
import { Product, RetailerProductOffer } from '../../types';

export const RetailerInventoryPage: React.FC = () => {
  const { products, offers, retailerProfile, updateOfferStock, updateOfferPrice, addProduct } = useApp();

  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New product form
  const [newProdName, setNewProdName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('Structural Materials');
  const [newUnit, setNewUnit] = useState('50 Kg Bag');
  const [newPrice, setNewPrice] = useState<number>(390);
  const [newStock, setNewStock] = useState<number>(100);

  const storeOffers = offers.filter((o) => o.retailerId === retailerProfile.id);

  const inventoryItems = storeOffers.map((offer) => {
    const product = products.find((p) => p.id === offer.productId) || products[0];
    return { offer, product };
  });

  const filtered = inventoryItems.filter(
    (item) =>
      item.product.name.toLowerCase().includes(search.toLowerCase()) ||
      item.product.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddNewProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newBrand || !newPrice) return;

    const prodId = `prod_${Date.now()}`;
    const offerId = `offer_${Date.now()}`;

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
      retailerId: retailerProfile.id,
      storeName: retailerProfile.name,
      price: newPrice,
      stock: newStock,
      isAvailable: true,
      estimatedDeliveryMins: 35,
    };

    addProduct(newProduct, newOffer);
    setIsAddModalOpen(false);
    setNewProdName('');
    setNewBrand('');
  };

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Store Inventory & Stock Levels</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
              Update live warehouse stock counts and unit pricing shown to local contractors.
            </p>
          </div>

          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={18} />
            <span>Add New Construction Material</span>
          </button>
        </div>

        {/* Search Bar */}
        <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '380px' }}>
          <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '10px' }} />
          <input
            type="text"
            placeholder="Search material SKU or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '38px', width: '100%' }}
          />
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
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Availability</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Quick Adjust</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(({ offer, product }) => (
                  <tr key={offer.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 800 }}>{product.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                        Brand: {product.brand} • SKU: {product.sku || 'SKU-GEN'}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div>{product.category}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{product.unit}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit' }}>
                          {offer.stock}
                        </span>
                        {offer.stock < 50 && <span className="badge badge-warning">Low</span>}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Outfit' }}>
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
                        >
                          -20
                        </button>
                        <button
                          onClick={() => updateOfferStock(offer.id, offer.stock + 50)}
                          className="btn btn-secondary btn-sm"
                        >
                          +50
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Product Modal */}
        {isAddModalOpen && (
          <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Add New Material to Catalog</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'var(--color-bg)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleAddNewProduct}>
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
                    onClick={() => setIsAddModalOpen(false)}
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
