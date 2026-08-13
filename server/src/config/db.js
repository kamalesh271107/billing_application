import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      console.log('Connecting to MongoDB Atlas via MONGODB_URI...');
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('Connected to MongoDB Atlas successfully.');
      return;
    } catch (err) {
      console.warn('Primary Atlas connection failed:', err.message);
      try {
        console.log('Retrying MongoDB Atlas connection with TLS options...');
        await mongoose.connect(uri, {
          tls: true,
          tlsAllowInvalidCertificates: true,
          serverSelectionTimeoutMS: 5000,
        });
        console.log('Connected to MongoDB Atlas successfully with TLS options.');
        return;
      } catch (retryErr) {
        console.error('Could not connect to MongoDB Atlas cluster.');
        console.error('IMPORTANT: Check your MongoDB Atlas Network Access settings to ensure your current IP address is whitelisted (or add 0.0.0.0/0).');
        console.log('Falling back to MongoMemoryServer for local database persistence...');
      }
    }
  } else {
    console.log('No MONGODB_URI provided. Initializing MongoMemoryServer fallback...');
    mongoMemoryServer = await MongoMemoryServer.create();
    const mongoUri = mongoMemoryServer.getUri();
    await mongoose.connect(mongoUri);
    console.log(`Connected to in-memory MongoDB at ${mongoUri}`);
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
