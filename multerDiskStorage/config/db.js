const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // // dbName: 'multertestdb',  // optional if it's already in the URI
    });
    console.log('✅ MongoDB connected successfully...');
  } 
  catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1); // Stop the app if DB fails
  }
};

module.exports = connectDB;

