import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const VEHICLE_RATES = {
  'Car / Sedan (Petrol)': 20,
  'Bike / Scooty': 10,
  'SUV / Large': 30,
  'Electric Vehicle (EV)': 25,
  'Truck / Heavy': 50
};

const AddVehicle = () => {
  const [manualSlot, setManualSlot] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState('Car / Sedan (Petrol)');
  const [durationHours, setDurationHours] = useState(1);
  const [requiresEV, setRequiresEV] = useState(false);
  const [isVIP, setIsVIP] = useState(false);
  const [loading, setLoading] = useState(false);

  // Rate aur Total Fee calculate
  const currentRate = VEHICLE_RATES[vehicleCategory] || 20;
  const totalFee = currentRate * Math.max(1, Number(durationHours) || 1);

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setVehicleCategory(selected);
    if (selected === 'Electric Vehicle (EV)') {
      setRequiresEV(true);
    } else {
      setRequiresEV(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!licensePlate.trim()) {
      return toast.error('Please enter vehicle plate number');
    }

    setLoading(true);
    try {
      const payload = {
        licensePlate: licensePlate.trim().toUpperCase(),
        vehicleType: vehicleCategory,
        durationHours: Number(durationHours) || 1,
        requiresEV,
        isVIP,
        manualSlot: manualSlot.trim() || undefined
      };

      const res = await axios.post('http://localhost:5000/api/vehicles/checkin', payload);
      toast.success(`Allocated Slot: ${res.data.slotNumber} (Floor: ${res.data.floorLevel})`);

      // Reset Form
      setLicensePlate('');
      setManualSlot('');
      setDurationHours(1);
      setRequiresEV(false);
      setIsVIP(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to check-in vehicle');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-md border border-slate-200">
        <h2 className="text-xl font-black text-slate-800 mb-6">Vehicle Check-In</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Manual Slot */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Manual Slot <span className="opacity-60 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. A-101"
              value={manualSlot}
              onChange={(e) => setManualSlot(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-medium"
            />
          </div>

          {/* Plate Number */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Plate Number *
            </label>
            <input
              type="text"
              required
              placeholder="MH05CJ8254"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-bold uppercase tracking-wider text-slate-800"
            />
          </div>

          {/* Vehicle Category Dropdown (Car, Bike/Scooty, Truck, EV, SUV) */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Vehicle Category *
            </label>
            <select
              value={vehicleCategory}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-500 font-semibold text-slate-700 bg-white cursor-pointer"
            >
              <option value="Car / Sedan (Petrol)">🚗 Car / Sedan (Petrol/Diesel)</option>
              <option value="Bike / Scooty">🛵 Bike / Scooty (Two Wheeler)</option>
              <option value="SUV / Large">🚙 SUV / Large Car</option>
              <option value="Electric Vehicle (EV)">⚡ Electric Vehicle (EV)</option>
              <option value="Truck / Heavy">🚛 Truck / Heavy Vehicle</option>
            </select>
          </div>

          {/* Parking Duration (Hours) */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Parking Duration (Kitne Ghante Rukegi) *
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="1"
                max="72"
                value={durationHours}
                onChange={(e) => setDurationHours(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Hour(s)</span>
            </div>
          </div>

          {/* Checkbox Toggles: EV Charger & VIP */}
          <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-bold">
            <label className="flex items-center gap-2 cursor-pointer text-amber-600">
              <input
                type="checkbox"
                checked={requiresEV}
                onChange={(e) => setRequiresEV(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 cursor-pointer"
              />
              <span>⚡ EV Charger</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-indigo-600">
              <input
                type="checkbox"
                checked={isVIP}
                onChange={(e) => setIsVIP(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 cursor-pointer"
              />
              <span>🛡️ VIP Reserved</span>
            </label>
          </div>

          {/* Dynamic Rate & Calculated Total Fee Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Rate per Hour</span>
              <span className="text-sm font-black text-slate-700">₹{currentRate}/hr</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Fee</span>
              <span className="text-2xl font-black text-emerald-600">₹{totalFee}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/25 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Allocating Slot...' : 'Confirm & Add Vehicle'}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddVehicle;