import React from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  DollarSign,
  Package,
  Truck,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../store';

export const RetailerDashboard: React.FC = () => {
  const { isStoreOpen, toggleStoreOpen, retailerProfile, orders, offers, products, updateOrderStatus } = useApp();

  const storeOrders = orders.filter((o) => o.retailerId === retailerProfile.id);
  const newOrders = storeOrders.filter((o) => o.status === 'placed');
  const inProgressOrders = storeOrders.filter((o) => ['confirmed', 'preparing', 'ready'].includes(o.status));
  const activeDeliveries = storeOrders.filter((o) => o.status === 'out_for_delivery');

  const todayRevenue = storeOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStockOffers = offers.filter((o) => o.retailerId === retailerProfile.id && o.stock < 50);

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Partner Header */}
        <div
          className="card"
          style={{
            backgroundColor: '#111827',
            color: '#FFFFFF',
            padding: '24px 32px',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF' }}>{retailerProfile.name}</h1>
                <span className="badge badge-primary">PARTNER PRO</span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#9CA3AF', marginTop: '2px' }}>
                GSTIN: {retailerProfile.gstin} • Delivery Radius: {retailerProfile.deliveryRadiusKm} km
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>STORE AVAILABILITY</div>
              <div style={{ fontWeight: 800, color: isStoreOpen ? '#22C55E' : '#EF4444' }}>
                {isStoreOpen ? 'ONLINE & ACCEPTING ORDERS' : 'STORE CURRENTLY PAUSED'}
              </div>
            </div>

            <button
              onClick={toggleStoreOpen}
              className={`btn btn-lg ${isStoreOpen ? 'btn-secondary' : 'btn-primary'}`}
            >
              {isStoreOpen ? 'Pause Store' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-4 gap-lg" style={{ marginBottom: '32px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>TODAY'S GROSS SALES</span>
              <DollarSign size={18} color="#16A34A" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit' }}>
              ₹{todayRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700, marginTop: '4px' }}>
              ↑ +18.4% vs last week
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>NEW INCOMING ORDERS</span>
              <Package size={18} color="var(--color-primary)" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit', color: 'var(--color-primary)' }}>
              {newOrders.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Requires immediate acceptance
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>IN WAREHOUSE PREPARATION</span>
              <Clock size={18} color="#D97706" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit' }}>
              {inProgressOrders.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Being packed & staged
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>ACTIVE EN-ROUTE TRUCKS</span>
              <Truck size={18} color="#2563EB" />
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit' }}>
              {activeDeliveries.length}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
              Dispatched with live GPS
            </div>
          </div>
        </div>

        {/* Low Stock Warning Alert if any */}
        {lowStockOffers.length > 0 && (
          <div
            style={{
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 20px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <AlertTriangle size={22} color="#D97706" />
              <div>
                <strong style={{ color: '#92400E' }}>Low Warehouse Stock Alert ({lowStockOffers.length} items)</strong>
                <div style={{ fontSize: '0.8125rem', color: '#B45309' }}>
                  Some materials are below the safety threshold (50 units). Refill inventory to prevent lost sales.
                </div>
              </div>
            </div>
            <Link to="/retailer/inventory" className="btn btn-secondary btn-sm" style={{ borderColor: '#D97706', color: '#92400E' }}>
              Manage Stock →
            </Link>
          </div>
        )}

        {/* Active Orders Pipeline Table */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Live Store Orders Pipeline</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Real-time feed of orders placed by site engineers and builders.
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
                {storeOrders.slice(0, 6).map((order) => (
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
