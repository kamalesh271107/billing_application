import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  Package,
  Clock,
  BarChart3,
  Users,
  LogOut,
  PauseCircle,
  Store,
  UserCheck,
} from 'lucide-react';
import HoldOrdersModal from './HoldOrdersModal';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { heldOrders } = useCart();
  const navigate = useNavigate();
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="bg-slate-800/90 backdrop-blur border-b border-slate-700/80 sticky top-0 z-30 text-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                Apex<span className="text-indigo-400">POS</span>
              </span>
              <span className="text-xs text-slate-400 block -mt-1 font-mono">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-700/50">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <ShoppingBag className="w-4 h-4" />
              <span>POS Terminal</span>
            </NavLink>

            <NavLink
              to="/orders"
              className={({ isActive }) =>
                `flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <Clock className="w-4 h-4" />
              <span>Order History</span>
            </NavLink>

            {isAdmin && (
              <>
                <NavLink
                  to="/inventory"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Package className="w-4 h-4" />
                  <span>Inventory</span>
                </NavLink>

                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </NavLink>

                <NavLink
                  to="/staff"
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Users className="w-4 h-4" />
                  <span>Staff</span>
                </NavLink>
              </>
            )}
          </nav>

          {/* Right Action Bar (Held Orders + Cashier Profile) */}
          <div className="flex items-center space-x-3">
            {/* Held Orders Quick Button */}
            <button
              onClick={() => setShowHoldModal(true)}
              className="relative p-2 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-all flex items-center gap-2 px-3"
              title="View Held Orders"
            >
              <PauseCircle className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-semibold hidden sm:inline text-slate-200">Held Carts</span>
              {heldOrders.length > 0 && (
                <span className="ml-1 bg-amber-500 text-slate-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {heldOrders.length}
                </span>
              )}
            </button>

            {/* User Profile Card */}
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-700/80">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold text-white leading-tight flex items-center justify-end gap-1.5">
                  {!(user?.role === 'admin' || user?.role === 'cashier') && <span>{user?.name}</span>}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      user?.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {user?.role}
                  </span>
                </div>
                {!(user?.role === 'admin' || user?.role === 'cashier') && (
                  <div className="text-xs text-slate-400 truncate max-w-[140px]">{user?.email}</div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                title="Sign out of POS"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Held Orders Modal */}
      {showHoldModal && <HoldOrdersModal onClose={() => setShowHoldModal(false)} />}
    </>
  );
};

export default Navbar;
