import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, DollarSign, MapPin, CheckCircle, Navigation, Clock, ShieldCheck } from 'lucide-react';
import { useApp } from '../../store';

export const DriverHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { isDriverOnline, toggleDriverOnline, driverTrips, driverStats, acceptDeliveryTrip } = useApp();

  const availableTrips = driverTrips.filter((t) => t.status === 'available');
  const ongoingTrip = driverTrips.find((t) => t.status === 'ongoing');

  const handleAcceptTrip = (tripId: string) => {
    acceptDeliveryTrip(tripId);
    navigate('/driver/ongoing');
  };

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Driver Top Banner */}
        <div
          className="card"
          style={{
            backgroundColor: '#1E293B',
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
                backgroundColor: '#2563EB',
                color: '#FFF',
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Truck size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#FFFFFF' }}>Ravi Teja (Heavy Fleet)</h1>
                <span className="badge badge-info">VERIFIED LOGISTICS</span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: '#94A3B8', marginTop: '2px' }}>
                Vehicle: Tata Ace 407 (TS 09 UB 8921) • Rating: ⭐ {driverStats.rating} ({driverStats.completedTrips} trips)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>DUTY STATUS</div>
              <div style={{ fontWeight: 800, color: isDriverOnline ? '#38BDF8' : '#94A3B8' }}>
                {isDriverOnline ? 'ONLINE (READY FOR TRIPS)' : 'OFF-DUTY'}
              </div>
            </div>

            <button
              onClick={toggleDriverOnline}
              className={`btn btn-lg ${isDriverOnline ? 'btn-secondary' : 'btn-primary'}`}
              style={{ backgroundColor: isDriverOnline ? '#334155' : 'var(--color-primary)', color: '#FFF' }}
            >
              {isDriverOnline ? 'Go Off Duty' : 'Go Online'}
            </button>
          </div>
        </div>

        {/* Ongoing Trip Quick Banner if active */}
        {ongoingTrip && (
          <div
            style={{
              backgroundColor: '#EFF6FF',
              border: '2px solid #2563EB',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ backgroundColor: '#2563EB', color: '#FFF', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <Navigation size={24} className="animate-pulse-live" />
              </div>
              <div>
                <span className="badge badge-info" style={{ marginBottom: '4px' }}>TRIP IN PROGRESS</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  Trip #{ongoingTrip.id} • {ongoingTrip.pickupStore.split('(')[0]}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                  Payload: {ongoingTrip.payloadWeight} • Payout: ₹{ongoingTrip.earnings}
                </div>
              </div>
            </div>

            <Link to="/driver/ongoing" className="btn btn-primary">
              Resume Turn-by-Turn Navigation →
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-lg" style={{ marginBottom: '32px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              TODAY'S EARNINGS
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16A34A', fontFamily: 'Outfit' }}>
              ₹{driverStats.todayEarnings.toLocaleString()}
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              WEEKLY PAYOUT
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#2563EB', fontFamily: 'Outfit' }}>
              ₹{driverStats.weeklyEarnings.toLocaleString()}
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              COMPLETED TRIPS
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'Outfit' }}>
              {driverStats.completedTrips} Trips
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '6px' }}>
              ACCEPTANCE RATE
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#D97706', fontFamily: 'Outfit' }}>
              {driverStats.acceptanceRate}%
            </div>
          </div>
        </div>

        {/* Available Dispatch Trips Feed */}
        <div className="card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Nearby Construction Dispatch Requests</h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                Accept loads within your vehicle capacity and start navigation.
              </p>
            </div>
            <span className="badge badge-info">{availableTrips.length} Available Nearby</span>
          </div>

          {availableTrips.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-text-muted)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>📡</div>
              <h4 style={{ color: 'var(--color-text-main)' }}>Searching for New Loads...</h4>
              <p style={{ fontSize: '0.875rem' }}>Stay online. We will alert you immediately when a store books freight.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {availableTrips.map((trip) => (
                <div
                  key={trip.id}
                  style={{
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ backgroundColor: 'var(--color-bg)', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '1.5rem' }}>
                      🏗️
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{trip.payloadWeight}</span>
                        <span className="badge badge-primary">{trip.distanceKm} km trip</span>
                      </div>

                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                        📍 Pickup: <strong>{trip.pickupStore}</strong>
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                        🎯 Dropoff Site: <strong>{trip.dropAddress}</strong>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        Manifest: {trip.itemSummary}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>DRIVER PAYOUT</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16A34A', fontFamily: 'Outfit', marginBottom: '8px' }}>
                      ₹{trip.earnings}
                    </div>

                    <button
                      onClick={() => handleAcceptTrip(trip.id)}
                      className="btn btn-primary"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Navigation size={16} />
                      <span>Accept & Navigate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
