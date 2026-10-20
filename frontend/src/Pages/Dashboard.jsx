import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  const [searchPlate, setSearchPlate] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSlots = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/slots');
      setSlots(res.data);
    } catch (err) {
      toast.error('Failed to load slots');
    }
  };

  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 5000); // Live sync every 5s
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPlate.trim()) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/vehicles/find/${searchPlate}`);
      setSearchResult(res.data);
      toast.success('Vehicle located!');
    } catch (err) {
      setSearchResult(null);
      toast.error(err.response?.data?.message || 'Vehicle not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (plate) => {
    if (!window.confirm(`Checkout vehicle ${plate}?`)) return;
    try {
      const res = await axios.post('http://localhost:5000/api/vehicles/checkout', { licensePlate: plate });
      toast.success(`Vehicle exited! Total Fee: ₹${res.data.feeCharged}`);
      setSearchResult(null);
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
  };

  const totalSlots = slots.length;
  const occupiedSlots = slots.filter((s) => s.isOccupied).length;
  const availableSlots = totalSlots - occupiedSlots;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase">Total Slots</span>
            <div className="text-3xl font-black text-slate-800 mt-1">{totalSlots}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-xs font-bold text-emerald-500 uppercase">Available</span>
            <div className="text-3xl font-black text-emerald-600 mt-1">{availableSlots}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-xs font-bold text-rose-500 uppercase">Occupied</span>
            <div className="text-3xl font-black text-rose-600 mt-1">{occupiedSlots}</div>
          </div>
        </div>

        {/* Vehicle Finder Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-base font-bold text-slate-800 mb-3">🔍 Vehicle Location Finder</h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Plate Number (e.g. MH05CJ8254)"
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow hover:bg-indigo-700"
            >
              {loading ? 'Searching...' : 'Locate'}
            </button>
          </form>

          {searchResult && (
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-indigo-900">Vehicle: {searchResult.licensePlate}</p>
                <p className="text-xs font-semibold text-indigo-700 mt-0.5">
                  Slot: <span className="text-base font-black">{searchResult.slotNumber}</span> (Floor {searchResult.floorLevel}, Zone {searchResult.zone})
                </p>
              </div>
              <button
                onClick={() => handleCheckout(searchResult.licensePlate)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow"
              >
                Exit / Checkout Gate
              </button>
            </div>
          )}
        </div>

        {/* Live Slot Map Display */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-slate-800">🗺️ Live Parking Slot Grid (Real-Time)</h2>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-full inline-block"></span> Free</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-rose-500 rounded-full inline-block"></span> Occupied</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition ${
                  slot.isOccupied
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}
              >
                <span className="text-lg font-black">{slot.slotNumber}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-75">
                  {slot.slotType} {slot.hasEVCharging ? '⚡' : ''}
                </span>
                <span className="text-[11px] font-semibold mt-2">
                  {slot.isOccupied ? (slot.currentVehicle?.licensePlate || 'Occupied') : 'Available'}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;