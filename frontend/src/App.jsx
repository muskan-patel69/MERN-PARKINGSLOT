import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Components/Navbar';
import Dashboard from './Pages/Dashboard';
import AddVehicle from './Pages/AddVehicle';
import ExitGate from './Pages/ExitGate';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddVehicle />} />
        <Route path="/exit" element={<ExitGate />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;