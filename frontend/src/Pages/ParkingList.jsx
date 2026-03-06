import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../lib/axios";
import { formatData, calculateParkingFee } from "../lib/utils";
import toast from 'react-hot-toast';
import { LayoutDashboard, Search, Trash2, Car, LogOut } from 'lucide-react';

const ParkingList = () => {
  const navigate = useNavigate();
  const [slots, setSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/slots');
      setSlots(data.data || []);
    } catch (error) { toast.error("Failed to load records"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  // --- MANUAL CHECK-OUT LOGIC ---
  const handleCheckOut = async (slot) => {
    const exitTime = prompt("Enter Exit Date & Time (YYYY-MM-DDTHH:MM)", new Date().toISOString().slice(0, 16));
    
    if (exitTime) {
      const fee = calculateParkingFee(slot.entryTime, exitTime, slot.vehicleType);
      
      try {
        await api.put(`/slots/${slot._id}`, {
          ...slot,
          exitTime: exitTime,
          parkingFee: fee,
          status: 'Exited'
        });
        toast.success(`Vehicle Exited. Total Fee: ₹${fee}`);
        loadData();
      } catch (error) { toast.error("Error during check-out"); }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete record?")) {
      await api.delete(`/slots/${id}`);
      loadData();
    }
  };

  const filteredSlots = slots.filter(s =>
    s.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.parkingSlot?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-base-100 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-base-200 gap-4">
        <div>
          <h1 className="text-xl font-black uppercase italic">All <span className="text-primary">Records</span></h1>
          <p className="text-[10px] font-bold opacity-50 uppercase">{slots.length} Total Logs</p>
        </div>
        <div className="flex items-center gap-3">
          <input type="text" placeholder="Search Plate..." className="input input-bordered w-full md:w-80" onChange={(e) => setSearchTerm(e.target.value)} />
          <button onClick={() => navigate('/')} className="btn btn-primary gap-2"><LayoutDashboard size={18} /> Dashboard</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSlots.map((slot) => (
          <div key={slot._id} className={`card bg-white shadow-sm border-t-4 ${slot.status === 'Parked' ? 'border-primary' : 'border-success'}`}>
            <div className="card-body p-5">
              <div className="flex justify-between items-start">
                <span className="badge badge-sm font-black uppercase">{slot.parkingSlot}</span>
                <button onClick={() => handleDelete(slot._id)} className="text-error opacity-50 hover:opacity-100"><Trash2 size={16} /></button>
              </div>
              <h2 className="font-mono font-black text-lg mt-3">{slot.vehicleNumber}</h2>
              <p className="text-[10px] font-bold opacity-50 uppercase">{slot.vehicleType} • {formatData(slot.entryTime)}</p>
              
              <div className="mt-5 pt-4 border-t flex justify-between items-center">
                <div>
                  <div className={`badge badge-xs font-bold ${slot.status === 'Parked' ? 'badge-primary' : 'badge-success'}`}>
                    {slot.status}
                  </div>
                </div>
                {slot.status === 'Parked' ? (
                  <button onClick={() => handleCheckOut(slot)} className="btn btn-xs btn-outline btn-secondary gap-1">
                    <LogOut size={12} /> Check-Out
                  </button>
                ) : (
                  <p className="font-black text-success text-xl">₹{slot.parkingFee}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParkingList;