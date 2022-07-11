const { Notification } = require("../models");

module.exports = {
  getNotifications: (req, res) => {},
  updateNotification: async (req, res) => {
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Invalid notification id",
      });
    }

    if (req.body.read && typeof req.body.read !== "boolean") {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Invalid read value",
      });
    }

    const { read } = req.body;

    try {
      await Notification.update(
        { read: read },
        {
          where: { id: req.params.id },
        }
      );

      const notification = await Notification.findOne({
        where: { id: req.params.id },
      });

      if (!notification) {
        return res.status(404).json({
          type: "NOT_FOUND",
          message: "Notification not found",
        });
      }
      res.status(200).json({ notification });
    } catch (err) {
      return res.status(500).json({
        type: "SERVER_ERROR",
        message: "Something went wrong",
      });
    }
  },
  deleteNotification: (req, res) => {},
};
