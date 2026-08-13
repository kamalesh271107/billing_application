import { Product } from '../models/Product.js';
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be positive'),
  costPrice: z.number().min(0).optional().default(0),
  stock: z.number().min(0, 'Stock must be 0 or greater'),
  lowStockThreshold: z.number().min(0).optional().default(5),
  image: z.string().optional(),
  isActive: z.boolean().optional().default(true),
});

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, lowStock } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ name: searchRegex }, { sku: searchRegex }, { category: searchRegex }];
    }

    if (lowStock === 'true') {
      query.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const getProductBySku = async (req, res, next) => {
  try {
    const product = await Product.findOne({ sku: req.params.sku.toUpperCase() });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product with this SKU/Barcode not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const existingSku = await Product.findOne({ sku: req.body.sku.toUpperCase() });
    if (existingSku) {
      return res.status(400).json({ success: false, message: 'SKU / Barcode already exists' });
    }

    const product = await Product.create({
      ...req.body,
      sku: req.body.sku.toUpperCase(),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (req.body.sku) {
      const existingSku = await Product.findOne({ sku: req.body.sku.toUpperCase(), _id: { $ne: id } });
      if (existingSku) {
        return res.status(400).json({ success: false, message: 'SKU already used by another product' });
      }
      req.body.sku = req.body.sku.toUpperCase();
    }

    const product = await Product.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
