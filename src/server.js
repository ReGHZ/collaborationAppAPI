const http = require('http');
const app = require('./app');
const { connectToDB } = require('./database/MongoDB');
const redisClient = require('./config/redis.conf');
const { Server } = require('socket.io');
const socketHelper = require('./helpers/Socket.helper');

const PORT = process.env.PORT || 3000;

// Connect to DB
connectToDB();

// Redis connection
redisClient();

// Http server and Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

// Socket.io handler
socketHelper(io);

server.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
