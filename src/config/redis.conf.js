import { createClient } from 'redis';
class RedisClient {
  constructor(redisUrl) {
    // Throw error if redisUrl is not provided
    if (!redisUrl) {
      throw new Error('REDIS_URL environment variable is not defined');
    }

    this.redisUrl = redisUrl; // Store the Redis URL
    this.clients = {
      publisher: this.createRedisClient('Publisher'), // Create publisher client
      subscriber: this.createRedisClient('Subscriber'), // Create subscriber client
      cache: this.createRedisClient('Cache'), // Create cache client
    };
  }

  // Method to create a Redis client with event listeners
  createRedisClient(name) {
    const client = createClient({
      url: this.redisUrl, // Set Redis URL
      socket: {
        reconnectStrategy: this.reconnectStrategy.bind(this), // Set reconnect strategy
        connectTimeout: 10_000, // 10 seconds timeout protection
      },
    });

    client.on('error', (e) => {
      // Log error event
      console.error(`[Redis ${name}] Error:`, e.message);
    });

    client.on('reconnecting', () => {
      // Log reconnecting event
      console.warn(`[Redis ${name}] Reconnecting...`);
    });

    client.on('ready', () => {
      // Log ready event
      console.log(`[Redis ${name}] Ready`);
    });

    client.on('end', () => {
      // Log connection closed event
      console.warn(`[Redis ${name}] Connection closed`);
    });

    return client; // Return the created client
  }

  // Reconnect strategy with exponential backoff
  reconnectStrategy(retries) {
    if (retries > 10) {
      // Stop after 10 retries
      return new Error('Redis reconnect attempts exhausted');
    }
    // Calculate delay (max 5 seconds)
    const delay = Math.min(retries * 500, 5000);
    return delay; // Return delay in ms
  }

  // Connect all Redis clients
  async connect() {
    try {
      await Promise.all(
        Object.values(this.clients).map(
          (client) => (client.isOpen ? Promise.resolve() : client.connect()) // Connect if not already open
        )
      );
      console.log('All Redis clients connected'); // Log success
    } catch (e) {
      // Log error if connection fails
      console.error('Error connecting to Redis clients:', e);
      throw e;
    }
  }

  // Disconnect all Redis clients
  async disconnect() {
    try {
      await Promise.all(
        Object.values(this.clients).map(
          (client) => (client.isOpen ? client.quit() : Promise.resolve()) // Quit if open
        )
      );
      console.log('All Redis clients disconnected'); // Log success
    } catch (e) {
      // Log error if disconnect fails
      console.error('Error disconnecting Redis clients:', e);
      throw e;
    }
  }

  // Getter for publisher client
  get publisher() {
    return this.clients.publisher;
  }

  // Getter for subscriber client
  get subscriber() {
    return this.clients.subscriber;
  }

  // Getter for cache client
  get cache() {
    return this.clients.cache;
  }
}

const redisUrl = process.env.REDIS_URL; // Get Redis URL from environment variable

if (!redisUrl) {
  // Throw error if REDIS_URL is not defined
  throw new Error('REDIS_URL environment variable is not defined');
}

const redisClient = new RedisClient(redisUrl); // Instantiate RedisClient

// Immediately connect all Redis clients
(async () => {
  try {
    await redisClient.connect(); // Try to connect
  } catch (e) {
    // Log and exit if connection fails
    console.error('Failed to connect Redis:', e);
    process.exit(1);
  }
})();

export default redisClient;
