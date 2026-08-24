import React from 'react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import { X, Play, Trash2, Clock, PauseCircle, User } from 'lucide-react';

const HoldOrdersModal = ({ onClose }) => {
  const { heldOrders, resumeHeldOrder, removeHeldOrder } = useCart();

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <PauseCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-base">Held Carts & Saved Orders</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
          {heldOrders.length === 0 ? (
            <div className="text-center py-8 text-slate-500 space-y-2">
              <PauseCircle className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-400">No held orders currently</p>
              <p className="text-xs text-slate-500">You can hold an active cart in the terminal to process later.</p>
            </div>
          ) : (
            heldOrders.map((held) => {
              const totalItems = held.items.reduce((sum, i) => sum + i.quantity, 0);
              const orderTotal = held.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

              return (
                <div
                  key={held.id}
                  className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:border-slate-600 transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-indigo-400 font-bold">{held.id}</span>
                      <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(held.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-300 font-semibold">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>{held.customerName || 'Walk-in Customer'}</span>
                    </div>

                    {held.note && (
                      <p className="text-xs text-amber-300 italic bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 inline-block">
                        "{held.note}"
                      </p>
                    )}

                    <div className="text-xs text-slate-400">
                      {totalItems} items • Total: <span className="text-emerald-400 font-bold">{formatCurrency(orderTotal)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => removeHeldOrder(held.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 active:scale-90"
                      title="Discard held order"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        resumeHeldOrder(held.id);
                        onClose();
                      }}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Resume</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700/80 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default HoldOrdersModal;
