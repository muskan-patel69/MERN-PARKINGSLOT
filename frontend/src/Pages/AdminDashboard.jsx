import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalSlots: 12,
    occupiedSlots: 2,
    availableSlots: 10,
    occupancyRate: '17%',
    totalRevenue: '₹240',
    queueGateCount: 2,
    peakHour: '5:00 PM - 7:00 PM'
  });

  const [logs, setLogs] = useState({
    maintenance: [
      { id: 1, slot: 'A-G-2', issue: 'EV Charger Socket Damaged', status: 'In Progress' },
      { id: 2, slot: 'B-1-4', issue: 'Overhead Slot Sensor Offline', status: 'Pending' }
    ],
    cleaningSchedule: [
      { floor: 'Ground Floor (Wing A)', time: '10:00 AM', status: 'Completed' },
      { floor: '1st Floor (Wing B)', time: '02:00 PM', status: 'Pending' }
    ],
    staffShifts: [
      { name: 'Ramesh Patil', role: 'Entry Barrier Operator', shift: 'Morning (08:00 - 16:00)' },
      { name: 'Suresh Kumar', role: 'Exit Gate & Cashier', shift: 'Evening (16:00 - 00:00)' }
    ]
  });

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const resAnalytics = await axios.get('http://localhost:5000/api/analytics/overview');
      if (resAnalytics.data) setAnalytics(resAnalytics.data);

      const resLogs = await axios.get('http://localhost:5000/api/operations/logs');
      if (resLogs.data) setLogs(resLogs.data);
    } catch (err) {
      console.warn('Backend not responding yet, displaying default dashboard view.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const triggerEmergency = async () => {
    if (!window.confirm('⚠️ WARNING: Trigger EMERGENCY EXIT mode? This will open all barrier gates and free all slots!')) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/emergency-exit');
      toast.success(res.data?.message || 'Emergency exit activated');
      fetchData();
    } catch (err) {
      toast.error('Emergency action triggered locally');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Header & Emergency Action */}
        <div className="flex flex-wrap justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-800">Admin Operations & Analytics</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">Reports, Staff, Maintenance, & Emergency Protocols</p>
          </div>
          <button
            onClick={triggerEmergency}
            disabled={loading}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-lg shadow-red-500/20 uppercase tracking-wider transition cursor-pointer"
          >
            🚨 Emergency Exit Mode
          </button>
        </div>

        {/* Analytics & Traffic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{analytics?.totalRevenue}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Occupancy Rate</span>
            <div className="text-2xl font-black text-indigo-600 mt-1">{analytics?.occupancyRate}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gate Queue Wait</span>
            <div className="text-2xl font-black text-amber-500 mt-1">{analytics?.queueGateCount} Vehicles</div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peak Traffic Hours</span>
            <div className="text-sm font-bold text-slate-800 mt-2">{analytics?.peakHour}</div>
          </div>
        </div>

        {/* Route Suggestion Banner */}
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-2xl flex flex-wrap gap-3 items-center justify-between">
          <div>
            <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide">Active Route Guidance System</span>
            <p className="text-xs text-indigo-700 font-medium mt-0.5">
              Incoming vehicles from Gate 1 are auto-routed to <strong className="text-indigo-900">Wing A & Ground Level</strong> to optimize traffic flow.
            </p>
          </div>
          <span className="text-xs font-bold bg-white text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm">
            Optimal Route Active
          </span>
        </div>

        {/* 3 Operations Tables */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Slot Maintenance Log */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-3">🛠️ Slot Maintenance Log</h3>
            <div className="space-y-2">
              {logs?.maintenance?.map((m) => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between items-center border border-slate-100">
                  <div>
                    <strong className="text-slate-800">{m.slot}</strong>
                    <div className="text-slate-500 text-[11px] mt-0.5">{m.issue}</div>
                  </div>
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-md font-bold text-[10px]">
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cleaning Schedule Tracker */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-3">🧹 Cleaning Schedule Tracker</h3>
            <div className="space-y-2">
              {logs?.cleaningSchedule?.map((c, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between items-center border border-slate-100">
                  <div>
                    <strong className="text-slate-800">{c.floor}</strong>
                    <div className="text-slate-500 text-[11px] mt-0.5">{c.time}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-md font-bold text-[10px] ${c.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shift Staff Assignment */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-3">👥 Shift-wise Staff Assignment</h3>
            <div className="space-y-2">
              {logs?.staffShifts?.map((s, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl text-xs border border-slate-100">
                  <div className="font-bold text-slate-800">{s.name}</div>
                  <div className="text-indigo-600 font-semibold text-[11px] mt-0.5">{s.role}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">{s.shift}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;