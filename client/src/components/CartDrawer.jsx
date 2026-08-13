import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Percent,
  PauseCircle,
  CreditCard,
  User,
  ArrowRight,
} from 'lucide-react';
import CheckoutModal from './CheckoutModal';

const CartDrawer = ({ onClose }) => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    discountType,
    setDiscountType,
    discountValue,
    setDiscountValue,
    subtotal,
    discountAmount,
    tax,
    grandTotal,
    holdCurrentOrder,
    customerName,
    setCustomerName,
  } = useCart();

  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [holdNote, setHoldNote] = useState('');
  const [showHoldNoteInput, setShowHoldNoteInput] = useState(false);

  const handleHoldOrder = () => {
    if (cartItems.length === 0) return;
    holdCurrentOrder(holdNote);
    setHoldNote('');
    setShowHoldNoteInput(false);
    if (onClose) onClose();
  };

  return (
    <>
      <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl flex flex-col h-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-700/80 flex items-center justify-between bg-slate-800">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-slate-100 text-base">Current Cart</h2>
            <span className="bg-indigo-600/30 text-indigo-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {cartItems.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors"
                title="Close Cart"
              >
                <span className="sr-only">Close</span>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Customer Input */}
        <div className="px-4 py-2.5 bg-slate-900/50 border-b border-slate-700/60 flex items-center space-x-2">
          <User className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Customer Name (Default: Walk-in)"
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-slate-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-400 text-sm">Cart is empty</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click items from product grid or scan SKU barcode to build customer order.
                </p>
              </div>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product._id}
                className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-3 flex items-center justify-between gap-3 group hover:border-slate-600 transition-colors"
              >
                {/* Thumb */}
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-12 h-12 rounded-lg object-cover bg-slate-950 flex-shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-200 truncate">{item.product.name}</h4>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {formatCurrency(item.product.price)} × {item.quantity}
                  </div>
                  <div className="text-xs font-bold text-emerald-400 mt-0.5">
                    {formatCurrency(item.product.price * item.quantity)}
                  </div>
                </div>

                {/* Qty Controls */}
                <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-xs font-bold text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeFromCart(item.product._id)}
                  className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Discount & Summary Section */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-slate-900/90 border-t border-slate-700/80 space-y-3">
            {/* Discount Row */}
            <div className="flex items-center justify-between gap-2 bg-slate-800/80 p-2 rounded-xl border border-slate-700/60">
              <span className="text-xs font-medium text-slate-300">Discount</span>
              <div className="flex items-center space-x-1.5">
                <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-700">
                  <button
                    onClick={() => setDiscountType('percentage')}
                    className={`px-2 py-0.5 text-xs font-bold rounded ${
                      discountType === 'percentage'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    %
                  </button>
                  <button
                    onClick={() => setDiscountType('fixed')}
                    className={`px-2 py-0.5 text-xs font-bold rounded ${
                      discountType === 'fixed'
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ₹
                  </button>
                </div>
                <input
                  type="number"
                  min="0"
                  value={discountValue || ''}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-right font-bold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Hold Order Note Dropdown */}
            {showHoldNoteInput && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={holdNote}
                  onChange={(e) => setHoldNote(e.target.value)}
                  placeholder="Note for held cart..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                />
                <button
                  onClick={handleHoldOrder}
                  className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs"
                >
                  Save
                </button>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs font-medium text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Tax (GST 8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-700">
                <span>Grand Total</span>
                <span className="text-indigo-400">{formatCurrency(grandTotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setShowHoldNoteInput(!showHoldNoteInput)}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <PauseCircle className="w-4 h-4 text-amber-400" />
                <span>Hold Order</span>
              </button>

              <button
                onClick={() => setShowCheckoutModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <CheckoutModal onClose={() => setShowCheckoutModal(false)} />
      )}
    </>
  );
};

export default CartDrawer;
