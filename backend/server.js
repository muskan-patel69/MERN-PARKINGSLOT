import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// MongoDB Connection
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:admin@cluster0.mongodb.net/parkingDB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.log('MongoDB Connection Error: ', err));

// Test Route
app.get('/api/slots', async (req, res) => {
  try {
    // Agar aapka alag slots route file hai, toh aap use yahan import kar sakte hain
    res.status(200).json({ success: true, message: "Backend is running fine", data: [] });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});