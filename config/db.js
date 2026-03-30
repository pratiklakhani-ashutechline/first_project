const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // if (!process.env.MONGO_URI) {
    //   console.error("❌ ERROR: MONGO_URI is not defined in environment variables!");
    //   return;
    // }
    // await mongoose.connect(process.env.MONGO_URI);
    await mongoose.connect("mongodb+srv://pratiklakhani888_db_user:pratik%40996633@cluster0.n59vbei.mongodb.net/?appName=Cluster0");
    console.log("Database connected ✅");
  } catch (error) {
    console.error("❌ Database connection failed: " + error.message);
  }
};

module.exports = connectDB;