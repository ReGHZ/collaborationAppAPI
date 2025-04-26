import mongoose from 'mongoose';

// Connection to MongoDB
export const connectDB = async () => {
  try {
    // Await the connection to MongoDB using the mongoose library
    await mongoose.connect(process.env.MONGO_URI);
    // Log a success message if the connection is established
    console.log('Connected to MongoDB');
  } catch (e) {
    // Log an error message if the connection fails
    console.error('Failed connect to MongoDB:', e);
    // Exit the process with a failure code
    process.exit(1);
  }
};

// TTL Index Configuration for data that needs to expire automatically
export const configureTTL = async () => {
  // Access the 'sessions' collection from the current mongoose connection
  await mongoose.connection.collection('sessions').createIndex(
    { createdAt: 1 }, // Create an index on the 'createdAt' field in ascending order
    { expireAfterSeconds: 86400 } // Remove session after 24 hours (86400 seconds)
  );
};
