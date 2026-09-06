import React from 'react';
import { DollarSign, ArrowUpRight, TrendingUp, CheckCircle, Wallet, ArrowDownCircle } from 'lucide-react';
import { useApp } from '../../store';

export const DriverEarningsPage: React.FC = () => {
  const { driverStats, driverTrips, showToast } = useApp();

  const completedTrips = driverTrips.filter((t) => t.status === 'completed');

  const handleWithdraw = () => {
    showToast('Withdrawal request of ₹' + driverStats.todayEarnings + ' initiated to bank account!', 'success');
  };

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Driver Payouts & Earnings Wallet</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', marginTop: '4px' }}>
              Track completed freight trips, diesel reimbursements, and daily instant bank settlements.
            </p>
          </div>

          <button onClick={handleWithdraw} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--color-success)' }}>
            <Wallet size={18} />
            <span>Instant Cashout to Bank</span>
          </button>
        </div>

        {/* Balance Grid */}
        <div className="grid grid-cols-3 gap-lg" style={{ marginBottom: '32px' }}>
          <div className="card" style={{ padding: '24px', backgroundColor: '#1E293B', color: '#FFF' }}>
            <div style={{ fontSize: '0.8125rem', color: '#94A3B8', fontWeight: 700, marginBottom: '6px' }}>
              AVAILABLE WALLET BALANCE
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#38BDF8', fontFamily: 'Outfit' }}>
              ₹{driverStats.todayEarnings.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '6px' }}>
              Settlement cycle: Daily 11:59 PM Auto-transfer
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '6px' }}>
              THIS WEEK'S EARNINGS
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, color: '#16A34A', fontFamily: 'Outfit' }}>
              ₹{driverStats.weeklyEarnings.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: 700, marginTop: '6px' }}>
              ↑ +14% vs previous week
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '6px' }}>
              COMPLETED TRIPS
            </div>
            <div style={{ fontSize: '2.25rem', fontWeight: 900, fontFamily: 'Outfit' }}>
              {driverStats.completedTrips}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              Average Payout: ₹{(driverStats.weeklyEarnings / (driverStats.completedTrips || 1)).toFixed(0)} / trip
            </div>
          </div>
        </div>

        {/* Trips History Table */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
            Completed Trip Ledger ({completedTrips.length})
          </h2>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Trip ID</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Pickup Store & Drop Site</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Payload Cargo</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Distance</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700 }}>Status</th>
                  <th style={{ padding: '12px 16px', fontWeight: 700, textAlign: 'right' }}>Credited Payout</th>
                </tr>
              </thead>
              <tbody>
                {completedTrips.map((trip) => (
                  <tr key={trip.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 800 }}>#{trip.id}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700 }}>{trip.pickupStore}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Drop: {trip.dropAddress}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>{trip.payloadWeight}</td>
                    <td style={{ padding: '14px 16px' }}>{trip.distanceKm} km</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span className="badge badge-success">✓ DELIVERED</span>
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 900, color: 'var(--color-success)', fontFamily: 'Outfit', fontSize: '1.1rem' }}>
                      +₹{trip.earnings}
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
