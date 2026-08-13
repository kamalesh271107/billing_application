import express from 'express';
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  createUserSchema,
  updateUserSchema,
} from '../controllers/userController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';
import { validateBody } from '../middleware/validate.js';

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get('/', getUsers);
router.post('/', validateBody(createUserSchema), createUser);
router.put('/:id', validateBody(updateUserSchema), updateUser);
router.delete('/:id', deleteUser);

export default router;
