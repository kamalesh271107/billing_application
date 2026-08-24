import React, { useState } from 'react';
import { Plus, AlertTriangle, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';

const ProductCard = ({ product }) => {
  const { addToCart, cartItems } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const isLowStock = product.stock <= product.lowStockThreshold && product.stock > 0;
  const isOutOfStock = product.stock <= 0;

  // Check how many of this item are currently in cart
  const itemInCart = cartItems.find((item) => item.product._id === product._id);
  const cartQty = itemInCart ? itemInCart.quantity : 0;

  const handleAdd = (e) => {
    if (e) e.stopPropagation();
    if (isOutOfStock) return;

    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 700);
  };

  return (
    <div
      onClick={handleAdd}
      className={`group relative bg-slate-800/80 border rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-200 cursor-pointer overflow-hidden ${
        isOutOfStock
          ? 'border-slate-800 opacity-60 cursor-not-allowed'
          : isLowStock
          ? 'border-amber-500/40 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 active:scale-[0.99]'
          : 'border-slate-700/70 hover:border-indigo-500/60 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 active:scale-[0.99]'
      }`}
    >
      {/* Top Image Container */}
      <div className="relative w-full h-36 rounded-xl overflow-hidden bg-slate-900 mb-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
          }}
        />

        {/* Category Pill */}
        <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur text-slate-200 text-[11px] font-medium px-2 py-0.5 rounded-full border border-slate-700/60">
          {product.category}
        </span>

        {/* Quantity Badge in Cart */}
        {cartQty > 0 && (
          <span className="absolute top-2 right-2 bg-indigo-600 text-white font-bold text-xs w-6 h-6 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/40 ring-2 ring-indigo-400 animate-in zoom-in duration-150">
            {cartQty}
          </span>
        )}

        {/* Low Stock / Out of Stock Banner */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          </div>
        ) : isLowStock ? (
          <span className="absolute bottom-2 left-2 bg-amber-500/90 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
            <AlertTriangle className="w-3 h-3" />
            Low Stock ({product.stock})
          </span>
        ) : null}
      </div>

      {/* Item Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="text-[11px] font-mono text-slate-400 mb-0.5">SKU: {product.sku}</div>
          <h3 className="font-semibold text-slate-100 text-sm line-clamp-2 group-hover:text-indigo-300 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-700/50">
          <div>
            <span className="text-xs text-slate-400 block -mb-1 font-medium">Price</span>
            <span className="text-lg font-bold text-emerald-400">{formatCurrency(product.price)}</span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAdd}
            className={`px-3 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all duration-200 active:scale-90 ${
              isOutOfStock
                ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed border border-transparent'
                : justAdded
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40 scale-105'
                : 'bg-indigo-600/90 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 hover:shadow-indigo-500/50'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4 animate-in zoom-in" />
                <span className="hidden sm:inline">Added!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
