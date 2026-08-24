import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
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
  Menu,
  X,
} from 'lucide-react';
import HoldOrdersModal from './HoldOrdersModal';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { heldOrders } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [showHoldModal, setShowHoldModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
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

          {/* Desktop Navigation Links */}
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

          {/* Right Action Bar (Held Orders + Cashier Profile + Mobile Toggle) */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Held Orders Quick Button */}
            <button
              type="button"
              onClick={() => setShowHoldModal(true)}
              className="relative p-2 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 hover:border-amber-500/50 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3"
              title="View Held Orders"
            >
              <PauseCircle className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-semibold hidden sm:inline text-slate-200">Held Carts</span>
              {heldOrders.length > 0 && (
                <span className="ml-0.5 bg-amber-500 text-slate-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-md shadow-amber-500/40">
                  {heldOrders.length}
                </span>
              )}
            </button>

            {/* User Profile Card (Desktop) */}
            <div className="hidden sm:flex items-center space-x-3 pl-2 border-l border-slate-700/80">
              <div className="text-right">
                <div className="text-sm font-semibold text-white leading-tight flex items-center justify-end gap-1.5">
                  {user?.name && <span>{user?.name}</span>}
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
                {user?.email && (
                  <div className="text-xs text-slate-400 truncate max-w-[140px]">{user?.email}</div>
                )}
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 active:scale-90"
                title="Sign out of POS"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 rounded-xl transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-indigo-400" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-700/80 px-4 py-4 space-y-3 animate-in slide-in-from-top duration-200">
            {/* User info header for mobile */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{user?.name || 'User'}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      user?.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {user?.role}
                  </span>
                </div>
                {user?.email && <div className="text-xs text-slate-400">{user?.email}</div>}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-semibold transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-1.5">
              <NavLink
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white bg-slate-800/60'
                  }`
                }
              >
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <span>POS Terminal</span>
              </NavLink>

              <NavLink
                to="/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-300 hover:text-white bg-slate-800/60'
                  }`
                }
              >
                <Clock className="w-5 h-5 text-indigo-400" />
                <span>Order History</span>
              </NavLink>

              {isAdmin && (
                <>
                  <NavLink
                    to="/inventory"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-slate-300 hover:text-white bg-slate-800/60'
                      }`
                    }
                  >
                    <Package className="w-5 h-5 text-indigo-400" />
                    <span>Inventory Management</span>
                  </NavLink>

                  <NavLink
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-slate-300 hover:text-white bg-slate-800/60'
                      }`
                    }
                  >
                    <BarChart3 className="w-5 h-5 text-indigo-400" />
                    <span>Sales Analytics</span>
                  </NavLink>

                  <NavLink
                    to="/staff"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-slate-300 hover:text-white bg-slate-800/60'
                      }`
                    }
                  >
                    <Users className="w-5 h-5 text-indigo-400" />
                    <span>Staff Management</span>
                  </NavLink>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Held Orders Modal */}
      {showHoldModal && <HoldOrdersModal onClose={() => setShowHoldModal(false)} />}
    </>
  );
};

export default Navbar;
