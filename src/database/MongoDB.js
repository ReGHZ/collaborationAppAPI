const mongoose = require('mongoose');

const connectToDB = async () => {
  try {
    // Await the connection to MongoDB using the mongoose library
    await mongoose.connect(process.env.MONGO_URI);
    // Log a success message if the connection is established
    console.log('Connected to MongoDB');
  } catch (e) {
    // Log an error message if the connection fails
    console.error('Failed to connect to MongoDB:', e);
    // Exit the process with a failure code
    process.exit(1);
  }
};

module.exports = { connectToDB };
