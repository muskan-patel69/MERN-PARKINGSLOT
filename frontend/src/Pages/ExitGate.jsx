import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ExitGate = () => {
  const [searchPlate, setSearchPlate] = useState('');
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchPlate.trim()) return;
    setLoading(true);
    setReceipt(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/vehicles/find/${searchPlate}`);
      setVehicleData(res.data);
      toast.success('Vehicle found!');
    } catch (err) {
      setVehicleData(null);
      toast.error(err.response?.data?.message || 'Vehicle not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!vehicleData) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/vehicles/checkout', {
        licensePlate: vehicleData.licensePlate
      });
      setReceipt(res.data);
      setVehicleData(null);
      toast.success('Vehicle checked out!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-2">🚗 Vehicle Exit & Finder</h2>
        <p className="text-xs text-slate-400 font-medium mb-6">Search car slot or process exit bill</p>

        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            required
            placeholder="e.g. MH05CJ8254"
            value={searchPlate}
            onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold uppercase outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl"
          >
            {loading ? '...' : 'Search'}
          </button>
        </form>

        {vehicleData && (
          <div className="p-5 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-indigo-100">
              <div>
                <span className="text-[10px] font-bold text-indigo-500 uppercase">Plate</span>
                <div className="text-lg font-black text-slate-800">{vehicleData.licensePlate}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-indigo-500 uppercase">Slot</span>
                <div className="text-lg font-black text-indigo-600">{vehicleData.slotNumber}</div>
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-600">
              Floor: {vehicleData.floorLevel} | Zone: {vehicleData.zone}
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-xl"
            >
              Exit Vehicle & Pay
            </button>
          </div>
        )}

        {receipt && (
          <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-1 mt-4">
            <span className="text-xs font-bold text-emerald-600 uppercase">Total Bill</span>
            <div className="text-2xl font-black text-emerald-700">₹{receipt.feeCharged}</div>
            <p className="text-xs text-slate-600">Duration: {receipt.durationHours} hr | Gate Open</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExitGate;