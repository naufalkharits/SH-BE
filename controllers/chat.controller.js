const { Chat, ChatMessage } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getChat: async (req, res) => {
    if (!req.params || !req.params.id || !Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid User Biodata ID is required",
      });
    }

    try {
      const chat = await Chat.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (!chat) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "Chat not found",
        });
      }

      const chatMessages = await ChatMessage.findAll({
        where: {
          chat_id: req.params.id,
        },
      });

      res.status(200).json({
        chatMessages,
      });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
  getChats: async (req, res) => {
    try {
      const chats = await Chat.findAll({
        where: {
          [Op.or]: {
            buyer_id: req.user.id,
            seller_id: req.user.id,
          },
        },
      });
      res.status(200).json({ chats });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
