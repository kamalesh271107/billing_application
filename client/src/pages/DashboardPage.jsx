import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';
import {
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({ dailyTrend: [], salesByCategory: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, chartRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/analytics/sales-chart'),
        ]);

        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
        if (chartRes.data.success) {
          setChartData({
            dailyTrend: chartRes.data.dailyTrend,
            salesByCategory: chartRes.data.salesByCategory,
          });
        }
      } catch (err) {
        console.error('Failed to fetch analytics data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading || !stats) {
    return (
      <div className="max-w-7xl mx-auto p-8 text-center text-slate-400">
        <BarChart3 className="w-8 h-8 animate-bounce text-indigo-500 mx-auto mb-2" />
        <p className="font-semibold text-sm">Loading Sales Analytics Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div className="bg-slate-800/80 p-4 sm:p-6 rounded-2xl border border-slate-700/80 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-100">Sales & Business Analytics</h1>
            <p className="text-xs text-slate-400">Real-time performance KPIs, revenue trends, and inventory health</p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales Revenue</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">{formatCurrency(stats.totalRevenue)}</h3>
              <p className="text-xs text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{stats.totalOrdersCount} Total Paid Orders</span>
              </p>
            </div>
            <div className="p-2.5 sm:p-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
              <span className="text-xl sm:text-2xl font-extrabold">₹</span>
            </div>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Revenue</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-indigo-400 mt-1">{formatCurrency(stats.todayRevenue)}</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                {stats.todayOrdersCount} orders placed today
              </p>
            </div>
            <div className="p-2.5 sm:p-3 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20 flex-shrink-0">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Top Product */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Selling Product</p>
              <h3 className="text-sm sm:text-base font-bold text-white mt-1 truncate">{stats.topSellingProduct.name}</h3>
              <p className="text-xs text-amber-400 font-semibold mt-1">
                {stats.topSellingProduct.quantity} units sold ({formatCurrency(stats.topSellingProduct.revenue)})
              </p>
            </div>
            <div className="p-2.5 sm:p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20 flex-shrink-0">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        {/* Low Stock Alert Count */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Low Stock Alerts</p>
              <h3 className="text-xl sm:text-2xl font-extrabold text-amber-400 mt-1">{stats.lowStockCount}</h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Items requiring reorder</p>
            </div>
            <div className="p-2.5 sm:p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Sales Trend Chart (7 Days) */}
        <div className="lg:col-span-8 bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-bold text-slate-100 text-sm">7-Day Sales Trend (₹)</h3>
            </div>
          </div>
          <div className="h-64 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.dailyTrend}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="sales" fill="#6366f1" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Category Pie Chart */}
        <div className="lg:col-span-4 bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-xl space-y-4">
          <div className="flex items-center space-x-2">
            <PieChartIcon className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-slate-100 text-sm">Sales by Category</h3>
          </div>
          <div className="h-64 sm:h-72 w-full flex items-center justify-center">
            {chartData.salesByCategory.length === 0 ? (
              <p className="text-xs text-slate-500">No category sales recorded yet</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData.salesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {chartData.salesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Top 5 Best Selling Items Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 p-4 sm:p-5 rounded-2xl shadow-xl space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <span>Top Best Selling Products Ranking</span>
        </h3>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs text-slate-300 min-w-[500px]">
            <thead className="bg-slate-900/90 text-slate-400 uppercase font-semibold border-b border-slate-700">
              <tr>
                <th className="p-3 whitespace-nowrap">Rank</th>
                <th className="p-3 whitespace-nowrap">Product Name</th>
                <th className="p-3 whitespace-nowrap">Units Sold</th>
                <th className="p-3 whitespace-nowrap">Total Generated Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {stats.topProductsList.map((item, index) => (
                <tr key={index} className="hover:bg-slate-700/30">
                  <td className="p-3 font-bold text-indigo-400 whitespace-nowrap">#{index + 1}</td>
                  <td className="p-3 font-semibold text-slate-100 whitespace-nowrap">{item.name}</td>
                  <td className="p-3 font-bold text-slate-200 whitespace-nowrap">{item.quantity} units</td>
                  <td className="p-3 font-bold text-emerald-400 whitespace-nowrap">{formatCurrency(item.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
