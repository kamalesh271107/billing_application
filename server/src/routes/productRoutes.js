import express from 'express';
import {
  getProducts,
  getProductById,
  getProductBySku,
  createProduct,
  updateProduct,
  deleteProduct,
  productSchema,
} from '../controllers/productController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getProducts);
router.get('/sku/:sku', getProductBySku);
router.get('/:id', getProductById);

router.post('/', isAdmin, validateBody(productSchema), createProduct);
router.put('/:id', isAdmin, updateProduct);
router.delete('/:id', isAdmin, deleteProduct);

export default router;
