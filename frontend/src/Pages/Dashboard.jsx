import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [slots, setSlots] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalSlots: 6,
    occupiedSlots: 1,
    availableSlots: 5,
    occupancyRate: '17%',
    totalRevenue: '₹0',
    queueGateCount: 3,
    peakHour: '5:00 PM - 7:00 PM',
    departedVehicles: []
  });

  const [logs, setLogs] = useState({
    maintenance: [
      { id: 1, slot: 'A-102', issue: 'EV Charging Gun Cable Fault', status: 'In Progress' },
      { id: 2, slot: 'B-202', issue: 'Barrier Sensor Alignment Error', status: 'Pending' }
    ],
    cleaningSchedule: [
      { floor: 'Ground Floor (Wing A)', time: '09:00 AM', status: 'Completed' },
      { floor: '1st Floor (Wing B)', time: '02:00 PM', status: 'Scheduled' }
    ],
    staffShifts: [
      { name: 'Ramesh Patil', role: 'Entry Barrier Operator', shift: 'Morning (08:00 - 16:00)' },
      { name: 'Suresh Kumar', role: 'Exit Gate & Billing', shift: 'Evening (16:00 - 00:00)' }
    ]
  });

  const [emergencyLoading, setEmergencyLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [resSlots, resAnalytics, resLogs] = await Promise.all([
        axios.get('http://localhost:5000/api/slots'),
        axios.get('http://localhost:5000/api/analytics/overview'),
        axios.get('http://localhost:5000/api/operations/logs')
      ]);

      if (resSlots.data) setSlots(resSlots.data);
      if (resAnalytics.data) setAnalytics(resAnalytics.data);
      if (resLogs.data) setLogs(resLogs.data);
    } catch (err) {
      console.warn('Dashboard fetch fallback:', err.message);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleEmergencyExit = async () => {
    if (!window.confirm('⚠️ WARNING: Trigger EMERGENCY EXIT mode? This will open all barrier gates and free all parking slots immediately!')) return;

    setEmergencyLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/emergency-exit');
      toast.success(res.data?.message || 'Emergency exit activated!');
      fetchDashboardData();
    } catch (err) {
      toast.error('Emergency action failed');
    } finally {
      setEmergencyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* 1. Header & Emergency Action */}
        <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">Smart Parking Dashboard</h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">Real-time slot monitoring, operations, and analytics</p>
          </div>
          <button
            onClick={handleEmergencyExit}
            disabled={emergencyLoading}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xs font-black rounded-xl shadow-lg shadow-red-500/25 uppercase tracking-wider transition cursor-pointer"
          >
            {emergencyLoading ? 'Clearing...' : '🚨 Emergency Exit Mode'}
          </button>
        </div>

        {/* 2. Occupancy, Revenue & Gate Analytics */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Slots</span>
            <div className="text-xl font-black text-slate-800 mt-1">{analytics.totalSlots}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Available</span>
            <div className="text-xl font-black text-emerald-600 mt-1">{analytics.availableSlots}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Occupied</span>
            <div className="text-xl font-black text-rose-600 mt-1">{analytics.occupiedSlots}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Occupancy Rate</span>
            <div className="text-xl font-black text-indigo-600 mt-1">{analytics.occupancyRate}</div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">Queue at Gate</span>
            <div className="text-xl font-black text-amber-600 mt-1">{analytics.queueGateCount} Cars</div>
          </div>
          <div className="col-span-2 md:col-span-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Total Revenue</span>
            <div className="text-xl font-black text-emerald-600 mt-1">{analytics.totalRevenue}</div>
          </div>
        </div>

        {/* 3. Route Suggestion & Peak Hour Traffic Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">📍 Route Suggestion System</span>
              <p className="text-xs text-indigo-700 font-medium mt-0.5">
                Fastest route directed to <strong>Wing A & Ground Level</strong> from Entry Gate 1.
              </p>
            </div>
            <span className="text-[11px] font-bold bg-white text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm">
              Optimal
            </span>
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wide">⏱️ Peak Hour Traffic Report</span>
              <p className="text-xs text-amber-700 font-medium mt-0.5">
                Maximum rush observed between <strong>{analytics.peakHour}</strong>.
              </p>
            </div>
            <span className="text-[11px] font-bold bg-white text-amber-700 px-3 py-1.5 rounded-lg border border-amber-200 shadow-sm">
              High Traffic
            </span>
          </div>
        </div>

        {/* 4. Live Slot Map Display */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-800">🗺️ Live Parking Slot Grid (Real-Time)</h2>
              <p className="text-xs text-slate-400 font-medium">Smart slot suggestion & occupancy status</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-emerald-500 rounded-full inline-block"></span> Free</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 bg-rose-500 rounded-full inline-block"></span> Occupied</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {slots.map((slot) => (
              <div
                key={slot._id}
                className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center transition shadow-sm ${
                  slot.isOccupied
                    ? 'bg-rose-50 border-rose-300 text-rose-800'
                    : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}
              >
                <span className="text-lg font-black">{slot.slotNumber}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider mt-1 opacity-75">
                  {slot.slotType} {slot.hasEVCharging ? '⚡' : ''} {slot.isReserved ? '🛡️' : ''}
                </span>
                <span className="text-[11px] font-bold mt-2">
                  {slot.isOccupied ? (slot.currentVehicle?.licensePlate || 'Occupied') : 'Available'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Operations: Maintenance, Cleaning & Staff Assignment */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Slot Maintenance & Fault Reporting */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">🛠️ Maintenance & Fault Log</h3>
            <div className="space-y-2">
              {logs.maintenance.map((m) => (
                <div key={m.id} className="p-2.5 bg-slate-50 rounded-xl text-xs flex justify-between items-center border border-slate-100">
                  <div>
                    <strong className="text-slate-800">{m.slot}</strong>
                    <div className="text-slate-500 text-[11px]">{m.issue}</div>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded font-bold text-[10px]">{m.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cleaning Schedule Tracker */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">🧹 Cleaning Schedule Tracker</h3>
            <div className="space-y-2">
              {logs.cleaningSchedule.map((c, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-xl text-xs flex justify-between items-center border border-slate-100">
                  <div>
                    <strong className="text-slate-800">{c.floor}</strong>
                    <div className="text-slate-500 text-[11px]">{c.time}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${c.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shift-wise Staff Assignment */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">👥 Shift-wise Staff Roster</h3>
            <div className="space-y-2">
              {logs.staffShifts.map((s, i) => (
                <div key={i} className="p-2.5 bg-slate-50 rounded-xl text-xs border border-slate-100">
                  <div className="font-bold text-slate-800">{s.name}</div>
                  <div className="text-indigo-600 font-semibold text-[11px]">{s.role}</div>
                  <div className="text-slate-400 text-[10px]">{s.shift}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;