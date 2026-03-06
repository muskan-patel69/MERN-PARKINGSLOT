import Parking from "../models/Parking.js";

const TOTAL_SLOTS = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"];

export const createParking = async (req, res) => {
    try {
        const { parkingSlot } = req.body;
        const isOccupied = await Parking.findOne({ parkingSlot, status: "Parked" });

        if (isOccupied) {
            return res.status(400).json({
                success: false,
                message: `Slot ${parkingSlot} is already occupied`
            });
        }

        const parking = await Parking.create({ ...req.body, status: "Parked" });
        res.status(201).json({ success: true, data: parking });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllParkings = async (req, res) => {
    try {
        const parking = await Parking.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: parking });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateParking = async (req, res) => {
    try {
        let parking = await Parking.findById(req.params.id);
        if (!parking) return res.status(404).json({ success: false, message: "Not found" });

        const updateData = { ...req.body };

        if (updateData.status === "Exited") {
            const entry = new Date(parking.entryTime);
            const exit = new Date(updateData.exitTime || new Date());
            const hours = Math.ceil((exit - entry) / (1000 * 60 * 60)) || 1;

            let rate = 20;
            if (parking.vehicleType === "Car") rate = 100;
            if (parking.vehicleType === "Bike") rate = 50;
            if (parking.vehicleType === "Truck") rate = 150;

            updateData.parkingFee = updateData.parkingFee || (hours * rate);
            updateData.exitTime = exit;
        }

        const updated = await Parking.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
        res.status(200).json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteParking = async (req, res) => {
    try {
        await Parking.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Deleted" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getSlotStatus = async (req, res) => {
    try {
        const parked = await Parking.find({ status: "Parked" });
        const occupiedSlots = parked.map(p => p.parkingSlot);
        const availableSlots = TOTAL_SLOTS.filter(slot => !occupiedSlots.includes(slot));

        res.status(200).json({ success: true, occupiedSlots, availableSlots });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};