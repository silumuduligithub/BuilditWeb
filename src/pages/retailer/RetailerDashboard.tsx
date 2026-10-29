import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  DollarSign,
  Package,
  Truck,
  TrendingUp,
  Percent,
  RotateCcw,
} from 'lucide-react';
import { useApp, AnalyticsTimeframe } from '../../store';

export const RetailerDashboard: React.FC = () => {
  const {
    isStoreOpen,
    toggleStoreOpen,
    retailerProfile,
    retailers,
    selectedRetailerId,
    setSelectedRetailerId,
    selectedStore,
    orders,
    offers,
    products,
    updateOrderStatus,
    analyticsTimeframe,
    setAnalyticsTimeframe,
    getStoreAnalytics,
  } = useApp();

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Store orders filtered by active store
  const storeOrders = orders.filter((o) => o.retailerId === selectedRetailerId);
  const newOrders = storeOrders.filter((o) => o.status === 'placed');
  const inProgressOrders = storeOrders.filter((o) => ['confirmed', 'preparing', 'ready'].includes(o.status));
  const activeDeliveries = storeOrders.filter((o) => o.status === 'out_for_delivery');

  const lowStockOffers = offers.filter((o) => o.retailerId === selectedRetailerId && o.stock < 50);

  // Dynamic analytics for selected store and timeframe
  const analytics = getStoreAnalytics(selectedRetailerId, analyticsTimeframe);

  const maxVolume = Math.max(...analytics.chartData.map((d) => d.volume), 1);
  const maxRevenue = Math.max(...analytics.chartData.map((d) => d.revenue), 1);

  // Timeframe tabs
  const timeframeOptions: { key: AnalyticsTimeframe; label: string }[] = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '3m', label: '3 Months' },
    { key: '1y', label: 'This Year' },
  ];

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Partner Store Switcher & Header */}
        <div
          className="card"
          style={{
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '24px 32px',
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
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Store size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF' }}>{selectedStore.name}</h1>
                <span className="badge badge-primary">PARTNER PRO</span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '2px' }}>
                GSTIN: {selectedStore.gstin} • Rating: ⭐ {selectedStore.rating} • Delivery Radius: {selectedStore.deliveryRadiusKm} km
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>Active Store:</span>
              <select
                value={selectedRetailerId}
                onChange={(e) => setSelectedRetailerId(e.target.value)}
                style={{
                  backgroundColor: '#1E293B',
                  color: '#FFFFFF',
                  border: '1px solid #334155',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
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

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>STORE STATUS</div>
              <div style={{ fontWeight: 800, color: isStoreOpen ? '#22C55E' : '#EF4444' }}>
                {isStoreOpen ? 'ONLINE & ACCEPTING' : 'STORE PAUSED'}
              </div>
            </div>

            <button
              onClick={toggleStoreOpen}
              className={`btn btn-md ${isStoreOpen ? 'btn-secondary' : 'btn-primary'}`}
            >
              {isStoreOpen ? 'Pause Store' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Timeframe Filter Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Store Analytics & Financials</h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              Real-time revenue, order volume trends, and fulfillment metrics for {selectedStore.name}.
            </p>
          </div>

          {/* 4 Timeframe Buttons */}
          <div
            style={{
              display: 'flex',
              backgroundColor: 'var(--color-bg)',
              padding: '4px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
            }}
          >
            {timeframeOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setAnalyticsTimeframe(opt.key)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: analyticsTimeframe === opt.key ? 'var(--color-primary)' : 'transparent',
                  color: analyticsTimeframe === opt.key ? '#FFFFFF' : 'var(--color-text-secondary)',
                  transition: 'all 0.2s ease',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Dynamic KPI Cards */}
        <div className="grid grid-cols-4 gap-md" style={{ marginBottom: '28px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Total Net Revenue</span>
              <DollarSign size={18} color="#16A34A" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit' }}>
              ₹{analytics.totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700, marginTop: '4px' }}>
              ↑ +22.4% vs prev period
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Gross Margin Rate</span>
              <Percent size={18} color="var(--color-primary)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--color-primary)' }}>
              {analytics.grossMarginPct}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Healthy partner tier
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Delivery SLA</span>
              <Truck size={18} color="#2563EB" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit' }}>
              {analytics.deliverySlaPct}%
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700, marginTop: '4px' }}>
              On-time site arrival
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Return / Rejection</span>
              <RotateCcw size={18} color="#6B7280" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit' }}>
              {analytics.returnRatePct}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#16A34A', marginTop: '4px' }}>
              Well below 2% limit
            </div>
          </div>
        </div>

        {/* Dual-Axis Interactive Chart Card */}
        <div className="card" style={{ padding: '28px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Revenue & Volume Trajectory</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Dual-axis analytics showing order volume bars and total daily revenue trend curve.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8125rem', fontWeight: 600 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#3B82F6', borderRadius: '2px' }} />
                <span>Order Volume</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', backgroundColor: '#F97316', borderRadius: '50%' }} />
                <span>Revenue (₹)</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div style={{ position: 'relative', height: '260px', width: '100%', display: 'flex', alignItems: 'flex-end', gap: '16px', paddingBottom: '30px' }}>
            {/* SVG Trend Line Overlay */}
            <svg
              viewBox="0 0 1000 230"
              preserveAspectRatio="none"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '230px',
                pointerEvents: 'none',
                overflow: 'visible',
              }}
            >
              <polyline
                fill="none"
                stroke="#F97316"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={analytics.chartData
                  .map((d, idx) => {
                    const totalItems = analytics.chartData.length;
                    const xVal = ((idx + 0.5) / totalItems) * 1000;
                    const yVal = 210 - (d.revenue / maxRevenue) * 170;
                    return `${xVal},${yVal}`;
                  })
                  .join(' ')}
              />
              {analytics.chartData.map((d, idx) => {
                const totalItems = analytics.chartData.length;
                const xVal = ((idx + 0.5) / totalItems) * 1000;
                const yVal = 210 - (d.revenue / maxRevenue) * 170;
                return (
                  <circle
                    key={idx}
                    cx={xVal}
                    cy={yVal}
                    r={hoveredIndex === idx ? 6 : 4}
                    fill="#FFFFFF"
                    stroke="#F97316"
                    strokeWidth="3"
                  />
                );
              })}
            </svg>

            {/* Bar columns */}
            {analytics.chartData.map((d, idx) => {
              const barHeightPct = Math.max(15, (d.volume / maxVolume) * 80);
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={d.label}
                  style={{
                    flex: 1,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  {isHovered && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-45px',
                        backgroundColor: '#1E293B',
                        color: '#FFFFFF',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        boxShadow: 'var(--shadow-lg)',
                        zIndex: 20,
                        pointerEvents: 'none',
                      }}
                    >
                      ₹{d.revenue.toLocaleString()} • {d.volume} units
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    style={{
                      width: '40%',
                      maxWidth: '48px',
                      height: `${barHeightPct}%`,
                      backgroundColor: isHovered ? '#2563EB' : '#3B82F6',
                      borderRadius: '6px 6px 0 0',
                      transition: 'all 0.2s ease',
                      opacity: isHovered ? 1 : 0.85,
                    }}
                  />

                  {/* Label */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: isHovered ? 'var(--color-primary)' : 'var(--color-text-muted)',
                    }}
                  >
                    {d.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Materials Breakdown Table */}
        <div className="card" style={{ padding: '24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Top Selling Materials Breakdown</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Highest revenue generated materials and margin performance for the selected timeframe.
              </p>
            </div>
            <Link to="/retailer/inventory" className="btn btn-secondary btn-sm">
              Stock More Materials →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Material Description</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Category</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Orders Count</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Gross Revenue</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Margin Rate</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Warehouse Status</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topMaterials.map((mat) => (
                  <tr key={mat.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 800 }}>{mat.name}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-primary">{mat.category}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700 }}>{mat.orders} Orders</td>
                    <td style={{ padding: '14px 16px', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--color-primary)' }}>
                      ₹{mat.revenue.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#059669' }}>
                      {mat.marginPct}%
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className={`badge ${mat.stockStatus === 'In Stock' ? 'badge-success' : 'badge-warning'}`}>
                        {mat.stockStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Store Orders Pipeline Table */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Live Store Orders Pipeline</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Real-time queue of orders placed by site engineers and builders for {selectedStore.name}.
              </p>
            </div>
            <Link to="/retailer/orders" className="btn btn-secondary btn-sm">
              View All Orders Archive
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Order ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Materials Ordered</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Delivery Site</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Amount</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Workflow Action</th>
                </tr>
              </thead>
              <tbody>
                {storeOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      <Package size={36} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
                      <div style={{ fontWeight: 700 }}>No live orders in pipeline for this store.</div>
                    </td>
                  </tr>
                ) : (
                  storeOrders.slice(0, 6).map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 800 }}>
                        <div>#{order.id}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {order.deliveryType.toUpperCase()}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600 }}>{order.items[0]?.product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Qty: {order.items.reduce((sum, i) => sum + i.quantity, 0)} Units ({order.items.length} SKUs)
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div>{order.deliveryAddress.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {order.deliveryAddress.line1.slice(0, 24)}...
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 900, fontFamily: 'Outfit' }}>
                        ₹{order.totalAmount.toLocaleString()}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className="badge badge-primary">
                          {order.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        {order.status === 'placed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="btn btn-primary btn-sm"
                          >
                            Accept Order
                          </button>
                        )}
                        {order.status === 'confirmed' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="btn btn-secondary btn-sm"
                          >
                            Mark Preparing
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                            className="btn btn-primary btn-sm"
                          >
                            Dispatch Fleet
                          </button>
                        )}
                        {order.status === 'out_for_delivery' && (
                          <Link to={`/tracking/${order.id}`} className="btn btn-secondary btn-sm">
                            Track Truck
                          </Link>
                        )}
                        {order.status === 'delivered' && (
                          <span style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: '0.8125rem' }}>
                            ✓ Fulfilled
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
