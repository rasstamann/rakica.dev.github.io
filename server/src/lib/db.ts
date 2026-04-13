import mongoose from 'mongoose';

export async function connectDb(): Promise<void> {
  // readyState 1 = connected; Mongoose tracks this authoritatively
  if (mongoose.connection.readyState === 1) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  await mongoose.connect(uri);
  if (process.env.NODE_ENV !== 'production') {
    console.log('Connected to MongoDB');
  }
}
