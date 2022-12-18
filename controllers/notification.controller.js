const {
  Notification,
  Product,
  Transaction,
  Category,
  User,
  UserBiodata,
  Picture,
} = require("../models");
const { mapProduct } = require("./product.controller");
const { mapTransaction } = require("./transaction.controller");

const mapNotification = (notification) => {
  switch (notification.type) {
    case "NEW_PRODUCT":
      return {
        id: notification.id,
        type: notification.type,
        read: notification.read,
        product: mapProduct(notification.Product),
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      };

    case "NEW_OFFER":
    case "TRANSACTION_COMPLETED":
    case "TRANSACTION_REJECTED":
    case "TRANSACTION_ACCEPTED":
      return {
        id: notification.id,
        type: notification.type,
        read: notification.read,
        transaction: mapTransaction(notification.Transaction),
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      };
  }
};

const notificationInclude = [
  {
    model: Product,
    include: [
      Category,
      Picture,
      {
        model: User,
        include: [UserBiodata],
      },
    ],
  },
  {
    model: Transaction,
    include: [
      {
        model: Product,
        include: [
          Picture,
          Category,
          {
            model: User,
            include: [UserBiodata],
          },
        ],
      },
      {
        model: User,
        include: [UserBiodata],
      },
    ],
  },
];

module.exports = {
  getNotifications: async (req, res) => {
    try {
      const notifications = await Notification.findAll({
        where: { user_id: req.user.id },
        include: notificationInclude,
        order: [["createdAt", "DESC"]],
      });

      const mappedNotifications = notifications.map((notification) =>
        mapNotification(notification)
      );

      res.status(200).json({
        notifications: mappedNotifications,
      });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },

  updateNotification: async (req, res) => {
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid Notification ID is required",
      });
    }

    if (!req.body.read || typeof req.body.read !== "boolean") {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid read value is required",
      });
    }

    const notification = await Notification.findOne({
      where: { id: req.params.id },
    });

    if (!notification) {
      return res.status(404).json({
        type: "NOT_FOUND",
        message: "Notification not found",
      });
    }

    const { read } = req.body;

    try {
      // Check if user is notification owner
      if (notification && notification.user_id !== req.user.id) {
        return res.status(401).json({
          type: "UNAUTHORIZED",
          message: "Unauthorized Access",
        });
      }

      await Notification.update(
        { read: read },
        {
          where: { id: req.params.id },
        }
      );

      const updatedNotification = await Notification.findOne({
        where: { id: req.params.id },
        include: notificationInclude,
      });

      const mappedNotification = mapNotification(updatedNotification);

      res.status(200).json({ updatedNotification: mappedNotification });
    } catch (err) {
      return res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },

  readAllNotification: async (req, res) => {
    try {
      await Notification.update(
        { read: true },
        {
          where: { user_id: req.user.id },
        }
      );
      res.status(200).json({ message: "All notification has been read" });
    } catch (error) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },

  deleteNotification: async (req, res) => {
    if (!Number.isInteger(+req.params.id)) {
      return res.status(400).json({
        type: "VALIDATION_FAILED",
        message: "Valid Notification ID is required",
      });
    }

    try {
      // Check if user is notification owner
      const userNotification = await Notification.findOne({
        where: { id: req.params.id },
      });
      if (userNotification && userNotification.user_id !== req.user.id) {
        return res.status(401).json({
          type: "UNAUTHORIZED",
          message: "Unauthorized Access",
        });
      }

      const result = await Notification.destroy({
        where: { id: req.params.id },
      });
      if (result === 0) {
        res
          .status(404)
          .json({ type: "NOT_FOUND", message: "Notification not found" });
      } else {
        res.status(200).json({ message: "Notification successfully deleted" });
      }
    } catch (err) {
      res.status(500).json({
        type: "SYSTEM_ERROR",
        message: "Something wrong with server",
      });
    }
  },
};
