const { Server } = require("socket.io");
const { sendNewPushNotification } = require("./messaging");
const { Chat, ChatMessage } = require("../models");

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

    io.on("connection", async (socket) => {
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

      socket.on("POST_CHAT", async (args) => {
        if (!args || !args.user_id || !args.as || !args.to || !args.message)
          return;

        let chat = await Chat.findOne({
          where:
            args.as.toLowerCase() === "buyer"
              ? { buyer_id: args.user_id }
              : args.as.toLowerCase() === "seller"
              ? { seller_id: args.user_id }
              : { id: -1 },
        });

        if (!chat) {
          chat = await Chat.create({
            buyer_id:
              args.as.toLowerCase() === "buyer" ? args.user_id : args.to,
            seller_id:
              args.as.toLowerCase() === "seller" ? args.user_id : args.to,
          });
        }

        await ChatMessage.create({
          chat_id: chat.id,
          user_id: args.user_id,
          message: args.message,
        });

        const chatUsers = connectedUsers.filter(
          (user) =>
            user.userId === chat.buyer_id || user.userId === chat.seller_id
        );

        chatUsers.forEach((user) =>
          io.to(user.socketId).emit("NEW_CHAT", {
            chat_id: args.chat_id,
            user_id: args.user_id,
            message: args.message,
          })
        );
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
