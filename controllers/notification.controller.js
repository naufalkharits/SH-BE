const { Notification } = require("../models");

module.exports = {
  getNotifications: async (req, res) => {
    try {
      const notifications = await Notification.findAll({
        where: {
          user_id: req.user.id,
        },
      });

      res.status(200).json({
        notifications,
      });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
  updateNotification: (req, res) => {},

  deleteNotification: async (req, res) => {
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid Notification ID is required",
      });
    }

    try {
      const result = await Notification.destroy({
        where: { id: req.params.id },
      });
      if (result === 0) {
        res
          .status(404)
          .json({ type: "NOT_FOUND", message: "Notification not found" });
      } else {
        console.log(result);
        res.status(200).json({ message: "TNotification successfully deleted" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
