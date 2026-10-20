import express from 'express';
import ParkingSlot from '../models/ParkingSlot.js';
import Vehicle from '../models/Vehicle.js';

const router = express.Router();

const VEHICLE_RATES = {
  'Car': 20,
  'Bike': 10,
  'Scooty': 10,
  'SUV': 30,
  'EV': 25,
  'Truck': 50
};

// 1. Vehicle Check-in Route
router.post('/vehicles/checkin', async (req, res) => {
  try {
    const { licensePlate, vehicleType, requiresEV, isVIP, manualSlot, durationHours } = req.body;

    if (!licensePlate) {
      return res.status(400).json({ message: 'License plate number is required' });
    }

    const cleanPlate = licensePlate.trim().toUpperCase();

    const existingVehicle = await Vehicle.findOne({ licensePlate: cleanPlate, status: 'Parked' });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle already parked inside!' });
    }

    let slot = null;

    if (manualSlot) {
      slot = await ParkingSlot.findOne({ slotNumber: manualSlot.trim().toUpperCase(), isOccupied: false });
      if (!slot) {
        return res.status(400).json({ message: `Slot ${manualSlot} is either occupied or invalid` });
      }
    } else {
      const query = { isOccupied: false, isUnderMaintenance: false };
      if (requiresEV) query.hasEVCharging = true;
      if (isVIP) query.isReserved = true;

      slot = await ParkingSlot.findOne(query).sort({ floorLevel: 1, proximityScore: 1 });
    }

    if (!slot) {
      return res.status(404).json({ message: 'No available parking slots matching criteria' });
    }

    const hours = Math.max(1, Number(durationHours) || 1);
    const hourlyRate = VEHICLE_RATES[vehicleType] || 20;

    const vehicle = new Vehicle({
      licensePlate: cleanPlate,
      vehicleType: vehicleType || 'Car',
      assignedSlot: slot._id,
      checkInTime: new Date(),
      feeCharged: hours * hourlyRate
    });
    await vehicle.save();

    slot.isOccupied = true;
    slot.currentVehicle = vehicle._id;
    await slot.save();

    return res.status(200).json({
      success: true,
      message: 'Vehicle checked in successfully',
      slotNumber: slot.slotNumber,
      floorLevel: slot.floorLevel,
      zone: slot.zone,
      estimatedFee: hours * hourlyRate
    });
  } catch (error) {
    console.error('Checkin Error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// 2. Live Slot Map Data
router.get('/slots', async (req, res) => {
  try {
    const slots = await ParkingSlot.find().populate('currentVehicle', 'licensePlate checkInTime');
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. Vehicle Location Finder
router.get('/vehicles/find/:plate', async (req, res) => {
  try {
    const cleanPlate = req.params.plate.trim().toUpperCase();
    const vehicle = await Vehicle.findOne({
      licensePlate: cleanPlate,
      status: 'Parked'
    }).populate('assignedSlot');

    if (!vehicle) {
      return res.status(404).json({ message: 'No actively parked vehicle found with this plate' });
    }

    res.json({
      licensePlate: vehicle.licensePlate,
      slotNumber: vehicle.assignedSlot.slotNumber,
      floorLevel: vehicle.assignedSlot.floorLevel,
      zone: vehicle.assignedSlot.zone,
      checkInTime: vehicle.checkInTime,
      vehicleType: vehicle.vehicleType
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Vehicle Exit / Checkout & Fee Calculation
router.post('/vehicles/checkout', async (req, res) => {
  try {
    const { licensePlate } = req.body;
    const cleanPlate = licensePlate.trim().toUpperCase();

    const vehicle = await Vehicle.findOne({
      licensePlate: cleanPlate,
      status: 'Parked'
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Active vehicle record not found' });
    }

    const checkOutTime = new Date();
    const durationHours = Math.max(1, Math.ceil((checkOutTime - new Date(vehicle.checkInTime)) / (1000 * 60 * 60)));
    const rate = VEHICLE_RATES[vehicle.vehicleType] || 20;
    const feeCharged = durationHours * rate;

    vehicle.checkOutTime = checkOutTime;
    vehicle.feeCharged = feeCharged;
    vehicle.status = 'Departed';
    await vehicle.save();

    await ParkingSlot.findByIdAndUpdate(vehicle.assignedSlot, {
      isOccupied: false,
      currentVehicle: null
    });

    res.json({
      message: 'Vehicle checked out successfully',
      licensePlate: vehicle.licensePlate,
      durationHours,
      feeCharged
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. Emergency Exit Mode
router.post('/emergency-exit', async (req, res) => {
  try {
    await ParkingSlot.updateMany({}, { isOccupied: false, currentVehicle: null });
    await Vehicle.updateMany({ status: 'Parked' }, { status: 'Departed', checkOutTime: new Date() });
    res.json({ success: true, message: 'EMERGENCY TRIGGERED: All gates opened and slots evacuated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 6. Analytics Overview & Reports
router.get('/analytics/overview', async (req, res) => {
  try {
    const totalSlots = await ParkingSlot.countDocuments();
    const occupiedSlots = await ParkingSlot.countDocuments({ isOccupied: true });
    const departedVehicles = await Vehicle.find({ status: 'Departed' }).sort({ checkOutTime: -1 }).limit(10);

    const totalRevenue = departedVehicles.reduce((acc, curr) => acc + (curr.feeCharged || 0), 0);
    const occupancyRate = totalSlots > 0 ? Math.round((occupiedSlots / totalSlots) * 100) : 0;

    res.json({
      totalSlots,
      occupiedSlots,
      availableSlots: totalSlots - occupiedSlots,
      occupancyRate: `${occupancyRate}%`,
      totalRevenue: `₹${totalRevenue}`,
      queueGateCount: 3,
      peakHour: '5:00 PM - 7:00 PM',
      departedVehicles
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 7. Operations Logs
router.get('/operations/logs', async (req, res) => {
  res.json({
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
});

export default router;