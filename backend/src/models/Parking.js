import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema({
    parkingSlot: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    vehicleType: {
        type: String,
        required: true,
        enum: ["Car", "Bike", "Truck"]
    },
    entryTime: { type: Date, required: true },
    exitTime: { type: Date },
    parkingFee: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ["Parked", "Exited"],
        default: "Parked"
    },
}, { timestamps: true });

const Parking = mongoose.model("Parking", parkingSchema);
export default Parking;