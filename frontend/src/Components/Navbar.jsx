import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Car } from 'lucide-react';

const Navbar = () => {
const location = useLocation();
const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar bg-white shadow-md px-6 py-4 sticky top-0 z-50 border-b border-base-200">
      {/* Brand / Logo Section */}
      <div className="flex-1">
        <Link to="/" className="flex items-center gap-3 group transition-all">
          <div className="bg-primary p-2 rounded-xl text-white group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
            <Car size={26} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-gray-800 uppercase leading-none">
              Parking <span className="text-primary">Slot</span>
            </span>
            <span className="text-[10px] font-bold opacity-50 uppercase tracking-[0.2em]">Management System</span>
          </div>
        </Link>
      </div>

     {/* Navigation Links */}
      <div className="flex-none gap-2 md:gap-4">
        
        {/* STATUS BUTTON */}
        <Link 
          to="/status" 
          className={`btn btn-ghost gap-2 font-bold normal-case hover:bg-primary/10 hover:text-primary transition-colors ${
            isActive('/status') || isActive('/') ? 'text-primary bg-primary/5' : 'text-gray-500'
          }`}
        >
          <LayoutDashboard size={20} />
          <span className="hidden md:inline">Status</span>
        </Link>
 
        
      </div>
    </nav>
  );
};

export default Navbar;