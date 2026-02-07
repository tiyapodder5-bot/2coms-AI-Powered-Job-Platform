import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log(`⚠️  Server will start without database connection`);
    console.log(`⚠️  Please check your MONGODB_URI in .env file`);
    // Don't exit, let server start anyway
  }
};

export default connectDB;
