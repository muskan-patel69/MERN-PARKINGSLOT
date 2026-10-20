import mongoose from 'mongoose';

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  floorLevel: {
    type: Number,
    required: true
  },
  zone: {
    type: String,
    required: true
  },
  slotType: {
    type: String,
    enum: ['Compact', 'SUV', 'EV', 'Handicapped'],
    default: 'Compact'
  },
  proximityScore: {
    type: Number,
    default: 1
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  hasEVCharging: {
    type: Boolean,
    default: false
  },
  isReserved: {
    type: Boolean,
    default: false
  },
  isUnderMaintenance: {
    type: Boolean,
    default: false
  },
  currentVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null
  }
}, { timestamps: true });

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);
export default ParkingSlot;