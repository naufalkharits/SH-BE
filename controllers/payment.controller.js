require("dotenv").config()
const midtransClient = require('midtrans-client');

// const Xendit = require("xendit-node")

const { Transaction, Product, Notification} = require("../models")

// const x = new Xendit({
//   secretKey: `${process.env.PAYMENT_SECRET_API_KEY}`,
// })
// const { Invoice } = x
// const invoiceSpecificOptions = {}
// const i = new Invoice(invoiceSpecificOptions)

module.exports = {
  getSnap: async (req, res) => {
    try {
      // Create Snap API instance
      const snap = new midtransClient.Snap({
        // Set to true if you want Production Environment (accept real transaction).
        isProduction : false,
        serverKey : process.env.MIDTRANS_SERVER_KEY
      })

      const parameter = {
        "transaction_details": {
          "order_id": req.body.order_id,
          "gross_amount": req.body.amount
        },
        "credit_card":{
          "secure" : true
        },
        "customer_details": {
          "first_name": "sandbox_firstname",
          "last_name": "sandbox_lastname",
          "email": req.body.email,
          "phone": `+${req.body.mobile_number}`
        }
      }

      snap.createTransaction(parameter).then(async (transaction)=>{
        // transaction token
        const transactionToken = transaction.token
        console.log(transactionToken)
        
        // input token to Transaction table
        await Transaction.update(
          {
            status: "WAIT FOR PAYMENT",
            snap_token: transactionToken,
          },
          {
            where: {
              id: req.body.order_id,
            },
          }
        )

        return res.status(200).json({ transactionToken })
      })    
    } catch (error) {
      return res.status(500).json({ type: "SYSTEM_ERROR", message: "Something wrong with server" })
    }
  },

//   getInvoice: async (req, res) => {
//     try {
//       const transaction = await Transaction.findOne({
//         where: { id: req.body.external_id },
//       })

//       if (transaction.status !== "ACCEPTED") {
//         return res.status(404).json({
//           type: "NOT_FOUND",
//           message: "Transaction not found",
//         })
//       }

//       const data = {
//         externalID: req.body.external_id,
//         amount: req.body.amount,
//         fees: [
//           {
//             type: "ADMIN",
//             value: 5000,
//           },
//         ],
//         customer: {
//           email: req.body.email,
//           mobile_number: `+${req.body.mobile_number}`,
//         },
//         customer_notification_preference: {
//           invoice_created: ["email"],
//           invoice_reminder: ["email"],
//           invoice_paid: ["email"],
//           invoice_expired: ["email"],
//         },
//         invoiceDuration: 120,
//         successRedirectURL: req.body.redirect_url,
//         failureRedirectURL: req.body.redirect_url,
//       }

//       const response = await i.createInvoice(data)

//       await Transaction.update(
//         {
//           status: "WAIT FOR PAYMENT",
//           expiry_time: response.expiry_time,
//           invoice_id: response.id,
//           invoice_url: response.invoice_url,
//         },
//         {
//           where: {
//             id: response.external_id,
//           },
//         }
//       )

//       return res.status(200).json({ invoice: response })
//     } catch (error) {
//       return res.status(500).json({ type: "SYSTEM_ERROR", message: "Something wrong with server" })
//     }
//   },

  webhookMidtrans: async (req, res) => {
    try {
      const transaction = await Transaction.findOne({
        where: { id: req.body.order_id },
      })

      if (req.body.transaction_status === "expire") {
        await Transaction.update(
          {
            status: "EXPIRED",
          },
          {
            where: {
              id: req.body.order_id,
            },
          }
        )
        await Notification.create({
          type: "TRANSACTION_EXPIRED",
          user_id: transaction.buyer_id,
          transaction_id: transaction.id,
        });

        await Product.update(
          {
            status: "READY",
          },
          {
            where: {
              id: transaction.product_id,
            },
          }
        )
      }
      
      if (req.body.transaction_status === "settlement") {
        await Transaction.update(
          {
            status: "PAID",
          },
          {
            where: {
              id: req.body.order_id,
            },
          }
        )

        await axios.post(`${process.env.HOOKDECK_URL}`, {
          order_id: transaction.id,
          product_id: transaction.product_id,
          type: "TRANSACTION_PAID"
        })

        await Product.update(
          {
            status: "SOLD",
          },
          {
            where: {
              id: transaction.product_id,
            },
          }
        )
      }

      //   await Product.update(
      //     {
      //       status: "SOLD",
      //     },
      //     {
      //       where: {
      //         id: transaction.product_id,
      //       },
      //     }
      //   )
      // }

      // if (req.body.status === "EXPIRED") {
      //   // const response = await i.expireInvoice({
      //   //   invoiceID: req.body.id,
      //   // });

      //   await Transaction.update(
      //     {
      //       status: "REJECTED",
      //     },
      //     {
      //       where: {
      //         id: req.body.external_id,
      //       },
      //     }
      //   )

      //   await Product.update(
      //     {
      //       status: "READY",
      //     },
      //     {
      //       where: {
      //         id: transaction.product_id,
      //       },
      //     }
      //   )
      // }

      res.status(200).send("OK")
    } catch (error) {
      return res.status(500)
    }
  },

  txTimer: async (req, res) => {
    try {
      const transaction = await Transaction.findOne({
        where: { id: req.body.order_id },
      })
      
      if (req.body.type === "NEW_OFFER") {
        await Transaction.update(
          {
            status: "EXPIRED",
          },
          {
            where: {
              id: req.body.order_id,
            },
          }
        )

        await Notification.create({
          type: "TRANSACTION_EXPIRED",
          user_id: transaction.buyer_id,
          transaction_id: transaction.id,
        });
      }

      if (req.body.type === "TRANSACTION_PAID") {
        await Transaction.update(
          {
            status: "REFUNDED",
          },
          {
            where: {
              id: req.body.order_id,
            },
          }
        )

        await Notification.create({
          type: "TRANSACTION_REFUNDED",
          user_id: transaction.buyer_id,
          transaction_id: transaction.id,
        });

        await axios.post(`${process.env.MIDTRANS_API_URL}/${req.body.order_id}/refund/online/direct`)
      }

      await Product.update(
        {
          status: "READY",
        },
        {
          where: {
            id: req.body.product_id,
          },
        }
      )

      res.status(200).send("OK")
    } catch (error) {
      return res.status(500)
    }
  }
}
