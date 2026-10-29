import React, { useState } from 'react';
import {
  X,
  Phone,
  Lock,
  User,
  Building,
  Store,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  HardHat,
} from 'lucide-react';
import { useApp } from '../../store';
import { UserRole } from '../../types';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    sendOtp,
    verifyOtp,
    register,
    showToast,
  } = useApp();

  // Mode: 'otp' | 'password' | 'register'
  const [activeTab, setActiveTab] = useState<'otp' | 'password' | 'register'>(
    authModalMode === 'register' ? 'register' : 'otp'
  );

  // Form States
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Password login states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');

  // Register states
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('customer');
  const [regCustomerType, setRegCustomerType] = useState<'individual' | 'contractor' | 'builder'>('individual');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regGst, setRegGst] = useState('');
  const [regStoreName, setRegStoreName] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await sendOtp(phone);
      if (res.success) {
        setOtpSent(true);
        setCountdown(60);
        showToast(`OTP sent to +91 ${phone}`, 'success');

        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setErrorMsg(res.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error sending OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setErrorMsg('Please enter the verification code');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await verifyOtp({
        phone,
        otp,
        role: selectedRole,
        customer_type: regCustomerType,
      });

      if (res.success) {
        setIsAuthModalOpen(false);
        setOtpSent(false);
        setOtp('');
      } else {
        setErrorMsg(res.message || 'Invalid OTP code. Please check and try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password / Identifier Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMsg('Please enter your phone/email and password');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await login({
        identifier,
        password,
        role: selectedRole,
      });

      if (res.success) {
        setIsAuthModalOpen(false);
        setPassword('');
      } else {
        setErrorMsg(res.message || 'Invalid credentials. Please check your login details.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) {
      setErrorMsg('Name and Phone number are required');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await register({
        name: regName,
        phone: regPhone,
        email: regEmail || `${regPhone}@buildkart.in`,
        password: regPassword || 'BuildIt@123',
        role: regRole,
        customer_type: regCustomerType,
        company_name: regCompanyName,
        gst_number: regGst,
        store_name: regStoreName,
      });

      if (res.success) {
        setIsAuthModalOpen(false);
      } else {
        setErrorMsg(res.message || 'Registration failed. Please check details.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => setIsAuthModalOpen(false)}
      style={{
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '480px',
          width: '92%',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '28px',
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
              }}
            >
              <HardHat size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-main)' }}>
                {activeTab === 'register' ? 'Join BuildIt Platform' : 'Welcome to BuildIt'}
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Construction Materials & Site Logistics Marketplace
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--color-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '4px',
            marginBottom: '20px',
            gap: '4px',
          }}
        >
          <button
            onClick={() => {
              setActiveTab('otp');
              setErrorMsg(null);
            }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'otp' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'otp' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              boxShadow: activeTab === 'otp' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            📱 Mobile OTP
          </button>

          <button
            onClick={() => {
              setActiveTab('password');
              setErrorMsg(null);
            }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'password' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'password' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              boxShadow: activeTab === 'password' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            🔑 Password
          </button>

          <button
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
            }}
            style={{
              flex: 1,
              padding: '8px',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
              backgroundColor: activeTab === 'register' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'register' ? 'var(--color-primary)' : 'var(--color-text-muted)',
              boxShadow: activeTab === 'register' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            ✍️ Register
          </button>
        </div>

        {/* Error Alert Banner */}
        {errorMsg && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.8125rem',
              marginBottom: '16px',
              border: '1px solid #FEE2E2',
            }}
          >
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* TAB 1: Mobile OTP Login */}
        {activeTab === 'otp' && (
          <div>
            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px' }}>
                    Mobile Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span
                      style={{
                        position: 'absolute',
                        left: '12px',
                        top: '10px',
                        fontWeight: 700,
                        color: 'var(--color-text-muted)',
                        fontSize: '0.875rem',
                      }}
                    >
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="98450 11223"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      style={{ paddingLeft: '48px', width: '100%' }}
                      autoFocus
                    />
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                    We'll send a one-time verification code to this phone number.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phone.length < 10}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontWeight: 800 }}
                >
                  {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Enter 6-Digit OTP</label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      style={{ fontSize: '0.75rem', color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Edit +91 {phone}
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.trim().slice(0, 6))}
                    style={{
                      width: '100%',
                      letterSpacing: '8px',
                      textAlign: 'center',
                      fontSize: '1.25rem',
                      fontWeight: 900,
                    }}
                    autoFocus
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '6px', color: 'var(--color-text-muted)' }}>
                    <span>Default demo code: 123456</span>
                    {countdown > 0 ? (
                      <span>Resend in {countdown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        style={{ color: 'var(--color-primary)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Resend Code
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 4}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontWeight: 800 }}
                >
                  {isLoading ? 'Verifying...' : 'Verify & Instant Login'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: Identifier / Password Login */}
        {activeTab === 'password' && (
          <form onSubmit={handlePasswordLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px' }}>
                Account Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {[
                  { id: 'customer', label: 'Customer / Builder' },
                  { id: 'retailer', label: 'Store Partner' },
                  { id: 'delivery', label: 'Logistics Partner' },
                  { id: 'admin', label: 'Platform Admin' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedRole(r.id as UserRole)}
                    style={{
                      padding: '8px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: selectedRole === r.id ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: selectedRole === r.id ? '#FFF7ED' : '#FFFFFF',
                      color: selectedRole === r.id ? 'var(--color-primary)' : 'var(--color-text-main)',
                      cursor: 'pointer',
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px' }}>
                Phone or Email
              </label>
              <input
                type="text"
                placeholder="9845011223 or user@buildkart.in"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                style={{ width: '100%' }}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px' }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%' }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !identifier || !password}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontWeight: 800 }}
            >
              {isLoading ? 'Signing In...' : `Sign In as ${selectedRole.toUpperCase()}`}
            </button>
          </form>
        )}

        {/* TAB 3: Register New User */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, marginBottom: '6px' }}>
                I am registering as:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                {[
                  { id: 'customer', label: 'Buyer' },
                  { id: 'retailer', label: 'Store Vendor' },
                  { id: 'delivery', label: 'Delivery' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegRole(r.id as UserRole)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: regRole === r.id ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: regRole === r.id ? '#FFF7ED' : '#FFFFFF',
                      color: regRole === r.id ? 'var(--color-primary)' : 'var(--color-text-main)',
                      cursor: 'pointer',
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {regRole === 'customer' && (
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Customer Profile Type
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {(['individual', 'contractor', 'builder'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setRegCustomerType(t)}
                      style={{
                        flex: 1,
                        padding: '6px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: regCustomerType === t ? '1px solid var(--color-primary)' : '1px solid var(--color-border)',
                        backgroundColor: regCustomerType === t ? 'var(--color-primary)' : '#FFF',
                        color: regCustomerType === t ? '#FFF' : 'var(--color-text-main)',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Full Name *</label>
                <input
                  type="text"
                  placeholder="Ravi Kumar"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="9845011223"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  placeholder="ravi@buildkart.in"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Create Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
                />
              </div>
            </div>

            {regRole === 'retailer' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>Hardware Store Name</label>
                  <input
                    type="text"
                    placeholder="Sri Balaji Building Materials"
                    value={regStoreName}
                    onChange={(e) => setRegStoreName(e.target.value)}
                    style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '4px' }}>GSTIN (Optional)</label>
                  <input
                    type="text"
                    placeholder="36AABCU9603R1ZM"
                    value={regGst}
                    onChange={(e) => setRegGst(e.target.value)}
                    style={{ width: '100%', fontSize: '0.85rem', padding: '8px' }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !regName || !regPhone}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontWeight: 800, marginTop: '8px' }}
            >
              {isLoading ? 'Registering...' : 'Create Account & Continue'}
            </button>
          </form>
        )}

        {/* Footer info */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
          By continuing, you agree to BuildIt's Terms of Service & Privacy Policy.
        </div>
      </div>
    </div>
  );
};
