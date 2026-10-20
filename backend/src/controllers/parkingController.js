import ParkingSlot from '../models/ParkingSlot.js';
import Vehicle from '../models/Vehicle.js';
import MaintenanceLog from '../models/MaintenanceLog.js';

// 1. Get Live Status of All Slots
export const getAllSlots = async (req, res) => {
  try {
    const slots = await ParkingSlot.find().populate('currentVehicle');
    res.status(200).json({ success: true, data: slots });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Allocate Slot & Vehicle Check-In
export const allocateSmartSlot = async (req, res) => {
  try {
    const { licensePlate, vehicleType, needsEV } = req.body;

    const existingVehicle = await Vehicle.findOne({ licensePlate, status: 'Parked' });
    if (existingVehicle) {
      return res.status(400).json({ success: false, message: 'Vehicle is already registered inside.' });
    }

    let query = {
      isOccupied: false,
      isUnderMaintenance: false,
      isReserved: false
    };

    if (needsEV || vehicleType === 'EV') {
      query.hasEVCharging = true;
    } else {
      query.slotType = vehicleType;
    }

    let candidateSlot = await ParkingSlot.findOne(query).sort({ floorLevel: 1, proximityScore: 1 });

    if (!candidateSlot && vehicleType === 'Compact' && !needsEV) {
      candidateSlot = await ParkingSlot.findOne({
        slotType: 'SUV',
        isOccupied: false,
        isUnderMaintenance: false,
        isReserved: false
      }).sort({ floorLevel: 1, proximityScore: 1 });
    }

    if (!candidateSlot) {
      return res.status(404).json({ success: false, message: 'No suitable parking slots available.' });
    }

    const newVehicle = new Vehicle({
      licensePlate,
      vehicleType,
      assignedSlot: candidateSlot._id,
      checkInTime: new Date(),
      status: 'Parked'
    });
    await newVehicle.save();

    candidateSlot.isOccupied = true;
    candidateSlot.currentVehicle = newVehicle._id;
    await candidateSlot.save();

    res.status(200).json({
      success: true,
      message: 'Slot allocated successfully.',
      slotNumber: candidateSlot.slotNumber,
      zone: candidateSlot.zone,
      floorLevel: candidateSlot.floorLevel,
      vehicle: newVehicle
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Find Vehicle Location
export const findVehicleLocation = async (req, res) => {
  try {
    const { plate } = req.params;
    const vehicle = await Vehicle.findOne({ licensePlate: plate.toUpperCase(), status: 'Parked' })
      .populate('assignedSlot');

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    res.status(200).json({
      success: true,
      licensePlate: vehicle.licensePlate,
      slotNumber: vehicle.assignedSlot.slotNumber,
      zone: vehicle.assignedSlot.zone,
      floorLevel: vehicle.assignedSlot.floorLevel,
      checkInTime: vehicle.checkInTime
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 4. Vehicle Check-Out
export const processCheckOut = async (req, res) => {
  try {
    const { licensePlate } = req.body;
    const vehicle = await Vehicle.findOne({ licensePlate: licensePlate.toUpperCase(), status: 'Parked' });

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Active vehicle session not found.' });
    }

    const checkOutTime = new Date();
    const durationHours = Math.max(1, Math.ceil((checkOutTime - new Date(vehicle.checkInTime)) / (1000 * 60 * 60)));
    const totalAmount = durationHours * 20.0;

    vehicle.checkOutTime = checkOutTime;
    vehicle.feeCharged = totalAmount;
    vehicle.status = 'Departed';
    await vehicle.save();

    await ParkingSlot.findByIdAndUpdate(vehicle.assignedSlot, {
      isOccupied: false,
      currentVehicle: null
    });

    res.status(200).json({
      success: true,
      message: 'Check-out completed.',
      durationHours,
      totalAmount
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 5. Toggle Maintenance
export const toggleMaintenance = async (req, res) => {
  try {
    const { slotId } = req.params;
    const { isUnderMaintenance, issueDescription } = req.body;

    const slot = await ParkingSlot.findById(slotId);
    if (!slot) return res.status(404).json({ success: false, message: 'Slot not found.' });

    slot.isUnderMaintenance = isUnderMaintenance;
    if (isUnderMaintenance) {
      slot.isOccupied = false;
      slot.currentVehicle = null;
      if (issueDescription) {
        await MaintenanceLog.create({ slot: slot._id, issueDescription });
      }
    }
    await slot.save();

    res.status(200).json({ success: true, message: 'Maintenance updated.', data: slot });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};