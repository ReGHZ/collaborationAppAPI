const redis = require('redis');

// Define a function to create and configure a Redis client
const redisClient = () => {
  // Create a new Redis client instance with a URL from environment or default
  const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379', // Redis server URL
  });

  // Listen for the 'connect' event and log when connected
  client.on('connect', () => {
    console.log('Connected to Redis'); // Log successful connection
  });

  // Listen for the 'error' event and log any connection errors
  client.on('error', (err) => {
    console.error('Redis connection error:', err); // Log connection error
  });

  // Initiate the connection to the Redis server
  client.connect();

  // Return the configured Redis client instance
  return client;
};

module.exports = redisClient;
