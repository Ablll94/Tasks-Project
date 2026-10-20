const mongoose = require('mongoose');

const connectDB = async (retries = 10, delay = 5000) => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (retries > 0) {
      console.error(`MongoDB Connection Error: ${error.message}`);
      console.log(`Retrying MongoDB connection in ${delay / 1000}s... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1, delay), delay);
    } else {
      console.error(`MongoDB Connection Error: ${error.message}`);
      console.log('Failed to connect to MongoDB after multiple retries. Retrying indefinitely...');
      setTimeout(() => connectDB(0, delay), delay);
    }
  }
};

module.exports = connectDB;