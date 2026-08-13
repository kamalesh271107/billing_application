import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';
import {
  X,
  Banknote,
  CreditCard,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Printer,
  User,
} from 'lucide-react';
import ReceiptModal from './ReceiptModal';

const CheckoutModal = ({ onClose }) => {
  const {
    cartItems,
    subtotal,
    discountAmount,
    tax,
    grandTotal,
    clearCart,
    customerName,
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' | 'card' | 'upi'
  const [tenderedAmount, setTenderedAmount] = useState(grandTotal);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState(null);

  const changeAmount = Math.max(0, (tenderedAmount || 0) - grandTotal);
  const isCashInsufficient = paymentMethod === 'cash' && (tenderedAmount || 0) < grandTotal;

  const handleQuickCash = (amount) => {
    setTenderedAmount(amount);
  };

  const handleCompleteSale = async () => {
    if (isCashInsufficient) {
      setErrorMessage('Tendered cash is less than Grand Total!');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        subtotal,
        tax,
        discount: discountAmount,
        grandTotal,
        paymentMethod,
        tenderedAmount: paymentMethod === 'cash' ? tenderedAmount : grandTotal,
        changeAmount: paymentMethod === 'cash' ? changeAmount : 0,
        customerName: customerName || 'Walk-in Customer',
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        setCompletedOrder(res.data.order);
        clearCart();
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to process checkout transaction');
    } finally {
      setLoading(false);
    }
  };

  if (completedOrder) {
    return (
      <ReceiptModal
        order={completedOrder}
        onClose={() => {
          setCompletedOrder(null);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Complete Payment</h3>
              <p className="text-xs text-slate-400">Total Due: <span className="text-indigo-400 font-bold">{formatCurrency(grandTotal)}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                paymentMethod === 'cash'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Banknote className="w-4 h-4" />
              <span>Cash</span>
            </button>

            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                paymentMethod === 'card'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Card</span>
            </button>

            <button
              onClick={() => setPaymentMethod('upi')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                paymentMethod === 'upi'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>UPI / QR</span>
            </button>
          </div>

          {/* Dynamic Content per Payment Method */}
          {paymentMethod === 'cash' && (
            <div className="space-y-4 bg-slate-800/60 p-4 rounded-xl border border-slate-700/60">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Tendered Cash Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={tenderedAmount || ''}
                    onChange={(e) => setTenderedAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-lg font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Quick Cash Buttons */}
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1.5">Quick Cash Presets</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleQuickCash(grandTotal)}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-emerald-500 rounded-lg text-xs font-bold text-emerald-400 transition-colors"
                  >
                    Exact ({formatCurrency(grandTotal)})
                  </button>
                  {[100, 200, 500, 2000].map((val) => (
                    <button
                      key={val}
                      onClick={() => handleQuickCash(val)}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-indigo-500 rounded-lg text-xs font-bold text-slate-200 transition-colors"
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Change Return Calculation */}
              <div className="flex justify-between items-center bg-slate-900 p-3 rounded-xl border border-slate-700">
                <span className="text-xs font-medium text-slate-400">Change to Return</span>
                <span className={`text-xl font-bold ${isCashInsufficient ? 'text-red-400' : 'text-emerald-400'}`}>
                  {formatCurrency(changeAmount)}
                </span>
              </div>
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="bg-slate-800/60 p-6 rounded-xl border border-slate-700/60 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto animate-pulse">
                <CreditCard className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm">Tap, Insert, or Swipe Card</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Card terminal connected. Ready for contactless NFC or Chip reader authorization.
                </p>
              </div>
              <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-bold">
                Terminal Ready • {formatCurrency(grandTotal)}
              </span>
            </div>
          )}

          {paymentMethod === 'upi' && (
            <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700/60 text-center space-y-3">
              {/* Mock Dynamic QR Code SVG */}
              <div className="w-40 h-40 bg-white p-3 rounded-xl mx-auto flex items-center justify-center shadow-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=store@pos%26pn=ApexPOS%26am=${grandTotal}%26cu=INR`}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm">Scan QR Code to Pay</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Scan via GPay, PhonePe, Razorpay, or Paytm app.
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Customer: <span className="text-slate-200 font-semibold">{customerName || 'Walk-in'}</span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              disabled={loading || isCashInsufficient}
              onClick={handleCompleteSale}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 transition-all ${
                isCashInsufficient || loading
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 active:scale-95'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>{loading ? 'Processing...' : 'Complete Sale & Print'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
