import React, { useState } from 'react';
import { Package, FileText, CheckCircle, Clock, Truck, Printer, X, Store, Inbox } from 'lucide-react';
import { useApp } from '../../store';
import { Order } from '../../types';

export const RetailerOrdersPage: React.FC = () => {
  const {
    orders,
    retailers,
    selectedRetailerId,
    setSelectedRetailerId,
    selectedStore,
    updateOrderStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'prep' | 'dispatched' | 'completed'>('all');
  const [selectedPicklistOrder, setSelectedPicklistOrder] = useState<Order | null>(null);

  const storeOrders = orders.filter((o) => o.retailerId === selectedRetailerId);

  const filteredOrders = storeOrders.filter((o) => {
    if (activeTab === 'new') return o.status === 'placed';
    if (activeTab === 'prep') return ['confirmed', 'preparing', 'ready'].includes(o.status);
    if (activeTab === 'dispatched') return ['driver_assigned', 'pickup', 'out_for_delivery'].includes(o.status);
    if (activeTab === 'completed') return o.status === 'delivered';
    return true;
  });

  const getEmptyStateMessage = () => {
    switch (activeTab) {
      case 'new':
        return {
          title: 'No New Orders Pending Acceptance',
          desc: 'All incoming customer orders for this store have already been accepted or processed.',
        };
      case 'prep':
        return {
          title: 'No Orders In Preparation',
          desc: 'There are currently no orders being staged or packed in the warehouse.',
        };
      case 'dispatched':
        return {
          title: 'No Active Dispatches En-Route',
          desc: 'No delivery trucks are currently on the road for this store.',
        };
      case 'completed':
        return {
          title: 'No Fulfilled Orders Yet',
          desc: 'Delivered orders will appear here once verified by customer OTP at the site.',
        };
      default:
        return {
          title: 'No Orders Found',
          desc: `No order history is currently recorded for ${selectedStore.name}.`,
        };
    }
  };

  const emptyInfo = getEmptyStateMessage();

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

        {/* Page Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Store Order Management & Dispatch</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
            Process buyer orders, generate warehouse picklists, and dispatch local delivery drivers.
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs-container" style={{ marginBottom: '24px' }}>
          <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            All Orders ({storeOrders.length})
          </button>
          <button className={`tab-btn ${activeTab === 'new' ? 'active' : ''}`} onClick={() => setActiveTab('new')}>
            New Placed ({storeOrders.filter((o) => o.status === 'placed').length})
          </button>
          <button className={`tab-btn ${activeTab === 'prep' ? 'active' : ''}`} onClick={() => setActiveTab('prep')}>
            In Preparation ({storeOrders.filter((o) => ['confirmed', 'preparing', 'ready'].includes(o.status)).length})
          </button>
          <button className={`tab-btn ${activeTab === 'dispatched' ? 'active' : ''}`} onClick={() => setActiveTab('dispatched')}>
            Dispatched Fleet ({storeOrders.filter((o) => ['driver_assigned', 'pickup', 'out_for_delivery'].includes(o.status)).length})
          </button>
          <button className={`tab-btn ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => setActiveTab('completed')}>
            Fulfilled ({storeOrders.filter((o) => o.status === 'delivered').length})
          </button>
        </div>

        {/* Orders Table */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Order ID & Time</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Buyer & Destination</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Materials Breakdown</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Total Value</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '48px 24px', textAlign: 'center' }}>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '12px',
                        }}
                      >
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--color-bg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          <Inbox size={28} />
                        </div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
                          {emptyInfo.title}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', maxWidth: '420px', lineHeight: 1.5 }}>
                          {emptyInfo.desc}
                        </p>
                        {activeTab !== 'all' && (
                          <button
                            onClick={() => setActiveTab('all')}
                            className="btn btn-secondary btn-sm"
                            style={{ marginTop: '8px' }}
                          >
                            View All Orders ({storeOrders.length})
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 800 }}>
                        <div>#{order.id}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 700 }}>{order.deliveryAddress.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                          {order.deliveryAddress.line1} ({order.deliveryAddress.phone})
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600 }}>{order.items[0]?.product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          Total: {order.items.reduce((s, i) => s + i.quantity, 0)} Units ({order.items.length} items)
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
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => setSelectedPicklistOrder(order)}
                            className="btn btn-secondary btn-sm"
                            title="Generate Warehouse Picklist"
                          >
                            <FileText size={14} />
                            <span>Picklist</span>
                          </button>

                          {order.status === 'placed' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'confirmed')}
                              className="btn btn-primary btn-sm"
                            >
                              Accept
                            </button>
                          )}
                          {order.status === 'confirmed' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="btn btn-secondary btn-sm"
                            >
                              Set Prep
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button
                              onClick={() => updateOrderStatus(order.id, 'out_for_delivery')}
                              className="btn btn-primary btn-sm"
                            >
                              Dispatch
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Picklist Generation Modal */}
        {selectedPicklistOrder && (
          <div className="modal-overlay" onClick={() => setSelectedPicklistOrder(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={22} color="var(--color-primary)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Warehouse Material Picklist</h3>
                </div>
                <button
                  onClick={() => setSelectedPicklistOrder(null)}
                  style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'var(--color-bg)', border: 'none', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div
                style={{
                  backgroundColor: 'var(--color-bg)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '20px',
                  fontSize: '0.875rem',
                }}
              >
                <div>Order: <strong>#{selectedPicklistOrder.id}</strong></div>
                <div>Destination Site: <strong>{selectedPicklistOrder.deliveryAddress.line1}</strong></div>
                <div>Freight Mode: <strong>{selectedPicklistOrder.deliveryType.toUpperCase()}</strong></div>
              </div>

              <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '12px' }}>Items to Pick & Load:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {selectedPicklistOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px',
                      border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input type="checkbox" style={{ width: '18px', height: '18px' }} defaultChecked />
                      <div>
                        <div style={{ fontWeight: 800 }}>{item.product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                          SKU: {item.product.sku || 'UTC-53'} • Unit: {item.product.unit}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Outfit' }}>
                      {item.quantity} Units
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn btn-secondary"
                  style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <Printer size={16} />
                  <span>Print Picklist</span>
                </button>
                <button
                  onClick={() => {
                    updateOrderStatus(selectedPicklistOrder.id, 'ready');
                    setSelectedPicklistOrder(null);
                  }}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Confirm Staged & Ready
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
