const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ ERROR: MONGO_URI is not defined in environment variables!");
      process.exit(1);
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected ✅");
  } catch (error) {
    console.error("❌ Database connection failed: " + error.message);
    process.exit(1);
  }
};

module.exports = connectDB;