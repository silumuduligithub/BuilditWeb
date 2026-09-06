import React from 'react';
import { Link } from 'react-router-dom';
import { HardHat, PhoneCall, ShieldCheck, Truck, Headphones, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#111827',
        color: '#D1D5DB',
        borderTop: '1px solid #1F2937',
        marginTop: 'auto',
      }}
    >
      {/* Value Proposition Highlights */}
      <div style={{ borderBottom: '1px solid #1F2937', padding: '32px 0' }}>
        <div className="app-container grid grid-cols-4 gap-lg">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                backgroundColor: 'rgba(224, 32, 32, 0.15)',
                color: 'var(--color-primary)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Truck size={24} />
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9375rem' }}>60-Min Express Dispatch</div>
              <div style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Fast delivery directly to your construction site</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                color: '#3B82F6',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <ShieldCheck size={24} />
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9375rem' }}>100% Genuine Materials</div>
              <div style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>BIS certified cement, steel & electrical brands</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                backgroundColor: 'rgba(22, 163, 74, 0.15)',
                color: '#22C55E',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Clock size={24} />
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9375rem' }}>GST Tax Invoicing</div>
              <div style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Instant Input Tax Credit (ITC) compliant bills</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                backgroundColor: 'rgba(217, 119, 6, 0.15)',
                color: '#F59E0B',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <Headphones size={24} />
            </div>
            <div>
              <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.9375rem' }}>Engineer Support Desk</div>
              <div style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Consultation on material mix and bulk tenders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div style={{ padding: '48px 0 32px' }}>
        <div className="app-container grid grid-cols-4 gap-xl">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HardHat size={18} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#FFFFFF' }}>
                Build<span style={{ color: 'var(--color-primary)' }}>It</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: '#9CA3AF', marginBottom: '16px' }}>
              India's premier on-demand construction materials marketplace connecting builders, contractors, and home makers with verified local hardware stores and instant heavy freight.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FFFFFF', fontWeight: 600, fontSize: '0.875rem' }}>
              <PhoneCall size={16} color="var(--color-primary)" />
              <span>Helpline: 1800-419-BUILD (Toll Free)</span>
            </div>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '16px' }}>Materials & Categories</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <li><Link to="/category/structural" style={{ color: '#9CA3AF' }}>UltraTech & Ramco Cement</Link></li>
              <li><Link to="/category/structural" style={{ color: '#9CA3AF' }}>Tata Tiscon & JSW TMT Steels</Link></li>
              <li><Link to="/category/structural" style={{ color: '#9CA3AF' }}>River Sand & AAC Blocks</Link></li>
              <li><Link to="/category/electrical" style={{ color: '#9CA3AF' }}>Havells & Polycab Wires</Link></li>
              <li><Link to="/category/plumbing" style={{ color: '#9CA3AF' }}>Finolex & Astral CPVC Pipes</Link></li>
              <li><Link to="/category/finishing" style={{ color: '#9CA3AF' }}>Asian Paints & Berger Emulsions</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '16px' }}>Partner Ecosystem</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.875rem' }}>
              <li><Link to="/retailer" style={{ color: '#9CA3AF' }}>Hardware Store Partner Portal</Link></li>
              <li><Link to="/driver" style={{ color: '#9CA3AF' }}>Truck & Tempo Logistics Driver App</Link></li>
              <li><Link to="/compare" style={{ color: '#9CA3AF' }}>Store Price Comparison Matrix</Link></li>
              <li><Link to="/offers" style={{ color: '#9CA3AF' }}>Monsoon Bulk Tenders & Offers</Link></li>
              <li><Link to="/admin" style={{ color: '#9CA3AF' }}>Platform Administration</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', marginBottom: '16px' }}>BuildIt Mobile App</h4>
            <p style={{ fontSize: '0.875rem', color: '#9CA3AF', marginBottom: '16px' }}>
              Download our high-speed mobile application for site supervisors and instant barcode scanning.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div
                style={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <span style={{ fontSize: '1.25rem' }}>📱</span>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>GET IT ON</div>
                  <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.875rem' }}>Google Play & iOS</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div style={{ borderTop: '1px solid #1F2937', padding: '16px 0', fontSize: '0.8125rem', color: '#6B7280' }}>
        <div className="app-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>© {new Date().getFullYear()} BuildIt Web (BuildKart Logistics Technologies Pvt. Ltd.). All rights reserved.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>GST Compliance</span>
            <span>Site Map</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
