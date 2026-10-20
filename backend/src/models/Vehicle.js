import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  vehicleType: {
    type: String,
    enum: ['Compact', 'SUV', 'EV', 'Handicapped'],
    default: 'Compact'
  },
  assignedSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParkingSlot',
    required: true
  },
  checkInTime: {
    type: Date,
    default: Date.now
  },
  checkOutTime: {
    type: Date,
    default: null
  },
  feeCharged: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Parked', 'Departed'],
    default: 'Parked'
  }
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;