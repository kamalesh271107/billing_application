import dotenv from 'dotenv';
dotenv.config();

import { connectDB, closeDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';

export const clearDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Wiping all collections and data from MongoDB...');
    const usersDeleted = await User.deleteMany({});
    const categoriesDeleted = await Category.deleteMany({});
    const productsDeleted = await Product.deleteMany({});
    const ordersDeleted = await Order.deleteMany({});

    console.log('========================================');
    console.log('       DATABASE WIPE COMPLETED          ');
    console.log('========================================');
    console.log(`Users deleted: ${usersDeleted.deletedCount}`);
    console.log(`Categories deleted: ${categoriesDeleted.deletedCount}`);
    console.log(`Products deleted: ${productsDeleted.deletedCount}`);
    console.log(`Orders deleted: ${ordersDeleted.deletedCount}`);
    console.log('All database collections have been completely cleared.');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await closeDB();
    process.exit(0);
  }
};

clearDatabase();
