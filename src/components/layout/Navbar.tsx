import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  MapPin,
  Search,
  ShoppingCart,
  Calculator,
  HardHat,
  Store,
  Truck,
  ShieldCheck,
  ChevronDown,
  Package,
  Percent,
  Layers,
  ArrowRightLeft,
  X,
} from 'lucide-react';
import { useApp } from '../../store';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    currentRole,
    setCurrentRole,
    currentAddress,
    setIsLocationModalOpen,
    setIsMaterialCalcOpen,
    setIsCartOpen,
    cart,
    products,
    retailers,
    isStoreOpen,
    toggleStoreOpen,
    isDriverOnline,
    toggleDriverOnline,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Search filter
  const searchResults = searchQuery.trim()
    ? {
        products: products
          .filter(
            (p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.category.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .slice(0, 5),
        stores: retailers
          .filter((r) => r.name.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice(0, 3),
      }
    : null;

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setIsRoleMenuOpen(false);
    if (role === 'customer') navigate('/');
    else if (role === 'retailer') navigate('/retailer');
    else if (role === 'delivery') navigate('/driver');
    else if (role === 'admin') navigate('/admin');
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'retailer':
        return { label: 'Store Partner', icon: <Store size={15} />, color: 'var(--color-dark-surface)' };
      case 'delivery':
        return { label: 'Logistics Partner', icon: <Truck size={15} />, color: '#1D4ED8' };
      case 'admin':
        return { label: 'Platform Admin', icon: <ShieldCheck size={15} />, color: '#7C3AED' };
      default:
        return { label: 'Buyer (Customer)', icon: <HardHat size={15} />, color: 'var(--color-primary)' };
    }
  };

  const currentRoleInfo = getRoleBadge(currentRole);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
        boxShadow: '0 1px 4px rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* Top Notification / Role Switcher Banner */}
      <div
        style={{
          backgroundColor: '#0F172A',
          color: '#F1F5F9',
          fontSize: '0.8125rem',
          padding: '6px var(--space-md)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              padding: '2px 6px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 700,
            }}
          >
            ⚡ EXPRESS FREIGHT
          </span>
          <span>Fast 60-Minute Construction Site Delivery & Direct Hardware Store Pickups</span>
        </div>

        {/* Live Role Switcher Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {currentRoleInfo.icon}
            <span>Mode: {currentRoleInfo.label}</span>
            <ChevronDown size={12} />
          </button>

          {isRoleMenuOpen && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: '6px',
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-xl)',
                width: '210px',
                zIndex: 200,
                overflow: 'hidden',
              }}
            >
              <div style={{ padding: '8px 12px', fontSize: '0.7rem', color: '#9CA3AF', borderBottom: '1px solid #374151' }}>
                SWITCH PORTAL VIEW:
              </div>
              {(['customer', 'retailer', 'delivery', 'admin'] as UserRole[]).map((r) => {
                const info = getRoleBadge(r);
                return (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '0.8125rem',
                      color: currentRole === r ? 'var(--color-primary-light)' : '#E5E7EB',
                      backgroundColor: currentRole === r ? 'rgba(255,255,255,0.08)' : 'transparent',
                      textAlign: 'left',
                      fontWeight: currentRole === r ? 700 : 500,
                    }}
                  >
                    {info.icon}
                    <span>{info.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px', gap: 'var(--space-md)' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <div
            style={{
              backgroundColor: 'var(--color-primary)',
              color: '#FFFFFF',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(224, 32, 32, 0.35)',
            }}
          >
            <HardHat size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#111827' }}>
                Build<span style={{ color: 'var(--color-primary)' }}>It</span>
              </span>
              <span style={{ fontSize: '0.65rem', backgroundColor: '#FEE2E2', color: 'var(--color-primary)', padding: '1px 4px', borderRadius: '3px', fontWeight: 800 }}>
                WEB
              </span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)', fontWeight: 600, marginTop: '-2px' }}>
              CONSTRUCTION MARKETPLACE
            </div>
          </div>
        </Link>

        {/* Location Selector (Customer view) */}
        {currentRole === 'customer' && (
          <button
            onClick={() => setIsLocationModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              maxWidth: '240px',
            }}
          >
            <MapPin size={16} color="var(--color-primary)" />
            <div style={{ textAlign: 'left', overflow: 'hidden' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Deliver To ({currentAddress.label})
              </div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {currentAddress.line1}, {currentAddress.pincode}
              </div>
            </div>
            <ChevronDown size={14} color="var(--color-text-muted)" />
          </button>
        )}

        {/* Search Bar with Autocomplete Dropdown */}
        {currentRole === 'customer' && (
          <div style={{ position: 'relative', flex: 1, maxWidth: '460px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: 'var(--color-bg)',
                borderRadius: 'var(--radius-full)',
                padding: '4px 16px',
                border: isSearchFocused ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                boxShadow: isSearchFocused ? '0 0 0 3px var(--color-primary-glow)' : 'none',
                transition: 'all 0.2s',
              }}
            >
              <Search size={18} color="var(--color-text-muted)" />
              <input
                type="text"
                placeholder="Search cement, TMT steel rebars, paints, sand, PVC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                style={{
                  border: 'none',
                  backgroundColor: 'transparent',
                  padding: '8px 10px',
                  width: '100%',
                  fontSize: '0.875rem',
                  boxShadow: 'none',
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ color: 'var(--color-text-muted)' }}>
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Search Suggestions Popup */}
            {isSearchFocused && searchResults && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '8px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-xl)',
                  zIndex: 200,
                  maxHeight: '380px',
                  overflowY: 'auto',
                  padding: '8px',
                }}
              >
                {searchResults.products.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', padding: '6px 8px' }}>
                      MATERIALS & PRODUCTS
                    </div>
                    {searchResults.products.map((prod) => (
                      <Link
                        key={prod.id}
                        to={`/product/${prod.id}`}
                        onClick={() => setSearchQuery('')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          textDecoration: 'none',
                          color: 'var(--color-text-main)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{prod.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {prod.brand} • {prod.unit}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 700 }}>View Offers →</span>
                      </Link>
                    ))}
                  </div>
                )}

                {searchResults.stores.length > 0 && (
                  <div style={{ marginTop: '8px', borderTop: '1px solid var(--color-border)', paddingTop: '6px' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', padding: '6px 8px' }}>
                      NEARBY HARDWARE STORES
                    </div>
                    {searchResults.stores.map((store) => (
                      <Link
                        key={store.id}
                        to={`/stores/${store.id}`}
                        onClick={() => setSearchQuery('')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-md)',
                          textDecoration: 'none',
                          color: 'var(--color-text-main)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{store.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                            {store.distance} km away • ⭐ {store.rating}
                          </div>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 700 }}>Open Store →</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Retailer Quick Status in Header */}
        {currentRole === 'retailer' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: isStoreOpen ? '#16A34A' : '#DC2626',
                  boxShadow: isStoreOpen ? '0 0 8px #16A34A' : 'none',
                }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                Store is {isStoreOpen ? 'ONLINE' : 'OFFLINE'}
              </span>
            </div>
            <button
              onClick={toggleStoreOpen}
              className={`btn btn-sm ${isStoreOpen ? 'btn-secondary' : 'btn-primary'}`}
            >
              {isStoreOpen ? 'Pause Orders' : 'Go Online'}
            </button>
          </div>
        )}

        {/* Driver Quick Status in Header */}
        {currentRole === 'delivery' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: isDriverOnline ? '#2563EB' : '#9CA3AF',
                  boxShadow: isDriverOnline ? '0 0 8px #2563EB' : 'none',
                }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                Driver Duty: {isDriverOnline ? 'ACTIVE (Online)' : 'OFF-DUTY'}
              </span>
            </div>
            <button
              onClick={toggleDriverOnline}
              className={`btn btn-sm ${isDriverOnline ? 'btn-secondary' : 'btn-primary'}`}
            >
              {isDriverOnline ? 'Go Off Duty' : 'Start Duty'}
            </button>
          </div>
        )}

        {/* Right Navigation Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {currentRole === 'customer' && (
            <>
              {/* Material Calculator Tool Button */}
              <button
                onClick={() => setIsMaterialCalcOpen(true)}
                className="btn btn-secondary btn-sm"
                title="Concrete & Steel Quantity Calculator"
              >
                <Calculator size={16} color="var(--color-primary)" />
                <span className="hide-mobile">Material Calc</span>
              </button>

              {/* Compare Tool */}
              <Link to="/compare" className="btn btn-secondary btn-sm" title="Compare Store Prices">
                <ArrowRightLeft size={16} />
                <span className="hide-mobile">Compare</span>
              </Link>

              {/* Offers */}
              <Link to="/offers" className="btn btn-secondary btn-sm" title="View Deals & Coupons">
                <Percent size={16} color="#D97706" />
                <span className="hide-mobile">Offers</span>
              </Link>

              {/* My Orders */}
              <Link to="/orders" className="btn btn-secondary btn-sm" title="Order History & Tracking">
                <Package size={16} />
                <span className="hide-mobile">Orders</span>
              </Link>

              {/* Cart Drawer Trigger Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ position: 'relative' }}
              >
                <ShoppingCart size={17} />
                <span>Cart</span>
                {cartItemCount > 0 && (
                  <span
                    style={{
                      backgroundColor: '#FFFFFF',
                      color: 'var(--color-primary)',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      borderRadius: 'var(--radius-full)',
                      padding: '1px 6px',
                      marginLeft: '4px',
                    }}
                  >
                    {cartItemCount}
                  </span>
                )}
              </button>
            </>
          )}

          {currentRole === 'retailer' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/retailer/orders" className="btn btn-secondary btn-sm">
                Orders
              </Link>
              <Link to="/retailer/inventory" className="btn btn-secondary btn-sm">
                Inventory
              </Link>
              <Link to="/retailer/promotions" className="btn btn-secondary btn-sm">
                Promos
              </Link>
            </div>
          )}

          {currentRole === 'delivery' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link to="/driver/ongoing" className="btn btn-primary btn-sm">
                Live Trip
              </Link>
              <Link to="/driver/earnings" className="btn btn-secondary btn-sm">
                Earnings
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Customer Sub-Navbar Categories Bar */}
      {currentRole === 'customer' && (
        <div
          style={{
            backgroundColor: '#FAFAFA',
            borderTop: '1px solid var(--color-border-light)',
            padding: '8px 0',
          }}
        >
          <div
            className="app-container"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              overflowX: 'auto',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <Link
              to="/categories"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: location.pathname === '/categories' ? 'var(--color-primary)' : 'var(--color-text-main)',
                whiteSpace: 'nowrap',
              }}
            >
              <Layers size={16} />
              <span>All Categories</span>
            </Link>
            <Link
              to="/stores"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: location.pathname === '/stores' ? 'var(--color-primary)' : 'var(--color-text-main)',
                whiteSpace: 'nowrap',
              }}
            >
              <Store size={16} />
              <span>Hardware Stores Directory</span>
            </Link>
            <Link to="/category/structural" style={{ color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
              🏗️ Cement & TMT Rebars
            </Link>
            <Link to="/category/electrical" style={{ color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
              ⚡ Electricals & Wires
            </Link>
            <Link to="/category/plumbing" style={{ color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
              🚿 Plumbing & Pipes
            </Link>
            <Link to="/category/finishing" style={{ color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
              🎨 Paints & Finishing
            </Link>
            <Link to="/category/hardware" style={{ color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
              🔩 Power Tools & Safety
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
