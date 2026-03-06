import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { calculateParkingFee } from '../lib/utils';
import toast from 'react-hot-toast';
import { Car, Bike, Truck, Save, ArrowLeft } from 'lucide-react';

const AddVehicle = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    parkingSlot: '',
    vehicleNumber: '',
    vehicleType: 'Car',
    entryTime: new Date().toISOString().slice(0, 16),
    exitTime: '',
    status: 'Parked',
    parkingFee: 0
  });

  // --- AUTOMATIC FEE LOGIC ---
  useEffect(() => {
    const fee = calculateParkingFee(formData.entryTime, formData.exitTime, formData.vehicleType);
    setFormData(prev => ({ ...prev, parkingFee: fee }));
  }, [formData.entryTime, formData.exitTime, formData.vehicleType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/slots', formData);
      toast.success(`${formData.vehicleType} Check-in Successful!`);
      navigate('/status');
    } catch (err) {
      toast.error("Error saving record. Slot might be taken.");
    }
  };

  return (
    <div className="flex flex-col items-center py-10 px-4 bg-base-200 min-h-screen">
      <div className="card w-full max-w-2xl bg-white shadow-2xl rounded-3xl overflow-hidden">
        <div className="h-2 bg-primary"></div>
        <div className="card-body p-8">

          <div className="flex justify-between items-center mb-8">
            <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm"><ArrowLeft size={20} /></button>
            <h2 className="text-2xl font-black text-center uppercase italic">Vehicle Entry</h2>
            <div className="w-10"></div> {/* Spacer */}
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Vehicle Type Selection */}
            <div className="form-control md:col-span-2">
              <label className="label text-xs font-bold opacity-50 uppercase">Select Vehicle Type</label>
              <div className="flex gap-4">
                {['Bike', 'Car', 'Truck'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, vehicleType: type })}
                    className={`flex-1 btn btn-md gap-2 ${formData.vehicleType === type ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {type === 'Bike' && <Bike size={18} />}
                    {type === 'Car' && <Car size={18} />}
                    {type === 'Truck' && <Truck size={18} />}
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* RESTRICTED SLOT DROPDOWN */}
            <div className="form-control">
              <label className="label text-xs font-bold opacity-50 uppercase">Slot (A1-A10)</label>
              <select
                className="select select-bordered font-bold"
                required
                value={formData.parkingSlot}
                onChange={(e) => setFormData({ ...formData, parkingSlot: e.target.value })}
              >
                <option value="" disabled>Choose Slot</option>
                {['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'].map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold opacity-50 uppercase">Plate Number</label>
              <input type="text" className="input input-bordered uppercase font-mono" placeholder="MH 01 AB 1234" required
                value={formData.vehicleNumber}
                onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value.toUpperCase() })} />
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold opacity-50 uppercase">Entry Time</label>
              <input type="datetime-local" className="input input-bordered"
                value={formData.entryTime}
                onChange={(e) => setFormData({ ...formData, entryTime: e.target.value })} />
            </div>

            <div className="form-control">
              <label className="label text-xs font-bold opacity-50 uppercase text-secondary">Exit Time</label>
              <input type="datetime-local" className="input input-bordered border-secondary"
                required
                value={formData.exitTime}
                onChange={(e) => setFormData({ ...formData, exitTime: e.target.value })} />
            </div>

            {/* Total Summary Display */}
            <div className="md:col-span-2 p-6 bg-base-200 rounded-2xl border-2 border-dashed border-base-300">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black opacity-50 uppercase">Current Rate</p>
                  <p className="text-lg font-black text-primary">
                    ₹{formData.vehicleType === 'Bike' ? 10 : formData.vehicleType === 'Truck' ? 50 : 20}/hr
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black opacity-50 uppercase">Total Fee</p>
                  <p className="text-4xl font-black text-success tracking-tighter">₹{formData.parkingFee}</p>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block md:col-span-2 text-lg font-black uppercase tracking-widest shadow-lg shadow-primary/20">
              <Save className="mr-2" /> Confirm & Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;