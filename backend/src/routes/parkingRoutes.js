import express from "express";
import {
    createParking,
    getAllParkings,
    updateParking,
    deleteParking,
    getSlotStatus
} from "../controllers/parkingController.js";

const router = express.Router();

router.get("/status", getSlotStatus);
router.post("/", createParking);
router.get("/", getAllParkings);
router.put("/:id", updateParking);
router.delete("/:id", deleteParking);

export default router;