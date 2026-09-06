import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, Clock, FileText, CheckCircle, RotateCcw } from 'lucide-react';
import { useApp } from '../../store';

export const OrdersHistoryPage: React.FC = () => {
  const { orders } = useApp();

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Site Orders & Procurement History</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
            Track active dispatches, view GST tax invoices, and reorder materials in one click.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>📦</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>No Orders Found</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              You haven't placed any site material orders yet.
            </p>
            <Link to="/categories" className="btn btn-primary">
              Procure Materials Now
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => {
              const isDelivered = order.status === 'delivered';

              return (
                <div key={order.id} className="card" style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid var(--color-border)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>Order #{order.id}</span>
                        <span className={`badge ${isDelivered ? 'badge-success' : 'badge-primary'}`}>
                          {order.status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })} • Store: <strong>{order.retailerName}</strong>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>TOTAL BILLED</div>
                      <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--color-primary)', fontFamily: 'Outfit' }}>
                        ₹{order.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Items List in this order */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    {order.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <span>
                          <strong>{item.quantity}x</strong> {item.product.name} ({item.product.unit})
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                          ₹{(item.offer.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--color-border-light)' }}>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                      📍 Site Drop: {order.deliveryAddress.line1}
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link to={`/tracking/${order.id}`} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Track Live GPS Route</span>
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
