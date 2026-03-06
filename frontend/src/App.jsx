import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Components/Navbar';
import Dashboard from './Pages/Dashboard';
import ParkingList from './Pages/ParkingList';

function App() {
  return (
    <BrowserRouter>
      {/* Global notification setup */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            zIndex: 99999,
          },
        }}
      />

      <div className="min-h-screen bg-base-200">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/status" element={<ParkingList />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;