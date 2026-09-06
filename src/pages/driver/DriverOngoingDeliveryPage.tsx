import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Navigation,
  MapPin,
  Phone,
  CheckCircle,
  Key,
  Truck,
  ArrowLeft,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../store';

export const DriverOngoingDeliveryPage: React.FC = () => {
  const navigate = useNavigate();
  const { driverTrips, completeDeliveryTrip, showToast } = useApp();

  const ongoingTrip = driverTrips.find((t) => t.status === 'ongoing') || driverTrips[0];

  const [currentPhase, setCurrentPhase] = useState<'to_store' | 'loaded' | 'to_site' | 'unloading'>('to_site');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState('');

  if (!ongoingTrip) {
    return (
      <div className="main-content" style={{ padding: '60px 0', textAlign: 'center' }}>
        <div className="app-container">
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🚚</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>No Active Trip In Progress</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '20px' }}>
            Check the available dispatch requests feed to accept a load.
          </p>
          <Link to="/driver" className="btn btn-primary">
            Back to Driver Feed
          </Link>
        </div>
      </div>
    );
  }

  const handleVerifyOtpAndComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredOtp) {
      setOtpError('Please enter the 4-digit OTP provided by the site engineer.');
      return;
    }

    const res = completeDeliveryTrip(ongoingTrip.id, enteredOtp);
    if (!res.success) {
      setOtpError(res.message);
    } else {
      setOtpError('');
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22C55E', '#2563EB', '#F59E0B'],
        });
      } catch {
        // ignore
      }
      setTimeout(() => {
        navigate('/driver/earnings');
      }, 1200);
    }
  };

  return (
    <div className="main-content" style={{ padding: '32px 0' }}>
      <div className="app-container">
        {/* Back Link */}
        <div style={{ marginBottom: '20px' }}>
          <Link to="/driver" style={{ color: '#2563EB', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem' }}>
            <ArrowLeft size={16} />
            <span>Driver Dashboard</span>
          </Link>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <span className="badge badge-info" style={{ marginBottom: '6px' }}>
              LIVE TRIP #{ongoingTrip.id}
            </span>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900 }}>Turn-by-Turn Delivery Navigation</h1>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9375rem' }}>
              Payload: <strong>{ongoingTrip.payloadWeight}</strong> ({ongoingTrip.itemSummary})
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>GUARANTEED TRIP PAYOUT</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#16A34A', fontFamily: 'Outfit' }}>
              ₹{ongoingTrip.earnings}
            </div>
          </div>
        </div>

        {/* Navigation Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '28px', alignItems: 'flex-start' }}>
          {/* Left: GPS Simulation Map */}
          <div>
            {/* Turn-by-Turn Direction Header */}
            <div
              style={{
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div style={{ backgroundColor: '#2563EB', padding: '12px', borderRadius: '50%' }}>
                <Navigation size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8', fontWeight: 700 }}>NEXT TURN IN 400 METERS</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>Turn Left towards Cyber City Site Gate 2</div>
                <div style={{ fontSize: '0.8125rem', color: '#38BDF8', marginTop: '2px' }}>
                  Remaining: 1.4 km • ~8 mins to site destination
                </div>
              </div>
            </div>

            {/* Map Canvas */}
            <div
              style={{
                height: '340px',
                backgroundColor: '#CBD5E1',
                backgroundImage: 'radial-gradient(#94A3B8 1.5px, transparent 1.5px)',
                backgroundSize: '30px 30px',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid var(--color-border)',
                borderTop: 'none',
              }}
            >
              <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
                <path d="M 80 280 L 260 200 L 460 100" fill="none" stroke="#2563EB" strokeWidth="6" />
              </svg>

              {/* Vehicle Indicator */}
              <div
                style={{
                  position: 'absolute',
                  left: '240px',
                  top: '180px',
                  backgroundColor: '#2563EB',
                  color: '#FFF',
                  padding: '10px',
                  borderRadius: '50%',
                  boxShadow: '0 0 20px rgba(37,99,235,0.6)',
                }}
              >
                <Truck size={22} className="animate-truck" />
              </div>

              {/* Destination */}
              <div style={{ position: 'absolute', right: '80px', top: '70px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="badge badge-success" style={{ marginBottom: '4px' }}>Site Unloading Point</span>
                <div style={{ backgroundColor: '#16A34A', color: '#FFF', padding: '8px', borderRadius: '50%' }}>
                  <MapPin size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Workflow Steps & Doorstep OTP Verification Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Site Engineer Contact */}
            <div className="card" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '10px' }}>
                CUSTOMER / SITE CONTACT
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 800 }}>Suresh Reddy (Site Engineer)</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>
                    Drop: {ongoingTrip.dropAddress}
                  </div>
                </div>
                <a href={`tel:${ongoingTrip.customerPhone}`} className="btn btn-primary btn-sm">
                  <Phone size={15} />
                  <span>Call Site</span>
                </a>
              </div>
            </div>

            {/* Step 3: OTP Verification Form */}
            <div className="card" style={{ padding: '24px', borderTop: '4px solid var(--color-success)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Key size={20} color="var(--color-success)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Doorstep OTP Verification</h3>
              </div>

              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                Ask the site engineer for the 4-digit passkey shown on their BuildIt screen once materials are unloaded.
              </p>

              {/* Demo Hint */}
              <div style={{ backgroundColor: 'var(--color-bg)', padding: '8px 12px', borderRadius: 'var(--radius-md)', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                💡 Demo Passkey: <strong>{ongoingTrip.otp || '4821'}</strong>
              </div>

              <form onSubmit={handleVerifyOtpAndComplete}>
                <div className="form-group">
                  <label className="form-label">Enter 4-Digit Customer OTP</label>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 4821"
                    value={enteredOtp}
                    onChange={(e) => {
                      setEnteredOtp(e.target.value);
                      setOtpError('');
                    }}
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 900,
                      letterSpacing: '8px',
                      textAlign: 'center',
                      fontFamily: 'Outfit',
                    }}
                  />
                  {otpError && <div style={{ color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '4px' }}>{otpError}</div>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-full btn-lg"
                  style={{ backgroundColor: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '16px' }}
                >
                  <CheckCircle size={18} />
                  <span>Verify OTP & Complete Delivery (₹{ongoingTrip.earnings})</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
