import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ParkingSlot from './models/ParkingSlot.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_parking_db';

const slots = [
  { slotNumber: 'A-101', floorLevel: 1, zone: 'A', slotType: 'Compact', proximityScore: 1, isOccupied: false, hasEVCharging: false },
  { slotNumber: 'A-102', floorLevel: 1, zone: 'A', slotType: 'SUV', proximityScore: 2, isOccupied: false, hasEVCharging: false },
  { slotNumber: 'B-101', floorLevel: 1, zone: 'B', slotType: 'EV', proximityScore: 3, isOccupied: false, hasEVCharging: true },
  { slotNumber: 'B-102', floorLevel: 1, zone: 'B', slotType: 'Handicapped', proximityScore: 1, isOccupied: false, hasEVCharging: false },
  { slotNumber: 'C-201', floorLevel: 2, zone: 'C', slotType: 'Compact', proximityScore: 4, isOccupied: false, hasEVCharging: false },
  { slotNumber: 'C-202', floorLevel: 2, zone: 'C', slotType: 'SUV', proximityScore: 5, isOccupied: false, hasEVCharging: false }
];

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // 5 second mein fail hone par bata dega
    });
    console.log('Connected! Clearing old slots...');
    await ParkingSlot.deleteMany();
    await ParkingSlot.insertMany(slots);
    console.log('Sample Parking Slots Successfully Added!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err.message);
    process.exit(1);
  }
};

seedData();