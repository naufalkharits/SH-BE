const { Server } = require("socket.io");

let io;

let connectedUsers = [];

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

      socket.on("START", (args) => {
        connectedUsers.push({
          socketId: socket.id,
          userId: args.id,
        });

        console.log("Connected Users :", connectedUsers);
      });

      socket.on("disconnect", (reason) => {
        connectedUsers = connectedUsers.filter(
          (user) => user.socketId !== socket.id
        );

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

  sendNewNotification: (userId) => {
    if (!io) {
      throw new Error("Socket Not Initialized");
    }
    console.log("Target User ID :", userId);
    console.log("Connected Users :", connectedUsers);
    const selectedUsers = connectedUsers.filter(
      (user) => user.userId == userId
    );
    console.log("Selected Users :", selectedUsers);

    if (selectedUsers.length > 0) {
      selectedUsers.forEach((user) => {
        io.to(user.socketId).emit("NOTIFICATION", [
          "There is new notification !",
        ]);
      });
    }
  },
};
