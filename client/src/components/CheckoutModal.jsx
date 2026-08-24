import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Loader2,
  Zap,
} from 'lucide-react';
import ReceiptModal from './ReceiptModal';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

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

  useEffect(() => {
    // Preload Razorpay checkout script
    loadRazorpayScript();
  }, []);

  const handleQuickCash = (amount) => {
    setTenderedAmount(amount);
  };

  const handleCashCheckout = async () => {
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
        paymentMethod: 'cash',
        tenderedAmount,
        changeAmount,
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

  const handleRazorpayCheckout = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const resLoaded = await loadRazorpayScript();
      if (!resLoaded) {
        setErrorMessage('Failed to load Razorpay SDK. Please check your internet connection.');
        setLoading(false);
        return;
      }

      // Step 1: Create Razorpay Order on backend
      const orderRes = await api.post('/payment/create-order', {
        amount: grandTotal,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });

      if (!orderRes.data.success) {
        setErrorMessage('Failed to initialize Razorpay order.');
        setLoading(false);
        return;
      }

      const { order, keyId } = orderRes.data;

      // Step 2: Open Razorpay Modal
      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TTTnaFSHUApEUQ',
        amount: order.amount,
        currency: order.currency,
        name: 'ApexPOS Billing System',
        description: `POS Payment for ${customerName || 'Walk-in Customer'}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            // Step 3: Verify Payment Signature on backend
            const verifyRes = await api.post('/payment/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              // Step 4: Create POS Order in DB
              const orderPayload = {
                items: cartItems.map((item) => ({
                  productId: item.product._id,
                  quantity: item.quantity,
                })),
                subtotal,
                tax,
                discount: discountAmount,
                grandTotal,
                paymentMethod: paymentMethod === 'card' ? 'card' : 'upi',
                tenderedAmount: grandTotal,
                changeAmount: 0,
                customerName: customerName || 'Walk-in Customer',
              };

              const posOrderRes = await api.post('/orders', orderPayload);
              if (posOrderRes.data.success) {
                setCompletedOrder(posOrderRes.data.order);
                clearCart();
              }
            } else {
              setErrorMessage('Razorpay payment signature verification failed!');
            }
          } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Payment verification failed on server');
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
        prefill: {
          name: customerName || 'Walk-in Customer',
          contact: '9999999999',
          email: 'customer@apexpos.com',
        },
        theme: {
          color: '#4F46E5',
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        setErrorMessage(`Payment Failed: ${response.error.description}`);
        setLoading(false);
      });
      razorpayInstance.open();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Razorpay checkout encountered an error');
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
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-inner">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Complete Payment</h3>
              <p className="text-xs text-slate-400">Total Due: <span className="text-indigo-400 font-bold">{formatCurrency(grandTotal)}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-700/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Payment Method Selector Tabs */}
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setPaymentMethod('cash')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 ${
                paymentMethod === 'cash'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Banknote className="w-4 h-4" />
              <span>Cash</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 ${
                paymentMethod === 'card'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Card / Razorpay</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 active:scale-95 ${
                paymentMethod === 'upi'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>UPI / Razorpay</span>
            </button>
          </div>

          {/* Dynamic Content per Payment Method */}
          {paymentMethod === 'cash' && (
            <div className="space-y-4 bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300">Tendered Cash Amount</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-base">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    value={tenderedAmount || ''}
                    onChange={(e) => setTenderedAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-lg font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Quick Cash Presets */}
              <div>
                <label className="text-[11px] font-medium text-slate-400 block mb-1.5">Quick Cash Presets</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickCash(grandTotal)}
                    className={`px-3 py-1.5 bg-slate-900 border rounded-lg text-xs font-bold transition-all active:scale-95 ${
                      tenderedAmount === grandTotal
                        ? 'border-emerald-500 text-emerald-400 bg-emerald-950/40 shadow-sm shadow-emerald-500/20'
                        : 'border-slate-700 hover:border-emerald-500 text-emerald-400'
                    }`}
                  >
                    Exact ({formatCurrency(grandTotal)})
                  </button>
                  {[100, 200, 500, 2000].map((val) => (
                    <button
                      type="button"
                      key={val}
                      onClick={() => handleQuickCash(val)}
                      className={`px-3 py-1.5 bg-slate-900 border rounded-lg text-xs font-bold transition-all active:scale-95 ${
                        tenderedAmount === val
                          ? 'border-indigo-500 text-indigo-400 bg-indigo-950/40 shadow-sm shadow-indigo-500/20'
                          : 'border-slate-700 hover:border-indigo-500 text-slate-200'
                      }`}
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

          {(paymentMethod === 'card' || paymentMethod === 'upi') && (
            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700/60 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto shadow-lg shadow-indigo-500/10">
                {paymentMethod === 'card' ? <CreditCard className="w-8 h-8" /> : <QrCode className="w-8 h-8" />}
              </div>
              
              <div>
                <h4 className="font-bold text-slate-100 text-sm flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Razorpay Secured Gateway Integrated
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Click below to launch Razorpay checkout modal for Cards, UPI, NetBanking, and Wallets.
                </p>
              </div>

              <div className="flex justify-center gap-2 text-[11px] text-slate-400 pt-1">
                <span className="bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-700/80 font-semibold text-slate-300">
                  Key ID: <span className="font-mono text-indigo-400">rzp_test_...ApEUQ</span>
                </span>
                <span className="bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-semibold">
                  Test Mode Active
                </span>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-300 p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
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
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all active:scale-95 border border-slate-700/80"
            >
              Cancel
            </button>

            {paymentMethod === 'cash' ? (
              <button
                type="button"
                disabled={loading || isCashInsufficient}
                onClick={handleCashCheckout}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all duration-200 ${
                  isCashInsufficient || loading
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-70'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 active:scale-95'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Printer className="w-4 h-4" />
                    <span>Complete Sale & Print</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={handleRazorpayCheckout}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all duration-200 ${
                  loading
                    ? 'bg-indigo-800 text-slate-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 active:scale-95'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Opening Gateway...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                    <span>Pay {formatCurrency(grandTotal)} via Razorpay</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
