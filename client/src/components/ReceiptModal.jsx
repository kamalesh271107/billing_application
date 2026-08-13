import React from 'react';
import { X, Printer, CheckCircle2, Store } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

const ReceiptModal = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="font-bold text-slate-100 text-sm">Payment Successful</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Thermal Receipt Card */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div
            id="printable-receipt"
            className="bg-white text-slate-900 p-5 rounded-xl font-mono text-xs shadow-inner space-y-4 border border-slate-200"
          >
            {/* Store Banner */}
            <div className="text-center border-b border-dashed border-slate-300 pb-3 space-y-1">
              <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-slate-950 uppercase tracking-wider">
                <Store className="w-4 h-4 text-indigo-600" />
                Apex Retail POS Store
              </div>
              <p className="text-[10px] text-slate-600">100 Tech Park, MG Road, Bengaluru, KA - 560001</p>
              <p className="text-[10px] text-slate-600">Phone: +91 98765 43210</p>
            </div>

            {/* Order Info Header */}
            <div className="text-[11px] space-y-1 text-slate-700 border-b border-dashed border-slate-300 pb-3">
              <div className="flex justify-between">
                <span className="font-bold">Order #:</span>
                <span className="font-bold text-slate-950">{order.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date/Time:</span>
                <span>{new Date(order.createdAt).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Cashier:</span>
                <span>{order.cashierName}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{order.customerName || 'Walk-in'}</span>
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-2 border-b border-dashed border-slate-300 pb-3">
              <div className="flex justify-between font-bold text-[10px] text-slate-500 uppercase border-b border-slate-200 pb-1">
                <span>Item</span>
                <span>Qty x Price</span>
                <span>Total</span>
              </div>

              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-start text-[11px]">
                  <div className="flex-1 pr-2">
                    <div className="font-semibold text-slate-950 line-clamp-1">{item.name}</div>
                    <div className="text-[10px] text-slate-500">{item.sku}</div>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <div>{item.quantity} × {formatCurrency(item.price)}</div>
                    <div className="font-bold text-slate-950">{formatCurrency(item.subtotal)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 text-xs text-slate-700 border-b border-dashed border-slate-300 pb-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span>-{formatCurrency(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax (GST 8%):</span>
                <span>{formatCurrency(order.tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-950 pt-1 border-t border-slate-300">
                <span>Grand Total:</span>
                <span>{formatCurrency(order.grandTotal)}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className="text-[11px] space-y-1 text-slate-700">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold uppercase text-slate-950">{order.paymentMethod}</span>
              </div>
              {order.paymentMethod === 'cash' && (
                <>
                  <div className="flex justify-between">
                    <span>Tendered Amount:</span>
                    <span>{formatCurrency(order.tenderedAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-950">
                    <span>Change Returned:</span>
                    <span>{formatCurrency(order.changeAmount || 0)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Footer barcode/greeting */}
            <div className="text-center pt-2 space-y-1 text-[10px] text-slate-500 border-t border-slate-200">
              <p className="font-semibold text-slate-800">Thank you for your business!</p>
              <p>Please retain receipt for returns & support.</p>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            Done & Close
          </button>

          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
