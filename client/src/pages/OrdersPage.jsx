import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ReceiptModal from '../components/ReceiptModal';
import { formatCurrency } from '../utils/formatters';
import { Clock, Search, Filter, Printer, Banknote, CreditCard, QrCode, Eye } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get('/orders', {
        params: {
          search,
          paymentMethod: paymentMethodFilter,
          startDate,
          endDate,
        },
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, paymentMethodFilter, startDate, endDate]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header */}
      <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Order History & Sales Audit</h1>
            <p className="text-xs text-slate-400">Review past transactions, inspect details, and reprint receipts</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Order #, Cashier, or Customer..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Date Filter & Payment Filter */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Payment Method Selector */}
          <select
            value={paymentMethodFilter}
            onChange={(e) => setPaymentMethodFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">All Payment Methods</option>
            <option value="cash">Cash Only</option>
            <option value="card">Card Only</option>
            <option value="upi">UPI / QR Code</option>
          </select>

          {/* Date Picker */}
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-xs text-slate-500">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-700 text-[11px]">
              <tr>
                <th className="p-4">Order Number</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Cashier</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items Count</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Grand Total</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-500">
                    No transactions match your search filter
                  </td>
                </tr>
              ) : (
                orders.map((ord) => (
                  <tr key={ord._id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-indigo-400 text-xs">{ord.orderNumber}</td>
                    <td className="p-4 text-slate-300">
                      {new Date(ord.createdAt).toLocaleDateString()} • {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 font-semibold text-slate-200">{ord.cashierName}</td>
                    <td className="p-4 text-slate-300">{ord.customerName || 'Walk-in'}</td>
                    <td className="p-4 font-semibold">
                      {ord.items.reduce((s, i) => s + i.quantity, 0)} items
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                          ord.paymentMethod === 'cash'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : ord.paymentMethod === 'card'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}
                      >
                        {ord.paymentMethod === 'cash' && <Banknote className="w-3.5 h-3.5" />}
                        {ord.paymentMethod === 'card' && <CreditCard className="w-3.5 h-3.5" />}
                        {ord.paymentMethod === 'upi' && <QrCode className="w-3.5 h-3.5" />}
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-emerald-400 text-sm">{formatCurrency(ord.grandTotal)}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal for Reprinting */}
      {selectedOrder && (
        <ReceiptModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default OrdersPage;
