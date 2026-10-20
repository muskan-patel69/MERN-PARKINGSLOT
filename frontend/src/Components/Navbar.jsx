import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const btnStyle = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-xs font-bold transition ${
      isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap justify-between items-center shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-lg">🚗</span>
        <span className="text-base font-black text-white tracking-wide">ParkSmart System</span>
      </div>

      <div className="flex gap-2 mt-2 sm:mt-0">
        <NavLink to="/" className={btnStyle}>
          Live Grid
        </NavLink>
        <NavLink to="/add" className={btnStyle}>
          Vehicle Check-In
        </NavLink>
        <NavLink to="/exit" className={btnStyle}>
          Exit & Finder Gate
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;