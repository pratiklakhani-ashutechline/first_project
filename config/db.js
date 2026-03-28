const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://pratiklakhani888_db_user:pratik%40996633@cluster0.n59vbei.mongodb.net/?appName=Cluster0');
    console.log("Database connected ✅");
  } catch (error) {
    console.log("Database connection failed ❌" + error);
    process.exit(1);
  }
};

module.exports = connectDB;