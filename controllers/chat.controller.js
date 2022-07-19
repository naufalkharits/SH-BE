const { Chat, ChatMessage } = require("../models");

module.exports = {
  getChats: async (req, res) => {
    try {
      const chats = await Chat.findAll();
      res.status(200).json({ chats });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
  getChat: (req, res) => {},
};
