import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ArrowRight,
  Clock,
  FileText,
  CheckCircle,
  RotateCcw,
  Truck,
  Store,
  KeyRound,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { useApp } from '../../store';
import { Order } from '../../types';

export const OrdersHistoryPage: React.FC = () => {
  const { orders, refreshOrders, isLoadingOrders, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'rejected'>('all');

  useEffect(() => {
    refreshOrders().catch(() => {});
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'active') {
      return ['placed', 'confirmed', 'preparing', 'ready', 'driver_assigned', 'out_for_delivery', 'pickup'].includes(order.status);
    }
    if (activeTab === 'completed') {
      return order.status === 'delivered';
    }
    if (activeTab === 'rejected') {
      return order.status === 'rejected';
    }
    return true;
  });

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return { label: 'Delivered', bg: '#DCFCE7', text: '#15803D' };
      case 'out_for_delivery':
      case 'driver_assigned':
      case 'pickup':
        return { label: 'Out for Delivery', bg: '#DBEAFE', text: '#1D4ED8' };
      case 'preparing':
      case 'ready':
      case 'confirmed':
        return { label: 'In Progress', bg: '#FEF3C7', text: '#B45309' };
      case 'placed':
        return { label: 'Order Placed', bg: '#F3E8FF', text: '#7E22CE' };
      case 'rejected':
        return { label: 'Cancelled / Rejected', bg: '#FEE2E2', text: '#B91C1C' };
      default:
        return { label: String(status).toUpperCase(), bg: '#F3F4F6', text: '#374151' };
    }
  };

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Site Orders & Procurement History</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
            Real-time fulfillment tracking, OTP delivery verification, and GST tax invoice receipts.
          </p>
        </div>

        {/* Tab Filters */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '24px',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '12px',
          }}
        >
          {[
            { key: 'all', label: `All Orders (${orders.length})` },
            {
              key: 'active',
              label: `Active (${orders.filter((o) => ['placed', 'confirmed', 'preparing', 'ready', 'driver_assigned', 'out_for_delivery', 'pickup'].includes(o.status)).length})`,
            },
            {
              key: 'completed',
              label: `Delivered (${orders.filter((o) => o.status === 'delivered').length})`,
            },
            {
              key: 'rejected',
              label: `Cancelled (${orders.filter((o) => o.status === 'rejected').length})`,
            },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '8px 18px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-bg)',
                color: activeTab === tab.key ? '#FFFFFF' : 'var(--color-text-secondary)',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📦</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>No Orders Found</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              No orders found matching the selected filter.
            </p>
            <Link to="/categories" className="btn btn-primary">
              Procure Materials Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredOrders.map((order) => {
              const badge = getStatusBadge(order.status);
              const isDelivered = order.status === 'delivered';
              const isActive = !['delivered', 'rejected'].includes(order.status);

              return (
                <div
                  key={order.id}
                  className="card"
                  style={{
                    padding: '24px',
                    borderRadius: 'var(--radius-xl)',
                    border: isActive ? '1px solid #BFDBFE' : '1px solid var(--color-border)',
                    boxShadow: isActive ? '0 4px 20px -2px rgba(59, 130, 246, 0.08)' : 'var(--shadow-sm)',
                  }}
                >
                  {/* Top Bar: Store Name, Order ID, Status Badge */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      flexWrap: 'wrap',
                      gap: '12px',
                      marginBottom: '16px',
                      paddingBottom: '16px',
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <div
                          style={{
                            backgroundColor: 'var(--color-bg)',
                            padding: '6px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Store size={18} color="var(--color-primary)" />
                        </div>
                        <span style={{ fontWeight: 900, fontSize: '1.15rem' }}>{order.retailerName}</span>
                        <span
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.text,
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                          }}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                        Order #{order.id} • Placed on{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                        TOTAL AMOUNT
                      </div>
                      <div
                        style={{
                          fontSize: '1.4rem',
                          fontWeight: 900,
                          color: 'var(--color-primary)',
                          fontFamily: 'Outfit',
                        }}
                      >
                        ₹{order.totalAmount.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600 }}>
                        {order.paymentStatus === 'paid' ? '✓ Paid via ' + order.paymentMethod : 'Payment Pending'}
                      </div>
                    </div>
                  </div>

                  {/* Middle Section: Items Summary & Delivery OTP */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isActive && order.otp ? '2fr 1fr' : '1fr',
                      gap: '20px',
                      marginBottom: '20px',
                    }}
                  >
                    {/* Items List */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: 'var(--color-bg)',
                            padding: '10px 14px',
                            borderRadius: 'var(--radius-md)',
                            fontSize: '0.875rem',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                              src={item.product.imageUrl || '/images/tmt_steel_rebars.jpg'}
                              alt={item.product.name}
                              style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&q=80';
                              }}
                            />
                            <div>
                              <div style={{ fontWeight: 800 }}>{item.product.name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                                Qty: {item.quantity} {item.product.unit} @ ₹{item.offer.price}/{item.product.unit}
                              </div>
                            </div>
                          </div>
                          <div style={{ fontWeight: 900, fontFamily: 'Outfit' }}>
                            ₹{(item.offer.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery OTP Card (if active order) */}
                    {isActive && order.otp && (
                      <div
                        style={{
                          backgroundColor: '#FEF3C7',
                          border: '1px dashed #F59E0B',
                          borderRadius: 'var(--radius-lg)',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textAlign: 'center',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#92400E', fontWeight: 800, fontSize: '0.8125rem' }}>
                          <KeyRound size={16} />
                          <span>DELIVERY VERIFICATION OTP</span>
                        </div>
                        <div
                          style={{
                            fontSize: '2rem',
                            fontWeight: 900,
                            letterSpacing: '6px',
                            color: '#78350F',
                            fontFamily: 'Outfit',
                            margin: '8px 0',
                          }}
                        >
                          {order.otp}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#92400E' }}>
                          Share this OTP with driver at site upon unloading
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Bar: Address & Actions */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '16px',
                      borderTop: '1px solid var(--color-border-light)',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      <MapPin size={16} color="var(--color-text-muted)" />
                      <span>
                        Site Drop: <strong>{order.deliveryAddress.line1}, {order.deliveryAddress.city}</strong>
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => showToast(`Downloading GST Tax Invoice for Order #${order.id}...`, 'info')}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FileText size={15} />
                        <span>GST Invoice</span>
                      </button>

                      <Link
                        to={`/tracking/${order.id}`}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Truck size={15} />
                        <span>Track Live Dispatch</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
