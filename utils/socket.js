const { Server } = require("socket.io");

let io;

const connectedUsers = [];

module.exports = {
  init: (httpServer) => {
    io = new Server(httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
    });

    io.on("connection", (socket) => {
      console.log("New User Connected");
      console.log("User Socket ID :", socket.id);

      socket.on("start", (args) => {
        connectedUsers.push({
          socketId: socket.id,
          userId: args.id,
        });

        console.log("Connected Users :", connectedUsers);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket Not Initialized");
    }
    return io;
  },
};
