import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Today's total sales & orders
    const todayOrders = await Order.find({
      createdAt: { $gte: todayStart, $lte: todayEnd },
      paymentStatus: 'paid',
    });

    const todayRevenue = todayOrders.reduce((acc, order) => acc + order.grandTotal, 0);
    const todayOrdersCount = todayOrders.length;

    // Total Lifetime Revenue & Orders
    const allPaidOrders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = allPaidOrders.reduce((acc, order) => acc + order.grandTotal, 0);
    const totalOrdersCount = allPaidOrders.length;

    // Low stock products count
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$stock', '$lowStockThreshold'] },
      isActive: true,
    });

    // Calculate Top Selling Product
    const itemSalesMap = {};
    allPaidOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemSalesMap[item.name]) {
          itemSalesMap[item.name] = { name: item.name, quantity: 0, revenue: 0 };
        }
        itemSalesMap[item.name].quantity += item.quantity;
        itemSalesMap[item.name].revenue += item.subtotal;
      });
    });

    const sortedProducts = Object.values(itemSalesMap).sort((a, b) => b.quantity - a.quantity);
    const topSellingProduct = sortedProducts.length > 0 ? sortedProducts[0] : { name: 'N/A', quantity: 0, revenue: 0 };

    res.json({
      success: true,
      stats: {
        todayRevenue: Number(todayRevenue.toFixed(2)),
        todayOrdersCount,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        totalOrdersCount,
        lowStockCount: lowStockProducts.length,
        topSellingProduct,
        topProductsList: sortedProducts.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getSalesChartData = async (req, res, next) => {
  try {
    // Generate last 7 days sales trend
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      
      const start = new Date(d.setHours(0, 0, 0, 0));
      const end = new Date(d.setHours(23, 59, 59, 999));

      const orders = await Order.find({
        createdAt: { $gte: start, $lte: end },
        paymentStatus: 'paid',
      });

      const dayRevenue = orders.reduce((sum, o) => sum + o.grandTotal, 0);

      last7Days.push({
        date: dateStr,
        day: start.toLocaleDateString('en-US', { weekday: 'short' }),
        sales: Number(dayRevenue.toFixed(2)),
        orders: orders.length,
      });
    }

    // Sales by Category
    const products = await Product.find();
    const productCategoryMap = {};
    products.forEach((p) => {
      productCategoryMap[p.name] = p.category;
    });

    const categoryRevenueMap = {};
    const allPaidOrders = await Order.find({ paymentStatus: 'paid' });

    allPaidOrders.forEach((order) => {
      order.items.forEach((item) => {
        const cat = productCategoryMap[item.name] || 'General';
        if (!categoryRevenueMap[cat]) {
          categoryRevenueMap[cat] = 0;
        }
        categoryRevenueMap[cat] += item.subtotal;
      });
    });

    const salesByCategory = Object.entries(categoryRevenueMap).map(([category, value]) => ({
      name: category,
      value: Number(value.toFixed(2)),
    }));

    res.json({
      success: true,
      dailyTrend: last7Days,
      salesByCategory,
    });
  } catch (error) {
    next(error);
  }
};
