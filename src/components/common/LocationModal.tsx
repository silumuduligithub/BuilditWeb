import React, { useState } from 'react';
import { X, MapPin, Plus, Check } from 'lucide-react';
import { useApp } from '../../store';
import { DeliveryAddress } from '../../types';

export const LocationModal: React.FC = () => {
  const { isLocationModalOpen, setIsLocationModalOpen, currentAddress, setCurrentAddress, savedAddresses, addAddress } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newLabel, setNewLabel] = useState<'Site' | 'Home' | 'Office'>('Site');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newLine1, setNewLine1] = useState('');
  const [newCity, setNewCity] = useState('Hyderabad');
  const [newPincode, setNewPincode] = useState('500081');

  if (!isLocationModalOpen) return null;

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone || !newLine1 || !newPincode) return;

    const newAddr: DeliveryAddress = {
      id: `addr_${Date.now()}`,
      label: newLabel,
      name: newName,
      phone: newPhone,
      line1: newLine1,
      city: newCity,
      pincode: newPincode,
    };

    addAddress(newAddr);
    setIsAddingNew(false);
    setIsLocationModalOpen(false);
  };

  return (
    <div className="modal-overlay" onClick={() => setIsLocationModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Select Delivery Location</h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              Materials and store availability will be updated based on your project site.
            </p>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            style={{ padding: '6px', borderRadius: '50%', backgroundColor: 'var(--color-bg)' }}
          >
            <X size={20} />
          </button>
        </div>

        {!isAddingNew ? (
          <div>
            {/* Saved Addresses List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {savedAddresses.map((addr, idx) => {
                const isSelected = currentAddress.line1 === addr.line1 && currentAddress.pincode === addr.pincode;
                return (
                  <div
                    key={addr.id || idx}
                    onClick={() => {
                      setCurrentAddress(addr);
                      setIsLocationModalOpen(false);
                    }}
                    style={{
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                      backgroundColor: isSelected ? 'var(--color-primary-faded)' : 'var(--color-surface)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div
                        style={{
                          backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-bg)',
                          color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                          width: '36px',
                          height: '36px',
                          borderRadius: 'var(--radius-md)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.9375rem' }}>{addr.label}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>• {addr.name}</span>
                        </div>
                        <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                          {addr.line1}
                          {addr.line2 && `, ${addr.line2}`}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                          {addr.city} - {addr.pincode} • Tel: {addr.phone}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: '#FFFFFF',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsAddingNew(true)}
              className="btn btn-secondary btn-full"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderStyle: 'dashed' }}
            >
              <Plus size={18} />
              <span>Add New Construction Site / Address</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleAddNew}>
            <div className="form-group">
              <label className="form-label">Location Type</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {(['Site', 'Home', 'Office'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setNewLabel(type)}
                    className={`btn btn-sm ${newLabel === type ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1 }}
                  >
                    {type === 'Site' ? '🏗️ Construction Site' : type === 'Home' ? '🏡 Home' : '🏢 Office'}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Site Contact / Recipient Name</label>
              <input
                type="text"
                placeholder="e.g. Suresh Reddy (Site Engineer)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone Number</label>
              <input
                type="tel"
                placeholder="e.g. 98480 22334"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Full Address / Site Landmark</label>
              <input
                type="text"
                placeholder="e.g. Tower 4, Cyber City Phase 2, Hitec City"
                value={newLine1}
                onChange={(e) => setNewLine1(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-md">
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  value={newPincode}
                  onChange={(e) => setNewPincode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="btn btn-secondary"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Save & Select Location
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
