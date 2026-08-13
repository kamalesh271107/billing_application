import express from 'express';
import { getDashboardStats, getSalesChartData } from '../controllers/analyticsController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get('/dashboard', getDashboardStats);
router.get('/sales-chart', getSalesChartData);

export default router;
