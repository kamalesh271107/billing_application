import { User } from '../models/User.js';
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'cashier']).default('cashier'),
  status: z.enum(['active', 'inactive']).default('active'),
});

export const updateUserSchema = z.object({
  name: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(['admin', 'cashier']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const existing = await User.findOne({ email: req.body.email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const user = await User.create(req.body);
    const userObject = user.toObject();
    delete userObject.password;

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      user: userObject,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.email) {
      const existing = await User.findOne({ email: updates.email.toLowerCase(), _id: { $ne: id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Email already used by another account' });
      }
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    Object.assign(user, updates);
    await user.save();

    const userObject = user.toObject();
    delete userObject.password;

    res.json({
      success: true,
      message: 'User updated successfully',
      user: userObject,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own active account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Staff member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
