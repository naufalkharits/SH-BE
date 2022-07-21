const admin = require("firebase-admin");
const { Transaction, Product } = require("../models");

const sendNewProductPushNotification = async (fcmToken, productId) => {
  try {
    const product = await Product.findOne({
      where: {
        id: productId,
      },
    });
    if (!product) return;

    await admin.messaging().send({
      notification: {
        title: "New Product",
        body: `${product.name} has been added successfully`,
      },
      token: fcmToken,
    });
  } catch (error) {
    console.log("Error :", error);
  }
};

const sendTransactionPushNotification = async (
  fcmToken,
  transactionId,
  type
) => {
  try {
    const transaction = await Transaction.findOne({
      where: {
        id: transactionId,
      },
    });
    if (!transaction) return;

    let notificationBody = null;

    switch (type) {
      case "NEW_TRANSACTION":
        notificationBody = {
          title: "New Transaction",
          body: "New Transaction has been created",
        };
        break;

      case "TRANSACTION_ACCEPTED":
        notificationBody = {
          title: "Transaction Accepted",
          body: "Transaction has been accepted",
        };
        break;

      case "TRANSACTION_REJECTED":
        notificationBody = {
          title: "Transaction Rejected",
          body: "Transaction has been rejected",
        };
        break;

      case "TRANSACTION_COMPLETED":
        notificationBody = {
          title: "Transaction Completed",
          body: "Transaction has been completed",
        };
        break;

      default:
        break;
    }

    if (!notificationBody) return;

    await admin.messaging().send({
      notification: notificationBody,
      token: fcmToken,
    });
  } catch (error) {
    console.log("Error :", error);
  }
};

module.exports = {
  sendNewProductPushNotification,
  sendTransactionPushNotification,
};
