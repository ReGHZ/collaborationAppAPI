const socketHelper = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    // ...
  });
};

module.exports = socketHelper;
