import React, { useState } from 'react';
import { X, Calculator, Plus, ShoppingCart, Sparkles } from 'lucide-react';
import { useApp } from '../../store';

export const MaterialCalculator: React.FC = () => {
  const { isMaterialCalcOpen, setIsMaterialCalcOpen, addToCart, products, offers, retailers, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'slab' | 'steel' | 'brick'>('slab');

  // Slab Calculator Inputs
  const [slabLength, setSlabLength] = useState<number>(30); // ft
  const [slabWidth, setSlabWidth] = useState<number>(40); // ft
  const [slabThickness, setSlabThickness] = useState<number>(5); // inches

  // Steel Calculator Inputs
  const [builtupArea, setBuiltupArea] = useState<number>(1200); // sqft

  // Brick Calculator Inputs
  const [wallLength, setWallLength] = useState<number>(50); // ft
  const [wallHeight, setWallHeight] = useState<number>(10); // ft
  const [wallThickness, setWallThickness] = useState<9 | 4.5>(9); // inches

  if (!isMaterialCalcOpen) return null;

  // Calculations for Concrete Slab (M20 grade 1:1.5:3 approx)
  const slabAreaSqFt = slabLength * slabWidth;
  const slabVolumeCuFt = slabAreaSqFt * (slabThickness / 12);
  const slabVolumeCuM = slabVolumeCuFt * 0.0283168;
  const dryVolumeCuM = slabVolumeCuM * 1.54; // 54% dry volume expansion
  // Cement in bags (1 bag = 0.035 m3, ratio sum = 1 + 1.5 + 3 = 5.5)
  const cementBagsCount = Math.ceil((dryVolumeCuM * (1 / 5.5)) / 0.035);
  // Sand in tons (density ~ 1.6 ton/m3)
  const sandTons = parseFloat((dryVolumeCuM * (1.5 / 5.5) * 1.6).toFixed(2));
  // Aggregate in tons (density ~ 1.55 ton/m3)
  const aggregateTons = parseFloat((dryVolumeCuM * (3 / 5.5) * 1.55).toFixed(2));

  // Calculations for Steel (approx 3.5 to 4 kg per sq ft of residential RCC slab)
  const steelKg = Math.round(builtupArea * 3.8);
  const steelPieces = Math.ceil(steelKg / 10.6); // 12mm 12m piece is ~10.6 kg

  // Calculations for Brickwork
  const wallVolumeCuFt = wallLength * wallHeight * (wallThickness / 12);
  const bricksCount = Math.round(wallVolumeCuFt * 13.5); // ~13.5 bricks per cu.ft of nominal masonry

  const handleAddSlabMaterials = () => {
    const cementProd = products.find((p) => p.id === 'p_cement_1') || products[0];
    const cementOffer = offers.find((o) => o.productId === cementProd.id) || offers[0];
    const store = retailers.find((r) => r.id === cementOffer.retailerId) || retailers[0];

    addToCart(cementOffer, cementProd, store, cementBagsCount);
    showToast(`Added ${cementBagsCount} Bags of Cement for your ${slabAreaSqFt} sq.ft Slab`, 'success');
    setIsMaterialCalcOpen(false);
  };

  const handleAddSteel = () => {
    const steelProd = products.find((p) => p.id === 'p_steel_1') || products[1];
    const steelOffer = offers.find((o) => o.productId === steelProd.id) || offers[2];
    const store = retailers.find((r) => r.id === steelOffer.retailerId) || retailers[0];

    addToCart(steelOffer, steelProd, store, steelPieces);
    showToast(`Added ${steelPieces} Rebars (${steelKg} Kg) for your project`, 'success');
    setIsMaterialCalcOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsMaterialCalcOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                backgroundColor: 'var(--color-primary-faded)',
                color: 'var(--color-primary)',
                padding: '10px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Calculator size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Civil Engineering Material Estimator</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Calculate exact quantity of cement, TMT steel rebars, sand & bricks with IS 456 standard ratios.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMaterialCalcOpen(false)}
            style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'var(--color-bg)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="tabs-container" style={{ marginBottom: '16px' }}>
          <button
            className={`tab-btn ${activeTab === 'slab' ? 'active' : ''}`}
            onClick={() => setActiveTab('slab')}
          >
            🏗️ Concrete Slab (RCC)
          </button>
          <button
            className={`tab-btn ${activeTab === 'steel' ? 'active' : ''}`}
            onClick={() => setActiveTab('steel')}
          >
            🔩 TMT Rebars / Steel
          </button>
          <button
            className={`tab-btn ${activeTab === 'brick' ? 'active' : ''}`}
            onClick={() => setActiveTab('brick')}
          >
            🧱 Brick Masonry Wall
          </button>
        </div>

        {/* Tab 1: Slab Concrete */}
        {activeTab === 'slab' && (
          <div>
            <div className="grid grid-cols-3 gap-md" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Slab Length (Feet)</label>
                <input
                  type="number"
                  min="1"
                  value={slabLength}
                  onChange={(e) => setSlabLength(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Slab Width (Feet)</label>
                <input
                  type="number"
                  min="1"
                  value={slabWidth}
                  onChange={(e) => setSlabWidth(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Thickness (Inches)</label>
                <input
                  type="number"
                  min="3"
                  max="12"
                  value={slabThickness}
                  onChange={(e) => setSlabThickness(Number(e.target.value))}
                />
              </div>
            </div>

            {/* Results Card */}
            <div
              style={{
                backgroundColor: 'var(--color-dark-surface)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8125rem', color: '#9CA3AF', fontWeight: 600 }}>
                  ESTIMATED MATERIALS (M20 GRADE 1:1.5:3 MIX)
                </span>
                <span className="badge badge-primary">Area: {slabAreaSqFt} Sq.Ft</span>
              </div>

              <div className="grid grid-cols-3 gap-md" style={{ textAlign: 'center' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FF4D4D' }}>{cementBagsCount}</div>
                  <div style={{ fontSize: '0.75rem', color: '#D1D5DB' }}>Cement Bags (50 Kg)</div>
                </div>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FBBF24' }}>{sandTons}</div>
                  <div style={{ fontSize: '0.75rem', color: '#D1D5DB' }}>River Sand (Tons)</div>
                </div>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#60A5FA' }}>{aggregateTons}</div>
                  <div style={{ fontSize: '0.75rem', color: '#D1D5DB' }}>20mm Aggregate (Tons)</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddSlabMaterials}
              className="btn btn-primary btn-full"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ShoppingCart size={18} />
              <span>Add {cementBagsCount} Cement Bags to Cart (₹{(cementBagsCount * 385).toLocaleString()})</span>
            </button>
          </div>
        )}

        {/* Tab 2: Steel Rebars */}
        {activeTab === 'steel' && (
          <div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Total Built-up RCC Slab Area (Sq.Ft)</label>
              <input
                type="number"
                min="100"
                value={builtupArea}
                onChange={(e) => setBuiltupArea(Number(e.target.value))}
              />
              <span className="form-hint">Standard residential construction requires ~3.8 Kg TMT steel per sq.ft</span>
            </div>

            {/* Results Card */}
            <div
              style={{
                backgroundColor: 'var(--color-dark-surface)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8125rem', color: '#9CA3AF', fontWeight: 600 }}>
                  ESTIMATED FE 550D TMT REBAR REQUIREMENT
                </span>
                <span className="badge badge-info">Area: {builtupArea} Sq.Ft</span>
              </div>

              <div className="grid grid-cols-2 gap-md" style={{ textAlign: 'center' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38BDF8' }}>
                    {(steelKg / 1000).toFixed(2)} <span style={{ fontSize: '0.9rem' }}>Tons</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#D1D5DB' }}>Total Weight ({steelKg.toLocaleString()} Kg)</div>
                </div>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4ADE80' }}>
                    {steelPieces} <span style={{ fontSize: '0.9rem' }}>Pieces</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#D1D5DB' }}>12mm Standard 12m Rebars</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddSteel}
              className="btn btn-primary btn-full"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <ShoppingCart size={18} />
              <span>Add {steelPieces} TMT Rebar Pieces to Cart</span>
            </button>
          </div>
        )}

        {/* Tab 3: Brick Masonry */}
        {activeTab === 'brick' && (
          <div>
            <div className="grid grid-cols-3 gap-md" style={{ marginBottom: '16px' }}>
              <div className="form-group">
                <label className="form-label">Wall Length (Feet)</label>
                <input
                  type="number"
                  min="1"
                  value={wallLength}
                  onChange={(e) => setWallLength(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Wall Height (Feet)</label>
                <input
                  type="number"
                  min="1"
                  value={wallHeight}
                  onChange={(e) => setWallHeight(Number(e.target.value))}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Wall Thickness</label>
                <select
                  value={wallThickness}
                  onChange={(e) => setWallThickness(Number(e.target.value) as 9 | 4.5)}
                >
                  <option value={9}>9" (Main Outer Wall)</option>
                  <option value={4.5}>4.5" (Partition Wall)</option>
                </select>
              </div>
            </div>

            {/* Results Card */}
            <div
              style={{
                backgroundColor: 'var(--color-dark-surface)',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8125rem', color: '#9CA3AF', fontWeight: 600 }}>
                  MASONRY BRICKS & MORTAR CALCULATION
                </span>
                <span className="badge badge-warning">Volume: {wallVolumeCuFt.toFixed(1)} Cu.Ft</span>
              </div>

              <div className="grid grid-cols-2 gap-md" style={{ textAlign: 'center' }}>
                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FB923C' }}>
                    {bricksCount.toLocaleString()} <span style={{ fontSize: '0.9rem' }}>Units</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#D1D5DB' }}>First Class Red Clay Bricks</div>
                </div>

                <div style={{ backgroundColor: 'rgba(255,255,255,0.06)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#A78BFA' }}>
                    {Math.ceil(bricksCount / 400)} <span style={{ fontSize: '0.9rem' }}>Bags</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#D1D5DB' }}>Cement for Mortar (1:6)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
