import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
    })
  ).min(1, 'Cart cannot be empty'),
  subtotal: z.number().min(0),
  tax: z.number().min(0).default(0),
  discount: z.number().min(0).default(0),
  grandTotal: z.number().min(0),
  paymentMethod: z.enum(['cash', 'card', 'upi']),
  tenderedAmount: z.number().optional().default(0),
  changeAmount: z.number().optional().default(0),
  customerName: z.string().optional().default('Walk-in Customer'),
});

export const createOrder = async (req, res, next) => {
  try {
    const { items, subtotal, tax, discount, grandTotal, paymentMethod, tenderedAmount, changeAmount, customerName } = req.body;

    const populatedItems = [];
    
    // Check stock & lock items
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found (ID: ${item.productId})` });
      }

      if (!product.isActive) {
        return res.status(400).json({ success: false, message: `Product "${product.name}" is currently inactive.` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`,
        });
      }

      const itemSubtotal = Number((product.price * item.quantity).toFixed(2));
      populatedItems.push({
        productId: product._id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });
    }

    // Generate Unique Order Number e.g., ORD-20260807-1234
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `ORD-${dateStr}-${randomSuffix}`;

    const newOrder = await Order.create({
      orderNumber,
      cashierId: req.user._id,
      cashierName: req.user.name,
      items: populatedItems,
      subtotal,
      tax,
      discount,
      grandTotal,
      paymentMethod,
      paymentStatus: 'paid',
      tenderedAmount,
      changeAmount,
      customerName,
    });

    // Decrement stock in real-time
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const { startDate, endDate, paymentMethod, cashierId, search } = req.query;
    let query = {};

    if (paymentMethod && paymentMethod !== 'All') {
      query.paymentMethod = paymentMethod;
    }

    if (cashierId) {
      query.cashierId = cashierId;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const eod = new Date(endDate);
        eod.setHours(23, 59, 59, 999);
        query.createdAt.$lte = eod;
      }
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ orderNumber: searchRegex }, { cashierName: searchRegex }, { customerName: searchRegex }];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};
