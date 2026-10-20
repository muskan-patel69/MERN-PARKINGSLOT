import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    licensePlate: 'MH05CJ8254',
    vehicleType: 'Compact',
    hasEVCharging: true,
    isReserved: false,
    manualSlot: 'A-G-1'
  });
  const [loading, setLoading] = useState(false);
  const [assignedInfo, setAssignedInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/vehicles/checkin', {
        licensePlate: formData.licensePlate,
        vehicleType: formData.vehicleType,
        requiresEV: formData.hasEVCharging,
        isVIP: formData.isReserved
      });
      setAssignedInfo(res.data);
      toast.success('Vehicle successfully checked in!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error checking in vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f3f4f6',
      padding: '40px 16px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
        padding: '28px',
        margin: 'auto'
      }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '20px' }}>
          Vehicle Check-In
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Manual Slot */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '6px', letterSpacing: '0.5px' }}>
              MANUAL SLOT <span style={{ fontWeight: 'normal', color: '#9ca3af' }}>(OPTIONAL)</span>
            </label>
            <input
              type="text"
              value={formData.manualSlot}
              onChange={(e) => setFormData({ ...formData, manualSlot: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                fontWeight: '600',
                outline: 'none'
              }}
            />
          </div>

          {/* License Plate */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '6px', letterSpacing: '0.5px' }}>
              PLATE NUMBER
            </label>
            <input
              type="text"
              required
              value={formData.licensePlate}
              onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                fontWeight: '700',
                fontSize: '15px',
                letterSpacing: '1px',
                outline: 'none'
              }}
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#6b7280', marginBottom: '6px', letterSpacing: '0.5px' }}>
              VEHICLE CATEGORY
            </label>
            <select
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                outline: 'none'
              }}
            >
              <option value="Compact">Compact / Sedan</option>
              <option value="SUV">SUV / Large</option>
              <option value="EV">Electric Vehicle (EV)</option>
              <option value="Handicapped">Handicapped / Accessible</option>
            </select>
          </div>

          {/* Toggles */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            backgroundColor: '#f9fafb',
            padding: '12px',
            borderRadius: '10px',
            border: '1px solid #f3f4f6'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#4f46e5' }}>
              <input
                type="checkbox"
                checked={formData.hasEVCharging}
                onChange={(e) => setFormData({ ...formData, hasEVCharging: e.target.checked })}
              />
              ⚡ EV CHARGER
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: '#db2777' }}>
              <input
                type="checkbox"
                checked={formData.isReserved}
                onChange={(e) => setFormData({ ...formData, isReserved: e.target.checked })}
              />
              🛡️ VIP RESERVED
            </label>
          </div>

          {/* Fee Card */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            backgroundColor: '#f9fafb',
            borderRadius: '10px',
            border: '1px solid #e5e7eb'
          }}>
            <div>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#6366f1' }}>CURRENT RATE</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>₹20/hr</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', fontWeight: '700', color: '#059669' }}>TOTAL FEE</div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669' }}>₹20</div>
            </div>
          </div>

          {/* Confirm & Add Vehicle Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '700',
              border: 'none',
              borderRadius: '10px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}
          >
            {loading ? 'Assigning Slot...' : 'Confirm & Add Vehicle'}
          </button>
        </form>

        {/* Assigned Slot Result Display */}
        {assignedInfo && (
          <div style={{
            marginTop: '20px',
            padding: '14px',
            backgroundColor: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '8px',
            color: '#065f46',
            textAlign: 'center'
          }}>
            <strong>Success! Slot Assigned:</strong> {assignedInfo.slotNumber || assignedInfo.slot?.slotNumber || 'Confirmed'}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddVehicle;