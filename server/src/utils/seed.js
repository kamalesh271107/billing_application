import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';

export const seedDatabase = async () => {
  try {
    console.log('Seeding / updating Hardware & Plumbing POS default users...');

    // 1. Create or Update Default Users (Admin & Cashier)
    let admin = await User.findOne({ role: 'admin' });
    if (admin) {
      admin.email = 'kamalesh@gmail.com';
      admin.password = 'kamal@12345';
      await admin.save();
    } else {
      admin = await User.create({
        name: 'Kamalesh (Admin)',
        email: 'kamalesh@gmail.com',
        password: 'kamal@12345',
        role: 'admin',
        status: 'active',
      });
    }

    let cashier = await User.findOne({ role: 'cashier' });
    if (cashier) {
      cashier.email = 'cashier@gmail.com';
      cashier.password = 'cashier@123';
      await cashier.save();
    } else {
      cashier = await User.create({
        name: 'Sarah Connor (Cashier)',
        email: 'cashier@gmail.com',
        password: 'cashier@123',
        role: 'cashier',
        status: 'active',
      });
    }

    console.log('Updated default accounts: kamalesh@gmail.com / cashier@gmail.com');

    // 2. Clear old categories, products, and orders to replace with new data
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    console.log('Cleared existing product catalog and order records.');

    // 3. Create Categories
    const categories = [
      { name: 'Pipes', slug: 'pipes', icon: 'Pipette' },
      { name: 'Pipe Fittings', slug: 'pipe-fittings', icon: 'Wrench' },
      { name: 'Valves', slug: 'valves', icon: 'Disc' },
      { name: 'Bathroom fittings', slug: 'bathroom-fittings', icon: 'ShowerHead' },
      { name: 'Motors and pumps', slug: 'motors-and-pumps', icon: 'Zap' },
      { name: 'Wires', slug: 'wires', icon: 'Cable' },
      { name: 'Switches', slug: 'switches', icon: 'ToggleRight' },
      { name: 'Sockets', slug: 'sockets', icon: 'Plug' },
    ];
    await Category.insertMany(categories);
    console.log('Created updated hardware & plumbing categories');

    // 4. Create New Real-World Indian Hardware Products
    const productsData = [
      // 1. Pipes
      {
        name: 'Finolex ASTM PVC-U 20mm 0.5" (3m) SCH40 Pipe',
        sku: 'PIP-001',
        category: 'Pipes',
        price: 321.00,
        costPrice: 210.00,
        stock: 45,
        lowStockThreshold: 10,
        image: 'https://images.unsplash.com/photo-1542013936693-884638332954?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Ashirvad CPVC Hot & Cold Plumbing Pipe 3/4" (10ft)',
        sku: 'PIP-002',
        category: 'Pipes',
        price: 480.00,
        costPrice: 320.00,
        stock: 30,
        lowStockThreshold: 10,
        image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Astral UPVC Lead-Free Drinking Water Pipe 1" (10ft)',
        sku: 'PIP-003',
        category: 'Pipes',
        price: 390.00,
        costPrice: 260.00,
        stock: 25,
        lowStockThreshold: 8,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Supreme SWR Heavy-Duty Drainage Waste Pipe 4" (10ft)',
        sku: 'PIP-004',
        category: 'Pipes',
        price: 850.00,
        costPrice: 580.00,
        stock: 15,
        lowStockThreshold: 5,
        image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=60',
      },

      // 2. Pipe Fittings
      {
        name: 'Ashirvad CPVC Brass Elbow 3/4 X 1/2 Inch (20 x 15 mm)',
        sku: 'FIT-001',
        category: 'Pipe Fittings',
        price: 68.20,
        costPrice: 42.00,
        stock: 120,
        lowStockThreshold: 20,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Finolex PVC Equal Tee Fitting 1"',
        sku: 'FIT-002',
        category: 'Pipe Fittings',
        price: 45.00,
        costPrice: 25.00,
        stock: 85,
        lowStockThreshold: 15,
        image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Astral CPVC Pipe Coupling 3/4"',
        sku: 'FIT-003',
        category: 'Pipe Fittings',
        price: 32.00,
        costPrice: 18.00,
        stock: 90,
        lowStockThreshold: 15,
        image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Weld-On CPVC Solvent Cement Heavy Duty 100ml',
        sku: 'FIT-004',
        category: 'Pipe Fittings',
        price: 125.00,
        costPrice: 75.00,
        stock: 40,
        lowStockThreshold: 10,
        image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=500&auto=format&fit=crop&q=60',
      },

      // 3. Valves
      {
        name: 'HPF Brass Ball Valve (25 mm) 1" inch',
        sku: 'VAL-001',
        category: 'Valves',
        price: 299.00,
        costPrice: 185.00,
        stock: 35,
        lowStockThreshold: 8,
        image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'ZOLOTO Brass Forged Ball Valve 1 inch (25mm)',
        sku: 'VAL-002',
        category: 'Valves',
        price: 995.00,
        costPrice: 650.00,
        stock: 20,
        lowStockThreshold: 5,
        image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Kirloskar Brass Non-Return Check Valve 1"',
        sku: 'VAL-003',
        category: 'Valves',
        price: 450.00,
        costPrice: 280.00,
        stock: 18,
        lowStockThreshold: 5,
        image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Leader Heavy Duty Brass Foot Valve 1.25"',
        sku: 'VAL-004',
        category: 'Valves',
        price: 380.00,
        costPrice: 230.00,
        stock: 15,
        lowStockThreshold: 4,
        image: 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=500&auto=format&fit=crop&q=60',
      },

      // 4. Bathroom fittings
      {
        name: 'Ruhe Proton Health Faucet with 1m Flexible Hose',
        sku: 'BTH-001',
        category: 'Bathroom fittings',
        price: 869.00,
        costPrice: 520.00,
        stock: 28,
        lowStockThreshold: 8,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Jaquar Chrome Plated Brass Bib Tap Water Cock',
        sku: 'BTH-002',
        category: 'Bathroom fittings',
        price: 1250.00,
        costPrice: 800.00,
        stock: 22,
        lowStockThreshold: 5,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Hindware Overhead Multi-Flow Rain Shower Head',
        sku: 'BTH-003',
        category: 'Bathroom fittings',
        price: 1850.00,
        costPrice: 1100.00,
        stock: 16,
        lowStockThreshold: 4,
        image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Cera Brass Angle Valve for Geyser & Basin',
        sku: 'BTH-004',
        category: 'Bathroom fittings',
        price: 450.00,
        costPrice: 270.00,
        stock: 40,
        lowStockThreshold: 10,
        image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=500&auto=format&fit=crop&q=60',
      },

      // 5. Motors and pumps
      {
        name: 'SwitchWell CRI 1 HP 10 Stage Submersible Pump',
        sku: 'MOT-001',
        category: 'Motors and pumps',
        price: 12091.00,
        costPrice: 8900.00,
        stock: 8,
        lowStockThreshold: 3,
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Kirloskar Openwell Submersible Pump Kosi-128',
        sku: 'MOT-002',
        category: 'Motors and pumps',
        price: 10601.00,
        costPrice: 7800.00,
        stock: 6,
        lowStockThreshold: 2,
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Crompton Mini Master+ 0.5 HP Self-Priming Pump',
        sku: 'MOT-003',
        category: 'Motors and pumps',
        price: 3850.00,
        costPrice: 2600.00,
        stock: 12,
        lowStockThreshold: 3,
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=500&auto=format&fit=crop&q=60',
      },

      // 6. Wires
      {
        name: 'Anchor Advance FR 90m PVC Insulated Copper Wire 1.5 sq mm',
        sku: 'WIR-001',
        category: 'Wires',
        price: 5692.00,
        costPrice: 4100.00,
        stock: 15,
        lowStockThreshold: 5,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Polycab FR PVC Copper House Wire 2.5 sq mm (90m Roll)',
        sku: 'WIR-002',
        category: 'Wires',
        price: 3450.00,
        costPrice: 2400.00,
        stock: 25,
        lowStockThreshold: 5,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Finolex FRLS Single Core Wire 4.0 sq mm (90m Roll)',
        sku: 'WIR-003',
        category: 'Wires',
        price: 5200.00,
        costPrice: 3700.00,
        stock: 10,
        lowStockThreshold: 3,
        image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
      },

      // 7. Switches
      {
        name: 'Legrand Arteor 6A 1-Way Modular Switch White',
        sku: 'SWI-001',
        category: 'Switches',
        price: 75.00,
        costPrice: 42.00,
        stock: 150,
        lowStockThreshold: 30,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Havells Crabtree 16A Heavy Duty Power Switch',
        sku: 'SWI-002',
        category: 'Switches',
        price: 145.00,
        costPrice: 85.00,
        stock: 80,
        lowStockThreshold: 20,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Anchor Roma Bell Push Switch with Indicator',
        sku: 'SWI-003',
        category: 'Switches',
        price: 95.00,
        costPrice: 55.00,
        stock: 60,
        lowStockThreshold: 15,
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop&q=60',
      },

      // 8. Sockets
      {
        name: "Schneider Electric Opale 3M Plate 16A Switch & Socket Combo",
        sku: 'SOC-001',
        category: 'Sockets',
        price: 840.00,
        costPrice: 560.00,
        stock: 35,
        lowStockThreshold: 10,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Anchor Roma 6A 3-Pin Modular Socket White',
        sku: 'SOC-002',
        category: 'Sockets',
        price: 85.00,
        costPrice: 48.00,
        stock: 110,
        lowStockThreshold: 20,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
      },
      {
        name: 'Legrand Myrius 16A Heavy Duty Shuttered Power Socket',
        sku: 'SOC-003',
        category: 'Sockets',
        price: 180.00,
        costPrice: 110.00,
        stock: 70,
        lowStockThreshold: 15,
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60',
      },
    ];

    const insertedProducts = await Product.insertMany(productsData);
    console.log(`Successfully inserted ${insertedProducts.length} new hardware/plumbing/electrical products.`);

    // 5. Create Initial Sample Orders for Analytics
    const p1 = insertedProducts[0];
    const p2 = insertedProducts[4];

    const sampleOrders = [
      {
        orderNumber: 'ORD-20260807-1001',
        cashierId: cashier._id,
        cashierName: cashier.name,
        items: [
          { productId: p1._id, name: p1.name, sku: p1.sku, price: p1.price, quantity: 2, subtotal: p1.price * 2 },
          { productId: p2._id, name: p2.name, sku: p2.sku, price: p2.price, quantity: 1, subtotal: p2.price * 1 },
        ],
        subtotal: p1.price * 2 + p2.price * 1,
        tax: 58.50,
        discount: 0,
        grandTotal: Number((p1.price * 2 + p2.price * 1 + 58.50).toFixed(2)),
        paymentMethod: 'cash',
        paymentStatus: 'paid',
        tenderedAmount: 1000.00,
        changeAmount: 231.80,
        customerName: 'Plumbing Works Co.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ];

    await Order.insertMany(sampleOrders);
    console.log('Created sample transaction order for analytics');

    console.log('Database product replacement & seeding completed successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
};
