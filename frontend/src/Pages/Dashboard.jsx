import React, { useState, useEffect } from 'react';
import api from '../lib/axios';
import { RATES } from '../lib/utils';
import toast from 'react-hot-toast';
import { Activity, PlusCircle, ArrowLeft } from 'lucide-react';

const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    parkingSlot: '', 
    vehicleNumber: '', 
    vehicleType: 'Car',
    entryTime: new Date().toISOString().slice(0, 16),
  });

  const fetchSlots = async () => {
    try {
      const { data } = await api.get('/slots');
      setSlots(data.data || []);
    } catch (error) { toast.error("API Error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSlots(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/slots', { ...formData, status: 'Parked', parkingFee: 0 });
      toast.success("Vehicle Parked Successfully!");
      document.getElementById('add_modal').close();
      setFormData({ ...formData, parkingSlot: '', vehicleNumber: '' });
      fetchSlots();
    } catch (error) { toast.error("Slot already occupied!"); }
  };

  const handleBack = () => {
    document.getElementById('add_modal').close();
  };

  if (loading) return <div className="flex justify-center mt-20"><span className="loading loading-bars text-primary"></span></div>;

  return (
    <div className="p-6 space-y-6 bg-base-100 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-md border border-base-200">
        <div className="flex items-center gap-4">
          <Activity className="text-primary" size={28} />
          <div>
            <h1 className="text-2xl font-black uppercase italic">PARKING <span className="text-primary">TRACKING</span></h1>
            <p className="text-[10px] font-bold opacity-60 uppercase">Monitoring current hostel parking</p>
          </div>
        </div>
        {/* UPDATED DARK BUTTON */}
        <button className="btn btn-neutral shadow-xl text-white border-none" onClick={() => document.getElementById('add_modal').showModal()}>
          <PlusCircle size={20} /> New Check-In
        </button>
      </div>

      {/* PARKING SLOTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {slots.filter(s => s.status === 'Parked').map((slot) => (
          <div key={slot._id} className="card bg-white border border-base-300 shadow-sm hover:shadow-md transition-shadow">
            <div className="card-body p-4">
              <div className="flex justify-between items-center">
                <span className="badge badge-neutral font-black text-[10px] uppercase text-white">{slot.parkingSlot}</span>
                <span className="flex items-center gap-1 text-[9px] font-black text-success uppercase">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                  </span>
                  LIVE
                </span>
              </div>
              
              {/* DARK & BOLD VEHICLE NUMBER */}
              <h2 className="font-black text-2xl font-mono mt-2 uppercase text-neutral tracking-tighter">
                {slot.vehicleNumber}
              </h2>
              
              <p className="text-[10px] text-primary uppercase font-black tracking-widest">{slot.vehicleType}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL SECTION */}
      <dialog id="add_modal" className="modal">
        <div className="modal-box max-w-xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-xl uppercase">Vehicle Entry</h3>
            <button type="button" onClick={handleBack} className="btn btn-sm btn-ghost gap-2 font-bold">
              <ArrowLeft size={16} /> Back
            </button>
          </div>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-5">
            <div className="flex gap-2">
              {Object.keys(RATES).map(type => (
                <button key={type} type="button" onClick={() => setFormData({...formData, vehicleType: type})} 
                className={`btn flex-1 font-bold ${formData.vehicleType === type ? 'btn-neutral text-white' : 'btn-outline'}`}>{type}</button>
              ))}
            </div>
            
            <select className="select select-bordered font-bold" required value={formData.parkingSlot} onChange={(e) => setFormData({...formData, parkingSlot: e.target.value})}>
              <option value="" disabled>Select Slot (A1-A10)</option>
              {['A1','A2','A3','A4','A5','A6','A7','A8','A9','A10'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <input type="text" className="input input-bordered uppercase font-mono font-bold" placeholder="Vehicle Number" required value={formData.vehicleNumber} onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value.toUpperCase()})} />

            <div className="form-control">
              <label className="label py-1">
                <span className="label-text font-bold text-[10px] uppercase opacity-50">Entry Time</span>
              </label>
              <input type="datetime-local" className="input input-bordered font-bold" value={formData.entryTime} onChange={(e) => setFormData({...formData, entryTime: e.target.value})} />
            </div>
            
            <div className="flex gap-3 mt-4">
              <button type="button" onClick={handleBack} className="btn btn-outline flex-1 uppercase font-black tracking-widest">Cancel</button>
              <button type="submit" className="btn btn-neutral flex-[2] uppercase font-black tracking-widest shadow-lg text-white">Confirm Parking</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Dashboard;
