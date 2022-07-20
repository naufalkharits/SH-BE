const { Server } = require("socket.io");
const { sendNewPushNotification } = require("./messaging");

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
        if (!args.user_id) return;

        connectedUsers.push({
          socketId: socket.id,
          userId: args.user_id,
        });

        console.log("Connected Users :", connectedUsers);
      });

      socket.on("FCM", (args) => {
        if (!args.user_id || !args.fcm_token) return;

        const userIdx = connectedUsers.findIndex(
          (user) => user.userId === args.user_id
        );
        if (userIdx < 0) return;
        connectedUsers[userIdx].fcmToken = args.fcm_token;

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
        if (user.fcmToken) {
          sendNewPushNotification(user.fcmToken);
        }
      });
    }
  },
};
