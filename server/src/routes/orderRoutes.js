import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  createOrderSchema,
} from '../controllers/orderController.js';
import { verifyToken, isCashierOrAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = express.Router();

router.use(verifyToken, isCashierOrAdmin);

router.post('/', validateBody(createOrderSchema), createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

export default router;
