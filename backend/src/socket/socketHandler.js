let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Allow client to register their userId room
    socket.on('join_user_room', (userId) => {
      if (userId) {
        const room = `user_${userId}`;
        socket.join(room);
        console.log(`[Socket.io] Socket ${socket.id} joined room ${room}`);
      }
    });

    socket.on('leave_user_room', (userId) => {
      if (userId) {
        const room = `user_${userId}`;
        socket.leave(room);
        console.log(`[Socket.io] Socket ${socket.id} left room ${room}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => ioInstance;

const emitToUser = (userId, event, data) => {
  if (ioInstance && userId) {
    ioInstance.to(`user_${userId}`).emit(event, data);
  }
};

const broadcastEvent = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  broadcastEvent
};
