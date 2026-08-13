import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductModal from '../components/ProductModal';
import { formatCurrency } from '../utils/formatters';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', {
        params: {
          category: categoryFilter,
          search,
          lowStock: lowStockOnly ? 'true' : 'false',
        },
      });
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Failed to fetch inventory', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter, search, lowStockOnly]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete product "${name}"?`)) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100">Inventory & Stock Management</h1>
            <p className="text-xs text-slate-400">View, add, update, and manage low stock thresholds</p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedProduct(null);
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Product Name or SKU..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto">
          {/* Low Stock Toggle */}
          <label className="flex items-center space-x-2 text-xs font-semibold text-amber-300 cursor-pointer bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
            />
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Low Stock Alerts Only</span>
          </label>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-700 text-[11px]">
              <tr>
                <th className="p-4">Product Details</th>
                <th className="p-4">SKU / Barcode</th>
                <th className="p-4">Category</th>
                <th className="p-4">Selling Price</th>
                <th className="p-4">Cost Price</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-500">
                    No products found in inventory
                  </td>
                </tr>
              ) : (
                products.map((item) => {
                  const isLow = item.stock <= item.lowStockThreshold && item.stock > 0;
                  const isOut = item.stock <= 0;

                  return (
                    <tr key={item._id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 flex items-center space-x-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-700"
                        />
                        <div>
                          <div className="font-bold text-slate-100 text-sm">{item.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {item.isActive ? (
                              <span className="text-emerald-400">Active</span>
                            ) : (
                              <span className="text-red-400">Disabled</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-200">{item.sku}</td>
                      <td className="p-4">
                        <span className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">{formatCurrency(item.price)}</td>
                      <td className="p-4 text-slate-400">{formatCurrency(item.costPrice)}</td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`font-bold text-sm ${
                              isOut ? 'text-red-400' : isLow ? 'text-amber-400' : 'text-slate-200'
                            }`}
                          >
                            {item.stock} units
                          </span>

                          {isOut ? (
                            <span className="bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                              Out of Stock
                            </span>
                          ) : isLow ? (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Low Stock (&le;{item.lowStockThreshold})
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setShowModal(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id, item.name)}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setShowModal(false)}
          onSave={() => {
            setShowModal(false);
            fetchProducts();
          }}
        />
      )}
    </div>
  );
};

export default InventoryPage;
