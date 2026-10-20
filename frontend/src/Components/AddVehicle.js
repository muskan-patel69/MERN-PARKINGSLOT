import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddVehicle = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    licensePlate: '',
    vehicleType: 'Compact',
    needsEV: false,
    isReserved: false,
    entryTime: new Date().toISOString().slice(0, 16),
    exitTime: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16)
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const hourlyRate = 20;

  const calculateTotalFee = () => {
    const start = new Date(formData.entryTime);
    const end = new Date(formData.exitTime);
    const diffHours = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60)));
    return isNaN(diffHours) ? 20 : diffHours * hourlyRate;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await axios.post('http://localhost:5000/api/vehicles/check-in', {
        licensePlate: formData.licensePlate.trim().toUpperCase(),
        vehicleType: formData.vehicleType,
        needsEV: formData.needsEV
      });

      if (res.data.success) {
        setMessage(`Success! Slot Assigned: ${res.data.slotNumber} (Floor ${res.data.floorLevel})`);
        setTimeout(() => {
          navigate('/');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to allocate parking slot. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#f3f4f6',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px 16px 80px 16px',
        overflowY: 'auto'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          padding: '32px',
          boxSizing: 'border-box'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#1f2937', margin: '0 0 6px 0' }}>
            Vehicle Check-In
          </h2>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
            Enter vehicle specifications to assign an optimal parking slot.
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}
          >
            {error}
          </div>
        )}

        {message && (
          <div
            style={{
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* License Plate Field */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              LICENSE PLATE NUMBER
            </label>
            <input
              type="text"
              name="licensePlate"
              required
              placeholder="e.g. MH-04-AB-1234"
              value={formData.licensePlate}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
                textTransform: 'uppercase',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
          </div>

          {/* Vehicle Type Dropdown */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
              VEHICLE CATEGORY
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '15px',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: '#ffffff'
              }}
            >
              <option value="Compact">Compact / Sedan</option>
              <option value="SUV">SUV / Large Vehicle</option>
              <option value="EV">Electric Vehicle (EV)</option>
              <option value="Handicapped">Accessibility / Handicapped</option>
            </select>
          </div>

          {/* Special Feature Toggles */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              backgroundColor: '#f9fafb',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '20px',
              border: '1px solid #e5e7eb'
            }}
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#4f46e5', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="needsEV"
                checked={formData.needsEV}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              ⚡ EV CHARGER
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: '#db2777', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="isReserved"
                checked={formData.isReserved}
                onChange={handleChange}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              🛡️ VIP RESERVED
            </label>
          </div>

          {/* Timestamps */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4b5563', marginBottom: '4px' }}>
                ENTRY TIME
              </label>
              <input
                type="datetime-local"
                name="entryTime"
                value={formData.entryTime}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#4b5563', marginBottom: '4px' }}>
                EXIT TIME
              </label>
              <input
                type="datetime-local"
                name="exitTime"
                value={formData.exitTime}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '13px',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Rate & Total Display */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px dashed #e5e7eb',
              borderBottom: '1px dashed #e5e7eb',
              padding: '16px 0',
              marginBottom: '24px'
            }}
          >
            <div>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>CURRENT RATE</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#111827' }}>₹{hourlyRate}/hr</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600' }}>TOTAL FEE</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#10b981' }}>₹{calculateTotalFee()}</div>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#9ca3af' : '#4f46e5',
              color: '#ffffff',
              padding: '14px',
              fontSize: '16px',
              fontWeight: '700',
              borderRadius: '10px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.35)',
              transition: 'background-color 0.2s ease'
            }}
          >
            {loading ? 'Allocating Slot...' : 'Confirm & Add Vehicle'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;