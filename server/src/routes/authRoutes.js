import express from 'express';
import { login, register, getMe, loginSchema, registerSchema } from '../controllers/authController.js';
import { verifyToken } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = express.Router();

router.post('/login', validateBody(loginSchema), login);
router.post('/register', validateBody(registerSchema), register);
router.get('/me', verifyToken, getMe);

export default router;
