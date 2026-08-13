import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import CartDrawer from '../components/CartDrawer';
import { Search, Filter, Loader2, Barcode, RefreshCw } from 'lucide-react';

const CATEGORIES = ['All', 'Pipes', 'Pipe Fittings', 'Valves', 'Bathroom fittings', 'Motors and pumps', 'wires', 'Switches', 'Sockets'];

const POSTerminalPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', {
        params: {
          category: selectedCategory,
          search: searchQuery,
        },
      });
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-5rem)]">
      {/* Left Column: Product Catalog Grid & Filters */}
      <div className="lg:col-span-8 flex flex-col h-full space-y-4 overflow-hidden">
        {/* Top Control Bar */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-3 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input / SKU Barcode Scanner */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Item Name or Scan Barcode/SKU..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <Barcode className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={fetchProducts}
              className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors self-end sm:self-auto"
              title="Refresh Catalog"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Catalog Grid Container */}
        <div className="flex-1 overflow-y-auto pr-1">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400 space-x-2">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              <span className="text-sm font-semibold">Loading Catalog...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-slate-800/40 rounded-2xl border border-slate-800">
              <p className="font-semibold text-slate-400 text-sm">No products found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try clearing search filter or select another category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Shopping Cart & Checkout Drawer */}
      <div className="lg:col-span-4 h-full">
        <CartDrawer />
      </div>
    </div>
  );
};

export default POSTerminalPage;
